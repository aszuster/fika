// Mock filter taxonomy. This will eventually come from the CMS, but the
// shape (an array of { label, ... } per category) is what both the filters
// panel and the product mock data key off of, so it stays in one place.

export const colors = [
  { label: "Negro", hex: "#2E2E2E" },
  { label: "Blanco", hex: "#2E2E2E" },
  { label: "Gris", hex: "#989DA4" },
  { label: "Beige", hex: "#D4C4BA" },
  { label: "Azul", hex: "#3066A5" },
  { label: "Rosa", hex: "#EACCD2" },
  { label: "Verde", hex: "#537561" },
  { label: "Rojo", hex: "#A20000" },
  { label: "Amarillo", hex: "#CE9300" },
  { label: "Marrón", hex: "#864E00" },
];

export const materials = [
  "Piedra natural",
  "Porcelanato",
  "Cerámica",
  "Porcelanato monomasa",
];

export const formats = [
  { label: "Mosaik", note: "(Pequeña escala)" },
  { label: "Brik", note: "(Mediana escala)" },
  { label: "Skala", note: "(Gran escala)" },
];

export const applications = ["Pared", "Piso", "Pared + Piso"];
