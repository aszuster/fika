"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import FiltersPanel from "@/components/filters/FiltersPanel";
import { products } from "@/data/products";

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

const emptyFilters = {
  color: [],
  material: [],
  format: [],
  application: [],
};

const matchesFilters = (product, filters) =>
  Object.entries(filters).every(
    ([key, values]) => values.length === 0 || values.includes(product[key])
  );

export default function Home() {
  const [cols, setCols] = useState(3);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const imageSizes = `${Math.ceil(100 / cols)}vw`;
  const visibleRows = cols === 6 ? 3 : 2;

  const visibleProducts = products.filter((product) =>
    matchesFilters(product, appliedFilters)
  );

  const appliedFiltersCount = Object.values(appliedFilters).reduce(
    (count, values) => count + values.length,
    0
  );

  return (
    <div className="bg-primary-03 h-[calc(100%-4.5rem)]">
      <div className="sticky top-18 z-10 w-full bg-primary-03">
        <div className="flex w-full justify-between items-center px-7.25  h-12.5 border-b border-primary-00">
          <div className="flex items-center gap-7.25 h-full">
            <div>
              <Button
                copy={
                  appliedFiltersCount > 0
                    ? `Filtros (${appliedFiltersCount})`
                    : "Filtros"
                }
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
        <FiltersPanel
          isOpen={isFiltersOpen}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setIsFiltersOpen(false);
          }}
          onClear={() => setAppliedFilters(emptyFilters)}
        />
      </div>

      <div>
        <div
          className={`grid ${grids[cols]} gap-px bg-primary-01 ${autoRaws[visibleRows]}`}
        >
          {visibleProducts.map(({ title, slug, src }, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const hasCross = row > 0 && col > 0;

            return (
              <Link
                key={title}
                href={`/productos/${slug}`}
                className="relative flex h-full flex-col items-center bg-primary-03 group hover:text-primary-03 hover:bg-primary-00 transition-all duration-300 ease-in-out"
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
                  <p className={`${titles[cols]} uppercase `}>{title}</p>
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
              </Link>
            );
          })}
          <GridFillers items={visibleProducts} cols={cols} />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: isFiltersOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        onClick={() => setIsFiltersOpen(false)}
        className={`fixed inset-x-0 top-30.5 bottom-0 bg-primary-00/40 ${
          isFiltersOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
    </div>
  );
}
