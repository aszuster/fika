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
  "Medialuna",
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
  "medialuna",
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
      color: "Blanco",
      catalogPhoto: `${stoneConvexoImg}/carrara-white.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Carrara brown",
      color: "Marrón",
      catalogPhoto: `${stoneConvexoImg}/carrara-brown.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Travertino",
      color: "Beige",
      catalogPhoto: `${stoneConvexoImg}/travertino.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Carrara emerald",
      color: "Verde",
      catalogPhoto: `${stoneConvexoImg}/carrara-emerald.png`,
      samplePhotos: stoneConvexoSamples,
    },
    {
      name: "Carrara dark green emerald",
      color: "Verde",
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
  const variants = (
    productVariants[slug] ?? [
      { name: "Estándar", color: colors[index % colors.length].label },
    ]
  ).map((variant, variantIndex) => ({
    catalogPhoto: src,
    samplePhotos: [],
    slug: slugify(variant.name),
    // Precio de ejemplo — reemplazar por el precio real cuando exista.
    price: 12000 + index * 850 + variantIndex * 350,
    ...variant,
  }));

  return {
    title,
    slug,
    image: src,
    hoverImage,
    code: `ZMN4502`,
    chipSize: `150x20 mm`,
    meshSize: "302x310 mm",
    meshesPerBox: 6,
    m2PerBox: "0,5",
    material: materials[index % materials.length],
    format: formats[index % formats.length].label,
    application: "Apto para piso",
    variants,
  };
});

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === slug);
