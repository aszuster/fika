"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import { useLenis } from "@/utils/lenis";
import Close from "@/svg/Close";

const DELAY_MS = 2000;
const DISMISSED_KEY = "fika-signup-modal-dismissed";

const wasDismissed = () => {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
};


export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (wasDismissed()) return;

    const timer = setTimeout(async () => {
      const { data } = await createClient().auth.getSession();
      if (!data.session) setIsOpen(true);
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, lenis]);

  const close = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          onClick={close}
          className="fixed inset-0 z-50 bg-primary-00/40 flex items-center justify-center px-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signup-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="relative bg-primary-03 w-[33%] min-w-80 flex flex-col items-center gap-10 px-7.5 py-12.5 text-center"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar"
              className="absolute top-5 right-5 cursor-pointer"
            >
              <Close />
            </button>

            <div className="flex flex-col gap-3.75 py-33.25">
              <p id="signup-modal-title" className="text-[25px] font-light w-60 uppercase text-center mx-auto leading-6.50">
                ¿Sos profesional del rubro?
              </p>
              <p className="by-sm text-secondary-01 font-normal! w-80 mx-auto">
                Creá tu cuenta para acceder a beneficios exclusivos y realizar tus pedidos.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <Button copy="Crear cuenta" url="/registro" variant="tertiary" className="mb-11.5"/>
                            <p  className="by-sm w-60  text-center mx-auto pb-2">
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
