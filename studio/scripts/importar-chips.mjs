// Carga las imágenes de los chips de muestra (material box) desde la
// biblioteca de medios del WordPress actual a cada variante en Sanity
// (campo "Chip de muestra → Imagen del chip").
//
// Uso (desde la carpeta studio, con sesión iniciada en `npx sanity login`):
//   npm run importar-chips -- --simular      muestra qué imagen va a cada variante
//   npm run importar-chips                   completa las variantes sin imagen de chip
//   npm run importar-chips -- --reemplazar   pisa también las que ya tienen
//
// La página de muestras de WordPress tiene contraseña, pero las imágenes están
// en la biblioteca de medios pública, con nombres tipo
// "fika-box_chip-stackbond_matte_white.jpg". Se cruzan con las variantes por
// el código (si el nombre lo tiene) o por producto + nombre de la variante.
// Cuando hay varias versiones del mismo chip se usa la más nueva.

import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { FILES_DIR } from "./excel-layout.mjs";

const SITE = "https://fikarevestimientos.com";
const CHIPS_DIR = path.join(FILES_DIR, "chips");
const CHIP_PREFIX = "fika-box_chip-";

const args = process.argv.slice(2);
const dryRun = args.includes("--simular");
const replace = args.includes("--reemplazar");

// Archivos que no se pueden cruzar solos (nombres viejos o incompletos):
// nombre del archivo → producto/variante. Revisados a ojo contra la foto de
// catálogo.
const MANUAL = {
  // Del lote de 2025-12 con los otros Stone convexo.
  "fika-box_chip-carrara_brown.jpg": "stone-convexo/carrara-brown",
  "fika-box_chip-sone-travertino.jpg": "stone-convexo/travertino-beige",
  "fika-box_chip-wheat.jpg": "wheat/matte-white",
  "fika-box_chip-plumage.jpg": "plumage/crackle-white",
  "fika-box_chip-fishscale_grey.jpg": "fishscale-fan-shape/grey",
  "fika-box_chip-fishscale_baby_blue.jpg": "fishscale-fan-shape/baby-blue",
  "fika-box_chip-fishscale_crackle_dark_grey.jpg": "fishscale-fan-shape/dark-grey",
};

// Variaciones de escritura en los nombres de WordPress.
const WORD_FIXES = {
  shinny: "shiny",
  mate: "matte",
  esmerald: "emerald",
  sienna: "siena",
  sone: "stone",
  convex: "convexo",
  concave: "concavo",
};

const tokens = (fileName) =>
  fileName
    .toLowerCase()
    .slice(CHIP_PREFIX.length)
    .replace(/\.(jpe?g|png|webp)$/, "")
    .replace(/-\d+$/, "") // "-1" que agrega WordPress a los duplicados
    .replace(/quadra(\d+x\d+)/, "quadra $1")
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((token) => WORD_FIXES[token] ?? token);

