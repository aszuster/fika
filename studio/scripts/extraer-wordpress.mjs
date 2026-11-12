// Genera el Excel de carga inicial a partir del catálogo del WordPress actual
// (fikarevestimientos.com) y baja sus imágenes a carga-inicial/archivos.
//
// Uso: npm run extraer-wordpress            (no pisa un Excel existente)
//      npm run extraer-wordpress -- --forzar (lo regenera desde cero)
//
// Solo lee la API pública de la tienda (WooCommerce Store API), así que no
// necesita credenciales. Lo que no puede resolver solo lo deja anotado en la
// columna "revisar" de cada fila.

import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import {
  EXCEL_PATH,
  FILES_DIR,
  LIST_SEPARATOR,
  SHEETS,
  slugify,
} from "./excel-layout.mjs";

const SITE = "https://fikarevestimientos.com";
const STORE_API = `${SITE}/wp-json/wc/store/v1`;

// --- Equivalencias WordPress → sitio nuevo ---------------------------------

// Cada producto de WordPress es una variante del sitio nuevo; el producto
// sale del comienzo del nombre. Algunas categorías de WordPress mezclan
// formas distintas (Stone cóncavo/convexo, Hexa/Big Hexa, los tres
// Fishscale), que acá quedan como productos separados porque cambian los
// m² por caja. El orden de esta lista es el orden del catálogo.
const PRODUCTS = [
  { prefix: "Arch", slug: "arch", title: "Arch" },
  { prefix: "Eclair", slug: "eclair", title: "Eclair" },
  { prefix: "Stone Concave", slug: "stone-concavo", title: "Stone cóncavo" },
  { prefix: "Stone Convex", slug: "stone-convexo", title: "Stone convexo" },
  { prefix: "Quadra 10x10", slug: "quadra-10x10", title: "Quadra 10x10" },
  { prefix: "Finger", slug: "finger", title: "Finger" },
  { prefix: "Stackbond", slug: "stackbond", title: "Stackbond" },
  { prefix: "Finger Stackbond", slug: "finger-stackbond", title: "Finger stackbond" },
  { prefix: "Herringbone", slug: "herringbone", title: "Herringbone" },
  { prefix: "Lantern", slug: "lantern", title: "Lantern" },
  { prefix: "Vanilla", slug: "vanilla", title: "Vanilla" },
  { prefix: "Plumage", slug: "plumage", title: "Plumage" },
  { prefix: "Tunnel", slug: "tunnel", title: "Tunnel" },
  { prefix: "Dot", slug: "dot", title: "Dot" },
  { prefix: "Fishscale Fan Shape", slug: "fishscale-fan-shape", title: "Fishscale fan shape" },
  { prefix: "Fishscale Crackle", slug: "fishscale-crackle", title: "Fishscale crackle" },
  { prefix: "Fishscale", slug: "fishscale", title: "Fishscale" },
  { prefix: "Hexa", slug: "hexa", title: "Hexa" },
  { prefix: "Big Hexa", slug: "big-hexa", title: "Big hexa" },
  { prefix: "Piano Keyboard", slug: "piano-keyboard", title: "Piano keyboard" },
  { prefix: "Quadra 5x5", slug: "quadra-5x5", title: "Quadra 5x5" },
  { prefix: "Quadra 5x10", slug: "quadra-5x10", title: "Quadra 5x10" },
  { prefix: "Penny", slug: "penny", title: "Penny" },
  { prefix: "Wheat Shape", slug: "wheat", title: "Wheat" },
];

// Etiquetas de color de WordPress (en inglés) → colores del filtro.
const COLOR_MAP = {
  white: "Blanco",
  black: "Negro",
  grey: "Gris",
  gray: "Gris",
  beige: "Beige",
  blue: "Azul",
  pink: "Rosa",
  green: "Verde",
  brown: "Marrón",
  red: "Rojo",
  yellow: "Amarillo",
};

// Travertino y mármol son piedra natural: el filtro no los separa, y el
// nombre de la variante (Travertino, Carrara…) igual aparece en la búsqueda.
const MATERIAL_MAP = {
  porcellanato: "Porcelanato",
  porcelanato: "Porcelanato",
  ceramica: "Cerámica",
  travertino: "Piedra natural",
  marmol: "Piedra natural",
};

