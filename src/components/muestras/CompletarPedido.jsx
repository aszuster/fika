"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import MuestrasForm, { initialForm } from "@/components/muestras/MuestrasForm";
import { MaterialBoxList } from "@/components/muestras/MaterialBoxPanel";
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
  // Mobile: paso 1 el formulario, paso 2 la lista de chips y "Solicitar".
  // Desktop muestra todo junto.
  const [mobileStep, setMobileStep] = useState(1);
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

  const goToStep2 = () => {
    if (!validate()) return;
    setMobileStep(2);
  };

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
    // Mobile: los 2 pasos ocupan toda la pantalla (tapan el navbar). Desktop:
    // debajo del navbar.
    <div className="bg-primary-03 w-full max-lg:fixed max-lg:inset-0 max-lg:z-50 h-dvh lg:h-[calc(100dvh-3.125rem)] flex flex-col">
      <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center px-3.75 lg:px-7.25">
        {mobileStep === 2 && (
          <div className="lg:hidden">
            <Button
              copy="Volver a tus datos"
              variant="tertiary"
              disabled={isSending}
              onClick={() => setMobileStep(1)}
            />
          </div>
        )}
        <div className={mobileStep === 2 ? "hidden lg:block" : ""}>
          <Button
            copy="Volver a muestras"
            url="/muestras/elegir"
            variant="tertiary"
          />
        </div>
      </div>
      <div
        data-lenis-prevent
        className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-visible no-scrollbar"
      >
        <div
          data-lenis-prevent
          className={`w-full lg:w-1/2 lg:h-full shrink-0 lg:shrink lg:overflow-y-auto no-scrollbar flex flex-col ${
            mobileStep === 2 ? "max-lg:hidden" : ""
          }`}
        >
          <div className="my-auto w-full flex flex-col py-10">
            <div className="flex flex-col items-center px-5 pb-10 lg:pb-15">
              <h1 className="hl-lg text-[25px]! lg:text-[40px]! uppercase text-center max-w-105">
                Completar pedido
              </h1>
              <p className="by-sm text-secondary-02 text-center max-w-60 lg:max-w-75 lg:py-6.25">
                Por favor completá tus datos para el envío del material box.
              </p>
            </div>
            <MuestrasForm
              form={form}
              errors={errors}
              onChange={handleChange}
              onBlur={touch}
              // En mobile, Enter en el formulario pasa al paso 2.
              onSubmit={() =>
                window.matchMedia("(min-width: 1024px)").matches
                  ? submitOrder()
                  : goToStep2()
              }
            />
          </div>
        </div>
        <div
          className={`w-full lg:w-1/2 lg:h-full shrink-0 lg:shrink lg:border-l border-primary-00 flex flex-col ${
            mobileStep === 1 ? "max-lg:hidden" : ""
          }`}
        >
          <div className="h-12.5 lg:h-18 shrink-0 border-b border-primary-00 flex items-center justify-center px-5 lg:px-7.5">
            <p className="hl-xs text-[25px]! text-center! uppercase">Tu material box</p>
          </div>

          {/* Mobile: la lista de "Ver selección", en modo lectura. */}
          <div className="lg:hidden flex flex-col">
            {/* Solo para revisar: sin el aviso ni los botones de quitar. */}
            <MaterialBoxList chips={chips} readOnly />
          </div>

          <ScrollArea
            className="hidden lg:block lg:flex-1"
            viewportClassName="flex flex-col"
          >
            {chips.map((chip, index) => (
              <div
                key={chip.key}
                className="h-20 shrink-0 border-b border-primary-01 grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_2fr_1fr] items-center gap-5 px-5 lg:px-7.5"
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
          <div className="hidden lg:flex h-16.25 shrink-0 border-t border-primary-00 items-center justify-between gap-6">
            <div className="min-w-0 flex items-center gap-4 pl-5 lg:pl-7.5">
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

      <div className="lg:hidden shrink-0 border-t border-primary-00">
        {mobileStep === 2 && sendError && (
          <p className="by-sm text-[14px]! text-[#A20000] px-5 py-2 border-b border-primary-00">
            {sendError}
          </p>
        )}
        <div className="h-12.5 lg:h-16.25">
          {mobileStep === 1 ? (
            <Button
              copy="Continuar"
              variant="primary"
              disabled={!isValid}
              onClick={goToStep2}
              className="h-full py-0!"
            />
          ) : (
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
              className="h-full py-0!"
            />
          )}
        </div>
      </div>
    </div>
  );
}
