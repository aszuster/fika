import { defineField, defineType } from "sanity";

// Un distribuidor es un local (dirección) en el mapa de /distribuidores. Si
// una empresa tiene varias sucursales, cada una es un distribuidor aparte con
// el mismo nombre.

// Las mismas provincias que el sitio (src/data/distribuidores.js tiene el
// centro y el zoom del mapa de cada una).
export const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const COORDS_PATTERN = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/;

export const distributor = defineType({
  name: "distributor",
  title: "Distribuidor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nombre",
      type: "string",
      description: "Por ejemplo: Colome Santa Fe. Cada sucursal se carga aparte, con el mismo nombre.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "province",
      title: "Provincia",
      type: "string",
      options: { list: PROVINCIAS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "Localidad",
      type: "string",
      description: "En el sitio, los distribuidores de cada provincia se agrupan por localidad.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Dirección",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coordinates",
      title: "Ubicación en el mapa",
      type: "string",
      description:
        'En Google Maps: clic derecho sobre el local → clic en los números de arriba (se copian) → pegar acá. Queda algo como "-34.6184, -58.8373".',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true;
          const match = value.match(COORDS_PATTERN);
          if (!match) return 'Tiene que ser "latitud, longitud", por ejemplo -34.6184, -58.8373.';
          const [lat, lng] = [Number(match[1]), Number(match[2])];
          // Argentina: latitud entre -21 y -56, longitud entre -53 y -74.
          if (lat > -21 || lat < -56 || lng > -53 || lng < -74) {
            return "La ubicación queda fuera de Argentina: revisar que primero esté la latitud y después la longitud.";
          }
          return true;
        }),
    }),
    defineField({
      name: "phone",
      title: "Teléfono",
      type: "string",
      description: 'Texto libre: puede tener varios números o una aclaración ("No recibe mercadería").',
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "string",
      description: "Solo el usuario, sin @ ni link. Por ejemplo: colome.oficial.",
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^[A-Za-z0-9._]+$/.test(value)
            ? true
            : "Solo el usuario (letras, números, puntos y guiones bajos), sin @ ni link.",
        ),
    }),
    defineField({
      name: "website",
      title: "Sitio web",
      type: "string",
      description: "Por ejemplo: domus.com.ar.",
    }),
  ],
  orderings: [
    {
      title: "Provincia y localidad",
      name: "provinceAsc",
      by: [
        { field: "province", direction: "asc" },
        { field: "city", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", city: "city", province: "province", address: "address" },
    prepare: ({ title, city, province, address }) => ({
      title,
      subtitle: [address, city, province].filter(Boolean).join(" · "),
    }),
  },
});
