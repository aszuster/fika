"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import GridCross, { hasTopCross } from "@/components/grid/GridCross";
import MaterialBoxPanel from "@/components/muestras/MaterialBoxPanel";
import { MAX_MUESTRAS, MUESTRAS_SELECCION_KEY } from "@/data/muestras";

// Columnas de la grilla: 2 en mobile, 6 en desktop (las cruces y los rellenos
// se calculan para cada una).
const COLS = 6;
const MOBILE_COLS = 2;


const subscribe = () => () => {};
const getSavedSnapshot = () => {
  try {
    return sessionStorage.getItem(MUESTRAS_SELECCION_KEY);
  } catch {
    return null;
  }
};
const getServerSnapshot = () => null;

const parseSavedKeys = (raw) => {
  try {
    const saved = JSON.parse(raw);
    return Array.isArray(saved) ? saved.map((chip) => chip?.key) : [];
  } catch {
    return [];
  }
};

export default function ElegirMuestras({ chips }) {
  const chipsByKey = Object.fromEntries(chips.map((chip) => [chip.key, chip]));


  const rawSaved = useSyncExternalStore(subscribe, getSavedSnapshot, getServerSnapshot);
  const savedKeys = parseSavedKeys(rawSaved)
    .filter((key) => chipsByKey[key])
    .slice(0, MAX_MUESTRAS);
  const [edited, setSelected] = useState(null);

  const selected = edited ?? savedKeys;
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const isFull = selected.length >= MAX_MUESTRAS;
  const selectedChips = selected.map((key) => chipsByKey[key]).filter(Boolean);

  const router = useRouter();

  const goToCheckout = () => {
    if (selectedChips.length === 0) return;
    try {
      sessionStorage.setItem(MUESTRAS_SELECCION_KEY, JSON.stringify(selectedChips));
    } catch {}
    router.push("/muestras/completar");
  };

  const removeChip = (key) => {
    const next = selected.filter((item) => item !== key);
    setSelected(next);
    if (next.length === 0) setIsPanelOpen(false);
  };

  const toggleChip = (key) => {
    if (selected.includes(key)) {
      setSelected(selected.filter((item) => item !== key));
    } else if (selected.length < MAX_MUESTRAS) {
      setSelected([...selected, key]);
    }
  };

  return (
    <div className="bg-primary-03 w-full min-h-[calc(100dvh-3.125rem)] flex flex-col">
      <div
        data-catalog-toolbar
        className="sticky top-12.5 z-10 w-full h-12.5 bg-primary-03 border-b border-primary-00 flex items-center px-3.75 lg:px-7.25"
      >
        <p className="by-sm text-[14px]! mx-auto">{chips.length} chips disponibles</p>
      </div>

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-6 content-start gap-px bg-primary-01">
        {chips.map(({ key, productTitle, variantName, image }, index) => {
          const isSelected = selected.includes(key);
          const isDisabled = isFull && !isSelected;

          return (
            <label
              key={key}
              className={`relative aspect-square flex flex-col bg-primary-03 transition-colors duration-300 ${
                isDisabled
                  ? "cursor-default"
                  : "cursor-pointer hover:bg-[#EFEFEF]"
              }`}
            >
              {hasTopCross(index, MOBILE_COLS) && (
                <span className="contents lg:hidden">
                  <GridCross />
                </span>
              )}
              {hasTopCross(index, COLS) && (
                <span className="hidden lg:contents">
                  <GridCross />
                </span>
              )}

              <input
                type="checkbox"
                className="peer sr-only"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggleChip(key)}
              />
              <span
                aria-hidden="true"
                className={`absolute top-4 left-4 lg:top-5.5 lg:left-5.5 size-4.5 flex items-center justify-center border border-primary-00 transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-00 ${
                  isSelected ? "bg-primary-00" : "bg-primary-03"
                } ${isDisabled ? "opacity-30" : ""}`}
              >
                <span
                  className={`size-0.5 transition-colors duration-300 ${
                    isSelected ? "bg-white" : "bg-primary-00"
                  }`}
                />
              </span>

              <div className="min-h-0 w-full flex-1 p-7 lg:p-10">
                <div className="relative h-full w-full">
                  {image && (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 17vw, 50vw"
                      className="object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="shrink-0 w-full px-4 pb-4 lg:px-5.5 lg:pb-5.5 flex">
                <p className="hl-xs uppercase leading-5!">
                  {productTitle} <br/> {variantName}
                </p>
              </div>
            </label>
          );
        })}
        <div className="contents lg:hidden">
          <GridFillers items={chips} cols={MOBILE_COLS} crosses />
        </div>
        <div className="hidden lg:contents">
          <GridFillers items={chips} cols={COLS} crosses />
        </div>
      </div>

      {/* Mobile: 2 filas (los chips elegidos arriba y los botones abajo, 101px
          en total: MaterialBoxPanel deja ese lugar). Desktop: 1 fila. */}
      <div data-bottom-toolbar className="sticky bottom-0 z-10 w-full lg:h-16.25 bg-primary-03 border-t border-primary-00 flex flex-col lg:flex-row lg:items-center justify-between lg:gap-6">

        <div className="h-12.5 lg:h-auto shrink-0 flex items-center justify-between lg:justify-start gap-4 min-w-0 px-3.75 lg:pr-0 lg:pl-7.25 border-b border-primary-00 lg:border-b-0">
          <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
            {Array.from({ length: MAX_MUESTRAS }, (_, index) => {
              const chip = chipsByKey[selected[index]];
              return (
                <span
                  key={index}
                  className="group relative size-5 lg:size-6.25 flex items-center justify-center border border-primary-00 bg-transparent transition-colors duration-300"
                  style={
                    chip
                      ? { backgroundColor: chip.color ?? "var(--color-primary-00)" }
                      : undefined
                  }
                >
                  <span
                    className={`size-0.75 rounded-full transition-colors duration-300 ${
                      chip ? "bg-white" : "bg-primary-00"
                    }`}
                  />
                  {chip && (
                    <span className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap bg-primary-00 text-primary-03 by-sm text-[12px]! px-2 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {chip.productTitle} {chip.variantName}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <p className="hl-xs text-[14px]! uppercase shrink-0 ">
            {selected.length}/{MAX_MUESTRAS} chips
          </p>
          <p className="hidden lg:block by-sm text-[14px]! text-primary-00 truncate pl-8.5">
            Elegí hasta <span className="font-medium!">{MAX_MUESTRAS} muestras</span> para tu box
          </p>
        </div>

        <div className="w-full h-12.5 lg:w-1/3 lg:h-full shrink-0 flex">
          <Button
            copy={isPanelOpen ? "Seguir editando" : "Ver selección"}
            variant="primary"
            disabled={!isPanelOpen && selected.length === 0}
            onClick={() => setIsPanelOpen((open) => !open)}
            className="flex-1 h-full py-0! lg:border-l border-primary-00 bg-primary-03! enabled:text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03!"
          />
          <Button
            copy="Solicitar muestras"
            variant="primary"
            disabled={selected.length === 0}
            onClick={goToCheckout}
            className="flex-1 h-full py-0! border-l border-primary-00"
          />
        </div>
      </div>

      <MaterialBoxPanel
        isOpen={isPanelOpen}
        chips={selectedChips}
        onRemove={removeChip}
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}
