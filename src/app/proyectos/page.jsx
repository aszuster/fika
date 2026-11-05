import Image from "next/image";
import Link from "next/link";
import { getFillerCount } from "@/components/grid/GridFillers";
import GridCross from "@/components/grid/GridCross";
import { projects } from "@/data/projects";

const cols = 3;

const hoverTransition =
  "duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none";

// La imagen se recorta hasta un círculo. El diámetro sale del lado más corto
// del panel (84cqmin = 84%), así queda redondo en cualquier proporción. El radio
// va en cqmin porque en inset() un % se mide sobre la caja entera, no sobre el recorte.
const imageHover =
  "[clip-path:inset(0_round_0)] group-hover:[clip-path:inset(calc(50%-42cqmin)_calc(50%-42cqmin)_round_42cqmin)] group-focus-visible:[clip-path:inset(calc(50%-42cqmin)_calc(50%-42cqmin)_round_42cqmin)] transition-[clip-path]";

export default async function Proyectos() {
  const fillerCount = getFillerCount(projects.length, cols);

  return (
    <div className="bg-primary-03 h-[calc(100%-3.125rem)]">
      <div className="grid grid-cols-3 gap-px bg-primary-00 auto-rows-[calc(100dvh-3.125rem)]">
        {projects.map(({ slug, title, image }, index) => (
          <Link
            key={slug}
            href={`/proyectos/${slug}`}
            className="group bg-primary-03 flex flex-col"
          >
            <div className="h-20 shrink-0 border-b border-primary-01 w-full flex items-center justify-center">
              <p className="hl-sm uppercase">{title}</p>
            </div>
            <div className="relative min-h-0 w-full flex-1 [container-type:size]">
              <Image
                src={image}
                alt={title}
                fill
                sizes="34vw"
                className={`object-cover ${imageHover} ${hoverTransition}`}
                loading={index < cols ? "eager" : undefined}
              />
              <div
                className={`absolute top-1/2 left-1/2 size-12.5 -translate-1/2 rounded-full bg-primary-03 scale-0 group-hover:scale-100 group-focus-visible:scale-100 transition-[scale] ${hoverTransition}`}
              />
            </div>
          </Link>
        ))}

        {Array.from({ length: fillerCount }, (_, index) => (
          <div key={`filler-${index}`} className="bg-primary-03 flex flex-col">
            <div className="h-21.75 shrink-0 border-b border-primary-01 w-full" />
            <div className="min-h-0 w-full flex-1 grid grid-cols-2 grid-rows-2 gap-px bg-primary-01">
              <div className="bg-primary-03" />
              <div className="bg-primary-03" />
              <div className="bg-primary-03" />
              <div className="relative bg-primary-03">
                <GridCross />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
