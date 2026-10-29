// Importa el Excel de carga a Sanity: opciones de filtros, productos con sus
// variantes, imágenes y descargas.
//
// Uso (desde la carpeta studio, con sesión iniciada en `npx sanity login`):
//   npm run importar -- --simular      valida el Excel sin subir nada
//   npm run importar                   crea lo que todavía no existe en Sanity
//   npm run importar -- --reemplazar   pisa también lo que ya existe
//   npm run importar -- otra/ruta.xlsx usa otro Excel
//
// Después de la primera carga, Sanity es la fuente de verdad: por defecto el
// script no toca los productos que ya existen, para no pisar cambios hechos
// en el Studio. --reemplazar los sobreescribe con lo que diga el Excel.

import { createReadStream, existsSync } from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { getCliClient } from "sanity/cli";
import {
  EXCEL_PATH,
  FILES_DIR,
  LIST_SEPARATOR,
  SHEETS,
  slugify,
} from "./excel-layout.mjs";

const args = process.argv.slice(2);
const dryRun = args.includes("--simular");
const replace = args.includes("--reemplazar");
const excelPath = args.find((arg) => !arg.startsWith("--")) ?? EXCEL_PATH;

// --- Lectura del Excel -------------------------------------------------------

const cellText = (value) => {
  if (value == null) return "";
  if (typeof value === "object") {
    if ("result" in value) return cellText(value.result);
    if ("text" in value) return cellText(value.text);
    if ("richText" in value) return value.richText.map((part) => part.text).join("");
  }
  return String(value).trim();
};

// Devuelve las filas como objetos con las claves de excel-layout, buscando
// cada columna por su encabezado (así se pueden reordenar en el Excel).
const readSheet = (workbook, { name, columns }) => {
  const sheet = workbook.getWorksheet(name);
  if (!sheet) throw new Error(`Falta la hoja "${name}" en el Excel.`);
  const headers = sheet.getRow(1).values.map(cellText);
  const rows = [];
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const item = { _row: `${name}, fila ${rowNumber}` };
    for (const column of columns) {
      const index = headers.indexOf(column.header);
      item[column.key] = index === -1 ? "" : cellText(row.getCell(index).value);
    }
    if (columns.some((column) => item[column.key] !== "")) rows.push(item);
  });
  return rows;
};

const errors = [];
const warnings = [];

const parseNumber = (value, row, column) => {
  if (value === "") return undefined;
  const number = Number(String(value).replace(",", "."));
  if (Number.isNaN(number)) {
    errors.push(`${row}: "${column}" tiene que ser un número (dice "${value}").`);
    return undefined;
  }
  return number;
};

const splitList = (value) =>
  value
    .split(LIST_SEPARATOR)
    .map((item) => item.trim())
    .filter(Boolean);

const checkFile = (fileName, row, column) => {
  if (fileName && !existsSync(path.join(FILES_DIR, fileName))) {
    errors.push(`${row}: el archivo "${fileName}" (${column}) no está en ${FILES_DIR}.`);
  }
};

// --- Validación y armado de documentos ------------------------------------------

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(excelPath);

const sheet = Object.fromEntries(
  Object.entries(SHEETS).map(([key, definition]) => [key, readSheet(workbook, definition)]),
);

// Opciones de filtros: su _id sale del nombre, así importar dos veces no
// duplica nada y las referencias se pueden armar sin consultar Sanity.
const taxonomyId = (type, label) => `${type}-${slugify(label)}`;
const taxonomies = {
  color: { rows: sheet.colors, sheetName: SHEETS.colors.name },
  material: { rows: sheet.materials, sheetName: SHEETS.materials.name },
  format: { rows: sheet.formats, sheetName: SHEETS.formats.name },
  application: { rows: sheet.applications, sheetName: SHEETS.applications.name },
};

const taxonomyDocs = [];
for (const [type, { rows }] of Object.entries(taxonomies)) {
  const seen = new Set();
  for (const row of rows) {
    if (!row.nombre) {
      errors.push(`${row._row}: falta el nombre.`);
      continue;
    }
    if (seen.has(row.nombre)) errors.push(`${row._row}: "${row.nombre}" está repetido.`);
    seen.add(row.nombre);
    if (type === "color" && !/^#[0-9a-fA-F]{6}$/.test(row.hex)) {
      errors.push(`${row._row}: el hex "${row.hex}" no es válido (ejemplo: #2E2E2E).`);
    }
    taxonomyDocs.push({
      _id: taxonomyId(type, row.nombre),
      _type: type,
      label: row.nombre,
      ...(type === "color" && { hex: row.hex.toUpperCase() }),
      ...(type === "format" && row.nota && { note: row.nota }),
      order: parseNumber(row.orden, row._row, "orden"),
    });
  }
  taxonomies[type].names = seen;
}

