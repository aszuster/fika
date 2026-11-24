import MuestrasForm from "@/components/muestras/MuestrasForm";
import Image from "next/image";

export default function Muestras() {
  return (
    <div className="bg-primary-03 w-full h-[calc(100dvh-3.125rem)] flex">
      {/* Columna izquierda: imagen (pendiente). Cuando esté, usar <Image fill className="object-cover" /> dentro de este div. */}
      <div className="w-1/2 h-full relative bg-primary-02">
        <Image
          fill
          className="object-cover"
          src="/img/muestras/intro.webp"
          alt=""
        />
      </div>

      {/* Columna derecha: título, texto y formulario */}
      <div
        data-lenis-prevent
        className="w-1/2 h-full overflow-y-auto no-scrollbar border-l border-primary-01 flex flex-col "
      >
        <div className="my-auto w-full flex flex-col py-10">
          <div className="flex flex-col items-center px-5 pb-15">
            <h1 className="hl-lg uppercase text-center max-w-105">
              Material box
            </h1>
            <div className="by-sm text-primary-00 text-center max-w-82.75 flex flex-col gap-2 py-6.25">
              <p>
                Tamaño del box es de 21x21x11 cm. <br />
                Incluye hasta <span className="font-medium!">8 muestras</span> a
                elección.
              </p>
              <p>
                Por favor completá tus datos para solicitar tu material box.
              </p>
            </div>
          </div>
          <MuestrasForm />
        </div>
      </div>
    </div>
  );
}
