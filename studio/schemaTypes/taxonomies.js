import { defineField, defineType } from "sanity";

// Opciones de los filtros del sitio. Los productos y variantes las eligen por
// referencia, así no se puede cargar un valor que el filtro no conozca.

const orderField = defineField({
  name: "order",
  title: "Orden",
  type: "number",
  description: "Posición en la lista de filtros (de menor a mayor).",
});

const labelField = defineField({
  name: "label",
  title: "Nombre",
  type: "string",
  validation: (rule) => rule.required(),
});

const orderings = [
  {
    title: "Orden",
    name: "orderAsc",
    by: [{ field: "order", direction: "asc" }],
  },
];

export const color = defineType({
  name: "color",
  title: "Color",
  type: "document",
  fields: [
    labelField,
    defineField({
      name: "hex",
      title: "Color (hex)",
      type: "string",
      description: "Código del círculo de color del filtro, por ejemplo #2E2E2E.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^#[0-9a-fA-F]{6}$/, { name: "hex" })
          .error("Tiene que ser un código hex de 6 dígitos, por ejemplo #2E2E2E."),
    }),
    orderField,
  ],
  orderings,
  preview: {
    select: { title: "label", subtitle: "hex" },
  },
});

export const material = defineType({
  name: "material",
  title: "Material",
  type: "document",
  fields: [labelField, orderField],
  orderings,
});

export const format = defineType({
  name: "format",
  title: "Formato",
  type: "document",
  fields: [
    labelField,
    defineField({
      name: "note",
      title: "Aclaración",
      type: "string",
      description: "Se muestra al lado del nombre, por ejemplo (Pequeña escala).",
    }),
    orderField,
  ],
  orderings,
  preview: {
    select: { title: "label", subtitle: "note" },
  },
});

export const application = defineType({
  name: "application",
  title: "Aplicación",
  type: "document",
  fields: [labelField, orderField],
  orderings,
});
