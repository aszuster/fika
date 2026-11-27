import GridCross from "@/components/grid/GridCross";
import { getFillerCount } from "@/components/grid/GridFillers";
import { getDescargas } from "@/data/descargas";

const COLS = 3;

// Alto de cada fila: entran 3 en la pantalla, debajo del navbar (3.125rem),
// descontando las líneas de 1px entre filas.
const ROW_HEIGHT = "auto-rows-[calc((100dvh-3.125rem-2px)/3)]";

export default async function Descargas() {
  const downloads = await getDescargas();
  const fillerCount = getFillerCount(downloads.length, COLS);
  const lastRow = Math.floor((downloads.length + fillerCount - 1) / COLS);

  return (
    <div className="flex flex-col w-full min-h-[calc(100dvh-3.125rem)] bg-primary-03 overflow-x-clip">
      <h1 className="sr-only">Descargas</h1>
      {/* Una celda por archivo: el título entero es el link (abre en otra
          pestaña). Se cargan en el Studio, en "Descargas". */}
      <div className={`relative z-1 grid grid-cols-3 gap-px bg-primary-00 ${ROW_HEIGHT}`}>
        {downloads.map(({ id, title, href }, index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;

          return (
            <a
              key={id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center px-4 bg-primary-03 ring-1 ring-primary-00 text-primary-00 hover:bg-primary-00 hover:text-primary-03 transition-colors duration-300"
            >
              {row > 0 && col > 0 && <GridCross position="top" />}
              {row === lastRow && col > 0 && <GridCross position="bottom" />}
              <p className="hl-sm uppercase text-center underline">{title}</p>
            </a>
          );
        })}
        {Array.from({ length: fillerCount }, (_, fillerIndex) => {
          const absoluteIndex = downloads.length + fillerIndex;
          const row = Math.floor(absoluteIndex / COLS);
          const col = absoluteIndex % COLS;

          return (
            <div
              key={`filler-${fillerIndex}`}
              className="relative bg-primary-03"
            >
              {row > 0 && col > 0 && <GridCross position="top" />}
              {row === lastRow && col > 0 && <GridCross position="bottom" />}
            </div>
          );
        })}
      </div>
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <div className={`absolute inset-0 pt-px grid grid-cols-3 gap-px ${ROW_HEIGHT} content-start bg-primary-01`}>
          {Array.from({ length: 12 }, (_, cellIndex) => (
            <div key={cellIndex} className="relative bg-primary-03">
              {cellIndex >= COLS && cellIndex % COLS > 0 && (
                <GridCross position="top" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
