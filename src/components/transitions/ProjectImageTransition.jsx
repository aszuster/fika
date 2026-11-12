import { ViewTransition } from "react";

// La imagen de la lista y la de la página de proyecto son la misma para la
// transición (animación en globals.css). Solo al abrir el proyecto: los links de
// la lista marcan el tipo; al volver, la imagen sale con el fade de la página.
export const PROJECT_OPEN_TRANSITION = "project-open";

export default function ProjectImageTransition({ slug, children }) {
  return (
    <ViewTransition
      name={`project-image-${slug}`}
      default="none"
      share={{ [PROJECT_OPEN_TRANSITION]: "project-morph", default: "none" }}
    >
      {children}
    </ViewTransition>
  );
}
