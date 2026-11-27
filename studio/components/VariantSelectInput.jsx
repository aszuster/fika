import { useEffect, useState } from "react";
import { set, unset, useClient, useFormValue } from "sanity";
import { Card, Select, Text } from "@sanity/ui";

// Desplegable con las variantes del producto elegido en el mismo ítem.
// Sanity no puede referenciar algo que vive dentro de otro documento (las
// variantes están dentro del producto), así que se guarda el slug de la
// variante y las opciones se leen del producto.
export function VariantSelectInput({ value, onChange, path, elementProps }) {
  const client = useClient({ apiVersion: "2026-10-01" });
  const productRef = useFormValue([...path.slice(0, -1), "product", "_ref"]);
  const [variants, setVariants] = useState(null);

  useEffect(() => {
    if (!productRef) {
      setVariants(null);
      return;
    }
    let cancelled = false;
    // Se lee el borrador si existe, así aparecen variantes recién agregadas.
    client
      .fetch(
        `coalesce(*[_id == "drafts." + $id][0], *[_id == $id][0]).variants[defined(slug.current)]{ name, "slug": slug.current }`,
        { id: productRef.replace(/^drafts\./, "") },
      )
      .then((result) => !cancelled && setVariants(result ?? []));
    return () => {
      cancelled = true;
    };
  }, [client, productRef]);

  if (!productRef) {
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          Primero elegí el producto.
        </Text>
      </Card>
    );
  }

  const missing = value && variants && !variants.some((variant) => variant.slug === value);

  return (
    <Select
      {...elementProps}
      value={value ?? ""}
      disabled={!variants}
      onChange={(event) =>
        onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset())
      }
    >
      <option value="">{variants ? "Elegir variante…" : "Cargando…"}</option>
      {missing && <option value={value}>{value} (ya no existe en el producto)</option>}
      {(variants ?? []).map((variant) => (
        <option key={variant.slug} value={variant.slug}>
          {variant.name}
        </option>
      ))}
    </Select>
  );
}
