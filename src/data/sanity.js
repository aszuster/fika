// Consultas a Sanity (catálogo, distribuidores…). Solo se usa en el servidor:
// páginas, layouts y server actions.

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? "production";

// Next guarda las respuestas en caché. Al publicar en el Studio, el webhook de
// Sanity (app/api/revalidate) la vacía al instante; esto es solo un respaldo
// por si el webhook falla.
const REVALIDATE_SECONDS = 3600;

export const sanityFetch = async (query, params = {}) => {
  // api (y no apicdn): justo después del webhook el CDN de Sanity todavía
  // podría devolver el dato viejo. Como Next ya cachea, se piden pocas veces.
  const url = new URL(
    `https://${projectId}.api.sanity.io/v2026-10-01/data/query/${dataset}`,
  );
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const response = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity"] },
  });
  if (!response.ok) {
    throw new Error(`Sanity respondió ${response.status}: ${await response.text()}`);
  }
  return (await response.json()).result;
};
