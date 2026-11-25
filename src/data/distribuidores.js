import { cache } from "react";
import { sanityFetch } from "@/data/sanity";

// Distribuidores desde Sanity. Solo se usa en el servidor.

// Encuadre del mapa al elegir cada provincia: centro [longitud, latitud] y
// zoom. Es configuración del mapa, no contenido: los distribuidores se cargan
// en el Studio y eligen la provincia de esta misma lista.
const PROVINCIAS_MAPA = {
  "Buenos Aires": { centro: [-60.0, -36.7], zoom: 5.5 },
  CABA: { centro: [-58.437, -34.6075], zoom: 11 },
  Catamarca: { centro: [-66.9, -27.3], zoom: 6 },
  Chaco: { centro: [-60.7, -26.4], zoom: 6 },
  Chubut: { centro: [-68.5, -44.0], zoom: 5.5 },
  Córdoba: { centro: [-63.8, -32.1], zoom: 6 },
  Corrientes: { centro: [-58.0, -28.7], zoom: 6 },
  "Entre Ríos": { centro: [-59.2, -32.0], zoom: 6 },
  Formosa: { centro: [-59.9, -24.9], zoom: 6.5 },
  Jujuy: { centro: [-65.8, -23.3], zoom: 7 },
  "La Pampa": { centro: [-65.5, -37.1], zoom: 6 },
  "La Rioja": { centro: [-67.2, -29.7], zoom: 6 },
  Mendoza: { centro: [-68.5, -34.6], zoom: 6 },
  Misiones: { centro: [-54.6, -26.9], zoom: 7 },
  Neuquén: { centro: [-69.9, -38.6], zoom: 6 },
  "Río Negro": { centro: [-67.2, -40.0], zoom: 5.5 },
  Salta: { centro: [-64.9, -24.8], zoom: 6 },
  "San Juan": { centro: [-68.9, -30.8], zoom: 6 },
  "San Luis": { centro: [-66.0, -33.8], zoom: 6.5 },
  "Santa Cruz": { centro: [-69.5, -48.8], zoom: 5 },
  "Santa Fe": { centro: [-61.0, -30.7], zoom: 6 },
  "Santiago del Estero": { centro: [-63.5, -27.7], zoom: 6 },
  "Tierra del Fuego": { centro: [-67.7, -54.3], zoom: 6.5 },
  Tucumán: { centro: [-65.3, -27.0], zoom: 7.5 },
};

// Provincia sin encuadre (no debería pasar): se ve todo el país.
const SIN_ENCUADRE = { centro: [-64, -38], zoom: 3.5 };

const distribuidoresQuery = `*[_type == "distributor" && defined(province) && defined(coordinates)]
  | order(name asc) {
    "id": _id,
    "nombre": name,
    "provincia": province,
    "localidad": city,
    "direccion": address,
    "telefono": phone,
    instagram,
    "website": website,
    coordinates
  }`;

// En el Studio las coordenadas se pegan como las copia Google Maps
// ("latitud, longitud"); el mapa las usa al revés: [longitud, latitud].
const parseCoords = (text) => {
  const [lat, lng] = String(text).split(",").map((part) => Number(part.trim()));
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lng, lat] : null;
};

// Devuelve las provincias que tienen al menos un distribuidor, en orden
// alfabético, con la misma forma que usan el panel y el mapa.
export const getProvinciasConDistribuidores = cache(async () => {
  const distribuidores = await sanityFetch(distribuidoresQuery);

  const porProvincia = Object.groupBy(
    distribuidores
      .map(({ coordinates, ...rest }) => ({ ...rest, coords: parseCoords(coordinates) }))
      .filter((d) => d.coords),
    (d) => d.provincia,
  );

  return Object.entries(porProvincia)
    .sort(([a], [b]) => a.localeCompare(b, "es"))
    .map(([provincia, lista]) => ({
      provincia,
      ...(PROVINCIAS_MAPA[provincia] ?? SIN_ENCUADRE),
      distribuidores: lista,
    }));
});
