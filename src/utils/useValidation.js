"use client";

import { useState } from "react";
import { getErrors } from "@/utils/validation";

// Maneja qué errores se muestran en un formulario: los de un campo aparecen
// recién cuando se sale de él (touch) o cuando se intenta enviar (validate), y
// se actualizan mientras se corrige.
// rules: { campo: { required, type: "email" | "phone" | "password", validate } }
export function useValidation(values, rules) {
  const [touched, setTouched] = useState({});
  const allErrors = getErrors(values, rules);

  const errors = Object.fromEntries(
    Object.entries(allErrors).filter(([name]) => touched[name]),
  );

  const touch = (name) =>
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));

  // Marca los campos (todos, o solo los indicados) como tocados para mostrar
  // sus errores. Devuelve true si no hay ninguno.
  const validate = (names = Object.keys(rules)) => {
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(names.map((name) => [name, true])),
    }));
    return names.every((name) => !allErrors[name]);
  };

  const reset = () => setTouched({});

  // Para deshabilitar el botón de enviar hasta que todo esté bien (todos los
  // campos, o solo los indicados).
  const isValidFor = (names) => names.every((name) => !allErrors[name]);
  const isValid = Object.keys(allErrors).length === 0;

  return { errors, touch, validate, reset, isValid, isValidFor };
}
