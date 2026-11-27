"use client";

import { useCallback, useEffect, useId, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import Close from "@/svg/Close";
import { useLenis } from "@/utils/lenis";
import {
  MUESTRAS_CONTACTO_KEY,
  MUESTRAS_PEDIDO_KEY,
  MUESTRAS_SELECCION_KEY,
} from "@/data/muestras";

// sessionStorage no avisa cambios en la misma pestaña: alcanza con leerlo.
const subscribe = () => () => {};
const getOrderSnapshot = () => {
  try {
    return sessionStorage.getItem(MUESTRAS_PEDIDO_KEY);
  } catch {
    return null;
  }
};
// En el servidor no hay pedido: el modal aparece al hidratar.
const getServerSnapshot = () => undefined;

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function PedidoEnviado() {
  const router = useRouter();
  const lenis = useLenis();
  const titleId = useId();

  // undefined: todavía en el servidor. null: no hay pedido guardado.
  const rawOrder = useSyncExternalStore(
    subscribe,
    getOrderSnapshot,
    getServerSnapshot,
  );
  let order = null;
  try {
    order = rawOrder ? JSON.parse(rawOrder) : null;
  } catch {}

  const backToMuestras = useCallback(() => router.push("/muestras"), [router]);

  // El pedido ya se envió: uno nuevo arranca con la selección y el
  // formulario vacíos.
  useEffect(() => {
    try {
      sessionStorage.removeItem(MUESTRAS_CONTACTO_KEY);
      sessionStorage.removeItem(MUESTRAS_SELECCION_KEY);
    } catch {}
  }, []);

  // Si se entra sin haber hecho un pedido, no hay nada que confirmar.
  useEffect(() => {
    if (rawOrder === null) router.replace("/muestras");
  }, [rawOrder, router]);

  const hasOrder = Boolean(order);
  useEffect(() => {
    if (!hasOrder) return;
    lenis?.stop();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") backToMuestras();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasOrder, lenis, backToMuestras]);

  return (
    <div className="w-full h-[calc(100dvh-3.125rem)] grid grid-cols-3 gap-px bg-primary-01">
      {/* Fondo: página en blanco con 3 columnas separadas por líneas grises. */}
      <div className="bg-primary-03"></div>
      <div className="bg-primary-03"></div>
      <div className="bg-primary-03"></div>

      {order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          onClick={backToMuestras}
          className="fixed inset-x-0 bottom-0 top-12.5 lg:top-0 z-50 bg-primary-00/40 flex items-center justify-center lg:px-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
            className="relative bg-primary-03 w-full h-full lg:h-auto lg:w-[33%] lg:min-w-80 flex flex-col items-center justify-between lg:justify-start gap-10 px-5 lg:px-7.5 py-12.5 text-center"
          >
            <button
              type="button"
              onClick={backToMuestras}
              aria-label="Cerrar"
              className="absolute top-5 right-5 cursor-pointer"
            >
              <Close />
            </button>

            <div className="flex-1 lg:flex-none flex flex-col justify-center gap-3.75 lg:py-25">
              <p
                id={titleId}
                className="text-[25px] font-light uppercase text-center mx-auto leading-6.50"
              >
                Pedido enviado
              </p>
              <p className="by-sm text-center">
                Material box
                <br />
                {dateFormatter.format(new Date(order.date))}
              </p>
              <p className="by-sm text-secondary-01 font-normal! max-w-80 mx-auto pt-5">
                ¡Gracias por contactarte con nosotros!
                <br />
                En breve te responderemos.
              </p>
            </div>

            <Button
              copy="Volver a muestras"
              url="/muestras"
              variant="tertiary"
              className="mb-5"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
