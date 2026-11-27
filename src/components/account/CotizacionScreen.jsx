"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import Arrow from "@/svg/Arrow";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import AvailabilityTag from "@/components/product/AvailabilityTag";
import { requestQuote } from "@/app/mi-cuenta/actions";
import { priceFormatter } from "@/utils/price";
import { getVariantPrice, isVariantAvailable } from "@/utils/variantMockup";
import FieldError from "@/components/forms/FieldError";
import { MESSAGES } from "@/utils/validation";

// Final de cada fila: la columna del total y el lugar del botón Quitar/Agregar.
// Se repite igual en el recuadro del total estimado para que los montos queden
// en la misma columna. El botón ocupa siempre lo que mide la palabra más
// ancha (copias invisibles superpuestas), así "Agregar" no corre el total.
const TotalColumn = ({ total, action = null }) => (
  <div className="flex items-center gap-7.5 shrink-0">
    <div className="w-36 flex justify-center">{total}</div>
    <div className="relative z-1 grid justify-items-end *:col-start-1 *:row-start-1">
      <div className="invisible" aria-hidden="true">
        <Button copy="Agregar" variant="tertiary" />
      </div>
      <div className="invisible" aria-hidden="true">
        <Button copy="Quitar" variant="tertiary" />
      </div>
      {action}
    </div>
  </div>
);

// La cantidad de M2 es obligatoria y tiene que ser mayor a 0.
const getQuantityError = (value) => {
  if (String(value ?? "").trim() === "") return MESSAGES.required;
  if (!(Number(value) > 0)) return "La cantidad debe ser mayor a 0";
  return null;
};

