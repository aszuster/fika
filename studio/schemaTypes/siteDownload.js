import { defineField, defineType } from "sanity";

// Archivo de la página /descargas (manuales, catálogo). No confundir con las
// descargas de cada producto o variante (tipo "download": fichas, DWG…).
export const siteDownload = defineType({
  name: "siteDownload",
  title: "Descarga general",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      description: "Por ejemplo: Manual de instalación.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "Archivo",
      type: "file",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Orden",
      type: "number",
      description: "Posición en la página de descargas (de menor a mayor).",
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
    select: { title: "title", filename: "file.asset.originalFilename" },
    prepare: ({ title, filename }) => ({ title, subtitle: filename ?? "Sin archivo" }),
  },
});
