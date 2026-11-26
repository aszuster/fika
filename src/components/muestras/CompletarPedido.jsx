"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import MuestrasForm, { initialForm } from "@/components/muestras/MuestrasForm";
import {
  MAX_MUESTRAS,
  MUESTRAS_CONTACTO_KEY,
  MUESTRAS_PEDIDO_KEY,
  MUESTRAS_SELECCION_KEY,
  CONTACT_RULES,
} from "@/data/muestras";
import { sendMuestrasOrder } from "@/app/muestras/actions";
import { useValidation } from "@/utils/useValidation";

const readJson = (key) => {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// sessionStorage no avisa cambios en la misma pestaña: alcanza con leerlo.
const subscribe = () => () => {};
const getSelectionSnapshot = () => {
  try {
    return sessionStorage.getItem(MUESTRAS_SELECCION_KEY);
  } catch {
    return null;
  }
};
// En el servidor todavía no se sabe (undefined).
const getServerSnapshot = () => undefined;

export default function CompletarPedido() {
  const router = useRouter();
  const rawSelection = useSyncExternalStore(
    subscribe,
    getSelectionSnapshot,
    getServerSnapshot,
  );

  let chips = [];
  try {
    chips = rawSelection ? JSON.parse(rawSelection) : [];
  } catch {}
  if (!Array.isArray(chips)) chips = [];
  const hasChips = chips.length > 0;

  // Sin chips elegidos no hay nada que pedir: se vuelve a elegir.
  useEffect(() => {
    if (rawSelection !== undefined && !hasChips)
      router.replace("/muestras/elegir");
  }, [rawSelection, hasChips, router]);

  // El contenido se monta recién en el cliente, así puede leer sessionStorage
  // al crear su estado.
  if (!hasChips) {
    return <div className="bg-primary-03 w-full h-[calc(100dvh-3.125rem)]" />;
  }
  return <CompletarPedidoContent chips={chips} />;
}

function CompletarPedidoContent({ chips: initialChips }) {
  const router = useRouter();
  const [chips, setChips] = useState(initialChips);

  // Quita un chip del pedido y actualiza la selección guardada (así también se
  // refleja si se vuelve a elegir). Si no queda ninguno, se vuelve a elegir.
  const removeChip = (key) => {
    const next = chips.filter((chip) => chip.key !== key);
    setChips(next);
    try {
      sessionStorage.setItem(MUESTRAS_SELECCION_KEY, JSON.stringify(next));
    } catch {}
    if (next.length === 0) router.replace("/muestras/elegir");
  };
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...readJson(MUESTRAS_CONTACTO_KEY),
  }));
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  const { errors, touch, validate, isValid } = useValidation(
    form,
    CONTACT_RULES,
  );

  // Se guarda a medida que se completa, para no perderlo si se vuelve a
  // editar la selección.
  const handleChange = (name, value) =>
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      try {
        sessionStorage.setItem(MUESTRAS_CONTACTO_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  // Envía el pedido (datos de contacto + chips elegidos) por mail y va a la
  // confirmación.
  const submitOrder = async () => {
    if (isSending || !validate()) return;

    const order = {
      date: new Date().toISOString(),
      contact: form,
      chips: chips.map(
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
      result = {
        ok: false,
        error: "No pudimos enviar el pedido. Intentá de nuevo.",
      };
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

  return (
    <div className="bg-primary-03 w-full h-[calc(100dvh-3.125rem)] flex flex-col">
      {/* Barra superior, debajo del navbar. Vuelve a elegir conservando la
          selección (queda guardada en sessionStorage). */}
      <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center px-3.75 lg:px-7.25">
        <Button
          copy="Volver a muestras"
          url="/muestras/elegir"
          variant="tertiary"
        />
      </div>

      <div className="flex-1 min-h-0 flex">
        {/* Columna izquierda: título, texto y formulario. */}
        <div
          data-lenis-prevent
          className="w-1/2 h-full overflow-y-auto no-scrollbar flex flex-col"
        >
          <div className="my-auto w-full flex flex-col py-10">
            <div className="flex flex-col items-center px-5 pb-15">
              <h1 className="hl-lg uppercase text-center max-w-105">
                Completar pedido
              </h1>
              <p className="by-sm text-secondary-02 text-center max-w-75 py-6.25">
                Por favor completá tus datos para el envío del material box.
              </p>
            </div>
            <MuestrasForm
              form={form}
              errors={errors}
              onChange={handleChange}
              onBlur={touch}
              onSubmit={submitOrder}
            />
          </div>
        </div>

        {/* Columna derecha: resumen de los chips elegidos. */}
        <div className="w-1/2 h-full border-l border-primary-00 flex flex-col">
          <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center px-7.5">
            <p className="hl-xs uppercase">Tu material box</p>
          </div>

          <ScrollArea className="flex-1" viewportClassName="flex flex-col">
            {chips.map((chip, index) => (
              <div
                key={chip.key}
                className="h-20 shrink-0 border-b border-primary-01 grid grid-cols-[1fr_2fr_1fr] items-center gap-5 px-7.5"
              >
                <p className="hl-xs text-primary-00">{index + 1}</p>
                <div className="min-w-0 flex gap-5 items-center">
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
                </div>
                <div className="justify-self-end">
                  <Button
                    copy="Quitar"
                    variant="tertiary"
                    disabled={isSending}
                    onClick={() => removeChip(chip.key)}
                  />
                </div>
              </div>
            ))}
          </ScrollArea>

          <div className="h-16.25 shrink-0 border-t border-primary-00 flex items-center justify-between gap-6">
            <div className="min-w-0 flex items-center gap-4 pl-7.5">
              <p className="hl-xs text-[14px]! uppercase shrink-0">
                {chips.length}{" "}
                {chips.length === 1 ? "chip agregado" : "chips agregados"}
              </p>
              {sendError && (
                <p className="by-sm text-[14px]! text-[#A20000] truncate">
                  {sendError}
                </p>
              )}
            </div>
            <div className="w-1/3 h-full shrink-0 flex">
              <Button
                copy={isSending ? "Enviando..." : "Solicitar"}
                variant="primary"
                disabled={
                  !isValid ||
                  isSending ||
                  chips.length === 0 ||
                  chips.length > MAX_MUESTRAS
                }
                onClick={submitOrder}
                className="flex-1 h-full py-0! border-l border-primary-00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