const reference = (type, label, row, column, { required = false } = {}) => {
  if (!label) {
    if (required) errors.push(`${row}: falta "${column}".`);
    return undefined;
  }
  if (!taxonomies[type].names.has(label)) {
    errors.push(
      `${row}: "${label}" (${column}) no está en la hoja ${taxonomies[type].sheetName}.`,
    );
    return undefined;
  }
  return { _type: "reference", _ref: taxonomyId(type, label) };
};

// Los archivos se guardan como nombre por ahora y se cambian por la
// referencia al asset recién al subirlos (solo para lo que se importa).
const imageField = (fileName, row, column) => {
  if (!fileName) return undefined;
  checkFile(fileName, row, column);
  return { _type: "image", _file: fileName };
};

const imageList = (value, row, column) => {
  const images = splitList(value).map((fileName, index) => ({
    ...imageField(fileName, row, column),
    _key: `img${index}`,
  }));
  return images.length > 0 ? images : undefined;
};

const productsBySlug = new Map();
for (const row of sheet.products) {
  const where = row._row;
  if (!row.slug || row.slug !== slugify(row.slug)) {
    errors.push(`${where}: el slug "${row.slug}" no es válido (solo minúsculas, números y guiones).`);
    continue;
  }
  if (productsBySlug.has(row.slug)) errors.push(`${where}: el slug "${row.slug}" está repetido.`);
  if (!row.titulo) errors.push(`${where}: falta el título.`);
  if (!row.imagen) warnings.push(`${where}: sin imagen.`);

  productsBySlug.set(row.slug, {
    _id: `product-${row.slug}`,
    _type: "product",
    title: row.titulo,
    slug: { _type: "slug", current: row.slug },
    order: parseNumber(row.orden, where, "orden"),
    format: reference("format", row.formato, where, "formato"),
    material: reference("material", row.material, where, "material", { required: true }),
    application: reference("application", row.aplicacion, where, "aplicacion", {
      required: true,
    }),
    chipSize: row.medida_chip || undefined,
    meshSize: row.medida_malla || undefined,
    meshesPerBox: parseNumber(row.mallas_por_caja, where, "mallas_por_caja"),
    m2PerBox: parseNumber(row.m2_por_caja, where, "m2_por_caja"),
    image: imageField(row.imagen, where, "imagen"),
    hoverImage: imageField(row.imagen_hover, where, "imagen_hover"),
    samplePhotos: imageList(row.fotos_muestra, where, "fotos_muestra"),
    variants: [],
    downloads: [],
  });
}

for (const row of sheet.variants) {
  const where = row._row;
  const product = productsBySlug.get(row.producto_slug);
  if (!product) {
    errors.push(`${where}: el producto "${row.producto_slug}" no está en la hoja Productos.`);
    continue;
  }
  if (!row.slug || row.slug !== slugify(row.slug)) {
    errors.push(`${where}: el slug "${row.slug}" no es válido (solo minúsculas, números y guiones).`);
    continue;
  }
  if (product.variants.some((variant) => variant._key === row.slug)) {
    errors.push(`${where}: el slug "${row.slug}" está repetido en ${row.producto_slug}.`);
  }
  if (!row.nombre) errors.push(`${where}: falta el nombre.`);

  const colors = [row.color_1, row.color_2]
    .filter(Boolean)
    .map((label, index) => ({
      ...reference("color", label, where, `color_${index + 1}`),
      _key: slugify(label),
    }));
  if (colors.length === 0) errors.push(`${where}: falta el color.`);

  product.variants.push({
    _type: "variant",
    _key: row.slug,
    name: row.nombre,
    slug: { _type: "slug", current: row.slug },
    code: row.codigo || undefined,
    colors,
    price: parseNumber(row.precio, where, "precio"),
    material: reference("material", row.material, where, "material"),
    application: reference("application", row.aplicacion, where, "aplicacion"),
    catalogPhoto: imageField(row.foto_catalogo, where, "foto_catalogo"),
    samplePhotos: imageList(row.fotos_muestra, where, "fotos_muestra"),
    downloads: [],
  });
}

sheet.downloads.forEach((row, index) => {
  const where = row._row;
  const product = productsBySlug.get(row.producto_slug);
  if (!product) {
    errors.push(`${where}: el producto "${row.producto_slug}" no está en la hoja Productos.`);
    return;
  }
  const owner = row.variante_slug
    ? product.variants.find((variant) => variant._key === row.variante_slug)
    : product;
  if (!owner) {
    errors.push(`${where}: la variante "${row.variante_slug}" no está en ${row.producto_slug}.`);
    return;
  }
  if (!row.etiqueta) errors.push(`${where}: falta la etiqueta.`);
  checkFile(row.archivo, where, "archivo");
  owner.downloads.push({
    _type: "download",
    _key: `download${index}`,
    label: row.etiqueta,
    file: row.archivo ? { _type: "file", _file: row.archivo } : undefined,
  });
});

