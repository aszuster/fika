import { colors, materials, formats, applications } from "./filters";

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const names = [
  "Arch",
  "Eclair",
  "Stone cóncavo",
  "Stone convexo",
  "Quadra 10x10",
  "Finger",
  "Stackbond",
  "Finger stackbond",
  "Herringbone",
  "Lantern",
  "Vainilla",
  "Plumage",
  "Tunnel",
  "Dot",
  "Fishcale",
  "Hexa",
  "Piano keyboard",
];

const slugs = [
  "arch",
  "eclair",
  "stone-concavo",
  "stone-convexo",
  "quadra-10-10",
  "finger",
  "stackbond",
  "finger-stackbond",
  "herringbone",
  "lantern",
  "vanilla",
  "plumage",
  "tunnel",
  "dot",
  "fishcale",
  "hexa",
  "piano-keyboard",
];

const stoneConvexoImg = "/img/productos/producto";

const stoneConvexoSamples = [
  `${stoneConvexoImg}/sample-carrara-brown-01.png`,
  `${stoneConvexoImg}/sample-travertino-01.png`,
];

const productVariants = {
  "stone-convexo": [
    {
      name: "Carrara white",
      code: "ZMN4202",
      colors: ["Blanco"],
      catalogPhoto: `${stoneConvexoImg}/carrara-white.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Carrara brown",
      code: "YDYHDSC3",
      colors: ["Marrón"],
      catalogPhoto: `${stoneConvexoImg}/carrara-brown.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Travertino",
      code: "ZMN4502",
      colors: ["Beige"],
      catalogPhoto: `${stoneConvexoImg}/travertino.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Carrara emerald",
      code: "ZMN4702",
      colors: ["Verde"],
      catalogPhoto: `${stoneConvexoImg}/carrara-emerald.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Carrara dark green emerald",
      code: "YDYHDSC2",
      colors: ["Verde"],
      // La aplicación de la variante pisa la del producto.
      application: "Pared",
      catalogPhoto: `${stoneConvexoImg}/carrara-dark-green-emerald.png`,
      samplePhotos: stoneConvexoSamples,
    },
  ],
};

// Productos que todavía no tienen la versión "-white" para el hover: usan la
// misma imagen. Sacarlos de acá cuando llegue la imagen.
const withoutHoverImage = ["medialuna"];

export const products = names.map((title, index) => {
  const src = `/img/productos/${slugs[index]}.png`;
  const slug = slugs[index];
  const hoverImage = withoutHoverImage.includes(slug)
    ? src
    : `/img/productos/${slug}-white.png`;
  // Valores por defecto del producto: cada variante puede pisarlos.
  const material = materials[index % materials.length];
  const application = applications[index % applications.length];
  const variants = (
    productVariants[slug] ?? [
      {
        name: "Estándar",
        code: `ZMN${4500 + index}`,
        colors: [colors[index % colors.length].label],
      },
    ]
  ).map((variant, variantIndex) => ({
    catalogPhoto: src,
    samplePhotos: [],
    material,
    application,
    slug: slugify(variant.name),
    // Precio de ejemplo — reemplazar por el precio real cuando exista.
    price: 12000 + index * 850 + variantIndex * 350,
    // PDFs descargables de ejemplo — reemplazar label y href (por ejemplo,
    // "/pdf/<archivo>.pdf") cuando existan. Sin href, el link no es clickeable.
    downloads: [
      { label: "Plano DWG", href: null },
      { label: "Ficha", href: null },
      { label: "3D SKP", href: null },
    ],
    ...variant,
  }));

  return {
    title,
    slug,
    image: src,
    hoverImage,
    chipSize: `150x20 mm`,
    meshSize: "302x310 mm",
    meshesPerBox: 6,
    m2PerBox: "0,5",
    format: formats[index % formats.length].label,
    variants,
  };
});

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === slug);
