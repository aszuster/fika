"use client";

import { useEffect } from "react";
import { clearCatalogView } from "@/utils/catalogView";

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

// Deja la cookie que usa la home para no volver a mostrar la elección de formato.
// La elección arranca de cero: el formato elegido reemplaza los filtros anteriores.
export default function RememberFormatChooser({ cookieName }) {
  useEffect(() => {
    document.cookie = `${cookieName}=1; path=/; max-age=${ONE_YEAR_IN_SECONDS}; samesite=lax`;
    clearCatalogView();
  }, [cookieName]);

  return null;
}
