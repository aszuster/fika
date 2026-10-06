import Image from "next/image";

// Cruz que marca la intersección de las líneas de la grilla. Va dentro de una
// celda con position: relative, centrada sobre su esquina superior izquierda
// (o inferior izquierda con position="bottom").
const GridCross = ({ position = "top" }) => (
  <Image
    src="/img/cross.svg"
    width={24}
    height={24}
    alt=""
    className={`pointer-events-none absolute left-0 z-5 -translate-x-[calc(50%+0.5px)] ${
      position === "bottom"
        ? "bottom-0 translate-y-[calc(50%+0.5px)]"
        : "top-0 -translate-y-1/2"
    }`}
  />
);

// Una celda lleva cruz arriba a la izquierda si no está en la primera fila
// ni en la primera columna.
export const hasTopCross = (index, cols) => index >= cols && index % cols > 0;

export default GridCross;
