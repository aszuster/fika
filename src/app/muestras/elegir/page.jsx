import { getProducts, getFilters } from "@/data/catalog";
import ElegirMuestras from "@/components/muestras/ElegirMuestras";

export default async function ElegirMuestrasPage() {
  const [products, filters] = await Promise.all([getProducts(), getFilters()]);

  // Hex de cada color por su nombre (las variantes guardan solo el nombre).
  const colorHex = Object.fromEntries(
    (filters?.colors ?? []).map(({ label, hex }) => [label, hex]),
  );

  // Cada variante es un chip, salvo las que en el CMS tienen el chip como no
  // disponible. La imagen es la del chip (o la de catálogo si no tiene).
  const chips = products.flatMap((product) =>
    product.variants
      .filter((variant) => variant.chip.available)
      .map((variant) => ({
        key: `${product.slug}/${variant.slug}`,
        productSlug: product.slug,
        variantSlug: variant.slug,
        productTitle: product.title,
        variantName: variant.name,
        image: variant.chip.image,
        // Color principal: el primero cargado en la variante.
        color: colorHex[variant.colors[0]] ?? null,
      })),
  );

  return <ElegirMuestras chips={chips} />;
}