const toApplication = (text) => {
  const normalized = slugify(text);
  const wall = normalized.includes("pared");
  const floor = normalized.includes("piso");
  if (wall && floor) return "Pared + Piso";
  if (wall) return "Pared";
  if (floor) return "Piso";
  return null;
};

// Correcciones de nombres con errores de tipeo en WordPress.
const NAME_FIXES = [[/\bShinny\b/g, "Shiny"]];

// Opciones de filtros: las mismas que src/data/filters.js del sitio.
const COLORS = [
  ["Negro", "#2E2E2E"],
  ["Blanco", "#FFFFFF"],
  ["Gris", "#989DA4"],
  ["Beige", "#D4C4BA"],
  ["Azul", "#3066A5"],
  ["Rosa", "#EACCD2"],
  ["Verde", "#537561"],
  ["Rojo", "#A20000"],
  ["Amarillo", "#CE9300"],
  ["Marrón", "#864E00"],
];
const MATERIALS = ["Piedra natural", "Porcelanato", "Cerámica", "Porcelanato monomasa"];
const FORMATS = [
  ["Mosaik", "(Pequeña escala)"],
  ["Brik", "(Mediana escala)"],
  ["Skala", "(Gran escala)"],
];
const APPLICATIONS = ["Pared", "Piso", "Pared + Piso"];

// --- Helpers -----------------------------------------------------------------

const decodeEntities = (text) =>
  String(text ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&sup2;/g, "²")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const cleanName = (name) => {
  let clean = decodeEntities(name).replace(/×/g, "x").replace(/\s+/g, " ").trim();
  for (const [pattern, replacement] of NAME_FIXES) {
    clean = clean.replace(pattern, replacement);
  }
  return clean;
};

// La descripción es texto libre, pero en todos los productos tiene el mismo
// formato: "M² x caja: 0,98", "Material: Porcellanato", "Apto para piso/pared".
const parseDescription = (html) => {
  const lines = decodeEntities(html)
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const valueOf = (pattern) => {
    const line = lines.find((l) => pattern.test(l));
    return line ? line.replace(/^[^:]*:/, "").trim() : null;
  };
  const m2 = valueOf(/^m²\s*x\s*caja/i);
  const material = valueOf(/^material/i);
  const applicationLine = lines.find((l) => /^apto/i.test(l));
  return {
    m2: m2 ? Number(m2.replace(",", ".")) : null,
    material: material ? MATERIAL_MAP[slugify(material)] ?? null : null,
    rawMaterial: material,
    application: applicationLine ? toApplication(applicationLine) : null,
    rawApplication: applicationLine,
  };
};

const mostCommon = (values) => {
  const counts = new Map();
  for (const value of values.filter((v) => v != null)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
};

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} al pedir ${url}`);
  return response.json();
};

const fetchAllProducts = async () => {
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await fetchJson(`${STORE_API}/products?per_page=100&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) return all;
  }
};

// Nombre local de cada imagen: el del archivo original, salvo que dos URLs
// distintas compartan nombre.
const fileNames = new Map();
const usedNames = new Set();
const localName = (url) => {
  if (fileNames.has(url)) return fileNames.get(url);
  let name = decodeURIComponent(url.split("/").pop());
  if (usedNames.has(name)) name = `${fileNames.size}-${name}`;
  usedNames.add(name);
  fileNames.set(url, name);
  return name;
};

