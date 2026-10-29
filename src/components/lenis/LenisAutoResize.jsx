"use client";

import { useEffect } from "react";
import { useLenis } from "@/utils/lenis";

// Lenis (root) recalcula hasta dónde se puede scrollear cuando cambia el
// tamaño de <html>, pero <html> tiene h-full y siempre mide lo mismo que la
// ventana. Sin esto, si el contenido cambia de alto (aplicar filtros, cambiar
// de página) Lenis se queda con la medida vieja y no deja scrollear.
export default function LenisAutoResize() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const observer = new ResizeObserver(() => lenis.resize());
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [lenis]);

  return null;
}
