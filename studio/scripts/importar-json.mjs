// Carga en Sanity documentos escritos en un JSON de carga-inicial (los que
// antes estaban fijos en el código del sitio: distribuidores, proyectos,
// descargas…), con sus imágenes y archivos.
//
// Uso (desde la carpeta studio, con sesión iniciada en `npx sanity login`).
// Cada JSON tiene su comando en package.json, por ejemplo:
//   npm run importar-proyectos -- --simular      muestra qué se va a cargar
//   npm run importar-proyectos                   crea los que todavía no existen
//   npm run importar-proyectos -- --reemplazar   pisa también los que ya existen
//
// Después de la primera carga, Sanity es la fuente de verdad: por defecto no
// se tocan los documentos que ya existen, para no pisar cambios del Studio.
//
// En el JSON, imágenes y archivos van como { "_type": "image" | "file",
// "_file": "ruta" } (ruta relativa a la carpeta studio) y se cambian por el
// asset de Sanity al subirlos.

import { createReadStream, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const args = process.argv.slice(2);
const dryRun = args.includes("--simular");
const replace = args.includes("--reemplazar");
const jsonPath = args.find((arg) => !arg.startsWith("--"));
if (!jsonPath) {
  console.error("Falta la ruta del JSON (por ejemplo carga-inicial/proyectos.json).");
  process.exit(1);
}

const docs = JSON.parse(readFileSync(jsonPath, "utf8"));
console.log(`${docs.length} documentos en ${jsonPath}.`);

// Archivos que faltan: mejor enterarse antes de subir nada.
const files = [];
const collectFiles = (value) => {
  if (Array.isArray(value)) return value.forEach(collectFiles);
  if (!value || typeof value !== "object") return;
  if (value._file) files.push(value._file);
  Object.values(value).forEach(collectFiles);
};
collectFiles(docs);
const missing = files.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error(`Faltan archivos:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const client = getCliClient({ apiVersion: "2026-10-01" });
const existing = new Set(
  await client.fetch("*[_id in $ids]._id", { ids: docs.map((doc) => doc._id) }),
);
const toWrite = replace ? docs : docs.filter((doc) => !existing.has(doc._id));

const describe = (doc) =>
  [doc.province, doc.city, doc.studio, doc.name, doc.title].filter(Boolean).join(" · ");
for (const doc of docs) {
  const status = existing.has(doc._id) ? (replace ? "se pisa" : "ya existe (no se toca)") : "nuevo";
  console.log(`  ${describe(doc).padEnd(70)} ${status}`);
}

if (dryRun) {
  console.log(`\nSimulación: se cargarían ${toWrite.length}. No se subió nada.`);
  process.exit(0);
}

const uploaded = new Map();
const resolveAssets = async (value) => {
  if (Array.isArray(value)) {
    const items = [];
    for (const item of value) items.push(await resolveAssets(item));
    return items;
  }
  if (!value || typeof value !== "object") return value;
  if (value._file) {
    const { _file, ...rest } = value;
    if (!uploaded.has(_file)) {
      const kind = value._type === "file" ? "file" : "image";
      console.log(`  Subiendo ${path.basename(_file)}…`);
      const asset = await client.assets.upload(kind, createReadStream(_file), {
        filename: path.basename(_file),
      });
      uploaded.set(_file, asset._id);
    }
    return { ...rest, asset: { _type: "reference", _ref: uploaded.get(_file) } };
  }
  const entries = [];
  for (const [key, inner] of Object.entries(value)) entries.push([key, await resolveAssets(inner)]);
  return Object.fromEntries(entries);
};

for (const [index, doc] of toWrite.entries()) {
  const resolved = await resolveAssets(doc);
  const transaction = client.transaction();
  if (replace) transaction.createOrReplace(resolved);
  else transaction.createIfNotExists(resolved);
  await transaction.commit();
  console.log(`  [${index + 1}/${toWrite.length}] ${describe(doc)}`);
}
console.log(`\nListo: ${toWrite.length} guardados, ${docs.length - toWrite.length} ya existían.`);
