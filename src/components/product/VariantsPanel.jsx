"use client";

import { Fragment, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import Carousel from "@/components/carousel/Carousel";
import { ReactLenis } from "@/utils/lenis";
import Chevron from "@/svg/Chevron";

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
        <div className="grid grid-cols-2 h-[calc(100dvh-7.625rem)]">
          <div className="border-r border-primary-00 relative">
            <div className="relative h-full px-10 py-15">
              <Carousel
                key={selectedIndex}
                images={
                  selected.samplePhotos.length > 0
                    ? selected.samplePhotos
                    : [selected.catalogPhoto]
                }
              />
            </div>
            <div className="absolute bottom-0 h-7.5 w-full border-t border-primary-01"></div>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div className="flex flex-col h-full">
              <div className="h-12.5 shrink-0 flex items-center px-7.5 border-b border-primary-00">
                <Button
                  copy="Volver"
                  variant="secondary"
                  onClick={() => setSelectedIndex(null)}
                />
              </div>
              <div className="h-22.5 shrink-0 border-b border-primary-00 flex items-center justify-between px-6.5">
                <button
                  type="button"
                  onClick={() => goToVariant(selectedIndex - 1)}
                  aria-label="Variante anterior"
                  className="cursor-pointer h-full rotate-180 border-l border-primary-00 pl-6.5"
                >
                  <Chevron />
                </button>
                <div className="relative h-full flex-1 flex items-center justify-center">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={selectedIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="hl-sm uppercase absolute"
                    >
                      {selected.name}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <button
                  type="button"
                  onClick={() => goToVariant(selectedIndex + 1)}
                  aria-label="Variante siguiente"
                  className="cursor-pointer h-full border-l border-primary-00 pl-6.5"
                >
                  <Chevron />
                </button>
              </div>
              <div className="relative h-60 w-full shrink-0 grow p-8 flex justify-center items-center">
                <div className="relative h-70 w-72.75">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={selectedIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={selected.catalogPhoto}
                        alt=""
                        fill
                        sizes="25vw"
                        className="object-contain"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <div className="border-t border-primary-00">
              <div className="h-12.5 flex justify-center items-center border-b border-primary-01">
              <p className="hl-xs uppercase">Ficha técnica</p>
              </div>
              <div className="grid grid-cols-2 gap-px bg-primary-01">
                {details.map(({ label, value }) => (
                  <Fragment key={label}>
                    <div className="pl-1.75 py-0.5 flex items-center bg-primary-03">
                      <p className="text-secondary-02 by-sm">{label}</p>
                    </div>
                    <div className="pl-1.75 flex items-center bg-primary-03">
                      <p className="by-sm">{value}</p>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div className="h-7.5 shrink-0 w-full border-t border-primary-02"></div>
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
