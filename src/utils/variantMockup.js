// Datos de prueba mientras las variantes no tengan precio ni disponibilidad
// cargados en el CMS. Si la variante trae el dato real, se usa ese.
const MOCKUP_PRICE = 68000;

export const getVariantPrice = (variant) => variant?.price ?? MOCKUP_PRICE;

// index: posición de la variante dentro de su producto.
export const isVariantAvailable = (variant, index) =>
  variant?.available ?? index % 2 === 0;
