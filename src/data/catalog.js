import { cache } from "react";

// Catálogo desde Sanity (productos, variantes y opciones de los filtros).
// Solo se usa en el servidor: páginas, layouts y server actions.

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";

// Next guarda el catálogo en caché. Al publicar en el Studio, el webhook de
// Sanity (app/api/revalidate) la vacía al instante; esto es solo un respaldo
// por si el webhook falla.
const REVALIDATE_SECONDS = 3600;

const sanityFetch = async (query, params = {}) => {
  // api (y no apicdn): justo después del webhook el CDN de Sanity todavía
  // podría devolver el dato viejo. Como Next ya cachea, se piden pocas veces.
  const url = new URL(
    `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity"] },
  });
  if (!response.ok) {
    throw new Error(`Sanity respondió ${response.status}: ${await response.text()}`);
  }
  return (await response.json()).result;
};

// Devuelve los productos con la misma forma que usaba la data mock. Las
// referencias (->) se resuelven acá, y lo que la variante deja vacío
// (material, aplicación, fotos, descargas) se completa con lo del producto
// (^ es el producto dentro de variants[]).
const productsQuery = `*[_type == "product" && defined(slug.current)] | order(order asc, title asc) {
  title,
  "slug": slug.current,
  "image": image.asset->url,
  "hoverImage": hoverImage.asset->url,
  chipSize,
  meshSize,
  meshesPerBox,
  m2PerBox,
  "format": format->label,
  "variants": variants[defined(slug.current)] {
    name,
    "slug": slug.current,
    code,
    "colors": coalesce(colors[]->label, []),
    price,
    available,
    "material": coalesce(material->label, ^.material->label),
    "application": coalesce(application->label, ^.application->label),
    "catalogPhoto": coalesce(catalogPhoto.asset->url, ^.image.asset->url),
    "samplePhotos": coalesce(samplePhotos[].asset->url, ^.samplePhotos[].asset->url, []),
    "downloads": coalesce(
      downloads[]{ label, "href": file.asset->url },
      ^.downloads[]{ label, "href": file.asset->url },
      []
    )
  }
}`;

const m2Formatter = new Intl.NumberFormat("es-AR");

// Mockup: mientras los productos no tengan formato en el CMS, se reparten
// entre estos dos para poder revisar la página de elección y el filtro.
const MOCKUP_FORMATS = ["Mosaik", "Brik"];

export const getProducts = cache(async () => {
  const products = await sanityFetch(productsQuery);
  return products.map((product, index) => ({
    ...product,
    format: product.format ?? MOCKUP_FORMATS[index % MOCKUP_FORMATS.length],
    // En Sanity es un número (0.98); en el sitio se muestra con coma.
    m2PerBox: product.m2PerBox == null ? null : m2Formatter.format(product.m2PerBox),
    variants: product.variants ?? [],
  }));
});

export const getProductBySlug = async (slug) =>
  (await getProducts()).find((product) => product.slug === slug);

// Productos por slug, para buscar rápido los favoritos y los ítems de los
// proyectos (Supabase guarda solo product_slug y variant_slug).
export const getCatalogBySlug = async () =>
  Object.fromEntries((await getProducts()).map((product) => [product.slug, product]));

const filtersQuery = `{
  "colors": *[_type == "color"] | order(order asc, label asc) { label, hex },
  "materials": *[_type == "material"] | order(order asc, label asc).label,
  "formats": *[_type == "format"] | order(order asc, label asc) { label, note },
  "applications": *[_type == "application"] | order(order asc, label asc).label
}`;

export const getFilters = cache(() => sanityFetch(filtersQuery));
