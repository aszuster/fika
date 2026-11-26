// Lista fija de "actividad profesional" para el formulario de perfil.
// Texto plano validado acá (no un enum de la base) porque puede cambiar —
// ver docs/supabase-schema.md.
export const PROFESSIONAL_ACTIVITIES = [
  "Arquitectura",
  "Interiorismo",
  "Diseño",
  "Construcción",
  "Comercialización y distribución",
  "Estudiante",
];

// Reglas de los datos personales al editar el perfil (ver utils/validation.js),
// las mismas que en el registro. Empresa y Web / Instagram son opcionales.
// Se usan en PerfilSection y en el server action updateProfile.
export const PROFILE_RULES = {
  full_name: { required: true },
  professional_activity: { required: true },
  phone: { required: true, type: "phone" },
  country: { required: true },
  state_province: { required: true },
  city: { required: true },
};
