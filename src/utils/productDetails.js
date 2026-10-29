// Ficha técnica de una variante: las medidas son del producto, pero el código
// y la aplicación son de cada variante (una versión brillante puede ir solo
// en pared aunque la mate vaya en piso y pared).
export const getProductDetails = (product, variant) => [
  { label: "Código", value: variant?.code },
  { label: "Medida chip", value: product?.chipSize },
  { label: "Medida malla", value: product?.meshSize },
  { label: "Mallas por caja", value: product?.meshesPerBox },
  { label: "M2/caja", value: product?.m2PerBox },
  { label: "Aplicación", value: variant?.application },
];
