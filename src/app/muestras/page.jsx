import Button from "@/components/buttons/Button";
import Image from "next/image";

export default function Muestras() {
  return (
    <div className="bg-primary-03 w-full h-[calc(100dvh-3.125rem)] flex">
      <div className="w-1/2 h-full relative bg-primary-02">
        <Image
          fill
          className="object-cover"
          src="/img/muestras/intro.webp"
          alt=""
        />
      </div>

      <div
        data-lenis-prevent
        className="w-1/2 h-full overflow-y-auto no-scrollbar border-l border-primary-01 flex flex-col "
      >
        <div className="flex-1 w-full flex flex-col justify-center pt-10">
          <div className="flex flex-col items-center px-5">
            <h1 className="hl-lg uppercase text-center max-w-105">
              Material box
            </h1>
            <div className="by-sm text-primary-00 text-center max-w-82.75 flex flex-col gap-2 py-6.25">
              <p>
                Tamaño del box es de 21x21x11 cm. <br />
                Incluye hasta <span className="font-medium!">8 muestras</span> a
                elección.
              </p>
            </div>
          </div>
        </div>
        <div className="shrink-0 flex justify-center pb-10">
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
