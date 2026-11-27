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

// Reglas del formulario de envío (ver utils/validation.js). Instagram es
// opcional. Se usan en el formulario y en el server action.
export const CONTACT_RULES = {
  fullName: { required: true },
  email: { required: true, type: "email" },
  phone: { required: true, type: "phone" },
  province: { required: true },
  address: { required: true },
  postalCode: { required: true },
};

// Clave de sessionStorage con el último pedido enviado (contacto + chips +
// fecha). Por ahora no se manda a ningún lado: lo lee la página de confirmación.
export const MUESTRAS_PEDIDO_KEY = "fika-muestras-pedido";
