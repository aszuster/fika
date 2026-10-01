"use client";

import { useState, Fragment, useTransition } from "react";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import { getFillerCount } from "@/components/grid/GridFillers";
import AddToProjectPanel from "@/components/account/AddToProjectPanel";
import { removeFavorite } from "@/app/mi-cuenta/actions";
import { getProductBySlug } from "@/data/products";

const FavoritosSection = ({ favorites, projects }) => {
  const [isPending, startTransition] = useTransition();
  const [addToProjectFavorite, setAddToProjectFavorite] = useState(null);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  if (favorites.length === 0) {
    return (
      <div className="flex h-[calc(100dvh-7.625rem)] relative w-full">
        <div className="w-full h-full relative">
          <div className="grid grid-cols-2 grid-rows-[3fr_7fr] bg-primary-03 gap-px w-full h-full"></div>
        </div>
        <div className="w-full h-full flex flex-col border-x border-primary-01">
          <div className="h-[33%] shrink-0 flex flex-col justify-center items-center">
            <h2 className="hl-lg uppercase">Favoritos</h2>
          </div>
          <div className="flex-1 min-h-0 w-full overflow-y-auto flex flex-col ">
            <div className="h-full border-y border-primary-00 flex justify-center items-center">
              <p className="by-sm text-secondary-01 font-normal! text-center max-w-70">
                Guardá tus productos favoritos para encontrarlos fácilmente y
                sumarlos a tus proyectos cuando quieras.
              </p>
            </div>
            <div className="h-full flex justify-center items-end">
              <div>
                <Button
                  copy="Ir a productos"
                  url="/"
                  variant="tertiary"
                  className="mb-20 font-normal!"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full relative">
          <div className="grid grid-cols-2 grid-rows-[3fr_7fr] bg-primary-03 gap-px w-full h-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <div className="h-75 w-full grid grid-cols-3 gap-px bg-primary-01">
        <div className="bg-primary-03 "></div>
        <div className="flex items-center justify-center bg-primary-03">
          <h2 className="hl-lg uppercase text-primary-00 z-10 ">Favoritos</h2>
        </div>
        <div className="bg-primary-03 h-full "></div>
      </div>
      <div className="grid grid-cols-3 gap-px bg-primary-00 border-t border-primary-00">
        {favorites.map((favorite, index) => {
          const product = getProductBySlug(favorite.product_slug);
          const variant = product?.variants.find(
            (v) => v.slug === favorite.variant_slug,
          );
          const row = Math.floor(index / 3);
          const col = index % 3;
          const hasCross = row > 0 && col > 0;

          const details = [
            { label: "Código", value: product?.code },
            { label: "Medida chip", value: product?.chipSize },
            { label: "Medida malla", value: product?.meshSize },
            { label: "Mallas por caja", value: product?.meshesPerBox },
            { label: "M2/caja", value: product?.m2PerBox },
            { label: "Aplicación", value: product?.application },
          ];

          return (
            <div
              key={favorite.id}
              className="relative flex flex-col bg-primary-03"
            >
              {hasCross && (
                <Image
                  src="/img/cross.svg"
                  width={24}
                  height={24}
                  alt=""
                  className="pointer-events-none absolute top-0 left-0 z-5 -translate-x-[calc(50%+0.5px)] -translate-y-1/2"
                />
              )}
              <div className="h-17.5 shrink-0 border-b border-primary-01 w-full flex flex-col items-center justify-center px-4">
                <p className="hl-sm uppercase text-center">
                  {variant?.name ?? favorite.variant_slug}
                </p>
              </div>
              <div className="flex items-start">
              <div className=" w-1/2 flex justify-center items-center p-8.25 border-r border-primary-01">
                <div className="relative h-46.25 w-49.5 ">
                  <Image
                    src={variant?.catalogPhoto ?? product?.image}
                    alt=""
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="h-auto grid grid-cols-2 w-1/2 gap-px bg-primary-01 border-b  border-primary-01">
                {details.map(({ label, value }) => (
                  <Fragment key={label}>
                    <div className="h-auto bg-primary-03 px-2.5 py-1">
                      <p className="text-secondary-02 by-sm">{label}</p>
                    </div>
                    <div className="h-auto  bg-primary-03 px-2.5 py-1">
                      <p className="by-sm">{value}</p>
                    </div>
                  </Fragment>
                ))}
              </div>
              </div>
              <div className="flex mt-auto border-t border-primary-01">
                <Button
                  copy="Quitar de favoritos"
                  variant="primary"
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() => removeFavorite(favorite.id))
                  }
                  className="bg-primary-03! border-t border-r border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                />
                <Button
                  copy="Agregar a proyecto"
                  variant="primary"
                  className="bg-primary-03! border-t border-primary-00! text-primary-00! hover:bg-primary-00! hover:text-primary-03!"
                  onClick={() => {
                    setAddToProjectFavorite(favorite);
                    setIsAddPanelOpen(true);
                  }}
                />
              </div>
            </div>
          );
        })}
        {Array.from(
          { length: getFillerCount(favorites.length, 3) },
          (_, fillerIndex) => {
            const absoluteIndex = favorites.length + fillerIndex;
            const row = Math.floor(absoluteIndex / 3);
            const col = absoluteIndex % 3;
            const hasCross = row > 0 && col > 0;

            return (
              <div key={`filler-${fillerIndex}`} className="relative bg-primary-03">
                {hasCross && (
                  <Image
                    src="/img/cross.svg"
                    width={24}
                    height={24}
                    alt=""
                    className="pointer-events-none absolute top-0 left-0 z-5 -translate-x-[calc(50%+0.5px)] -translate-y-1/2"
                  />
                )}
              </div>
            );
          }
        )}
      </div>
      <AddToProjectPanel
        isOpen={isAddPanelOpen}
        favorite={addToProjectFavorite}
        projects={projects}
        onClose={() => setIsAddPanelOpen(false)}
      />
    </div>
  );
};

export default FavoritosSection;
