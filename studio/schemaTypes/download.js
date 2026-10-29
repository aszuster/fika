import { defineField, defineType } from "sanity";

export const download = defineType({
  name: "download",
  title: "Descarga",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Texto del link",
      type: "string",
      description: "Por ejemplo: Plano DWG, Ficha, 3D SKP.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "Archivo",
      type: "file",
      description: "Sin archivo, el link se muestra pero no se puede clickear.",
    }),
  ],
  preview: {
    select: { title: "label", filename: "file.asset.originalFilename" },
    prepare: ({ title, filename }) => ({
      title,
      subtitle: filename ?? "Sin archivo",
    }),
  },
});