for (const product of productsBySlug.values()) {
  if (product.variants.length === 0) {
    errors.push(`Productos: "${product.slug.current}" no tiene ninguna variante.`);
  }
}

// --- Resultado de la validación ------------------------------------------------

const products = [...productsBySlug.values()];
const variantCount = products.reduce((sum, p) => sum + p.variants.length, 0);
console.log(
  `Excel: ${products.length} productos, ${variantCount} variantes, ` +
    `${taxonomyDocs.length} opciones de filtros.`,
);
const withoutFormat = products.filter((p) => !p.format).length;
if (withoutFormat > 0) warnings.push(`${withoutFormat} productos sin formato.`);
if (warnings.length > 0) console.log(`\nAvisos:\n  ${warnings.join("\n  ")}`);
if (errors.length > 0) {
  console.error(`\nErrores (no se subió nada):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
if (dryRun) {
  console.log("\nEl Excel está bien. Simulación: no se subió nada.");
  process.exit(0);
}

// --- Subida a Sanity --------------------------------------------------------------

const client = getCliClient({ apiVersion: "2026-10-01" });

const existingIds = new Set(
  await client.fetch("*[_id in $ids]._id", {
    ids: [...taxonomyDocs, ...products].map((doc) => doc._id),
  }),
);
const pending = (docs) => (replace ? docs : docs.filter((doc) => !existingIds.has(doc._id)));

// Sanity rechaza más de 25 pedidos simultáneos (error 429): se suben de a
// pocos y, si igual lo rechaza, se espera lo que pide y se reintenta.
const MAX_UPLOADS = 4;
let activeUploads = 0;
const uploadQueue = [];
const withUploadSlot = async (task) => {
  if (activeUploads >= MAX_UPLOADS) await new Promise((resolve) => uploadQueue.push(resolve));
  activeUploads++;
  try {
    return await task();
  } finally {
    activeUploads--;
    uploadQueue.shift()?.();
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uploadWithRetry = async (kind, fileName, attempt = 1) => {
  try {
    return await client.assets.upload(kind, createReadStream(path.join(FILES_DIR, fileName)), {
      filename: fileName,
    });
  } catch (error) {
    if (error.statusCode !== 429 || attempt >= 5) throw error;
    const seconds = Number(error.response?.headers?.["retry-after"]) || 5;
    await sleep(seconds * 1000);
    return uploadWithRetry(kind, fileName, attempt + 1);
  }
};

// Se guarda la promesa (no el resultado) para que un mismo archivo usado en
// dos lugares a la vez se suba una sola vez.
const uploaded = new Map();
const uploadAsset = (kind, fileName) => {
  const cacheKey = `${kind}:${fileName}`;
  if (!uploaded.has(cacheKey)) {
    uploaded.set(
      cacheKey,
      withUploadSlot(() => uploadWithRetry(kind, fileName)).then((asset) => asset._id),
    );
  }
  return uploaded.get(cacheKey);
};

// Recorre el documento y cambia cada { _file } por la referencia al asset.
const resolveAssets = async (value) => {
  if (Array.isArray(value)) return Promise.all(value.map(resolveAssets));
  if (!value || typeof value !== "object") return value;
  if (value._file) {
    const { _file, ...rest } = value;
    const assetId = await uploadAsset(value._type === "file" ? "file" : "image", _file);
    return { ...rest, asset: { _type: "reference", _ref: assetId } };
  }
  const entries = await Promise.all(
    Object.entries(value).map(async ([key, inner]) => [key, await resolveAssets(inner)]),
  );
  return Object.fromEntries(
    entries.filter(
      ([, inner]) => inner !== undefined && !(Array.isArray(inner) && inner.length === 0),
    ),
  );
};

const write = (transaction, doc) =>
  replace ? transaction.createOrReplace(doc) : transaction.createIfNotExists(doc);

const taxonomiesToWrite = pending(taxonomyDocs);
if (taxonomiesToWrite.length > 0) {
  const transaction = client.transaction();
  for (const doc of taxonomiesToWrite) write(transaction, await resolveAssets(doc));
  await transaction.commit();
}
console.log(
  `\nFiltros: ${taxonomiesToWrite.length} guardados, ` +
    `${taxonomyDocs.length - taxonomiesToWrite.length} ya existían.`,
);

const productsToWrite = pending(products);
for (const [index, product] of productsToWrite.entries()) {
  const doc = await resolveAssets(product);
  await write(client.transaction(), doc).commit();
  console.log(`  [${index + 1}/${productsToWrite.length}] ${product.title}`);
}
console.log(
  `Productos: ${productsToWrite.length} guardados, ` +
    `${products.length - productsToWrite.length} ya existían` +
    (replace ? "." : " (no se tocaron; usar --reemplazar para pisarlos)."),
);
