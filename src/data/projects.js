import { cache } from "react";
import { sanityFetch } from "@/data/sanity";

// Proyectos de la página /proyectos (obras con productos Fika) desde Sanity.
// No confundir con los proyectos de cada usuario en su cuenta (Supabase).
// Solo se usa en el servidor.

const projectsQuery = `*[_type == "project" && defined(slug.current)] | order(order asc, _createdAt asc) {
  "slug": slug.current,
  studio,
  title,
  "image": mainImage.asset->url,
  "hotspot": mainImage.hotspot { x, y },
  description,
  "gallery": coalesce(gallery[].asset->url, []),
  professionals,
  type,
  location,
  year,
  credits,
  "products": coalesce(products[defined(product._ref) && defined(variant)] {
    "productSlug": product->slug.current,
    "productTitle": product->title,
    variant,
    "variants": product->variants[] { name, "slug": slug.current }
  }, [])
}`;

export const getProjects = cache(async () => {
  const projects = await sanityFetch(projectsQuery);
  return projects.map(({ hotspot, products, ...project }) => ({
    ...project,
    // Punto de la imagen que no se tiene que cortar (marcado en el Studio).
    imagePosition: hotspot
      ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`
      : undefined,
    // Si la variante se borró o se le cambió el slug, no se muestra.
    products: products.flatMap(({ productSlug, productTitle, variant, variants }) => {
      const match = variants?.find((v) => v.slug === variant);
      if (!productSlug || !match) return [];
      return [
        {
          key: `${productSlug}/${variant}`,
          label: `${productTitle} ${match.name}`,
          href: `/productos/${productSlug}?variante=${encodeURIComponent(variant)}`,
        },
      ];
    }),
  }));
});

export const getProjectBySlug = async (slug) =>
  (await getProjects()).find((project) => project.slug === slug);
