"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function addFavorite({ productSlug, variantSlug }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado.");
  }

  const { error } = await supabase.from("favorites").upsert(
    {
      user_id: user.id,
      product_slug: productSlug,
      variant_slug: variantSlug,
    },
    { onConflict: "user_id,product_slug,variant_slug", ignoreDuplicates: true }
  );

  if (error) throw new Error(error.message);

  revalidatePath(`/productos/${productSlug}`);
  revalidatePath("/mi-cuenta");
}

export async function removeFavoriteByVariant({ productSlug, variantSlug }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado.");
  }

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("product_slug", productSlug)
    .eq("variant_slug", variantSlug);

  if (error) throw new Error(error.message);

  revalidatePath(`/productos/${productSlug}`);
  revalidatePath("/mi-cuenta");
}
