"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

// Fade entre páginas (las animaciones están en globals.css). La key hace que
// solo se dispare al cambiar de ruta: filtros, ?formato= y demás actualizaciones
// internas no animan.
export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <ViewTransition
      key={pathname}
      default="none"
      enter="page-fade-in"
      exit="page-fade-out"
    >
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
