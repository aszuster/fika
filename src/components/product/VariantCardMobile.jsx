"use client";

import Image from "next/image";
import FavoriteButton from "@/components/product/FavoriteButton";
import AvailabilityTag from "@/components/product/AvailabilityTag";
import { priceFormatter } from "@/utils/price";

// Contenido de la tarjeta de una variante en mobile: favoritos arriba a la
// derecha, la imagen cuadrada y debajo nombre, "Precio sugerido", precio X M2
// y disponibilidad. Lo usan el panel de variantes del producto y la grilla del
// catálogo cuando muestra variantes (búsqueda o filtros), para que se vean
// iguales. Va dentro de la celda (relative) que hace de link o botón.
const VariantCardMobile = ({
  name,
  image,
  imageSizes = "50vw",
  price,
  available,
  isFavorited,
  onToggleFavorite,
  imageLoading,
}) => (
  <>
    <FavoriteButton
      isFavorited={isFavorited}
      onToggle={onToggleFavorite}
      className="absolute top-0 right-0 p-4"
    />
    <div className="w-full aspect-square px-7 pt-12 pb-3">
      <div className="relative h-full w-full">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes={imageSizes}
            className="object-contain"
            loading={imageLoading}
          />
        )}
      </div>
    </div>
    <div className="w-full flex flex-col items-start gap-1 px-4 pb-4 ">
      <p className="hl-xs uppercase">{name}</p>
      <p className="btn-sm text-secondary-02">Precio sugerido</p>
      <p className="btn-sm">
        {priceFormatter.format(price)}{" "}
        <span className="text-secondary-02">X M2</span>
      </p>
      <div className="pt-1">
        <AvailabilityTag available={available} />
      </div>
    </div>
  </>
);

export default VariantCardMobile;
