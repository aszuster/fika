import { defineArrayMember, defineField, defineType } from "sanity";
import { VariantSelectInput } from "../components/VariantSelectInput";

// Proyecto de la página /proyectos (obras hechas con productos Fika). No
// tiene nada que ver con los proyectos que arma cada usuario en su cuenta,
// que viven en Supabase.

// Un producto Fika usado en la obra: producto + variante. En el sitio linkea
// a la página del producto con esa variante elegida.
export const projectProduct = defineType({
  name: "projectProduct",
  title: "Producto usado",
  type: "object",
  fields: [
    defineField({
      name: "product",
      title: "Producto",
      type: "reference",
      to: [{ type: "product" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "variant",
      title: "Variante",
      type: "string",
      components: { input: VariantSelectInput },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { product: "product.title", variants: "product.variants", variant: "variant" },
    prepare: ({ product, variants, variant }) => ({
      title: [product, variants?.find((v) => v.slug?.current === variant)?.name ?? variant]
        .filter(Boolean)
        .join(" "),
    }),
  },
});

export const project = defineType({
  name: "project",
  title: "Proyecto",
  type: "document",
  fieldsets: [
    {
      name: "sheet",
      title: "Ficha técnica",
      description: "Los campos vacíos no se muestran. El estudio sale del campo de arriba.",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      name: "studio",
      title: "Arquitectos / estudio",
      type: "string",
      description: "Por ejemplo: Jorgelina Tortorici Arq. & Asoc. Es el nombre que aparece en la lista de proyectos.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título del proyecto",
      type: "string",
      description: "Por ejemplo: Casa Be.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Parte de la URL (/proyectos/...). Se genera con el botón a partir del estudio y el título.",
      options: {
        source: (document) => [document.studio, document.title].filter(Boolean).join(" "),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Posición en la lista de proyectos (de menor a mayor).",
    }),
    defineField({
      name: "mainImage",
      title: "Imagen principal",
      type: "image",
      description:
        "La de la lista de proyectos y la portada del proyecto. Con el botón de recorte se puede marcar el punto que no se tiene que cortar.",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "array",
      description:
        "Para agregar un link: seleccionar el texto y tocar el ícono de cadena. En el sitio se ve subrayado y abre en otra pestaña.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule) =>
                      rule.required().uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "gallery",
      title: "Imágenes del carrusel",
      type: "array",
      of: [defineArrayMember({ type: "image" })],
      options: { layout: "grid" },
    }),
    defineField({
      name: "professionals",
      title: "Profesionales",
      type: "string",
      fieldset: "sheet",
      description: "Por ejemplo: Arq. Jorgelina Tortorici / Arq. Nicolás Lanza.",
    }),
    defineField({
      name: "type",
      title: "Tipo",
      type: "string",
      fieldset: "sheet",
      description: "Por ejemplo: Residencial.",
    }),
    defineField({
      name: "location",
      title: "Lugar",
      type: "string",
      fieldset: "sheet",
      description: "Por ejemplo: Ramos Mejía, Buenos Aires.",
    }),
    defineField({
      name: "year",
      title: "Año",
      type: "string",
      fieldset: "sheet",
    }),
    defineField({
      name: "credits",
      title: "Créditos",
      type: "string",
      fieldset: "sheet",
      description: "Por ejemplo, quién sacó las fotos.",
    }),
    defineField({
      name: "products",
      title: "Productos Fika utilizados en el proyecto",
      type: "array",
      of: [defineArrayMember({ type: "projectProduct" })],
    }),
  ],
  orderings: [
    {
      title: "Orden",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "studio", media: "mainImage" },
  },
});
