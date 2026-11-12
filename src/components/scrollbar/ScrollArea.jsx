"use client";

import { useRef } from "react";
import { ReactLenis } from "@/utils/lenis";
import Scrollbar from "./Scrollbar";

// Contenedor scrolleable con el scrollbar custom adentro de su caja.
// className va en la caja (tamaño, posición en la grilla, bordes) y
// viewportClassName en el elemento que scrollea (layout del contenido).
// Con lenisOptions, el viewport usa una instancia propia de Lenis.
export default function ScrollArea({
  className = "",
  viewportClassName = "",
  lenisOptions,
  children,
}) {
  const viewportRef = useRef(null);
  const viewportClasses = `h-full overflow-y-auto no-scrollbar ${viewportClassName}`;

  return (
    <div className={`relative min-h-0 ${className}`}>
      {lenisOptions ? (
        <ReactLenis
          ref={(api) => {
            viewportRef.current = api?.wrapper ?? null;
          }}
          className={viewportClasses}
          data-lenis-prevent
          options={lenisOptions}
        >
          {children}
        </ReactLenis>
      ) : (
        <div ref={viewportRef} className={viewportClasses} data-lenis-prevent>
          {children}
        </div>
      )}
      <Scrollbar targetRef={viewportRef} className="absolute inset-y-0 right-0" />
    </div>
  );
}
