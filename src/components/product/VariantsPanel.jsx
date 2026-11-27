"use client";

import { Fragment, useCallback, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import GridFillers from "@/components/grid/GridFillers";
import GridCross, { hasTopCross } from "@/components/grid/GridCross";
import Carousel from "@/components/carousel/Carousel";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import FavoriteButton from "@/components/product/FavoriteButton";
import VariantCardMobile from "@/components/product/VariantCardMobile";
import FavoritesLoginModal from "@/components/modals/FavoritesLoginModal";
import useFavorites from "@/hooks/useFavorites";
import useIsMobile from "@/hooks/useIsMobile";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import AvailabilityTag from "@/components/product/AvailabilityTag";
import { priceFormatter } from "@/utils/price";
import { getVariantPrice, isVariantAvailable } from "@/utils/variantMockup";
import { getProductDetails } from "@/utils/productDetails";

const setVariantInUrl = (variantSlug, { replace = false } = {}) => {
  const params = new URLSearchParams(window.location.search);
  if (variantSlug) {
    params.set("variante", variantSlug);
  } else {
    params.delete("variante");
  }
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history[replace ? "replaceState" : "pushState"](null, "", url);
};

const MOCKUP_DOWNLOADS = [
  { label: "Plano DWG", href: null },
  { label: "Ficha", href: null },
  { label: "3D SKP", href: null },
];

const PriceAndAvailability = ({ variant, index, className = "" }) => (
  <div
    className={`flex gap-2 justify-between items-end lg:items-center w-full ${className}`}
  >
    <div className="w-full flex flex-col lg:flex-row lg:flex-wrap justify-start gap-x-2">
      <p className="btn-sm text-secondary-02">Precio sugerido</p>
      <div className="flex flex-row gap-x-2">
      <p className="btn-sm text-[15px]!">{priceFormatter.format(getVariantPrice(variant))}</p>
      <p className="btn-sm text-[15px]! text-secondary-02">X M2</p>
      </div>
    </div>
    <AvailabilityTag available={isVariantAvailable(variant, index)} />
  </div>
);

const VariantsPanel = ({
  productSlug,
  productTitle,
  variants,
  specs,
  selectedVariantSlug = null,
  mobileFooter = null,
  children,
}) => {
  // En mobile scrollea la página entera; en desktop, solo el panel de la derecha.
  const isMobile = useIsMobile();
  const foundIndex = variants.findIndex(
    ({ slug }) => slug === selectedVariantSlug,
  );
  const selectedIndex = foundIndex === -1 ? null : foundIndex;
  const selected = selectedIndex !== null ? variants[selectedIndex] : null;

  const { isLoggedIn, isFavorited, toggleFavorite } = useFavorites(productSlug);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const closeFavoritesModal = useCallback(() => setIsFavoritesModalOpen(false), []);

  // Sin sesión, en vez de guardar el favorito se abre el popup para crear cuenta.
  const handleFavorite = (variantSlug) =>
    isLoggedIn
      ? toggleFavorite(productSlug, variantSlug)
      : setIsFavoritesModalOpen(true);

  const breadcrumbs = [
    { label: "Productos", href: "/" },
    selected
      ? { label: productTitle, onClick: () => setVariantInUrl(null) }
      : { label: productTitle },
    ...(selected ? [{ label: selected.name }] : []),
  ];

  // Piezas del detalle de la variante: desktop y mobile las ordenan distinto.
  const detail = selected && {
    // Nombre de la variante (centrado) con el botón de favoritos a la derecha.
    nav: (
      <div className="relative h-12.5 lg:h-20 shrink-0 border-b border-primary-01 flex items-center justify-end px-6.5">
        <div className="absolute inset-0 px-16 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="font-mono  hl-sm text-center uppercase"
            >
              {selected.name}
            </motion.p>
          </AnimatePresence>
        </div>
        <FavoriteButton
          isFavorited={isFavorited(productSlug, selected.slug)}
          onToggle={() => handleFavorite(selected.slug)}
          className="relative h-full pl-6.5"
        />
      </div>
    ),

    // Foto de la variante, precio y disponibilidad.
    info: (
      <div className="relative h-auto w-full shrink-0  flex flex-col items-center">
        <div className="h-full w-full flex justify-center items-center py-12">
          <div className="relative w-40 h-40 lg:h-full 2xl:h-60 2xl:w-61.25 ">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={selected.catalogPhoto}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) 160px, 25vw"
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <PriceAndAvailability
          variant={selected}
          index={selectedIndex}
          className="px-7.25 lg:px-7.5 pb-6.25"
        />
      </div>
    ),

    technicalSheet: (
      <div className=" border-t border-primary-00">
        <div className="h-12.5 flex justify-center items-center border-b border-primary-00 lg:border-primary-01">
          <p className="hl-xs uppercase">Ficha técnica</p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-primary-01 border-b border-primary-01">
          {getProductDetails(specs, selected).map(({ label, value }) => (
            <Fragment key={label}>
              <div className="pl-3.75 lg:pl-9.75 py-1 lg:py-0.5 flex items-center bg-primary-03">
                <p className="text-secondary-01 by-sm">{label}</p>
              </div>
              <div className="pl-3.75 lg:pl-9.75 flex items-center bg-primary-03">
                <p className="by-sm">{value}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    ),

    downloads: (
      <div className="lg:mt-auto w-full lg:h-16.25 shrink-0 border-t border-primary-00 flex flex-col lg:flex-row justify-center lg:gap-5 max-lg:divide-y max-lg:divide-primary-01">
        {(selected.downloads.length > 0
          ? selected.downloads
          : MOCKUP_DOWNLOADS
        ).map(({ label, href }) => (
          <a
            key={label}
            href={href ?? undefined}
            download={href ? true : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer underline py-3.75 lg:py-0 lg:h-full flex items-center justify-center btn-sm uppercase text-primary-00 hover:text-secondary-01 transition-colors duration-300 ease-in-out"
          >
            {label}
          </a>
        ))}
      </div>
    ),
  };

  // Desktop: carrusel a la izquierda, el resto a la derecha. Si no hay fotos
  // de muestra, el carrusel muestra la foto de catálogo.
  const desktopDetail = selected && (
    <div className="grid grid-cols-2 h-[calc(100dvh-6.25rem)]">
      <div className="border-r border-primary-00 relative flex flex-col">
        <div className="relative h-full w-full">
          <Carousel
            key={selectedIndex}
            images={
              selected.samplePhotos.length > 0
                ? selected.samplePhotos
                : [selected.catalogPhoto]
            }
          />
        </div>
        <div className="h-16.25 w-full shrink-0 border-t border-primary-00"></div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex flex-col">
          {detail.nav}
          {detail.info}
        </div>
        {detail.technicalSheet}
        {detail.downloads}
      </div>
    </div>
  );

  // Mobile: todo en una columna. El carrusel solo aparece si hay fotos de muestra.
  const mobileDetail = selected && (
    <div>
      <div className="h-12.5 lg:h-21.75 border-b border-primary-00 lg:border-primary-01 flex items-center justify-center px-7.25">
        <p className="hl-lg uppercase text-center">{productTitle}</p>
      </div>
      {detail.nav}
      {selected.samplePhotos.length > 0 && (
        <div className="h-[100vw] max-h-[70dvh] border-b border-primary-01">
          <Carousel
            key={selectedIndex}
            images={selected.samplePhotos}
            sizes="100vw"
            dotsClassName="shrink-0 py-4"
          />
        </div>
      )}
      {detail.info}
      {detail.technicalSheet}
      {detail.downloads}
    </div>
  );

  return (
    <>
      {/* Solo desktop: en mobile se vuelve con el "atrás" del teléfono (elegir
          una variante agrega una entrada al historial). */}
      <div className="hidden lg:flex w-full items-center px-3.75 lg:px-7.25 h-12.5 border-b border-primary-00">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:h-[calc(100dvh-6.25rem)] lg:overflow-hidden">
        {/* Con una variante elegida, en mobile se ve directamente su detalle. */}
        <div className={selected ? "hidden lg:contents" : "contents"}>
          {children}
        </div>

        <PanelScroll isMobile={isMobile}>
          {selected ? (
            isMobile ? mobileDetail : desktopDetail
          ) : (
            // Mobile: cada tarjeta mide lo que su contenido (imagen cuadrada).
            // Desktop: 2 filas por pantalla.
            <div className="grid grid-cols-2 gap-px bg-primary-01 lg:auto-rows-[calc((100dvh-6.25rem-2px)/2)]">
              {variants.map((variant, index) => {
                const { name, slug, catalogPhoto } = variant;
                return (
                <div
                  key={name}
                  role="button"
                  tabIndex={0}
                  onClick={() => setVariantInUrl(slug)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setVariantInUrl(slug);
                    }
                  }}
                  className="relative flex h-full flex-col bg-primary-03 cursor-pointer group hover:text-primary-00 hover:bg-[#EFEFEF] transition-all duration-300 ease-in-out text-left"
                >
                  {hasTopCross(index, 2) && <GridCross />}

                  {isMobile ? (
                    // Mobile: favoritos arriba a la derecha, la imagen y debajo
                    // nombre, "Precio sugerido", precio X M2 y disponibilidad.
                    <VariantCardMobile
                      name={name}
                      image={catalogPhoto}
                      price={getVariantPrice(variant)}
                      available={isVariantAvailable(variant, index)}
                      isFavorited={isFavorited(productSlug, slug)}
                      onToggleFavorite={() => handleFavorite(slug)}
                    />
                  ) : (
                  <>
                  <div className="h-15 lg:h-21.75 relative shrink-0 border-b border-primary-01 w-full flex items-center justify-center">
                    <p
                      className={`${isMobile ? "hl-xs" : "hl-sm"} pl-2 pr-12.5 lg:px-0 uppercase max-w-50 text-center 2xl:max-w-100`}
                    >
                      {name}
                    </p>
                    <FavoriteButton
                      isFavorited={isFavorited(productSlug, slug)}
                      onToggle={() => handleFavorite(slug)}
                      className="absolute px-4 lg:px-8.25 right-0 h-full"
                    />
                  </div>
                  <div className="min-h-0 w-full flex-1 p-5 lg:p-8">
                    <div className="relative h-full w-full">
                      <Image
                        src={catalogPhoto}
                        alt=""
                        fill
                        sizes="(max-width: 1023px) 50vw, 25vw"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* {isLoggedIn && ( */}
                  <PriceAndAvailability
                    variant={variant}
                    index={index}
                    className="py-3 lg:h-8 lg:py-7 shrink-0 px-3 lg:px-7.5 "
                  />
                  {/* )} */}
                  </>
                  )}
                </div>
                );
              })}
              <GridFillers items={variants} cols={2} minRows={2} crosses />
            </div>
          )}
          {mobileFooter}
        </PanelScroll>
      </div>

      <FavoritesLoginModal
        isOpen={isFavoritesModalOpen}
        onClose={closeFavoritesModal}
      />
    </>
  );
};

// En desktop el panel tiene su propio scroll; en mobile es un bloque más de la página.
const PanelScroll = ({ isMobile, children }) =>
  isMobile ? (
    <div>{children}</div>
  ) : (
    <ScrollArea className="col-span-2" lenisOptions={{ orientation: "vertical" }}>
      {children}
    </ScrollArea>
  );

export const VariantsPanelFromUrl = (props) => {
  const selectedVariantSlug = useSearchParams().get("variante");

  return <VariantsPanel {...props} selectedVariantSlug={selectedVariantSlug} />;
};

export default VariantsPanel;
