import { getProducts, getFilters } from "@/data/catalog";
import ElegirMuestras from "@/components/muestras/ElegirMuestras";

export default async function ElegirMuestrasPage() {
  const [products, filters] = await Promise.all([getProducts(), getFilters()]);

  // Hex de cada color por su nombre (las variantes guardan solo el nombre).
  const colorHex = Object.fromEntries(
    (filters?.colors ?? []).map(({ label, hex }) => [label, hex]),
  );

  // Por ahora cada variante del catálogo es un chip, con su foto de catálogo.
  // Más adelante los chips podrían tener una imagen propia.
  const chips = products.flatMap((product) =>
    product.variants.map((variant) => ({
      key: `${product.slug}/${variant.slug}`,
      productSlug: product.slug,
      variantSlug: variant.slug,
      productTitle: product.title,
      variantName: variant.name,
      image: variant.catalogPhoto,
      // Color principal: el primero cargado en la variante.
      color: colorHex[variant.colors[0]] ?? null,
    })),
  );

  return <ElegirMuestras chips={chips} />;
}
