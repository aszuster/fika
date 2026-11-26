"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { PROJECT_OPEN_TRANSITION } from "@/components/transitions/ProjectImageTransition";

// Si el tamaño de la ventana cambia durante una View Transition (en el celular
// pasa al aparecer/esconderse la barra del navegador), Chrome la cancela. Es
// inofensivo: la página cambia igual, solo sin el fade. React ignora esos
// errores, pero compara el mensaje exacto y Chrome lo cambió ("...invalid
// state. Viewport size changed"), así que React lo reporta como error. Acá se
// descarta solo ese caso. Escucha en captura para correr antes que el overlay
// de errores de Next.
const isAbortedViewTransition = (error) =>
  error?.name === "InvalidStateError" &&
  /view ?transition|transition was aborted|viewport size changed/i.test(
    error.message ?? "",
  );

if (typeof window !== "undefined" && !window.__fikaIgnoreVTErrors) {
  window.__fikaIgnoreVTErrors = true;
  const ignore = (event) => {
    if (isAbortedViewTransition(event.error ?? event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  };
  window.addEventListener("error", ignore, true);
  window.addEventListener("unhandledrejection", ignore, true);
}

// Fade entre páginas (las animaciones están en globals.css). La key hace que
// solo se dispare al cambiar de ruta: filtros, ?formato= y demás actualizaciones
// internas no animan.
export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <ViewTransition
      key={pathname}
      default="none"
      enter={{
        [PROJECT_OPEN_TRANSITION]: "page-fade-in-after-image",
        default: "page-fade-in",
      }}
      exit="page-fade-out"
    >
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
