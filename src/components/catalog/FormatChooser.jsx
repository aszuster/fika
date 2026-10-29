import Link from "next/link";
import GridCross from "@/components/grid/GridCross";
import Button from "@/components/buttons/Button";

export const formatParam = (label) => label.toLowerCase();
// /?formato=todos: el catálogo completo, sin elegir formato.
export const ALL_FORMATS_PARAM = "todos";

// Grilla de fondo de cada formato (columnas x filas); la escala del formato
// se lee en el tamaño de las celdas. Las filas deben ser pares: la línea del
// medio va en primary-00 y siempre es continua.
// dashedCols: líneas verticales punteadas, de izquierda a derecha desde 0
// (0 = el borde izquierdo de la columna, 1 = la primera línea interna…
// cols = el borde derecho).
// dashedRows: líneas horizontales punteadas, de arriba hacia abajo desde 1
// (1 = la primera línea interna; rows / 2 es la del medio y se ignora).
const backgrounds = {
  Mosaik: {
    cols: 10,
    rows: 10,
    dashedCols: [1, 3, 5, 7, 9],
    dashedRows: [2, 4, 6, 8],
  },
  Brik: { cols: 4, rows: 2, dashedCols: [1, 3] },
};
const defaultBackground = { cols: 4, rows: 4 };

// Trazos de 3px con 2px de separación.
const DASH = 3;
const GAP = 2;

// Las líneas son el gap de 1px entre celdas, así que la posición de la línea
// n sale del tamaño de las celdas: (100% - gaps) / celdas por cada celda,
// más 1px por cada gap anterior.
const linePosition = (index, count) =>
  index === 0
    ? "-1px"
    : `calc((100% - ${count - 1}px) / ${count} * ${index} + ${index - 1}px)`;

// Tapa una línea de la grilla con una punteada del mismo color. Los bordes
// verticales de la columna son la línea entre columnas, en primary-00; las
// internas, en primary-01.
const DashedLine = ({ index, count, horizontal = false }) => {
  const isEdge = index === 0 || index === count;
  const color = isEdge ? "var(--color-primary-00)" : "var(--color-primary-01)";
  const gradient = `repeating-linear-gradient(to ${horizontal ? "right" : "bottom"}, ${color} 0 ${DASH}px, var(--color-primary-03) ${DASH}px ${DASH + GAP}px)`;

  return (
    <div
      aria-hidden
      className={`absolute pointer-events-none ${
        horizontal ? "inset-x-0 h-px" : "inset-y-0 w-px"
      }`}
      style={{
        [horizontal ? "top" : "left"]: linePosition(index, count),
        background: gradient,
      }}
    />
  );
};

// Media grilla (las filas de arriba o las de abajo de la línea del medio).
// dashedRows acá se cuentan dentro de esta mitad.
const HalfGrid = ({ cols, rows, dashedRows }) => (
  <div
    className="relative flex-1 grid gap-px bg-primary-01"
    style={{
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    }}
  >
    {Array.from({ length: cols * rows }, (_, index) => (
      <div key={index} className="bg-primary-03" />
    ))}
    {dashedRows.map((index) => (
      <DashedLine key={index} index={index} count={rows} horizontal />
    ))}
  </div>
);

export default function FormatChooser({ formats }) {
  return (
    <div
      className="relative bg-primary-00 h-[calc(100dvh-3.125rem)] grid gap-px"
      style={{ gridTemplateColumns: `repeat(${formats.length}, minmax(0, 1fr))` }}
    >
      {/* Saltea la elección y va al catálogo completo. */}
      <div className="absolute top-0 right-0 z-20  flex items-center  bg-primary-03 p-7.25">
        <Button copy="Cerrar" url={`/?formato=${ALL_FORMATS_PARAM}`} variant="tertiary" className="text-[15px]!" />
      </div>
      {formats.map(({ label, note }, formatIndex) => {
        const {
          cols,
          rows,
          dashedCols = [],
          dashedRows = [],
        } = backgrounds[label] ?? defaultBackground;
        const half = rows / 2;

        return (
          <Link
            key={label}
            href={`/?formato=${encodeURIComponent(formatParam(label))}`}
            className="group relative flex flex-col"
          >
            <HalfGrid
              cols={cols}
              rows={half}
              dashedRows={dashedRows.filter((index) => index < half)}
            />
            {/* Línea del medio. Desde la segunda columna, lleva la cruz en su
                borde izquierdo: el cruce con la línea entre columnas. */}
            <div className="relative z-5 h-px shrink-0 bg-primary-00">
              {formatIndex > 0 && <GridCross />}
            </div>
            <HalfGrid
              cols={cols}
              rows={half}
              dashedRows={dashedRows
                .filter((index) => index > half)
                .map((index) => index - half)}
            />

            {dashedCols.map((index) => (
              <DashedLine key={index} index={index} count={cols} />
            ))}

            <div className="absolute top-1/2 left-1/2 -translate-1/2 z-10 flex flex-col items-center whitespace-nowrap border border-primary-00 rounded-sm bg-primary-03 px-5 py-2 group-hover:bg-primary-00 group-hover:text-primary-03 transition-colors duration-300 ease-in-out">
              <p className="hl-xs uppercase leading-3.75!">{label}</p>
              {note && (
                <p className="by-sm leading-3.75! text-secondary-02 group-hover:text-primary-01 transition-colors duration-300 ease-in-out">
                  {note}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
