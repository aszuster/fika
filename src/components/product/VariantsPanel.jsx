"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import Carousel from "@/components/carousel/Carousel";
import { ReactLenis } from "@/utils/lenis";

const VariantsPanel = ({ variants, details }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex !== null ? variants[selectedIndex] : null;

  const goToVariant = (next) =>
    setSelectedIndex((next + variants.length) % variants.length);

  return (
    <ReactLenis
      className="flex-1 overflow-y-auto"
      data-lenis-prevent
      options={{ orientation: "vertical" }}
    >
      {selected ? (
        <div className="grid grid-cols-2 h-full">
          <div className="relative border-r border-primary-00 h-full">
            <Carousel
              key={selectedIndex}
              images={
                selected.samplePhotos.length > 0
                  ? selected.samplePhotos
                  : [selected.catalogPhoto]
              }
            />
          </div>

          <div className="flex flex-col">
            <div className="h-12.5 shrink-0 flex items-center px-7.5 border-b border-primary-00">
              <Button
                copy="Volver a variantes"
                variant="secondary"
                onClick={() => setSelectedIndex(null)}
              />
            </div>
            <div className="h-21.75 shrink-0 border-b border-primary-01 flex items-center justify-center gap-7.5">
              <button
                type="button"
                onClick={() => goToVariant(selectedIndex - 1)}
                aria-label="Variante anterior"
                className="btn-sm cursor-pointer hl-sm"
              >
                ‹
              </button>
              <p className="hl-sm uppercase">{selected.name}</p>
              <button
                type="button"
                onClick={() => goToVariant(selectedIndex + 1)}
                aria-label="Variante siguiente"
                className="btn-sm cursor-pointer hl-sm"
              >
                ›
              </button>
            </div>
            <div className="relative h-60 w-full shrink-0 p-8">
              <div className="relative h-full w-full">
                <Image
                  src={selected.catalogPhoto}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-primary-01">
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  className="h-12.5 flex flex-col justify-center px-7.5 bg-primary-03"
                >
                  <p className="text-secondary-02 by-sm">{label}</p>
                  <p className="by-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-px bg-primary-01 auto-rows-[calc((100dvh-7.625rem-2px)/2)]">
          {variants.map(({ name, catalogPhoto }, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const hasCross = row > 0 && col > 0;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="relative flex h-full flex-col bg-primary-03 cursor-pointer group hover:text-primary-03 hover:bg-primary-00 transition-all duration-300 ease-in-out text-left"
              >
                {hasCross && (
                  <Image
                    src="/img/cross.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="pointer-events-none absolute top-0 left-0 z-5 -translate-x-[calc(50%+0.5px)] -translate-y-1/2"
                  />
                )}
                <div className="h-21.75 shrink-0 border-b border-primary-01 w-full flex flex-col items-center justify-center">
                  <p className="hl-sm uppercase">{name}</p>
                </div>
                <div className="min-h-0 w-full flex-1 p-8">
                  <div className="relative h-full w-full">
                    <Image
                      src={catalogPhoto}
                      alt=""
                      fill
                      sizes="25vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              </button>
            );
          })}
          <GridFillers items={variants} cols={2} />
        </div>
      )}
    </ReactLenis>
  );
};

export default VariantsPanel;
