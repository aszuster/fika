import { colors, materials, formats, applications } from "./filters";

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

export const products = names.map((title, index) => {
  const src = `/img/productos/${slugs[index]}.png`;
  const slug = slugs[index];
  const variants = (
    productVariants[slug] ?? [
      { name: "Estándar", color: colors[index % colors.length].label },
    ]
  ).map((variant) => ({ catalogPhoto: src, samplePhotos: [], ...variant }));

  return {
    title,
    slug,
    image: src,
    code: `FK-${String(index + 1).padStart(3, "0")}`,
    chipSize: `${2 + (index % 4)}x${2 + (index % 4)} cm`,
    meshSize: "30x30 cm",
    meshesPerBox: 10 + (index % 3) * 2,
    m2PerBox: Number((0.9 + (index % 5) * 0.1).toFixed(2)),
    material: materials[index % materials.length],
    format: formats[index % formats.length].label,
    application: applications[index % applications.length],
    variants,
  };
});

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === slug);
