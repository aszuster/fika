"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getCatalogBySlug } from "@/data/catalog";
import { priceFormatter } from "@/utils/price";
import {
  escapeHtml,
  formatDateTime,
  getCompanyEmails,
  sendEmail,
} from "@/utils/email";

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

  // Los nombres lindos salen del catálogo de Sanity.
  const catalog = await getCatalogBySlug();
  const items = selectedItems.map((item) => {
    const product = catalog[item.product_slug];
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

  // Aviso por mail a la empresa, que después le manda el presupuesto al
  // cliente por su cuenta. El pedido ya quedó guardado: si el mail falla no
  // se corta el flujo (queda registrado en la consola del servidor).
  await sendQuoteEmail({
    supabase,
    user,
    project,
    items,
    catalog,
    number: count,
  });

  revalidatePath("/mi-cuenta");
  return { quoteRequestId: data, number: count };
}

async function sendQuoteEmail({ supabase, user, project, items, catalog, number }) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const location = [profile?.city, profile?.state_province, profile?.country]
      .filter(Boolean)
      .join(", ");
    const contactRows = [
      ["Nombre", profile?.full_name],
      ["Mail", user.email],
      ["Teléfono", profile?.phone],
      ["Actividad profesional", profile?.professional_activity],
      ["Empresa", profile?.company],
      ["Web / Instagram", profile?.website_or_instagram],
      ["Ubicación", location],
    ];

    // Precio de lista solo si la variante lo tiene cargado en Sanity.
    const lines = items.map((item) => {
      const price = catalog[item.product_slug]?.variants.find(
        (v) => v.slug === item.variant_slug,
      )?.price;
      return {
        name: `${item.product_title} ${item.variant_name}`,
        quantity: item.quantity,
        price: typeof price === "number" ? price : null,
      };
    });
    const formatLinePrice = ({ price, quantity }) =>
      price == null
        ? ""
        : `${priceFormatter.format(price)} x M2 = ${priceFormatter.format(price * quantity)}`;

    const date = formatDateTime();
    const clientName = profile?.full_name || user.email;
    const requestLabel = `Solicitud #${String(number).padStart(2, "0")}`;

    await sendEmail({
      label: "cotizacion",
      to: getCompanyEmails("COTIZACIONES_EMAIL_TO"),
      replyTo: user.email,
      subject: `Pedido de cotización – ${project.name} – ${clientName}`,
      text: [
        `Pedido de cotización (${date})`,
        `Proyecto: ${project.name} (${requestLabel} del cliente)`,
        "",
        "Datos del cliente",
        ...contactRows.map(([label, value]) => `${label}: ${value || "-"}`),
        "",
        "Productos",
        ...lines.map((line, index) => {
          const price = formatLinePrice(line);
          return `${index + 1}. ${line.name} — ${line.quantity} M2${price ? ` (${price})` : ""}`;
        }),
      ].join("\n"),
      html: `
        <h2>Pedido de cotización</h2>
        <p>${escapeHtml(date)}<br />
        Proyecto: <strong>${escapeHtml(project.name)}</strong> (${escapeHtml(requestLabel)} del cliente)</p>
        <h3>Datos del cliente</h3>
        <table cellpadding="4">
          ${contactRows
            .map(
              ([label, value]) =>
                `<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value || "-")}</td></tr>`,
            )
            .join("")}
        </table>
        <h3>Productos</h3>
        <table cellpadding="4" border="1" style="border-collapse: collapse">
          <tr><th>#</th><th>Producto</th><th>M2</th><th>Precio de lista</th></tr>
          ${lines
            .map(
              (line, index) =>
                `<tr><td>${index + 1}</td><td>${escapeHtml(line.name)}</td><td>${escapeHtml(line.quantity)}</td><td>${escapeHtml(formatLinePrice(line) || "-")}</td></tr>`,
            )
            .join("")}
        </table>
      `,
    });
  } catch (error) {
    console.error("[cotizacion] Error al armar el mail", error);
  }
}
