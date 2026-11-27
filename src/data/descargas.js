import { cache } from "react";
import { sanityFetch } from "@/data/sanity";

// Archivos de la página /descargas desde Sanity (tipo "siteDownload"). Las
// descargas de cada producto van aparte, con el catálogo. Solo servidor.

const descargasQuery = `*[_type == "siteDownload" && defined(file.asset)]
  | order(order asc, title asc) {
    "id": _id,
    title,
    "href": file.asset->url
  }`;

export const getDescargas = cache(() => sanityFetch(descargasQuery));
