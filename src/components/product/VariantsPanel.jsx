"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import GridFillers from "@/components/grid/GridFillers";
import GridCross, { hasTopCross } from "@/components/grid/GridCross";
import Carousel from "@/components/carousel/Carousel";
import Breadcrumbs from "@/components/product/Breadcrumbs";
import FavoriteButton from "@/components/product/FavoriteButton";
import useFavorites from "@/hooks/useFavorites";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import { priceFormatter } from "@/utils/price";
import { getProductDetails } from "@/utils/productDetails";
import Chevron from "@/svg/Chevron";

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

const MOCKUP_PRICE = 68000;
const MOCKUP_DOWNLOADS = [
  { label: "Plano DWG", href: null },
  { label: "Ficha", href: null },
  { label: "3D SKP", href: null },
];
const isAvailable = (variant, index) => variant.available ?? index % 2 === 0;

const PriceAndAvailability = ({ variant, index, className = "" }) => {
  const available = isAvailable(variant, index);

  return (
    <div className={`flex justify-between items-center w-full ${className}`}>
      <div className="w-full flex gap-2">
        <p className="btn-sm text-secondary-02">Precio sugerido</p>
        <p className="btn-sm">
          {priceFormatter.format(variant.price ?? MOCKUP_PRICE)}
        </p>
        <p className="btn-sm text-secondary-02">X M2</p>
      </div>
      <div
        className={`${available ? "border border-primary-00 px-1" : "bg-primary-01 px-2"} py-0.5 rounded-sm w-auto h-auto`}
      >
        <p className="hl-xs uppercase h-auto whitespace-nowrap">
          {available ? "Disponible" : "A consultar"}
        </p>
      </div>
    </div>
  );
};

const VariantsPanel = ({
  productSlug,
  productTitle,
  variants,
  specs,
  selectedVariantSlug = null,
  children,
}) => {
  const foundIndex = variants.findIndex(
    ({ slug }) => slug === selectedVariantSlug,
  );
  const selectedIndex = foundIndex === -1 ? null : foundIndex;
  const selected = selectedIndex !== null ? variants[selectedIndex] : null;

  const { isLoggedIn, isFavorited, toggleFavorite } = useFavorites(productSlug);

  const goToVariant = (next) =>
    setVariantInUrl(variants[(next + variants.length) % variants.length].slug, {
      replace: true,
    });

  const breadcrumbs = [
    { label: "Productos", href: "/" },
    selected
      ? { label: productTitle, onClick: () => setVariantInUrl(null) }
      : { label: productTitle },
    ...(selected ? [{ label: selected.name }] : []),
  ];

  return (
    <>
      <div className="flex w-full items-center px-7.25 h-12.5 border-b border-primary-00">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="grid grid-cols-3 h-[calc(100dvh-6.25rem)] overflow-hidden">
        {children}

        <ScrollArea
          className="col-span-2"
          lenisOptions={{ orientation: "vertical" }}
        >
          {selected ? (
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
                  <div className="h-20 shrink-0 border-b border-primary-01 flex items-center justify-between px-6.5">
                    <button
                      type="button"
                      onClick={() => goToVariant(selectedIndex - 1)}
                      aria-label="Variante anterior"
                      className="cursor-pointer h-full rotate-180  pl-6.5"
                    >
                      <Chevron />
                    </button>
                    <div className="relative h-full flex-1 flex items-center justify-center">
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.p
                          key={selectedIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="hl-sm text-center uppercase absolute"
                        >
                          {selected.name}
                        </motion.p>
                      </AnimatePresence>
                    </div>
                    <button
                      type="button"
                      onClick={() => goToVariant(selectedIndex + 1)}
                      aria-label="Variante siguiente"
                      className="cursor-pointer h-full  pl-6.5"
                    >
                      <Chevron />
                    </button>
                  </div>
                  <div className="relative h-auto w-full shrink-0  flex flex-col items-center">
                    {isLoggedIn && (
                      <div className="h-10 py-2 2xl:py-0 w-full border-b border-primary-01 flex items-center justify-center gap-3">
                        <p className="uppercase text-[14px]">
                          {isFavorited(productSlug, selected.slug)
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"}
                        </p>
                        <FavoriteButton
                          isFavorited={isFavorited(productSlug, selected.slug)}
                          onToggle={() =>
                            toggleFavorite(productSlug, selected.slug)
                          }
                          className="w-5 2xl:w-5 pb-0.5"
                        />
                      </div>
                    )}
                    <div className="h-full w-full flex justify-center items-center py-12">
                      <div className="relative w-40 h-full 2xl:h-60 2xl:w-61.25 ">
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
                              sizes="25vw"
                              className="object-contain"
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                    <PriceAndAvailability
                      variant={selected}
                      index={selectedIndex}
                      className="px-7.5 pb-6.25"
                    />
                  </div>
                  {/* {isLoggedIn && ( */}

                  {/* )} */}
                </div>
                <div className="border-t border-primary-00">
                  <div className="h-12.5 flex justify-center items-center border-b border-primary-01">
                    <p className="hl-xs uppercase">Ficha técnica</p>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-primary-01 border-b border-primary-01">
                    {getProductDetails(specs, selected).map(
                      ({ label, value }) => (
                        <Fragment key={label}>
                          <div className="pl-9.75 py-0.5 flex items-center bg-primary-03">
                            <p className="text-secondary-02 by-sm">{label}</p>
                          </div>
                          <div className="pl-9.75 flex items-center bg-primary-03">
                            <p className="by-sm">{value}</p>
                          </div>
                        </Fragment>
                      ),
                    )}
                  </div>
                </div>
                <div className="mt-auto w-full h-16.25 shrink-0 border-t border-primary-00 flex justify-center gap-5">
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
                      className="cursor-pointer underline h-full flex items-center justify-center btn-sm uppercase text-primary-00 hover:text-secondary-01 transition-colors duration-300 ease-in-out"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-px bg-primary-01 auto-rows-[calc((100dvh-6.25rem-2px)/2)]">
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

                  <div className="h-21.75 relative shrink-0 border-b border-primary-01 w-full flex items-center justify-center">
                    <p className="hl-sm uppercase max-w-50 text-center 2xl:max-w-100">
                      {name}
                    </p>
                    {isLoggedIn && (
                      <FavoriteButton
                        isFavorited={isFavorited(productSlug, slug)}
                        onToggle={() => toggleFavorite(productSlug, slug)}
                        className="absolute px-8.25 right-0 h-full border-l border-primary-00"
                      />
                    )}
                  </div>
                  <div className="min-h-0 w-full flex-1 p-8">
                    <div className="relative h-full w-full">
                      <Image
                        src={catalogPhoto}
                        alt=""
                        fill
                        sizes="25vw"
                        className="object-contain"
                      />
                    </div>
                  </div>
                  {/* {isLoggedIn && ( */}
                  <PriceAndAvailability
                    variant={variant}
                    index={index}
                    className="h-8 py-7 shrink-0 px-7.5 "
                  />
                  {/* )} */}
                </div>
                );
              })}
              <GridFillers items={variants} cols={2} minRows={2} crosses />
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};

export const VariantsPanelFromUrl = (props) => {
  const selectedVariantSlug = useSearchParams().get("variante");

  return <VariantsPanel {...props} selectedVariantSlug={selectedVariantSlug} />;
};

export default VariantsPanel;
