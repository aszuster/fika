"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import GridCross, { hasTopCross } from "@/components/grid/GridCross";
import MaterialBoxPanel from "@/components/muestras/MaterialBoxPanel";
import {
  MAX_MUESTRAS,
  MUESTRAS_CONTACTO_KEY,
  MUESTRAS_PEDIDO_KEY,
  isContactComplete,
} from "@/data/muestras";
import { sendMuestrasOrder } from "@/app/muestras/actions";

const COLS = 6;

// Datos de contacto guardados por el formulario de /muestras.
// sessionStorage no avisa cambios en la misma pestaña: alcanza con leerlo.
const subscribe = () => () => {};
const getContactSnapshot = () => {
  try {
    return sessionStorage.getItem(MUESTRAS_CONTACTO_KEY);
  } catch {
    return null;
  }
};
// En el servidor todavía no se sabe (undefined).
const getServerSnapshot = () => undefined;

const parseContact = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function ElegirMuestras({ chips }) {
  // Keys de los chips elegidos, en el orden en que se eligieron.
  const [selected, setSelected] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const isFull = selected.length >= MAX_MUESTRAS;
  const chipsByKey = Object.fromEntries(chips.map((chip) => [chip.key, chip]));
  const selectedChips = selected.map((key) => chipsByKey[key]).filter(Boolean);

  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  // Siempre hay que completar el formulario antes de elegir: sin datos de
  // contacto completos, se vuelve a /muestras.
  const rawContact = useSyncExternalStore(
    subscribe,
    getContactSnapshot,
    getServerSnapshot,
  );
  const contact = parseContact(rawContact);
  const hasContact = isContactComplete(contact);
  useEffect(() => {
    if (rawContact !== undefined && !hasContact) router.replace("/muestras");
  }, [rawContact, hasContact, router]);

  // Envía el pedido (datos de contacto + chips elegidos) por mail y va a la
  // confirmación.
  const submitOrder = async () => {
    if (selectedChips.length === 0 || isSending) return;
    if (!hasContact) {
      router.replace("/muestras");
      return;
    }

    const order = {
      date: new Date().toISOString(),
      contact,
      chips: selectedChips.map(
        ({ productSlug, variantSlug, productTitle, variantName }) => ({
          productSlug,
          variantSlug,
          productTitle,
          variantName,
        }),
      ),
    };

    setIsSending(true);
    setSendError(null);
    let result;
    try {
      result = await sendMuestrasOrder(order);
    } catch {
      result = { ok: false, error: "No pudimos enviar el pedido. Intentá de nuevo." };
    }
    if (!result.ok) {
      setSendError(result.error);
      setIsSending(false);
      return;
    }

    try {
      sessionStorage.setItem(MUESTRAS_PEDIDO_KEY, JSON.stringify(order));
    } catch {}
    router.push("/muestras/enviado");
  };

  const removeChip = (key) => {
    const next = selected.filter((item) => item !== key);
    setSelected(next);
    // Si se quitan todos, no queda nada para ver: se cierra el panel.
    if (next.length === 0) setIsPanelOpen(false);
  };

  const toggleChip = (key) =>
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((item) => item !== key);
      if (prev.length >= MAX_MUESTRAS) return prev;
      return [...prev, key];
    });

  return (
    <div className="bg-primary-03 w-full min-h-[calc(100dvh-3.125rem)] flex flex-col">
      {/* Barra superior fija, debajo del navbar.
          data-catalog-toolbar hace que el scroll de la página arranque debajo
          de esta barra (ver globals.css), igual que en el catálogo. */}
      <div
        data-catalog-toolbar
        className="sticky top-12.5 z-10 w-full h-12.5 bg-primary-03 border-b border-primary-00 flex items-center px-3.75 lg:px-7.25"
      >
        <p className="by-sm">{chips.length} chips disponibles</p>
      </div>

      {/* Grilla de chips: las líneas son el fondo gris que se ve por el gap. */}
      <div className="flex-1 grid grid-cols-6 content-start gap-px bg-primary-01">
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
              {hasTopCross(index, COLS) && <GridCross />}

              {/* Checkbox: input oculto + cuadrado dibujado. */}
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggleChip(key)}
              />
              <span
                aria-hidden="true"
                className={`absolute top-3 left-3 size-4 border border-primary-00 transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-00 ${
                  isSelected ? "bg-primary-00" : "bg-primary-03"
                } ${isDisabled ? "opacity-30" : ""}`}
              />

              <div className="min-h-0 w-full flex-1 p-8 lg:p-10">
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

              <div className="shrink-0 w-full border-t border-primary-01 px-2 py-3 flex items-center justify-center">
                <p className="hl-xs uppercase text-center">
                  {productTitle} {variantName}
                </p>
              </div>
            </label>
          );
        })}
        <GridFillers items={chips} cols={COLS} crosses />
      </div>

      {/* Barra inferior fija con la selección.
          data-bottom-toolbar hace que el scroll de la página termine arriba
          de esta barra (ver globals.css). */}
      <div data-bottom-toolbar className="sticky bottom-0 z-10 w-full h-12.5 bg-primary-03 border-t border-primary-00 flex items-center justify-between gap-6 pl-3.75 lg:pl-7.25">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-1 shrink-0">
            {Array.from({ length: MAX_MUESTRAS }, (_, index) => {
              const chip = chipsByKey[selected[index]];
              return (
                <span
                  key={index}
                  className="group relative size-2.5 border border-primary-00 bg-transparent transition-colors duration-300"
                  // Lleno: color principal de la variante (negro si no tiene).
                  style={
                    chip
                      ? { backgroundColor: chip.color ?? "var(--color-primary-00)" }
                      : undefined
                  }
                >
                  {/* Tooltip con el chip elegido (solo en cuadrados llenos).
                      Alineado a la izquierda del cuadrado para que no se
                      salga de la pantalla en los primeros. */}
                  {chip && (
                    <span className="pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap bg-primary-00 text-primary-03 by-sm uppercase px-2 py-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {chip.productTitle} {chip.variantName}
                    </span>
                  )}
                </span>
              );
            })}
          </div>
          <p className="by-sm shrink-0">
            ({selected.length}/{MAX_MUESTRAS}) chips
          </p>
          {sendError ? (
            <p className="by-sm text-[#A20000] truncate">{sendError}</p>
          ) : (
            <p className="by-sm text-secondary-01 truncate">
              Elegí hasta {MAX_MUESTRAS} muestras para tu box
            </p>
          )}
        </div>

        {/* Botones: un tercio de pantalla (el mismo ancho que el panel),
            cada uno la mitad, con el alto de la barra. */}
        <div className="w-1/3 h-full shrink-0 flex">
          <Button
            copy={isPanelOpen ? "Seguir editando" : "Ver selección"}
            variant="primary"
            disabled={!isPanelOpen && selected.length === 0}
            onClick={() => setIsPanelOpen((open) => !open)}
            className="flex-1 h-full py-0! border-l border-primary-00 bg-primary-03! enabled:text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03!"
          />
          <Button
            copy={isSending ? "Enviando..." : "Solicitar muestras"}
            variant="primary"
            disabled={selected.length === 0 || isSending}
            onClick={submitOrder}
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