const downloadAll = async (urls, concurrency = 6) => {
  const queue = [...urls];
  let done = 0;
  const failed = [];
  const worker = async () => {
    while (queue.length > 0) {
      const url = queue.shift();
      const target = path.join(FILES_DIR, localName(url));
      if (!existsSync(target) || statSync(target).size === 0) {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(String(response.status));
          writeFileSync(target, Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          failed.push(`${url} (${error.message})`);
        }
      }
      done++;
      if (process.stdout.isTTY) {
        process.stdout.write(`\r  Imágenes: ${done}/${urls.length}`);
      }
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  console.log(process.stdout.isTTY ? "" : `  Imágenes: ${done}/${urls.length}`);
  return failed;
};

// --- Armado de filas -----------------------------------------------------------

const buildRows = (wpProducts) => {
  const families = [...PRODUCTS].sort((a, b) => b.prefix.length - a.prefix.length);
  const byProduct = new Map(PRODUCTS.map((p) => [p.slug, []]));
  const unmatched = [];

  for (const wp of wpProducts) {
    const name = cleanName(wp.name);
    const family = families.find((f) =>
      name.toLowerCase().startsWith(`${f.prefix.toLowerCase()} `),
    );
    if (!family) {
      unmatched.push(name);
      continue;
    }
    byProduct.get(family.slug).push({ wp, name, family });
  }

  const productRows = [];
  const variantRows = [];

  PRODUCTS.forEach((product, index) => {
    const items = byProduct.get(product.slug);
    if (items.length === 0) return;

    const parsed = items.map(({ wp }) => parseDescription(wp.description));
    const material = mostCommon(parsed.map((p) => p.material));
    const application = mostCommon(parsed.map((p) => p.application));
    const m2 = mostCommon(parsed.map((p) => p.m2));

    // La imagen del producto es la de su categoría en WordPress.
    const category = items[0].wp.categories[0];
    const categoryImage = category?.image ?? null;
    const sharedWith = PRODUCTS.filter(
      (other) =>
        other.slug !== product.slug &&
        byProduct.get(other.slug)?.[0]?.wp.categories[0]?.id === category?.id,
    ).map((other) => other.title);

    const productNotes = ["Falta formato (Mosaik / Brik / Skala)."];
    if (!categoryImage) productNotes.push("Falta imagen: la categoría de WordPress no tiene.");
    if (sharedWith.length > 0) {
      productNotes.push(
        `La imagen es la de la categoría "${decodeEntities(category.name)}", compartida con: ${sharedWith.join(", ")}.`,
      );
    }
    if (new Set(parsed.map((p) => p.m2)).size > 1) {
      productNotes.push("Las variantes tienen m² por caja distintos en WordPress: ver la columna revisar de cada variante.");
    }

    productRows.push({
      slug: product.slug,
      titulo: product.title,
      orden: (index + 1) * 10,
      formato: "",
      material: material ?? "",
      aplicacion: application ?? "",
      medida_chip: "",
      medida_malla: "",
      mallas_por_caja: "",
      m2_por_caja: m2 ?? "",
      imagen: categoryImage ? localName(categoryImage.src) : "",
      imagen_hover: "",
      fotos_muestra: "",
      revisar: productNotes.join(" "),
      origen_wp: category ? decodeEntities(category.name) : "",
    });

    const variants = items
      .map((item, i) => ({ ...item, parsed: parsed[i] }))
      .sort((a, b) => a.name.localeCompare(b.name));
    const variantSlugs = new Set();

    for (const { wp, name, family, parsed: info } of variants) {
      const variantName = name.slice(family.prefix.length).trim();
      const notes = [];

      if (name !== decodeEntities(wp.name).replace(/×/g, "x").trim()) {
        notes.push(`Nombre corregido (en WordPress: "${decodeEntities(wp.name)}").`);
      }

      let slug = slugify(variantName);
      if (variantSlugs.has(slug)) {
        slug = `${slug}-${wp.id}`;
        notes.push("Slug repetido dentro del producto: se le agregó el id de WordPress.");
      }
      variantSlugs.add(slug);

      const colors = wp.tags.map((tag) => COLOR_MAP[slugify(decodeEntities(tag.name))]);
      const unknownTags = wp.tags.filter((_, i) => !colors[i]).map((t) => decodeEntities(t.name));
      if (unknownTags.length > 0) notes.push(`Etiquetas sin color equivalente: ${unknownTags.join(", ")}.`);
      if (colors.filter(Boolean).length === 0) notes.push("Sin color.");
      if (colors.filter(Boolean).length > 2) notes.push(`Más de dos colores en WordPress: ${colors.filter(Boolean).join(", ")}.`);
      const [color1 = "", color2 = ""] = colors.filter(Boolean);

      if (!info.material) notes.push(`Material no reconocido: "${info.rawMaterial ?? "(falta)"}".`);
      if (!info.application) notes.push(`Aplicación no reconocida: "${info.rawApplication ?? "(falta)"}".`);
      if (info.m2 != null && info.m2 !== m2) {
        notes.push(`En WordPress tiene ${String(info.m2).replace(".", ",")} m² por caja; el producto usa ${String(m2).replace(".", ",")}.`);
      }

      const images = wp.images.map((image) => image.src);
      // Los nombres de archivo de las fotos llevan el código del producto:
      // si no coincide con el SKU, puede ser una foto de otra variante (o un
      // SKU mal cargado en WordPress).
      const sku = wp.sku?.trim() ?? "";
      if (!sku) notes.push("Sin código (SKU) en WordPress.");
      const mismatched = images.filter(
        (src) => sku && !src.toLowerCase().includes(sku.toLowerCase()),
      );
      if (mismatched.length > 0) {
        notes.push(
          `Las fotos ${mismatched.map((src) => localName(src)).join(", ")} no tienen el código ${sku} en el nombre: revisar que la foto o el código sean de esta variante.`,
        );
      }
      if (images.length === 0) notes.push("Sin fotos.");

      variantRows.push({
        producto_slug: product.slug,
        slug,
        nombre: variantName,
        codigo: sku,
        color_1: color1,
        color_2: color2,
        precio: "",
        material: info.material && info.material !== material ? info.material : "",
        aplicacion:
          info.application && info.application !== application ? info.application : "",
        foto_catalogo: images[0] ? localName(images[0]) : "",
        fotos_muestra: images.slice(1).map(localName).join(LIST_SEPARATOR),
        revisar: notes.join(" "),
        wp_url: wp.permalink,
      });
    }
  });

  return { productRows, variantRows, unmatched };
};

// --- Excel -------------------------------------------------------------------

const INSTRUCTIONS = [
  "Carga inicial del catálogo Fika",
  "",
  "Generado automáticamente desde fikarevestimientos.com. Revisar antes de importar a Sanity.",
  "",
  "Hojas",
  "• Productos: una fila por producto (Arch, Stackbond…). Material y aplicación son los de todas sus variantes.",
  "• Variantes: una fila por color/terminación. producto_slug indica a qué producto pertenece.",
  "• Descargas: archivos para descargar (plano DWG, ficha, 3D SKP). Con variante_slug vacío valen para todo el producto.",
  "• Colores, Materiales, Formatos, Aplicaciones: las opciones de los filtros. Las columnas de las otras hojas se eligen de estas listas.",
  "",
  "Cómo completar",
  "• Las columnas grises (revisar, origen_wp, wp_url) son solo de ayuda: no se importan.",
  "• revisar: lo que el script no pudo resolver solo. Una vez resuelto, se puede borrar el texto.",
  "• Material y aplicación de una variante: dejar vacíos salvo que sean distintos a los del producto.",
  "• color_2: solo para variantes de dos colores (por ejemplo, Hexa Mixed: Negro y Blanco).",
  "• precio: por m², en pesos, sin puntos ni signo $. Se puede dejar vacío y cargar después.",
  "• m2_por_caja: número con coma o punto (0,98).",
  "• Fotos y archivos: el nombre del archivo dentro de la carpeta carga-inicial/archivos. Varias fotos se separan con ;",
  "• slug: es la parte de la URL. No cambiarlo después de publicar el sitio.",
  "",
  "Datos que WordPress no tiene y hay que completar",
  "• Productos: formato (Mosaik / Brik / Skala: es también el filtro inicial del catálogo), medida_chip, medida_malla, mallas_por_caja, imagen_hover.",
  "• Variantes: precio.",
  "• Descargas: toda la hoja.",
];

const HEADER_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E2E2E" } };
const NOTE_FILL = { type: "pattern", pattern: "solid", fgColor: { argb: "FF989DA4" } };
const LAST_ROW = 1000;

const listRange = {
  products: `Productos!$A$2:$A$${LAST_ROW}`,
  colors: `Colores!$A$2:$A$${LAST_ROW}`,
  materials: `Materiales!$A$2:$A$${LAST_ROW}`,
  formats: `Formatos!$A$2:$A$${LAST_ROW}`,
  applications: `Aplicaciones!$A$2:$A$${LAST_ROW}`,
};

const listSource = (list) =>
  `la hoja ${list === "products" ? "Productos" : SHEETS[list].name}`;

const addSheet = (workbook, { name, columns }, rows) => {
  const sheet = workbook.addWorksheet(name, { views: [{ state: "frozen", ySplit: 1 }] });
  sheet.columns = columns.map(({ key, header, width }) => ({ key, header, width }));
  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  columns.forEach((column, i) => {
    header.getCell(i + 1).fill = column.note ? NOTE_FILL : HEADER_FILL;
  });
  sheet.addRows(rows);

  columns.forEach((column, i) => {
    if (column.note) {
      sheet.getColumn(i + 1).font = { color: { argb: "FF6B6B6B" } };
      header.getCell(i + 1).font = { bold: true, color: { argb: "FFFFFFFF" } };
    }
    if (!column.list) return;
    for (let row = 2; row <= LAST_ROW; row++) {
      sheet.getCell(row, i + 1).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [listRange[column.list]],
        showErrorMessage: true,
        errorTitle: "Valor no válido",
        error: `Elegir un valor de ${listSource(column.list)}.`,
      };
    }
  });
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
  return sheet;
};

const writeExcel = async ({ productRows, variantRows }) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Fika";

  const instructions = workbook.addWorksheet("Instrucciones");
  instructions.getColumn(1).width = 120;
  INSTRUCTIONS.forEach((line, i) => {
    const cell = instructions.getCell(i + 1, 1);
    cell.value = line;
    if (i === 0) cell.font = { bold: true, size: 14 };
    else if (line && !line.startsWith("•") && i > 3) cell.font = { bold: true };
  });

  addSheet(workbook, SHEETS.products, productRows);
  addSheet(workbook, SHEETS.variants, variantRows);
  addSheet(workbook, SHEETS.downloads, []);
  addSheet(
    workbook,
    SHEETS.colors,
    COLORS.map(([nombre, hex], i) => ({ nombre, hex, orden: (i + 1) * 10 })),
  );
  addSheet(
    workbook,
    SHEETS.materials,
    MATERIALS.map((nombre, i) => ({ nombre, orden: (i + 1) * 10 })),
  );
  addSheet(
    workbook,
    SHEETS.formats,
    FORMATS.map(([nombre, nota], i) => ({ nombre, nota, orden: (i + 1) * 10 })),
  );
  addSheet(
    workbook,
    SHEETS.applications,
    APPLICATIONS.map((nombre, i) => ({ nombre, orden: (i + 1) * 10 })),
  );

  await workbook.xlsx.writeFile(EXCEL_PATH);
};