const CotizacionScreen = ({ project, catalog, onClose, onRequested }) => {
  const [isPending, startTransition] = useTransition();
  const [quantities, setQuantities] = useState({});
  const [removedIds, setRemovedIds] = useState(new Set());

  const items = project.project_items ?? [];
  const includedItems = items.filter((item) => !removedIds.has(item.id));
  const includedCount = includedItems.length;
  const hasMissingQuantity = includedItems.some((item) =>
    getQuantityError(quantities[item.id]),
  );

  // Cantidades cuyo error ya se muestra: al salir del campo, o al pasar el
  // mouse por "Pedir cotización" deshabilitado (para explicar por qué).
  const [touchedIds, setTouchedIds] = useState(new Set());
  const touchItem = (itemId) =>
    setTouchedIds((prev) =>
      prev.has(itemId) ? prev : new Set(prev).add(itemId),
    );
  const touchAll = () =>
    setTouchedIds(new Set(includedItems.map((item) => item.id)));

  const getVariant = (item) =>
    catalog[item.product_slug]?.variants.find(
      (v) => v.slug === item.variant_slug,
    );

  // Suma de las líneas incluidas que ya tienen M2 cargados.
  const estimatedTotal = includedItems.reduce((total, item) => {
    const quantity = Number(quantities[item.id]);
    return quantity > 0
      ? total + getVariantPrice(getVariant(item)) * quantity
      : total;
  }, 0);

  const toggleRemoved = (itemId) => {
    setRemovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const setQuantity = (itemId, value) =>
    setQuantities((prev) => ({ ...prev, [itemId]: value }));

  // Datos de cada fila (los usan la vista mobile y la de desktop).
  const getItemData = (item) => {
    const product = catalog[item.product_slug];
    const variantIndex =
      product?.variants.findIndex((v) => v.slug === item.variant_slug) ?? -1;
    const variant = product?.variants[variantIndex];
    const isRemoved = removedIds.has(item.id);
    return {
      product,
      variant,
      variantIndex,
      isRemoved,
      price: getVariantPrice(variant),
      quantity: Number(quantities[item.id]),
      quantityError:
        !isRemoved && touchedIds.has(item.id)
          ? getQuantityError(quantities[item.id])
          : null,
    };
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
    // Mobile: pantalla completa (tapa también el navbar). Desktop: debajo del
    // navbar.
    <div
      data-lenis-prevent
      className="fixed inset-x-0 top-0 lg:top-12.5 bottom-0 z-50 bg-primary-03 flex flex-col"
    >
      {/* ---------- Mobile ---------- */}
      <div className="lg:hidden flex-1 min-h-0 flex flex-col">
        <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Volver a proyectos"
            className="h-full px-5 flex items-center cursor-pointer"
          >
            <Arrow className="rotate-180" />
          </button>
          <p className="btn-sm uppercase pr-5">Cotización</p>
        </div>
        <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center justify-center px-5">
          <p className="hl-xs uppercase text-center truncate">
            Proyecto {project.name}
          </p>
        </div>

        <ScrollArea className="flex-1">
          {items.map((item) => {
            const {
              product,
              variant,
              variantIndex,
              isRemoved,
              price,
              quantity,
              quantityError,
            } = getItemData(item);

            return (
              <div
                key={item.id}
                className="relative border-b border-primary-01"
              >
                <div className="flex gap-5 p-5">
                  <div className="relative size-25 shrink-0">
                    <Image
                      src={variant?.catalogPhoto ?? product?.image}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col items-start gap-2">
                    <p className="hl-xs uppercase font-normal!">
                      {product?.title ?? item.product_slug}{" "}
                      {variant?.name ?? item.variant_slug}
                    </p>
                    {variant && (
                      <AvailabilityTag
                        available={isVariantAvailable(variant, variantIndex)}
                      />
                    )}
                    <p className="hl-xs whitespace-nowrap">
                      {priceFormatter.format(price)} <span>X M2</span>
                    </p>
                  </div>
                  <div className="relative z-1 self-start shrink-0">
                    <Button
                      copy={isRemoved ? "Agregar" : "Quitar"}
                      variant="tertiary"
                      disabled={isPending}
                      onClick={() => toggleRemoved(item.id)}
                    />
                  </div>
                </div>
                {/* M2 a completar y el total de la línea. */}
                <div className="border-t border-primary-01 px-5 py-3 flex items-start justify-between gap-5">
                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-primary-00">
                      <input
                        aria-label="Cantidad de M2"
                        aria-invalid={Boolean(quantityError)}
                        onBlur={() => touchItem(item.id)}
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={quantities[item.id] ?? ""}
                        onChange={(event) =>
                          setQuantity(item.id, event.target.value)
                        }
                        disabled={isRemoved || isPending}
                        placeholder="Completar cantidad"
                        className="by-sm w-44 bg-transparent py-1 outline-none"
                      />
                      <span className="hl-xs text-primary-00">M2</span>
                    </div>
                    <FieldError
                      message={quantityError}
                      className="px-0! pb-0! pt-1"
                    />
                  </div>
                  <p className="hl-xs whitespace-nowrap pt-1.5">
                    {quantity > 0
                      ? priceFormatter.format(price * quantity)
                      : "-"}
                  </p>
                </div>
                {isRemoved && (
                  <div className="absolute inset-0 bg-primary-03/60 pointer-events-none" />
                )}
              </div>
            );
          })}
        </ScrollArea>

        <div className="h-12.5 shrink-0 border-t border-primary-00 flex items-center justify-between px-5">
          <p className="hl-xs uppercase">Total estimado</p>
          <p className="hl-xs whitespace-nowrap border border-primary-00 rounded-sm px-2.25 pt-px">
            {estimatedTotal > 0 ? priceFormatter.format(estimatedTotal) : "-"}
          </p>
        </div>
        <div className="shrink-0 border-t border-primary-00 px-5 py-4">
          <p className="by-sm text-[14px]! leading-4! text-secondary-01 font-normal!">
            Sujeto a confirmación. <br/>Esto es una consulta, no una compra: un
            asesor te contacta con la cotización final.
          </p>
        </div>
        {/* En el celular no hay hover: tocar el botón deshabilitado (que deja
            pasar el toque al contenedor) muestra qué cantidades faltan. */}
        <div
          className="h-12.5 lg:h-16.25 shrink-0 border-t border-primary-00"
          onClick={() => hasMissingQuantity && touchAll()}
        >
          <Button
            copy={isPending ? "Enviando..." : "Pedir cotización"}
            variant="primary"
            disabled={isPending || includedCount === 0 || hasMissingQuantity}
            onClick={handleRequest}
            className="h-12.5 lg:h-16.25 disabled:pointer-events-none disabled:text-secondary-02!"
          />
        </div>
      </div>

      {/* ---------- Desktop ---------- */}
      <div className="hidden lg:flex flex-1 min-h-0 flex-col">
        <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center px-7.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-full cursor-pointer flex items-center gap-3 btn-sm text-primary-00 hover:text-secondary-01 transition-colors duration-300 ease-in-out pr-7.5"
          >
            <span className="text-[14px] flex underline">
              Volver a proyectos
            </span>
          </button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-3">
          <div className="col-span-1 border-r border-primary-00 flex flex-col items-center justify-center gap-2 px-7.5">
            <h2 className="hl-md uppercase text-center">Cotización</h2>
            <p className="hl-md uppercase text-center ">{project.name}</p>
          </div>

          <div className="col-span-2 min-h-0 flex flex-col">
            <ScrollArea className="flex-1">
              {items.map((item) => {
                const {
                  product,
                  variant,
                  variantIndex,
                  isRemoved,
                  price,
                  quantity,
                  quantityError,
                } = getItemData(item);

                return (
                  <div
                    key={item.id}
                    className="relative flex items-center gap-7.5 border-b border-primary-01 pr-10.75 pl-12.5 py-7.5"
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
                      <p className="hl-xs uppercase font-normal! w-40">
                        {product?.title ?? item.product_slug}{" "}
                        {variant?.name ?? item.variant_slug}
                      </p>
                      <div className="flex w-full justify-between items-center pl-20">
                        {/* Las dos versiones del tag, invisibles y superpuestas, hacen que
                        la columna mida siempre lo del más ancho y no corra lo que sigue. */}
                        <div className="grid justify-items-start *:col-start-1 *:row-start-1">
                          <div className="invisible" aria-hidden="true">
                            <AvailabilityTag available />
                          </div>
                          <div className="invisible" aria-hidden="true">
                            <AvailabilityTag available={false} />
                          </div>
                          {variant && (
                            <AvailabilityTag
                              available={isVariantAvailable(
                                variant,
                                variantIndex,
                              )}
                            />
                          )}
                        </div>
                        <p className="hl-xs whitespace-nowrap">
                          {priceFormatter.format(price)} <span>X M2</span>
                        </p>
                        <div className="relative flex items-center border-b border-primary-00">
                          <input
                            aria-label="Cantidad de M2"
                            aria-invalid={Boolean(quantityError)}
                            onBlur={() => touchItem(item.id)}
                            type="number"
                            min="0"
                            step="1"
                            inputMode="numeric"
                            value={quantities[item.id] ?? ""}
                            onChange={(event) =>
                              setQuantity(item.id, event.target.value)
                            }
                            disabled={isRemoved || isPending}
                            placeholder="Completar cantidad"
                            className="by-sm w-38  bg-transparent py-1 outline-none text-right"
                          />
                          <span className="hl-xs text-primary-00">M2</span>
                          {/* Debajo de la línea, sin mover el resto de la fila. */}
                          <FieldError
                            message={quantityError}
                            className="absolute top-full right-0 px-0! pb-0! pt-1 whitespace-nowrap"
                          />
                        </div>
                        {/* Total de la línea: precio por la cantidad de M2. */}
                        <TotalColumn
                          total={
                            <p className="hl-xs whitespace-nowrap">
                              {quantity > 0
                                ? priceFormatter.format(price * quantity)
                                : "-"}
                            </p>
                          }
                          action={
                            <Button
                              copy={isRemoved ? "Agregar" : "Quitar"}
                              variant="tertiary"
                              disabled={isPending}
                              onClick={() => toggleRemoved(item.id)}
                            />
                          }
                        />
                        {isRemoved && (
                          <div className="absolute inset-0 bg-primary-03/60 pointer-events-none" />
                        )}
                      </div>
                    </div>
                    {/* <label className="flex items-center gap-2 shrink-0">

                </label> */}
                  </div>
                );
              })}
            </ScrollArea>

            {/* Recuadro fijo debajo de la lista: no scrollea con los productos. */}
            <div className="shrink-0 border-t border-primary-00 flex items-center justify-between gap-7.5 pl-12.5 pr-10.75 py-12">
              {/* TODO: texto provisorio, reemplazar por el definitivo. */}
              <p className="by-sm text-[14px]! leading-4! text-secondary-01 font-normal! max-w-100">
                Sujeto a confirmación. <br />
                Esto es una consulta, no una compra: <br />
                un asesor te contacta con la cotización final.
              </p>
              <div className="flex items-center gap-10 shrink-0">
                <p className="hl-xs text-[14px]! uppercase">Total estimado</p>
                <TotalColumn
                  total={
                    <p className="hl-xs text-[15px]! whitespace-nowrap border border-primary-00 rounded-sm px-2.25 pt-px">
                      {estimatedTotal > 0
                        ? priceFormatter.format(estimatedTotal)
                        : "-"}
                    </p>
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-16.25 shrink-0 bg-primary-03 border-t border-primary-00 flex items-center justify-between gap-4 pl-12.5">
          <p className="btn-sm text-secondary-02 font-normal! mx-auto">
            <span className="text-primary-00">
              {includedCount} {includedCount === 1 ? "producto" : "productos"}
            </span>{" "}
            {includedCount === 1 ? "agregado" : "agregados"}
          </p>
          {/* El botón deshabilitado no recibe eventos: el hover va en el contenedor. */}
          <div
            className="h-full"
            onMouseEnter={() => hasMissingQuantity && touchAll()}
          >
            <Button
              copy={isPending ? "Enviando..." : "Pedir cotización"}
              variant="primary"
              disabled={isPending || includedCount === 0 || hasMissingQuantity}
              onClick={handleRequest}
              className="px-25 h-full border-l  disabled:text-secondary-02!"
            />
          </div>
        </div>
      </div>

      {sentNumber !== null && (
        <div className="absolute inset-0 z-10 bg-primary-00/40 flex items-center justify-center lg:px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-primary-03 h-full w-full lg:h-[70%] lg:w-[30%] flex flex-col items-center justify-between  py-12.5"
          >
            <p className="btn-sm text-primary-00">
              Solicitud #{String(sentNumber).padStart(2, "0")}
            </p>
            <div className="flex flex-col items-center gap-6 px-7.5 pb-12.5 text-center">
              <div className="flex flex-col gap-1">
                <p className="hl-sm uppercase">Cotización {project.name}</p>
                <p className="hl-sm uppercase">Enviada</p>
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
