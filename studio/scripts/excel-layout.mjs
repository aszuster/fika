// Estructura del Excel de carga: la usan tanto el script que lo genera desde
// WordPress como el que lo importa a Sanity, así las columnas no se desfasan.

export const EXCEL_PATH = "carga-inicial/fika-carga-inicial.xlsx";
export const FILES_DIR = "carga-inicial/archivos";

// Separador para las celdas con varios archivos (fotos de muestra).
export const LIST_SEPARATOR = ";";

export const SHEETS = {
  products: {
    name: "Productos",
    columns: [
      { key: "slug", header: "slug", width: 22 },
      { key: "titulo", header: "titulo", width: 22 },
      { key: "orden", header: "orden", width: 8 },
      { key: "formato", header: "formato", width: 12, list: "formats" },
      { key: "material", header: "material", width: 22, list: "materials" },
      { key: "aplicacion", header: "aplicacion", width: 14, list: "applications" },
      { key: "medida_chip", header: "medida_chip", width: 14 },
      { key: "medida_malla", header: "medida_malla", width: 14 },
      { key: "mallas_por_caja", header: "mallas_por_caja", width: 10 },
      { key: "m2_por_caja", header: "m2_por_caja", width: 10 },
      { key: "imagen", header: "imagen", width: 40 },
      { key: "imagen_hover", header: "imagen_hover", width: 24 },
      { key: "fotos_muestra", header: "fotos_muestra", width: 24 },
      { key: "revisar", header: "revisar", width: 60, note: true },
      { key: "origen_wp", header: "origen_wp", width: 20, note: true },
    ],
  },
  variants: {
    name: "Variantes",
    columns: [
      { key: "producto_slug", header: "producto_slug", width: 22, list: "products" },
      { key: "slug", header: "slug", width: 24 },
      { key: "nombre", header: "nombre", width: 26 },
      { key: "codigo", header: "codigo", width: 14 },
      { key: "color_1", header: "color_1", width: 10, list: "colors" },
      { key: "color_2", header: "color_2", width: 10, list: "colors" },
      { key: "precio", header: "precio", width: 10 },
      { key: "material", header: "material", width: 18, list: "materials" },
      { key: "aplicacion", header: "aplicacion", width: 14, list: "applications" },
      { key: "foto_catalogo", header: "foto_catalogo", width: 50 },
      { key: "fotos_muestra", header: "fotos_muestra", width: 80 },
      { key: "revisar", header: "revisar", width: 70, note: true },
      { key: "wp_url", header: "wp_url", width: 40, note: true },
    ],
  },
  downloads: {
    name: "Descargas",
    columns: [
      { key: "producto_slug", header: "producto_slug", width: 22, list: "products" },
      { key: "variante_slug", header: "variante_slug", width: 24 },
      { key: "etiqueta", header: "etiqueta", width: 16 },
      { key: "archivo", header: "archivo", width: 40 },
    ],
  },
  colors: {
    name: "Colores",
    columns: [
      { key: "nombre", header: "nombre", width: 14 },
      { key: "hex", header: "hex", width: 10 },
      { key: "orden", header: "orden", width: 8 },
    ],
  },
  materials: {
    name: "Materiales",
    columns: [
      { key: "nombre", header: "nombre", width: 22 },
      { key: "orden", header: "orden", width: 8 },
    ],
  },
  formats: {
    name: "Formatos",
    columns: [
      { key: "nombre", header: "nombre", width: 12 },
      { key: "nota", header: "nota", width: 20 },
      { key: "orden", header: "orden", width: 8 },
    ],
  },
  applications: {
    name: "Aplicaciones",
    columns: [
      { key: "nombre", header: "nombre", width: 14 },
      { key: "orden", header: "orden", width: 8 },
    ],
  },
};

export const slugify = (value) =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
