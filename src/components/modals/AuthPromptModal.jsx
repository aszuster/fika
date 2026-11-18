"use client";

import { useEffect, useId } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/buttons/Button";
import { useLenis } from "@/utils/lenis";
import Close from "@/svg/Close";

// Popup que invita a crear una cuenta o iniciar sesión.
export default function AuthPromptModal({
  isOpen,
  onClose,
  title,
  description,
  titleClassName = "w-60",
  textClassName = "py-33.25",
}) {
  const lenis = useLenis();
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lenis, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-primary-00/40 flex items-center justify-center px-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
            className="relative bg-primary-03 w-[33%] min-w-80 flex flex-col items-center gap-10 px-7.5 py-12.5 text-center"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-5 right-5 cursor-pointer"
            >
              <Close />
            </button>

            <div className={`flex flex-col gap-3.75 ${textClassName}`}>
              <p id={titleId} className={`text-[25px] font-light ${titleClassName} uppercase text-center mx-auto leading-6.50`}>
                {title}
              </p>
              <p className="by-sm text-secondary-01 font-normal! w-80 mx-auto">
                {description}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Button copy="Crear cuenta" url="/registro" variant="tertiary" className="mb-11.5"/>
              <p className="by-sm w-60 text-center mx-auto pb-2">
                ¿Ya tenés una cuenta?
              </p>
              <Button copy="Iniciar sesión" url="/ingresar" variant="tertiary" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
