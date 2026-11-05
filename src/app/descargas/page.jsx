import Image from "next/image";
import Button from "@/components/buttons/Button";
import GridCross from "@/components/grid/GridCross";
import { getFillerCount } from "@/components/grid/GridFillers";

const COLS = 3;

const DOWNLOADS = [
  {
    title: "Manual de instalación",
    description: "Todos los productos Fika en un solo documento.",
    image: "/img/descargas/fika-manual_instalacion-placeholder_11_2025.jpg",
    href: "/docs/ManualInstalacion_Fika.pdf",
  },
  {
    title: "Manual de advertencias",
    description: "Precios sugeridos de toda la línea.",
    image: "/img/descargas/fika-manual_adverencias-placeholder-1.jpg",
    href: "/docs/ManualAdvertencias_Fika.pdf",
  },
  {
    title: "Catálogo de productos",
    description: "Recomendaciones de colocación y cuidado.",
    image: "/img/descargas/fika-catalogo_completo-placeholder.jpg",
    href: "/docs/FIKA_2026all.pdf",
  },
];

export default function Descargas() {
  const fillerCount = getFillerCount(DOWNLOADS.length, COLS);
  const lastRow = Math.floor((DOWNLOADS.length + fillerCount - 1) / COLS);

  return (
    <div className="flex flex-col w-full min-h-[calc(100dvh-3.125rem)] bg-primary-03 overflow-x-clip">
      <div className="h-59 w-full grid grid-cols-3 gap-px bg-primary-01">
        <div className="bg-primary-03"></div>
        <div className="flex items-center justify-center bg-primary-03">
          <h2 className="hl-lg uppercase text-primary-00 z-10">Descargas</h2>
        </div>
        <div className="bg-primary-03"></div>
      </div>
      <div className="relative z-1 grid grid-cols-3 gap-px bg-primary-00 border-t border-primary-01">
        {DOWNLOADS.map(({ title, description, image, href }, index) => {
          const row = Math.floor(index / COLS);
          const col = index % COLS;

          return (
            <div
              key={title}
              className="relative flex flex-col bg-primary-03 ring-1 ring-primary-00"
            >
              {row > 0 && col > 0 && <GridCross position="top" />}
              {row === lastRow && col > 0 && <GridCross position="bottom" />}
              <div className="h-17.5 shrink-0 border-b border-primary-01 w-full flex flex-col items-center justify-center px-4">
                <p className="hl-sm uppercase text-center">{title}</p>
              </div>

              {/* La imagen también descarga, y su hover activa el del botón. */}
              <div className="group/descarga flex flex-1 flex-col">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden
                    className="relative h-62.75 w-full"
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </a>
                ) : (
                  <div className="relative h-62.75 w-full">
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex mt-auto border-t border-primary-01">
                  <Button
                    copy="Descargar"
                    variant="primary"
                    url={href ?? undefined}
                    target="_blank"
                    disabled={!href}
                    className={`bg-primary-03! border-t border-primary-00! text-primary-00! ${
                      href
                        ? "group-hover/descarga:bg-primary-00! group-hover/descarga:text-primary-03!"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {Array.from({ length: fillerCount }, (_, fillerIndex) => {
          const absoluteIndex = DOWNLOADS.length + fillerIndex;
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
        <div className="absolute inset-0 pt-px grid grid-cols-3 gap-px auto-rows-87 content-start bg-primary-01">
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
