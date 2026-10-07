"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import Arrow from "@/svg/Arrow";
import { requestQuote } from "@/app/mi-cuenta/actions";
import { getProductBySlug } from "@/data/products";

const priceFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const CotizacionScreen = ({ project, onClose, onRequested }) => {
  const [isPending, startTransition] = useTransition();
  const [quantities, setQuantities] = useState({});
  const [removedIds, setRemovedIds] = useState(new Set());

  const items = project.project_items ?? [];
  const includedItems = items.filter((item) => !removedIds.has(item.id));
  const includedCount = includedItems.length;
  const hasMissingQuantity = includedItems.some(
    (item) => !(Number(quantities[item.id]) > 0),
  );

  const toggleRemoved = (itemId) => {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const [sentNumber, setSentNumber] = useState(null);

  const handleRequest = () => {
    startTransition(async () => {
      const { number } = await requestQuote({
        projectId: project.id,
        items: includedItems.map((item) => ({
          itemId: item.id,
          quantity: Number(quantities[item.id]),
        })),
      });
      setSentNumber(number);
    });
  };

  return (
    <div className="fixed inset-x-0 top-18 bottom-0 z-50 bg-primary-03 flex flex-col">
      <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center px-7.5">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="h-full cursor-pointer flex items-center gap-3 btn-sm text-primary-00 hover:text-secondary-01 transition-colors duration-300 ease-in-out border-r border-primary-00 pr-7.5"
        >
          <span className="rotate-180 flex">
            <Arrow />
          </span>
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-3">
        <div className="col-span-1 border-r border-primary-00 flex flex-col items-center justify-center gap-2 px-7.5">
          <h2 className="hl-md uppercase text-center">Cotización</h2>
          <p className="hl-md uppercase text-center ">{project.name}</p>
        </div>

        <div className="overflow-y-auto col-span-2">
          {items.map((item) => {
            const product = getProductBySlug(item.product_slug);
            const variant = product?.variants.find(
              (v) => v.slug === item.variant_slug,
            );
            const isRemoved = removedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="relative flex items-center gap-7.5 border-b border-primary-01 pr-24.25 pl-12.5 py-7.5"
              >
                <div className="relative h-25 w-25 shrink-0">
                  <Image
                    src={variant?.catalogPhoto ?? product?.image}
                    alt=""
                    fill
                    sizes="90px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex w-full justify-between items-center">
                  <p className="hl-xs uppercase font-normal! w-full">
                    {product?.title ?? item.product_slug}
                    {" "}
                    {variant?.name ?? item.variant_slug}
                  </p>
                  <div className="flex w-full justify-between items-center">
                  {variant?.price != null && (
                    <p className="hl-xs">
                      {priceFormatter.format(variant.price)}{" "}
                      <span className="text-primary-00">X M2</span>
                    </p>
                  )}
                  <div className="flex items-center border-b border-primary-00">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={quantities[item.id] ?? ""}
                    onChange={(event) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [item.id]: event.target.value,
                      }))
                    }
                    disabled={isRemoved || isPending}
                    placeholder="Completar cantidad"
                    className="by-sm w-38  bg-transparent py-1 outline-none text-right"
                  />
                  <span className="hl-xs text-primary-00">M2</span>
                  </div>
                  {isRemoved && (
                    <div className="absolute inset-0 bg-primary-03/60 pointer-events-none" />
                  )}

                  <div className="relative z-1 shrink-0">
                    <Button
                      copy={isRemoved ? "Agregar" : "Quitar"}
                      variant="tertiary"
                      disabled={isPending}
                      onClick={() => toggleRemoved(item.id)}
                    />
                  </div>
                  </div>
                </div>
                {/* <label className="flex items-center gap-2 shrink-0">

                </label> */}
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-24.25 shrink-0 bg-primary-03 border-t border-primary-00 flex items-center justify-between gap-4 pl-12.5">
        <p className="btn-sm text-secondary-02 font-normal! mx-auto">
          <span className="text-primary-00">
            {includedCount} {includedCount === 1 ? "producto" : "productos"}
          </span>{" "}
          {includedCount === 1 ? "agregado" : "agregados"} al pedido
        </p>
        <div className="h-full">
          <Button
            copy={isPending ? "Enviando..." : "Pedir cotización"}
            variant="primary"
            disabled={isPending || includedCount === 0 || hasMissingQuantity}
            onClick={handleRequest}
            className="px-12.5 bg-primary-03! h-full border-l border-primary-00! text-primary-00! enabled:hover:bg-primary-00! enabled:hover:text-primary-03! disabled:text-secondary-02!"
          />
        </div>
      </div>

      {sentNumber !== null && (
        <div className="absolute inset-0 z-10 bg-primary-00/40 flex items-center justify-center px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-primary-03 h-[70%] w-[30%] flex flex-col items-center justify-between  py-12.5"
          >
                          <p className="btn-sm text-primary-00">
                Solicitud #{String(sentNumber).padStart(2, "0")}
              </p>
            <div className="flex flex-col items-center gap-6 px-7.5 pb-12.5 text-center">

              <div className="flex flex-col gap-1">
                <p className="hl-sm uppercase">
                  Pedido de cotización {project.name}
                </p>
                <p className="hl-sm uppercase">Enviado</p>
              </div>
              <p className="by-sm text-secondary-01 font-normal! max-w-68.75">
                Nuestro equipo revisará tu solicitud y un representante de Fika
                se comunicará con vos a la brevedad.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <Button
                copy="Volver a proyectos"
                variant="tertiary"
                onClick={() => onRequested(project.id)}
                className=" "
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CotizacionScreen;
