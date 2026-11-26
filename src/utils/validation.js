// Validación compartida por todos los formularios del sitio. Las reglas y los
// mensajes están acá para que sean iguales en todos lados. Se usa también en
// el servidor; el hook para los formularios está en useValidation.js.

export const MESSAGES = {
  required: "Este campo es obligatorio",
  format: "El formato es incorrecto",
  password: "La contraseña debe tener un mínimo de 6 caracteres",
};

export const PASSWORD_MIN_LENGTH = 6;

// Algo antes y después del @, y un punto en el dominio (ej: nombre@mail.com).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value) => EMAIL_RE.test(String(value ?? "").trim());

// Teléfonos de Argentina: característica de 2 o 3 números + 8 números
// (10 u 11 en total). Se ignoran espacios, guiones, puntos y paréntesis, y se
// acepta adelante el código de país (+54, con o sin el 9 de celulares).
export const isValidPhone = (value) => {
  let digits = String(value ?? "").replace(/[\s\-().]/g, "");
  if (digits.startsWith("+54")) digits = digits.slice(3).replace(/^9/, "");
  return /^\d{10,11}$/.test(digits);
};

const isEmpty = (value) => String(value ?? "").trim() === "";

// Devuelve el mensaje de error de un campo, o null si está bien.
// rule: { required, type: "email" | "phone" | "password", validate }
// validate(value, values) sirve para reglas propias (ej: "no coinciden").
export const getFieldError = (value, rule = {}, values = {}) => {
  if (isEmpty(value)) return rule.required ? MESSAGES.required : null;
  if (rule.type === "email" && !isValidEmail(value)) return MESSAGES.format;
  if (rule.type === "phone" && !isValidPhone(value)) return MESSAGES.format;
  if (rule.type === "password" && String(value).length < PASSWORD_MIN_LENGTH) {
    return MESSAGES.password;
  }
  return rule.validate?.(value, values) ?? null;
};

export const getErrors = (values, rules) =>
  Object.fromEntries(
    Object.entries(rules)
      .map(([name, rule]) => [name, getFieldError(values[name], rule, values)])
      .filter(([, error]) => error),
  );
