import Image from "next/image";
import Link from "next/link";
import { getFillerCount } from "@/components/grid/GridFillers";
import GridCross from "@/components/grid/GridCross";
import { projects } from "@/data/projects";

const cols = 3;

export default async function Proyectos() {
  const fillerCount = getFillerCount(projects.length, cols);

  return (
    <div className="bg-primary-03 h-[calc(100%-3.125rem)]">
      <div className="grid grid-cols-3 gap-px bg-primary-00 auto-rows-[calc(100dvh-3.125rem)]">
        {projects.map(({ slug, title, image }, index) => (
          <Link
            key={slug}
            href={`/proyectos/${slug}`}
            className="bg-primary-03 flex flex-col"
          >
            <div className="h-20 shrink-0 border-b border-primary-01 w-full flex items-center justify-center">
              <p className="hl-sm uppercase">{title}</p>
            </div>
            <div className="relative min-h-0 w-full flex-1">
              <Image
                src={image}
                alt={title}
                fill
                sizes="34vw"
                className="object-cover"
                loading={index < cols ? "eager" : undefined}
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
