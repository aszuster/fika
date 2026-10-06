"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { addFavorite, removeFavoriteByVariant } from "@/app/productos/actions";

const favoriteKey = (productSlug, variantSlug) =>
  `${productSlug}/${variantSlug}`;

// Sesión + favoritos de la usuaria. Con productSlug solo carga los favoritos
// de ese producto (página de producto); sin él, todos (grilla del inicio).
export default function useFavorites(productSlug = null) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoriteKeys, setFavoriteKeys] = useState(new Set());
  const [pendingKeys, setPendingKeys] = useState(new Set());

  useEffect(() => {
    const supabase = createClient();

    const loadFavorites = async (userId) => {
      let query = supabase
        .from("favorites")
        .select("product_slug, variant_slug")
        .eq("user_id", userId);
      if (productSlug) query = query.eq("product_slug", productSlug);

      const { data } = await query;
      setFavoriteKeys(
        new Set(
          (data ?? []).map((row) =>
            favoriteKey(row.product_slug, row.variant_slug),
          ),
        ),
      );
    };

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      setIsLoggedIn(Boolean(user));
      if (user) loadFavorites(user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(Boolean(session));
        if (session?.user) {
          loadFavorites(session.user.id);
        } else {
          setFavoriteKeys(new Set());
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [productSlug]);

  const isFavorited = (productSlug, variantSlug) =>
    favoriteKeys.has(favoriteKey(productSlug, variantSlug));

  const toggleFavorite = (productSlug, variantSlug) => {
    const key = favoriteKey(productSlug, variantSlug);
    if (pendingKeys.has(key)) return;

    const wasFavorited = favoriteKeys.has(key);
    setPendingKeys((prev) => new Set(prev).add(key));

    const request = wasFavorited
      ? removeFavoriteByVariant({ productSlug, variantSlug })
      : addFavorite({ productSlug, variantSlug });

    request
      .then(() => {
        setFavoriteKeys((prev) => {
          const next = new Set(prev);
          if (wasFavorited) {
            next.delete(key);
          } else {
            next.add(key);
          }
          return next;
        });
      })
      .finally(() => {
        setPendingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      });
  };

  return { isLoggedIn, isFavorited, toggleFavorite };
}
