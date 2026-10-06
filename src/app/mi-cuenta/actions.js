"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getProductBySlug } from "@/data/products";

async function requireUser(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado.");
  }

  return user;
}

export async function updateProfile(formData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const fields = {
    full_name: formData.get("full_name") || null,
    professional_activity: formData.get("professional_activity") || null,
    company: formData.get("company") || null,
    website_or_instagram: formData.get("website_or_instagram") || null,
    phone: formData.get("phone") || null,
    country: formData.get("country") || null,
    state_province: formData.get("state_province") || null,
    city: formData.get("city") || null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(fields)
    .eq("id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/mi-cuenta");
}

export async function removeFavorite(favoriteId) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", favoriteId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/mi-cuenta");
}

export async function createProject(name) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { data, error } = await supabase
    .from("projects")
    .insert({ user_id: user.id, name })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/mi-cuenta");
  return data;
}

export async function renameProject({ projectId, name }) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { error } = await supabase
    .from("projects")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/mi-cuenta");
}

export async function deleteProject(projectId) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/mi-cuenta");
}

export async function addFavoriteToProject({
  favoriteId,
  projectId,
  newProjectName,
}) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { data: favorite, error: favoriteError } = await supabase
    .from("favorites")
    .select("product_slug, variant_slug")
    .eq("id", favoriteId)
    .eq("user_id", user.id)
    .single();

  if (favoriteError) throw new Error(favoriteError.message);

  let targetProjectId = projectId;

  if (!targetProjectId && newProjectName) {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name: newProjectName })
      .select()
      .single();

    if (projectError) throw new Error(projectError.message);
    targetProjectId = project.id;
  }

  const { error } = await supabase.from("project_items").upsert(
    {
      project_id: targetProjectId,
      product_slug: favorite.product_slug,
      variant_slug: favorite.variant_slug,
    },
    { onConflict: "project_id,product_slug,variant_slug", ignoreDuplicates: true }
  );

  if (error) throw new Error(error.message);

  revalidatePath("/mi-cuenta");

  return { projectId: targetProjectId };
}

// `items` son los productos del proyecto que el usuario dejó incluidos en la
// pantalla de cotización ({ itemId, quantity }). Los que quitó ahí siguen en
// el proyecto, simplemente no vienen en esta lista.
export async function requestQuote({ projectId, items: selections }) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*, project_items(*)")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (projectError) throw new Error(projectError.message);

  const quantityByItemId = new Map(
    selections.map(({ itemId, quantity }) => [itemId, Number(quantity)])
  );

  // Solo ítems que de verdad pertenecen al proyecto y con cantidad válida.
  const selectedItems = project.project_items.filter(
    (item) => quantityByItemId.get(item.id) > 0
  );

  if (selectedItems.length === 0) {
    throw new Error("No hay productos para cotizar.");
  }

  // Los nombres lindos hoy salen de la data mock local; el día que los
  // productos vengan de Sanity, esto se reemplaza por una consulta ahí.
  const items = selectedItems.map((item) => {
    const product = getProductBySlug(item.product_slug);
    const variant = product?.variants.find(
      (v) => v.slug === item.variant_slug
    );

    return {
      product_slug: item.product_slug,
      variant_slug: item.variant_slug,
      product_title: product?.title ?? item.product_slug,
      variant_name: variant?.name ?? item.variant_slug,
      quantity: quantityByItemId.get(item.id),
    };
  });

  const { data, error } = await supabase.rpc("request_quote", {
    p_project_id: projectId,
    p_items: items,
  });

  if (error) throw new Error(error.message);

  // Número de solicitud para mostrar ("Solicitud #03"): es correlativo por
  // usuario — cuántos pedidos lleva hecho contando este — no un id global.
  const { count, error: countError } = await supabase
    .from("quote_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) throw new Error(countError.message);

  revalidatePath("/mi-cuenta");
  return { quoteRequestId: data, number: count };
}
