export const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

// Cantidad máxima de muestras que entran en el material box.
export const MAX_MUESTRAS = 8;

// Clave de sessionStorage con los chips elegidos en /muestras/elegir, que se
// revisan en /muestras/completar antes de solicitar.
export const MUESTRAS_SELECCION_KEY = "fika-muestras-seleccion";

// Clave de sessionStorage con los datos de contacto que se van completando en
// /muestras/completar (se conservan si se vuelve a editar la selección).
export const MUESTRAS_CONTACTO_KEY = "fika-muestras-contacto";

// Campos obligatorios del formulario de contacto (Instagram es opcional).
export const REQUIRED_CONTACT_FIELDS = [
  "fullName",
  "email",
  "phone",
  "province",
  "address",
  "postalCode",
];

export const isContactComplete = (contact) =>
  REQUIRED_CONTACT_FIELDS.every(
    (name) => typeof contact?.[name] === "string" && contact[name].trim() !== "",
  );

// Clave de sessionStorage con el último pedido enviado (contacto + chips +
// fecha). Por ahora no se manda a ningún lado: lo lee la página de confirmación.
export const MUESTRAS_PEDIDO_KEY = "fika-muestras-pedido";
