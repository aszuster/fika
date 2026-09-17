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

// Mock filter assignments so the filters panel has something to filter
// against before the CMS is wired up. Cycling through each taxonomy
// guarantees every filter value matches at least one product.
export const products = names.map((title, index) => ({
  title,
  slug: slugs[index],
  src: `/img/productos/${slugs[index]}.png`,
  color: colors[index % colors.length].label,
  material: materials[index % materials.length],
  format: formats[index % formats.length].label,
  application: applications[index % applications.length],
}));

export const getProductBySlug = (slug) =>
  products.find((product) => product.slug === slug);
