import { Fragment } from "react";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/data/projects";
import Image from "next/image";
import Link from "next/link";
import Arrow from "@/svg/Arrow";
import Carousel from "@/components/carousel/Carousel";
import BackToTop from "@/components/buttons/BackToTop";
import RichText from "@/components/project/RichText";
import ProjectImageTransition from "@/components/transitions/ProjectImageTransition";

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export default async function ProyectoPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const {
    studio,
    title,
    image,
    imagePosition,
    description,
    gallery,
    products,
  } = project;

  // Ficha técnica: solo las filas que tienen dato.
  const details = [
    { label: "Estudio", value: studio },
    { label: "Profesionales", value: project.professionals },
    { label: "Tipo", value: project.type },
    { label: "Lugar", value: project.location },
    { label: "Año", value: project.year },
    { label: "Créditos", value: project.credits },
  ].filter(({ value }) => value);

  return (
    <>
      {/* Mobile: imagen arriba y nombre abajo. Desktop: mitad y mitad. */}
      <div className="bg-primary-03 h-[calc(100dvh-3.125rem)] flex flex-col lg:flex-row shrink-0">
        <ProjectImageTransition slug={slug}>
          <div className="relative w-full h-[55%] shrink-0 lg:shrink lg:w-auto lg:flex-1 lg:min-w-0 lg:h-full">
            {image && (
              <Image
                src={image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                loading="eager"
                className="object-cover"
                style={{ objectPosition: imagePosition }}
              />
            )}
          </div>
        </ProjectImageTransition>
        <div className="flex-1 min-h-0 min-w-0 lg:h-full bg-primary-03 flex flex-col items-center justify-between shrink-0 px-5 lg:px-0">
          <div className="flex flex-col h-full gap-6 lg:gap-25 justify-center">
            <h2 className="text-center hl-xl max-lg:text-[2.5rem]! max-lg:leading-12! uppercase mx-auto max-w-151">
              {studio}
            </h2>
            {title && (
              <p className="text-center mx-auto max-w-73.5 text-[32px] lg:text-[60px] font-mono uppercase border border-primary-00 rounded-sm px-2 tracking-[-1px] lg:tracking-[-1.8px] font-light leading-10 lg:leading-18">
                {title}
              </p>
            )}
          </div>
          <div className="h-15 lg:h-25">
            <div className="rotate-90">
              <Arrow className="mx-auto " />
            </div>
          </div>
        </div>
      </div>
      {description?.length > 0 && (
        <div className="flex shrink-0 ">
          <div className="hidden lg:block relative w-13 border-r border-primary-00 py-33.75">
            <div className="absolute top-38.25 left-7 w-10 h-10 rounded-full flex justify-center items-center bg-primary-00">
              <div className="h-2.5 w-2.5 rounded-full bg-primary-03"></div>
            </div>
          </div>
          <div className="w-full py-15 lg:py-33.75 flex flex-col gap-[1em] font-sans text-[24px] lg:text-[50px] font-light">
            <RichText value={description} className="w-full px-5 lg:px-0 lg:w-425 lg:mx-auto" />
          </div>
          <div className="hidden lg:block w-13 py-33.75"></div>
        </div>
      )}
      <div className="flex shrink-0 border-y border-primary-00">
        <div className="hidden lg:block relative w-13 border-r border-primary-00 "></div>
        <div className="w-full flex flex-col lg:flex-row">
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
          <div className="flex-1 border-t lg:border-t-0 lg:border-l border-primary-00">
            <div className="h-12.5 flex justify-center items-center border-b border-primary-01 px-5">
              <p className="hl-xs uppercase text-center">
                Productos Fika utilizados en el proyecto
              </p>
            </div>
            {products.map(({ key, label, href }) => (
              <div
                key={key}
                className="pl-5.25 py-0.5 flex items-center border-b border-primary-01"
              >
                <Link href={href} className="by-sm underline">
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden lg:block w-13  border-l border-primary-00"></div>
      </div>
      {gallery.length > 0 && (
        <div className="flex shrink-0 h-[80vw] lg:h-225.75">
          <div className="hidden lg:block relative w-13 border-r border-primary-00 py-7.5"></div>
          <div className="w-full py-7.5 ">
            <div className="relative h-full w-full">
              <Carousel
                images={gallery}
                sizes="100vw"
                dotsClassName="absolute -bottom-7.5 left-1/2 -translate-x-1/2 h-7.5 items-center"
              />
            </div>
          </div>
          <div className="hidden lg:block w-13 py-7.5 border-l border-primary-00"></div>
        </div>
      )}
      <div className="flex shrink-0 h-30 lg:h-57.5 border-y border-primary-00">
        <div className="hidden lg:block relative w-13 border-r border-primary-00 py-7.5"></div>
        <Link
          href="/proyectos"
          className="group w-full py-7.5 flex justify-center items-center gap-5.75 bg-primary-03  duration-300 ease-in-out"
        >
          <p className="font-mono text-[22px] lg:text-[40px] font-light uppercase group-hover:text-secondary-01 transition-all duration-300 ease-in-out">
            Ver todos los proyectos
          </p>
          <Arrow
            color="currentColor"
            className="group-hover:translate-x-1.5 transition-all duration-300 ease-in-out"
          />
        </Link>
        <div className="hidden lg:block w-13 py-7.5 border-l border-primary-00"></div>
      </div>
      {/* Mobile: links uno debajo del otro y "volver arriba" al final. */}
      <div className="mt-16 lg:mt-32.5 mb-10.5 flex flex-col lg:flex-row gap-8 lg:gap-0 justify-between px-5 lg:px-13">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-9.5 hl-xs uppercase font-light underline">
          <a href="" className="">Instagram</a>
          <a href="mailto:info@fikarevestimientos.com" className="">info@fikarevestimientos.com</a>
                      <div className="flex items-center gap-2">
<Image width={18} height={18} src="/img/whatsapp.svg" alt=""/>
                        <a href="https://wa.me/5491124768416" target="_blank" rel="noopener noreferrer" className="hl-xs underline uppercase transition-all duration-300 hover:text-secondary-01">+549 1124768416</a>
                      </div>
        </div>
        <div className="hl-xs uppercase font-light underline">
          <BackToTop/>
        </div>
      </div>
    </>
  );
}
