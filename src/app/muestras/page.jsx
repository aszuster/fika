import Button from "@/components/buttons/Button";
import Image from "next/image";

export default function Muestras() {
  return (
    <div className="bg-primary-03 w-full h-[calc(100dvh-3.125rem)] flex flex-col-reverse lg:flex-row">
      <div className="lg:hidden h-12.5 shrink-0 border-t border-primary-00">
        <Button
          copy="Elegir muestras"
          url="/muestras/elegir"
          variant="primary"
          className="h-full py-0! bg-primary-03 text-primary-00!"
        />
      </div>

      <div className="w-full h-1/2 lg:w-1/2 lg:h-full shrink-0 relative bg-primary-02">
        <Image
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          src="/img/muestras/intro.webp"
          alt=""
        />
      </div>

      <div
        data-lenis-prevent
        className="w-full flex-1 min-h-0 lg:w-1/2 lg:h-full overflow-y-auto no-scrollbar border-t lg:border-t-0 lg:border-l border-primary-01 flex flex-col "
      >
        <div className="flex-1 w-full flex flex-col justify-center pt-8 lg:pt-10">
          <div className="flex flex-col items-center px-5">
            <h1 className="hl-lg text-[25px]! lg:text-[20px]! uppercase text-center max-w-105">
              Material box
            </h1>
            <div className="by-sm text-primary-00 text-center max-w-82.75 flex flex-col gap-2 py-6.25">
              <p>
                Tamaño del box es de 21x21x11 cm. <br />
                Incluye hasta <span className="font-medium!">8 muestras</span> a
                elección.
              </p>
              <p className="lg:hidden">
              Por favor completá tus datos para solicitar tu material box.
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex shrink-0 justify-center pb-8 lg:pb-10">
          <Button
            copy="Elegir muestras"
            url="/muestras/elegir"
            variant="tertiary"
          />
        </div>
      </div>
    </div>
  );
}
