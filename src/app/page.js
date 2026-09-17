"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import Navbar from "@/components/navbar/Navbar";

const grids = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const titles = {
  3: "hl-lg",
  4: "hl-md",
  5: "hl-sm",
  6: "hl-sm",
};

const autoRaws = {
  2: "auto-rows-[calc((100dvh-7.625rem-2px)/2)]",
  3: "auto-rows-[calc((100dvh-7.625rem-2px)/3)]",
};

const products = [
  { title: "Arch", src: "/img/productos/arch.png" },
  { title: "Eclair", src: "/img/productos/eclair.png" },
  { title: "Stone cóncavo", src: "/img/productos/stone-concavo.png" },
  { title: "Stone convexo", src: "/img/productos/stone-convexo.png" },
  { title: "Medialuna", src: "/img/productos/medialuna.png" },
  { title: "Quadra 10x10", src: "/img/productos/quadra-10-10.png" },
  { title: "Finger", src: "/img/productos/finger.png" },
  { title: "Stackbond", src: "/img/productos/stackbond.png" },
  { title: "Finger stackbond", src: "/img/productos/finger-stackbond.png" },
  { title: "Herringbone", src: "/img/productos/herringbone.png" },
  { title: "Lantern", src: "/img/productos/lantern.png" },
  { title: "Vainilla", src: "/img/productos/vanilla.png" },
  { title: "Plumage", src: "/img/productos/plumage.png" },
  { title: "Tunnel", src: "/img/productos/tunnel.png" },
  { title: "Dot", src: "/img/productos/dot.png" },
  { title: "Fishcale", src: "/img/productos/fishcale.png" },
  { title: "Hexa", src: "/img/productos/hexa.png" },
  { title: "Piano keyboard", src: "/img/productos/piano-keyboard.png" },
];

export default function Home() {
  const [cols, setCols] = useState(3);
  const imageSizes = `${Math.ceil(100 / cols)}vw`;
  const visibleRows = cols === 6 ? 3 : 2;

  return (
    <div>
      <Navbar />
      <div className="bg-primary-03 h-[calc(100%-4.5rem)]">
        <div className="sticky top-18 z-10 w-full bg-primary-03">
          <div className="flex w-full justify-between items-center px-7.25  h-12.5 border-b border-primary-00">
            <div className="flex items-center gap-7.25 h-full">
              <div>
                <Button copy="Filtros" url="" variant="secondary" />
              </div>
              <div className="border-l border-primary-00 pl-7.25 h-full flex items-center">
                <p className="by-sm underline">¿Qué estás buscando?</p>
              </div>
            </div>

            <div className="flex h-full items-center gap-8 border-l border-primary-00 pl-7.25">
              <p className="btn-sm">Vista</p>
              <input
                type="range"
                min={3}
                max={6}
                step={1}
                value={9 - cols}
                onChange={(e) => setCols(9 - Number(e.target.value))}
                aria-label="Zoom de la grilla"
                className="range-cols w-34.25"
              />
            </div>
          </div>
        </div>
        <div>
          <div
            className={`grid ${grids[cols]} gap-px bg-primary-01 ${autoRaws[visibleRows]}`}
          >
            {products.map(({ title, src }, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const hasCross = row > 0 && col > 0;

              return (
                <div
                  key={title}
                  className="relative flex h-full flex-col items-center bg-primary-03"
                >
                  {hasCross && (
                    <Image
                      src="/img/cross.svg"
                      width={24}
                      height={24}
                      alt=""
                      className="pointer-events-none absolute top-0 left-0 z-10 -translate-x-[calc(50%+0.5px)] -translate-y-1/2"
                    />
                  )}
                  <div className="h-21.75 shrink-0 border-b border-primary-01 w-full flex flex-col items-center justify-center">
                    <p className={`${titles[cols]} uppercase`}>{title}</p>
                  </div>
                  <div className="min-h-0 w-full flex-1 p-8">
                    <div className="relative h-full w-full">
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes={imageSizes}
                        className="object-contain"
                        loading={index === 0 ? "eager" : undefined}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
