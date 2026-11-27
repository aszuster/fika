"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import Close from "@/svg/Close";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import { MAX_MUESTRAS } from "@/data/muestras";

// Lista de chips elegidos (los MAX_MUESTRAS lugares, con "-" en los vacíos) y
// el aviso de cuántos quedan. La usan el panel "Ver selección" y el paso 2 de
// Completar pedido en mobile; readOnly (paso 2): solo la lista, sin el aviso
// ni los botones de quitar.
export const MaterialBoxList = ({ chips, onRemove, readOnly = false }) => {
  const remaining = MAX_MUESTRAS - chips.length;

  return (
    <>
      {!readOnly && (
        <div className="min-h-12.5 py-0 shrink-0 border-b border-primary-00 flex items-center px-5 lg:px-7.5">
          <p className="by-sm text-[14px]! leading-4!">
            {remaining > 0 ? (
              <>
                <span className="font-medium!">
                  ¡Podés sumar {remaining} chips más!{" "}
                  <br className="lg:hidden" />
                </span>{" "}
                Revisá tu selección antes de solicitar
              </>
            ) : (
              <>
                <span className="font-medium!">¡Tu box está completo!</span>{" "}
                <br className="lg:hidden" />
                Revisá tu selección antes de solicitar
              </>
            )}
          </p>
        </div>
      )}

      <ScrollArea className="flex-1" viewportClassName="flex flex-col">
        {Array.from({ length: MAX_MUESTRAS }, (_, index) => {
          const chip = chips[index];
          return (
            <div
              key={chip?.key ?? `empty-${index}`}
              className="h-14 lg:h-20 shrink-0 border-b border-primary-01 flex items-center gap-5 px-5 lg:px-7.5"
            >
              <p className="hidden lg:block hl-xs w-5 shrink-0 text-primary-00">
                {String(index + 1).padStart(1)}
              </p>
              {chip ? (
                <>
                  <div className="relative size-12.5 shrink-0">
                    {chip.image && (
                      <Image
                        src={chip.image}
                        alt=""
                        fill
                        sizes="50px"
                        className="object-contain"
                      />
                    )}
                  </div>
                  <p className="hl-xs uppercase flex-1 min-w-0 truncate">
                    {chip.productTitle} {chip.variantName}
                  </p>
                  {/* Mobile: una cruz en vez de "Quitar", para que entre mejor. */}
                  {!readOnly && (
                    <>
                      <button
                        type="button"
                        onClick={() => onRemove(chip.key)}
                        aria-label={`Quitar ${chip.productTitle} ${chip.variantName}`}
                        className="lg:hidden shrink-0 -m-2 p-2 cursor-pointer"
                      >
                        <Close />
                      </button>
                      <div className="hidden lg:block">
                        <Button
                          copy="Quitar"
                          variant="tertiary"
                          onClick={() => onRemove(chip.key)}
                        />
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="by-sm text-secondary-02">-</p>
              )}
            </div>
          );
        })}
      </ScrollArea>
    </>
  );
};

// Panel lateral con los chips elegidos. Va entre el navbar y la barra inferior
// de la página (que queda visible para poder cerrarlo con "Seguir editando").
// En mobile tapa también el navbar, para tener más lugar.
const MaterialBoxPanel = ({ isOpen, chips, onRemove, onClose }) => {
  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        onClick={onClose}
        data-lenis-prevent
        className={`fixed inset-x-0 top-0 lg:top-12.5 bottom-12.75 lg:bottom-16 z-50 lg:z-20 bg-primary-00/40 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        data-lenis-prevent
        className="fixed top-0 lg:top-12.5 bottom-12.75 lg:bottom-16.5 right-0 z-50 lg:z-30 w-full lg:w-1/3 bg-primary-03 lg:border-l border-primary-00 flex flex-col"
      >
        <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center justify-between px-5 lg:px-7.5">
          <p className="hl-xs uppercase">Tu material box</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer"
          >
            <Close />
          </button>
        </div>

        <MaterialBoxList chips={chips} onRemove={onRemove} />
      </motion.div>
    </>
  );
};

export default MaterialBoxPanel;
