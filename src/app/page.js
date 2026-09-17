"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { motion } from "motion/react";

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

const colors = [
  { label: "Negro", hex: "#2E2E2E" },
  { label: "Blanco", hex: "#2E2E2E" },
  { label: "Gris", hex: "#989DA4" },
  { label: "Beige", hex: "#D4C4BA" },
  { label: "Azul", hex: "#3066A5" },
  { label: "Rosa", hex: "#EACCD2" },
  { label: "Verde", hex: "#537561" },
  { label: "Rojo", hex: "#A20000" },
  { label: "Amarillo", hex: "#CE9300" },
  { label: "Marrón", hex: "#864E00" },
];

const materials = [
  "Piedra natural",
  "Porcelanato",
  "Cerámica",
  "Porcelanato monomasa",
];

const formats = [
  { label: "Mosaik", note: "(Pequeña escala)" },
  { label: "Brik", note: "(Mediana escala)" },
  { label: "Skala", note: "(Gran escala)" },
];

const applications = ["Pared", "Piso", "Pared + Piso"];

// Grid lines are drawn with a background-color trick: the grid container has
// bg-primary-01 (gray) and gap-px, while every real cell paints bg-primary-03
// (white) over its own area, so only the 1px gaps show through as lines. When
// a list doesn't fill a full row, the leftover tracks have no cell to paint
// them, so the container's gray shows through solid. GridFillers paints those
// leftover tracks white so it keeps working no matter how many items a CMS
// ends up sending.
const getFillerCount = (itemCount, cols) => (cols - (itemCount % cols)) % cols;

function GridFillers({ items, cols }) {
  const count = getFillerCount(items.length, cols);
  return Array.from({ length: count }, (_, index) => (
    <div key={`filler-${index}`} className="bg-primary-03" />
  ));
}

function FilterSection({ title, items, borderTop, renderItem }) {
  return (
    <div>
      <div
        className={`h-12.5 flex justify-center items-center border-b border-primary-00${
          borderTop ? " border-t" : ""
        }`}
      >
        <p className="hl-xs uppercase">{title}</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-primary-01">
        {items.map((item, index) => (
          <div
            key={index}
            className="h-12.5 flex items-center px-7.5 bg-primary-03"
          >
            {renderItem(item)}
          </div>
        ))}
        <GridFillers items={items} cols={2} />
      </div>
    </div>
  );
}

export default function Home() {
  const [cols, setCols] = useState(3);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const imageSizes = `${Math.ceil(100 / cols)}vw`;
  const visibleRows = cols === 6 ? 3 : 2;

  return (
    <div className="bg-primary-03 h-[calc(100%-4.5rem)]">
      <div className="sticky top-18 z-10 w-full bg-primary-03">
        <div className="flex w-full justify-between items-center px-7.25  h-12.5 border-b border-primary-00">
          <div className="flex items-center gap-7.25 h-full">
            <div>
              <Button
                copy="Filtros"
                url=""
                variant="secondary"
                onClick={() => setIsFiltersOpen((open) => !open)}
              />
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
        <motion.div
          initial={false}
          animate={{ x: isFiltersOpen ? 0 : "-100%" }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute w-160 bg-primary-03 h-[calc(100dvh-7.625rem)] border-r border-primary-00 flex flex-col justify-between"
        >
          <div className="border-b border-primary-00">
            <FilterSection
              title="Color"
              items={colors}
              renderItem={({ label, hex }) => (
                <div className="flex w-full items-center justify-between">
                  <p className="by-sm">{label}</p>
                  <div
                    className="w-5.5 h-5.5 rounded-full"
                    style={{ backgroundColor: hex }}
                  ></div>
                </div>
              )}
            />
            <FilterSection
              title="Material"
              items={materials}
              borderTop
              renderItem={(label) => <p className="by-sm">{label}</p>}
            />
            <FilterSection
              title="Formato"
              items={formats}
              borderTop
              renderItem={({ label, note }) => (
                <p className="by-sm">
                  {label} <span className="text-secondary-02">{note}</span>
                </p>
              )}
            />
            <FilterSection
              title="Aplicación"
              items={applications}
              borderTop
              renderItem={(label) => <p className="by-sm">{label}</p>}
            />
          </div>
          <div className="w-full h-18 border-t border-primary-00 flex">
            <div className="w-full flex justify-center items-center border-r border-primary-00">
              <Button copy="Borrar" variant="tertiary" />
            </div>
            <div className="w-full flex justify-center items-center">
              <Button copy="Aplicar" variant="tertiary" />
            </div>
          </div>
        </motion.div>
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
                    className="pointer-events-none absolute top-0 left-0 z-5 -translate-x-[calc(50%+0.5px)] -translate-y-1/2"
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
          <GridFillers items={products} cols={cols} />
        </div>
      </div>
    </div>
  );
}
