import { Fragment } from "react";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import Image from "next/image";
import Link from "next/link";
import Arrow from "@/svg/Arrow";
import Carousel from "@/components/carousel/Carousel";
import BackToTop from "@/components/buttons/BackToTop";

// Mockup de la galería: por ahora una sola foto repetida para ver el
// carrusel funcionando; más adelante viene del CMS.
const gallery = Array.from(
  { length: 4 },
  () => "/img/proyectos/jorgelina_project.webp",
);

// Mockup de la ficha del proyecto: más adelante viene del CMS.
const details = [
  { label: "Estudio", value: "Jorgelina Tortorici Arq. & Asoc." },
  {
    label: "Profesionales",
    value: "Arq. Jorgelina Tortorici / Arq. Nicolás Lanza",
  },
  { label: "Tipo", value: "Residencial" },
  { label: "Lugar", value: "Ramos Mejía, Buenos Aires" },
  { label: "Año", value: "2025" },
  { label: "Créditos", value: "----" },
];

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// Por ahora todos los proyectos muestran el mismo mockup; más adelante cada
// uno va a armar su página con la información del CMS.
export default async function ProyectoPage({ params }) {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <div className="bg-primary-03 h-[calc(100dvh-3.125rem)] flex shrink-0">
        <div className="relative flex-1 min-w-0 h-full">
          <Image
            src="/img/proyectos/jorgelina.webp"
            alt=""
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 h-full bg-primary-03 flex flex-col items-center justify-between shrink-0">
          <div className="flex flex-col h-full gap-25 justify-center">
            <h2 className="text-center hl-xl uppercase mx-auto max-w-151">
              Jorgelina Tortorici Arq. & Asoc
            </h2>
            <p className="text-center mx-auto max-w-73.5 text-[60px] font-mono uppercase border border-primary-00 rounded-sm px-2 tracking-[-1.8px] font-light leading-18">
              Casa Be
            </p>
          </div>
          <div className="h-25">
            <div className="rotate-90">
              <Arrow className="mx-auto " />
            </div>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 ">
        <div className="relative w-13 border-r border-primary-00 py-33.75">
          <div className="absolute top-38.25 left-7 w-10 h-10 rounded-full flex justify-center items-center bg-primary-00">
            <div className="h-2.5 w-2.5 rounded-full bg-primary-03"></div>
          </div>
        </div>
        <div className="w-full py-33.75 ">
          <p className="font-sans text-[50px] font-light w-425 mx-auto">
            Esta casa de 450m2 está ubicada en un lote en esquina, en un barrio
            cerrado de la ciudad de{" "}
            <a
              target="_blank"
              href="https://www.archdaily.com/es/tag/adrogue"
              className="underline"
            >
              Adrogué
            </a>
            , Buenos Aires. Su implantación en "L" permite abrazar el jardín
            central de la casa desde afuera hacia adentro. Hacia un lado una
            fachada casi ciega, de hormigón visto, en relación con la calle
            principal de acceso al barrio, permite cerrarse al tránsito y a las
            vistas exteriores.
          </p>
        </div>
        <div className="w-13 py-33.75"></div>
      </div>
      <div className="flex shrink-0 border-y border-primary-00">
        <div className="relative w-13 border-r border-primary-00 "></div>
        <div className="w-full  flex">
          <div className="flex-1 ">
            <div className="h-12.5 flex justify-center items-center border-b border-primary-01">
              <p className="hl-xs uppercase">Ficha técnica</p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-primary-01 border-b border-primary-01">
              {details.map(({ label, value }) => (
                <Fragment key={label}>
                  <div className="pl-5.25 py-0.5 flex items-center bg-primary-03">
                    <p className="text-primary-00 by-sm">{label}</p>
                  </div>
                  <div className="pl-5.25 flex items-center bg-primary-03">
                    <p className="by-sm">{value}</p>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex-1 border-l border-primary-00">
            <div className="h-12.5 flex justify-center items-center border-b border-primary-01">
              <p className="hl-xs uppercase">
                Productos Fika utilizados en el proyecto
              </p>
            </div>
            <div className="pl-5.25 py-0.5 flex items-center border-b border-primary-01">
              <p className="by-sm underline">Stackbond Matte Offwhite</p>
            </div>
          </div>
        </div>
        <div className="w-13  border-l border-primary-00"></div>
      </div>
      <div className="flex shrink-0 h-225.75">
        <div className="relative w-13 border-r border-primary-00 py-7.5"></div>
        <div className="w-full py-7.5 ">
          <div className="relative h-full w-full">
            <Carousel
              images={gallery}
              sizes="100vw"
              dotsClassName="absolute -bottom-7.5 left-1/2 -translate-x-1/2 h-7.5 items-center"
            />
          </div>
        </div>
        <div className="w-13 py-7.5 border-l border-primary-00"></div>
      </div>
      <div className="flex shrink-0 h-57.5 border-y border-primary-00">
        <div className="relative w-13 border-r border-primary-00 py-7.5"></div>
        <Link
          href="/proyectos"
          className="group w-full py-7.5 flex justify-center items-center gap-5.75 bg-primary-03 hover:bg-primary-00 hover:text-primary-03 transition-colors duration-300 ease-in-out"
        >
          <p className="font-mono text-[40px] font-light uppercase group-hover:text-primary-01 transition-colors duration-300 ease-in-out">
            Ver todos los proyectos
          </p>
          <Arrow
            color="currentColor"
            className="group-hover:text-primary-01 transition-colors duration-300 ease-in-out"
          />
        </Link>
        <div className="w-13 py-7.5 border-l border-primary-00"></div>
      </div>
      <div className="mt-32.5 mb-10.5 flex justify-between px-13">
        <div className="flex gap-9.5 hl-xs uppercase font-light underline">
          <a href="" className="">Instagram</a>
          <a href="mailto:info@fikarevestimientos.com" className="">info@fikarevestimientos.com</a>
        </div>
        <div className="hl-xs uppercase font-light underline">
          <BackToTop/>
        </div>
      </div>
    </>
  );
}
