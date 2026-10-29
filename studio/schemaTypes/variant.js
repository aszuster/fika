import { defineArrayMember, defineField, defineType } from "sanity";

// Una variante es un color/terminación de un producto. Vive dentro del
// producto (no es un documento aparte) porque no existe sin él.
export const variant = defineType({
  name: "variant",
  title: "Variante",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      description: "Por ejemplo: Carrara White.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Parte de la URL. No cambiarlo una vez publicado: los favoritos y proyectos de los usuarios lo usan para encontrar la variante.",
      options: {
        source: (_document, { parent }) => parent?.name,
        // Basta con que no se repita dentro del mismo producto.
        isUnique: (slug, { document, parent }) =>
          !(document?.variants ?? []).some(
            (other) => other._key !== parent?._key && other.slug?.current === slug,
          ),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "code",
      title: "Código",
      type: "string",
    }),
    defineField({
      name: "colors",
      title: "Colores",
      type: "array",
      description: "Los colores con los que aparece en el filtro. Puede ser más de uno.",
      of: [defineArrayMember({ type: "reference", to: [{ type: "color" }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: "price",
      title: "Precio por m²",
      type: "number",
      description: "En pesos. Si está vacío, no se muestra precio.",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "available",
      title: "Disponible",
      type: "boolean",
      description: "Activado = se muestra \"Disponible\". Desactivado = \"A consultar\".",
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "reference",
      to: [{ type: "material" }],
      description: "Solo si es distinto al del producto. Vacío = usa el del producto.",
    }),
    defineField({
      name: "application",
      title: "Aplicación",
      type: "reference",
      to: [{ type: "application" }],
      description: "Solo si es distinta a la del producto. Vacío = usa la del producto.",
    }),
    defineField({
      name: "catalogPhoto",
      title: "Foto de catálogo",
      type: "image",
      description: "Vacío = usa la imagen del producto.",
    }),
    defineField({
      name: "samplePhotos",
      title: "Fotos de muestra",
      type: "array",
      description: "Vacío = usa las fotos de muestra del producto.",
      of: [defineArrayMember({ type: "image" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "downloads",
      title: "Descargas propias",
      type: "array",
      description:
        "Solo si esta variante tiene archivos distintos (por ejemplo, su propia ficha). Vacío = usa las del producto.",
      of: [defineArrayMember({ type: "download" })],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "code", media: "catalogPhoto" },
  },
});