// --- Lectura de WordPress y Sanity ---------------------------------------------

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} al pedir ${url}`);
  return response.json();
};

// La API devuelve menos de 100 por página (oculta los adjuntos de entradas
// privadas), así que se recorre hasta la última página que informa.
const fetchChipMedia = async () => {
  const first = await fetch(`${SITE}/wp-json/wp/v2/media?per_page=100&page=1`);
  const totalPages = Number(first.headers.get("x-wp-totalpages")) || 1;
  const all = [...(await first.json())];
  for (let page = 2; page <= totalPages; page++) {
    all.push(...(await fetchJson(`${SITE}/wp-json/wp/v2/media?per_page=100&page=${page}`)));
  }
  return all
    .map((item) => ({
      id: item.id,
      date: item.date,
      url: item.source_url,
      fileName: decodeURIComponent(item.source_url.split("/").pop()),
    }))
    .filter((item) => item.fileName.toLowerCase().startsWith(CHIP_PREFIX))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id); // más nuevo primero
};

const client = getCliClient({ apiVersion: "2026-10-01" });

const products = await client.fetch(
  `*[_type == "product" && !(_id in path("drafts.**"))] | order(order asc) {
    _id,
    "slug": slug.current,
    "variants": variants[] { _key, "slug": slug.current, code, "hasChip": defined(chip.image) }
  }`,
);

// --- Cruce ---------------------------------------------------------------------

const variantsByCode = new Map();
const variantsByPath = new Map();
for (const product of products) {
  for (const variant of product.variants ?? []) {
    const entry = { product, variant, path: `${product.slug}/${variant.slug}` };
    variantsByPath.set(entry.path, entry);
    if (variant.code) variantsByCode.set(variant.code.toLowerCase(), entry);
  }
}

const matchFile = (fileName) => {
  if (MANUAL[fileName]) return variantsByPath.get(MANUAL[fileName]);
  const words = tokens(fileName);

  const byCode = words.map((word) => variantsByCode.get(word)).find(Boolean);
  if (byCode) return byCode;

  // Producto: el de nombre más largo cuyas palabras estén todas en el archivo
  // (así "finger stackbond" gana sobre "finger").
  let best = null;
  for (const product of products) {
    const productWords = product.slug.split("-");
    if (productWords.every((word) => words.includes(word))) {
      if (!best || productWords.length > best.words.length) best = { product, words: productWords };
    }
  }
  if (!best) return null;

  const rest = words.filter((word) => !best.words.includes(word));
  const fits = (ignore) => (variant) =>
    variant.slug
      .split("-")
      .filter((word) => !ignore.includes(word))
      .every((word) => rest.includes(word));
  const byLength = (a, b) => b.slug.length - a.slug.length;
  // Primero exacto; si no, sin "matte" (hay archivos como "penny_black").
  const variant =
    best.product.variants.filter(fits([])).sort(byLength)[0] ??
    best.product.variants.filter(fits(["matte"])).sort(byLength)[0];
  return variant ? variantsByPath.get(`${best.product.slug}/${variant.slug}`) : null;
};

console.log("Leyendo la biblioteca de medios de WordPress…");
const media = await fetchChipMedia();
console.log(`  ${media.length} imágenes de chips.`);

const chosen = new Map(); // ruta de la variante → imagen (la más nueva)
const unmatched = [];
for (const item of media) {
  const entry = matchFile(item.fileName);
  if (!entry) {
    unmatched.push(item.fileName);
    continue;
  }
  if (!chosen.has(entry.path)) chosen.set(entry.path, { ...entry, media: item });
}

const missing = [...variantsByPath.keys()].filter((key) => !chosen.has(key));

console.log("\nVariante → imagen del chip");
for (const key of variantsByPath.keys()) {
  const match = chosen.get(key);
  const status = !match ? "SIN IMAGEN" : match.variant.hasChip && !replace ? "ya tiene (no se toca)" : "";
  console.log(`  ${key.padEnd(38)} ${match ? `${match.media.date.slice(0, 10)} ${match.media.fileName}` : ""} ${status}`);
}
if (unmatched.length > 0) {
  console.log(
    `\nImágenes sin variante (agregarlas a MANUAL en este script si corresponden):\n  ${unmatched.join("\n  ")}`,
  );
}
console.log(`\n${chosen.size} variantes con imagen, ${missing.length} sin imagen en WordPress.`);

if (dryRun) {
  console.log("Simulación: no se subió nada.");
  process.exit(0);
}

// --- Descarga y subida ----------------------------------------------------------

const toUpload = [...chosen.values()].filter((match) => replace || !match.variant.hasChip);
mkdirSync(CHIPS_DIR, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const uploadWithRetry = async (filePath, fileName, attempt = 1) => {
  try {
    return await client.assets.upload("image", createReadStream(filePath), { filename: fileName });
  } catch (error) {
    if (error.statusCode !== 429 || attempt >= 5) throw error;
    const seconds = Number(error.response?.headers?.["retry-after"]) || 5;
    await sleep(seconds * 1000);
    return uploadWithRetry(filePath, fileName, attempt + 1);
  }
};

// Si el producto tiene un borrador abierto en el Studio, se actualiza también,
// así el cambio no queda escondido detrás del borrador.
const draftIds = new Set(
  await client.fetch(`*[_id in $ids]._id`, {
    ids: products.map((product) => `drafts.${product._id}`),
  }),
);

let done = 0;
const failed = [];
for (const { product, variant, path: key, media: item } of toUpload) {
  try {
    const filePath = path.join(CHIPS_DIR, item.fileName);
    if (!existsSync(filePath) || statSync(filePath).size === 0) {
      const response = await fetch(item.url);
      if (!response.ok) throw new Error(`${response.status} al bajar ${item.url}`);
      writeFileSync(filePath, Buffer.from(await response.arrayBuffer()));
    }
    const asset = await uploadWithRetry(filePath, item.fileName);

    const base = `variants[_key=="${variant._key}"].chip`;
    const transaction = client.transaction();
    for (const id of [product._id, `drafts.${product._id}`]) {
      if (id.startsWith("drafts.") && !draftIds.has(id)) continue;
      transaction.patch(id, (patch) =>
        patch
          .setIfMissing({ [base]: {} })
          .setIfMissing({ [`${base}.available`]: true })
          .set({
            [`${base}.image`]: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
          }),
      );
    }
    await transaction.commit();
    done++;
    console.log(`  [${done}/${toUpload.length}] ${key}`);
  } catch (error) {
    failed.push(`${key}: ${error.message}`);
  }
}

console.log(`\nListo: ${done} chips cargados.`);
if (failed.length > 0) {
  console.error(`No se pudieron cargar ${failed.length}:\n  ${failed.join("\n  ")}`);
  process.exitCode = 1;
}
