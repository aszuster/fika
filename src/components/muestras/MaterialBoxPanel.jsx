"use client";

import Image from "next/image";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import Close from "@/svg/Close";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import { MAX_MUESTRAS } from "@/data/muestras";

// Panel lateral con los chips elegidos. Va entre el navbar y la barra inferior
// de la página (que queda visible para poder cerrarlo con "Seguir editando").
const MaterialBoxPanel = ({ isOpen, chips, onRemove, onClose }) => {
  const remaining = MAX_MUESTRAS - chips.length;

  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        onClick={onClose}
        data-lenis-prevent
        className={`fixed inset-x-0 top-12.5 bottom-16 z-20 bg-primary-00/40 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        data-lenis-prevent
        className="fixed top-12.5 bottom-16.5 right-0 z-30 w-1/3 bg-primary-03 border-l border-primary-00 flex flex-col"
      >
        <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center justify-between px-7.5">
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

        <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center px-7.5">
          <p className="by-sm text-[14px]! text-center">
            {remaining > 0 ? (
              <>
                <span className="font-medium!">
                  ¡Te {remaining === 1 ? "queda 1 lugar" : `quedan ${remaining} lugares`}!
                </span>{" "}
                Revisá tu selección antes de solicitar
              </>
            ) : (
              <>
                <span className="font-medium!">¡Tu box está completo!</span>{" "}
                Revisá tu selección antes de solicitar
              </>
            )}
          </p>
        </div>

        <ScrollArea className="flex-1" viewportClassName="flex flex-col">
          {Array.from({ length: MAX_MUESTRAS }, (_, index) => {
            const chip = chips[index];
            return (
              <div
                key={chip?.key ?? `empty-${index}`}
                className="h-20 shrink-0 border-b border-primary-01 flex items-center gap-5 px-7.5"
              >
                <p className="hl-xs w-5 shrink-0 text-primary-00">
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
                    <Button
                      copy="Quitar"
                      variant="tertiary"
                      onClick={() => onRemove(chip.key)}
                    />
                  </>
                ) : (
                  <p className="by-sm text-secondary-02">Lugar disponible</p>
                )}
              </div>
            );
          })}
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default MaterialBoxPanel;
