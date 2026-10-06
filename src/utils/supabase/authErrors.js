const MESSAGES = {
  "Invalid login credentials": "Email o contraseña incorrectos.",
  "User already registered": "Ya existe una cuenta con ese email.",
  "Password should be at least 6 characters.":
    "La contraseña debe tener al menos 6 caracteres.",
};

export const translateAuthError = (message) => MESSAGES[message] ?? message;