// --- Main --------------------------------------------------------------------

const force = process.argv.includes("--forzar");
if (existsSync(EXCEL_PATH) && !force) {
  console.error(
    `Ya existe ${EXCEL_PATH} y puede tener cambios hechos a mano.\n` +
      "Para regenerarlo desde cero: npm run extraer-wordpress -- --forzar",
  );
  process.exit(1);
}

mkdirSync(FILES_DIR, { recursive: true });

console.log("Leyendo productos de WordPress…");
const wpProducts = await fetchAllProducts();
const categories = await fetchJson(`${STORE_API}/products/categories?per_page=100`);
const categoriesById = new Map(categories.map((c) => [c.id, c]));
for (const wp of wpProducts) {
  wp.categories = wp.categories.map((c) => categoriesById.get(c.id) ?? c);
}
console.log(`  ${wpProducts.length} productos, ${categories.length} categorías.`);

const rows = buildRows(wpProducts);
if (rows.unmatched.length > 0) {
  console.error(
    "Productos de WordPress sin producto equivalente (agregarlos a PRODUCTS en este script):\n  " +
      rows.unmatched.join("\n  "),
  );
  process.exit(1);
}

console.log("Bajando imágenes originales…");
const failed = await downloadAll([...fileNames.keys()]);

await writeExcel(rows);

const withNotes = rows.variantRows.filter((row) => row.revisar).length;
console.log(
  `\nListo: ${EXCEL_PATH}\n` +
    `  ${rows.productRows.length} productos, ${rows.variantRows.length} variantes ` +
    `(${withNotes} con algo para revisar).\n` +
    `  ${fileNames.size - failed.length} archivos en ${FILES_DIR}.`,
);
if (failed.length > 0) {
  console.error(`  No se pudieron bajar ${failed.length} archivos:\n  ${failed.join("\n  ")}`);
  process.exitCode = 1;
}
