import { notFound } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import BackToTop from "@/components/buttons/BackToTop";
import Misc from "@/svg/Misc";

export default async function Nosotros() {
  return (
    <div className="bg-primary-03 h-full w-full @container">
      <div className="w-full h-full flex gap-px bg-primary-02 border-b border-primary-02 [--spacing:calc(100cqw/480)]">
        <div className="w-[round(down,50%,1px)] shrink-0 h-full ">
          <div>
            <div className="w-full h-100 bg-primary-02 gap-px grid grid-cols-5">
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full bg-primary-02 grid grid-cols-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="w-full h-50 grid grid-cols-5 border-y border-primary-02">
              <div className="col-span-2 bg-primary-02 grid grid-rows-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
              <div className="col-span-1 bg-primary-02 grid grid-cols-2 gap-px ">
                <div className="bg-primary-03 w-full h-full">
                  <div className="relative w-full h-full rounded-full bg-primary-00 after:absolute after:left-1/2 after:top-1/2 after:-translate-1/2 after:h-6.75 after:w-6.75 after:bg-primary-03 after:rounded-full"></div>
                </div>
                <div className="bg-primary-03 w-full h-full">
                  <div className="relative w-full h-full rounded-full bg-primary-00 after:absolute after:left-1/2 after:top-1/2 after:-translate-1/2 after:h-6.75 after:w-6.75 after:bg-primary-03 after:rounded-full"></div>
                </div>
                <div className="bg-primary-03 w-full h-full">
                  <div className="relative w-full h-full rounded-full bg-primary-00 after:absolute after:left-1/2 after:top-1/2 after:-translate-1/2 after:h-6.75 after:w-6.75 after:bg-primary-03 after:rounded-full"></div>
                </div>
                <div className="bg-primary-03 w-full h-full">
                  <div className="relative w-full h-full rounded-full bg-primary-00 after:absolute after:left-1/2 after:top-1/2 after:-translate-1/2 after:h-6.75 after:w-6.75 after:bg-primary-03 after:rounded-full"></div>
                </div>
              </div>
              <div className="col-span-2 bg-primary-02 grid grid-rows-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
            </div>
          </div>
          <div>
            <div className="w-full h-100 bg-primary-02 gap-px grid grid-cols-5">
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full bg-primary-02 grid grid-cols-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full  grid grid-rows-2 gap-px">
                <div className="h-full w-full bg-primary-03"></div>
                <div className="h-full w-full bg-primary-03"></div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="w-full h-100 bg-primary-02 gap-px grid grid-cols-5 border-t border-primary-02">
              <div className="w-full h-full col-span-2 bg-primary-03"></div>
              <div className="w-full h-full bg-primary-02 grid grid-cols-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full col-span-2 bg-primary-03"></div>
            </div>
          </div>
          <div className="">
            <div className="w-full h-50 grid grid-cols-5 border-t border-primary-02 relative">
              <div className="absolute z-10 w-5 h-5 left-1/2 top-1/2 -translate-1/2 bg-primary-00 rounded-full"></div>
              <div className="absolute z-10 w-5 h-5 left-1/2 top-0 -translate-1/2 bg-primary-00 rounded-full"></div>
              <div className="absolute z-10 w-5 h-5 left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 bg-primary-00 rounded-full"></div>
              <div className="absolute z-10 w-1.5 h-1.5 left-1/2 top-1/2 -translate-1/2 bg-primary-03 rounded-full"></div>
              <div className="absolute z-10 w-1.5 h-1.5 left-1/2 top-0 -translate-1/2 bg-primary-03 rounded-full"></div>
              <div className="absolute z-10 w-1.5 h-1.5 left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 bg-primary-03 rounded-full"></div>
              <div className="col-span-2 bg-primary-02 grid grid-rows-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
              <div className="col-span-1 bg-primary-02 grid grid-cols-2 gap-px relative">
                <div className="bg-primary-03 w-full h-full"></div>
                <div className="bg-primary-03 w-full h-full"></div>
                <div className="bg-primary-03 w-full h-full"></div>
                <div className="bg-primary-03 w-full h-full"></div>
              </div>
              <div className="col-span-2 bg-primary-02 grid grid-rows-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="w-full h-100 bg-primary-02 gap-px grid grid-cols-5 border-t border-primary-02">
              <div className="w-full h-full col-span-2 bg-primary-03"></div>
              <div className="w-full h-full bg-primary-02 grid grid-cols-2 gap-px">
                <div className="w-full h-full bg-primary-03"></div>
                <div className="w-full h-full bg-primary-03"></div>
              </div>
              <div className="w-full h-full col-span-2 bg-primary-03"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0 h-full flex flex-col bg-primary-02 gap-px">
          <div className="w-full h-[calc(var(--spacing)*50-0.5px)] bg-primary-03"></div>
          <div className="w-full h-[calc(var(--spacing)*150-1px)] bg-primary-03 relative">
            <div className=" pl-17.5 pr-25  font-sans xl:text-[28px] xl:leading-12 2xl:text-[30px] 2xl:leading-10 flex flex-col gap-6 absolute top-1/2 -translate-y-1/2">
              <p>
                Fika entiende el diseño como una disciplina de precisión. Una
                práctica donde la unidad mínima se articula para dar respuesta a
                la envolvente arquitectónica: el plano de los muros y los
                pavimentos.{" "}
              </p>
              <p>
                Desde esta mirada, Fika trasciende la herencia del mosaico para
                emerger como un especialista en revestimientos minerales. Cada
                pieza se concibe desde su materialidad intrínseca, buscando una
                síntesis entre tecnología aplicada y control del detalle
                constructivo. Proponemos una estética esencial donde la calidad
                reside en la precisión de la parte para garantizar la excelencia
                del todo. 
              </p>
            </div>
          </div>
          <div className="w-full h-[calc(var(--spacing)*50-0.5px)] bg-primary-03 relative"></div>
          <div className="w-full h-[calc(var(--spacing)*250-1.5px)] bg-primary-02 flex flex-col gap-px relative">
            <div className="absolute top-0 left-0  flex flex-col gap-0">
              <div className="-scale-x-100">
                <Misc />
              </div>
              <p className="text-[18px] font-normal">2026</p>
            </div>
            <div className="absolute left-1/2 top-1/2 -translate-1/2 h-165.5 w-165.5 rounded-full bg-[url('/img/nosotros/circle.webp')] bg-cover"></div>
            <div className="absolute left-1/2 top-1/2 -translate-1/2 h-31.25 w-31.25 rounded-full bg-primary-03"></div>
            <div className="absolute top-[calc(50%+var(--spacing)*82.75)] left-0 -scale-x-100">
              <Misc />
            </div>

            <div className="w-full h-full bg-primary-03"></div>
            <div className="w-full h-full bg-primary-03"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="bg-primary-03 px-12.5 pt-25">
          <Image src="/img/logo.svg" width={67} height={25} className="w-full h-auto" alt="" />
        </div>
        <div className="h-full flex justify-between relative px-12.5 py-12.5">
          <div className="flex gap-10">
            <a href="" className="hl-xs underline uppercase transition-all duration-300 hover:text-secondary-01">
              Instagram
            </a>
            <a href="mailto:info@fikarevestimientos.com" target="_blank" className="hl-xs underline uppercase transition-all duration-300 hover:text-secondary-01">
              info@fikarevestimientos.com
            </a>
          </div>
          <div>
            <BackToTop className="hl-xs underline uppercase flex transition-all duration-300 hover:text-secondary-01" />
          </div>
        </div>
      </div>
    </div>
  );
}
