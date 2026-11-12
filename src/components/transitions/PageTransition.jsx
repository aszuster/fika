"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import { PROJECT_OPEN_TRANSITION } from "@/components/transitions/ProjectImageTransition";

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
