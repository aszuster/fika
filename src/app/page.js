"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import Button from "@/components/buttons/Button";
import GridFillers from "@/components/grid/GridFillers";
import GridCross, { hasTopCross } from "@/components/grid/GridCross";
import FiltersPanel from "@/components/filters/FiltersPanel";
import FavoriteButton from "@/components/product/FavoriteButton";
import useFavorites from "@/hooks/useFavorites";
import { priceFormatter } from "@/utils/price";
import { products } from "@/data/products";
import Search from "@/svg/Search";
import { useLenis } from "@/utils/lenis";

const grids = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const titles = {
  3: "hl-lg",
  4: "hl-md",
  5: "hl-sm",
  6: "hl-sm",
};

const autoRaws = {
  2: "auto-rows-[calc((100dvh-7.625rem-2px)/2)]",
  3: "auto-rows-[calc((100dvh-7.625rem-2px)/3)]",
};

const emptyFilters = {
  color: [],
  material: [],
  format: [],
  application: [],
};

// El color es de cada variante; material, formato y aplicación son del
// producto, así que una variante los hereda.
const variantMatchesFilters = (product, variant, filters) =>
  Object.entries(filters).every(([key, values]) => {
    if (values.length === 0) return true;
    if (key === "color") return values.includes(variant.color);
    return values.includes(product[key]);
  });

// Minúsculas y sin tildes, para que "concavo" encuentre "Stone cóncavo".
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const getSearchTerms = (query) => normalize(query).split(/\s+/).filter(Boolean);

// Cada palabra buscada tiene que aparecer en alguno de los datos de la
// variante: "blanco piso" devuelve las variantes blancas aptas para piso.
const variantMatchesSearch = (product, variant, terms) => {
  const searchable = normalize(
    [
      product.title,
      variant.name,
      variant.color,
      product.material,
      product.format,
      product.application,
    ].join(" "),
  );
  return terms.every((term) => searchable.includes(term));
};

// Sin filtros ni búsqueda la grilla muestra productos; con filtros o
// búsqueda, las variantes que coinciden. Ambos se normalizan al mismo
// formato de tarjeta.
const getGridItems = (filters, hasFilters, query) => {
  const terms = getSearchTerms(query);

  if (!hasFilters && terms.length === 0) {
    return products.map(({ title, slug, image, hoverImage }) => ({
        key: slug,
        href: `/productos/${slug}`,
        title,
        image,
        hoverImage,
      }));
  }

  return products.flatMap((product) =>
    product.variants
      .filter(
        (variant) =>
          variantMatchesFilters(product, variant, filters) &&
          variantMatchesSearch(product, variant, terms),
      )
      .map((variant) => ({
        key: `${product.slug}-${variant.slug}`,
        href: `/productos/${product.slug}?variante=${variant.slug}`,
        productSlug: product.slug,
        variantSlug: variant.slug,
        price: variant.price,
        title: product.title,
        subtitle: variant.name,
        // Sin hoverImage: en la grilla de variantes el hover es gris claro,
        // así que la foto no cambia a la versión "-white".
        image: variant.catalogPhoto,
      })),
  );
};

export default function Home() {
  const [cols, setCols] = useState(3);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [searchQuery, setSearchQuery] = useState("");
  const imageSizes = `${Math.ceil(100 / cols)}vw`;
  const visibleRows = cols === 6 ? 3 : 2;
  const lenis = useLenis();
  const { isLoggedIn, isFavorited, toggleFavorite } = useFavorites();

  // Con el panel abierto, la página queda fija y solo scrollea el panel
  // (que tiene data-lenis-prevent para que Lenis no lo bloquee).
  useEffect(() => {
    if (!lenis) return;
    if (isFiltersOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    return () => lenis.start();
  }, [lenis, isFiltersOpen]);

  const appliedFiltersCount = Object.values(appliedFilters).reduce(
    (count, values) => count + values.length,
    0,
  );

  // Con el panel abierto la grilla queda vacía: solo las celdas con sus
  // líneas, hasta que se apliquen (o se cierren) los filtros.
  const gridItems = isFiltersOpen
    ? []
    : getGridItems(appliedFilters, appliedFiltersCount > 0, searchQuery);

  return (
    <div className="bg-primary-03 h-[calc(100%-4.5rem)]">
      <div className="sticky top-18 z-10 w-full bg-primary-03">
        <div className="flex w-full justify-between items-center px-7.25  h-12.5 border-b border-primary-00">
          <div className="flex items-center gap-7.25 h-full">
            <div>
              <Button
                copy={
                  appliedFiltersCount > 0
                    ? `Filtros (${appliedFiltersCount})`
                    : "Filtros"
                }
                url=""
                variant="secondary"
                onClick={() => setIsFiltersOpen((open) => !open)}
              />
            </div>
            <div className="border-l border-primary-00 pl-7.25 h-full flex items-center">
              <Search />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="¿Qué estás buscando?"
                aria-label="Buscar productos"
                className="by-sm w-56 bg-transparent outline-none placeholder:text-primary-00 pl-2.5"
              />
            </div>
          </div>

          <div className="flex h-full items-center gap-8 border-l border-primary-00 pl-7.25">
            <p className="btn-sm">Vista</p>
            <input
              type="range"
              min={3}
              max={6}
              step={1}
              value={9 - cols}
              onChange={(e) => setCols(9 - Number(e.target.value))}
              aria-label="Zoom de la grilla"
              className="range-cols w-34.25"
            />
          </div>
        </div>
        <motion.div
          initial={false}
          animate={{ opacity: isFiltersOpen ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          onClick={() => setIsFiltersOpen(false)}
          className={`fixed inset-x-0 top-18 bottom-0 bg-primary-00/40 ${
            isFiltersOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        />
        <FiltersPanel
          isOpen={isFiltersOpen}
          onApply={(filters) => {
            setAppliedFilters(filters);
            setIsFiltersOpen(false);
          }}
          onClear={() => setAppliedFilters(emptyFilters)}
          onClose={() => setIsFiltersOpen(false)}
        />
      </div>

      <div>
        <div
          className={`grid ${grids[cols]} gap-px bg-primary-01 ${autoRaws[visibleRows]}`}
        >
          {gridItems.map(({ key, href, title, subtitle, image: src, hoverImage, productSlug, variantSlug, price }, index) => {
            const isVariant = Boolean(variantSlug);
            const hasHoverImage = Boolean(hoverImage) && hoverImage !== src;

            return (
            <div
              key={key}
              className={`relative bg-primary-03 group transition-all duration-300 ease-in-out ${
                isVariant
                  ? "hover:text-primary-00 hover:bg-[#EFEFEF]"
                  : "hover:text-primary-03 hover:bg-primary-00"
              }`}
            >
              {hasTopCross(index, cols) && <GridCross />}

              <Link
                href={href}
                className="flex h-full flex-col items-center"
              >
                <div className="h-21.75 relative shrink-0 border-b border-primary-01 w-full flex items-center justify-center">
                  <p className={` ${isVariant ? "hl-xs max-w-50 text-center 2xl:max-w-100" : titles[cols]}  uppercase `}>{title} {subtitle}</p>
                                {isVariant && isLoggedIn && (
                <FavoriteButton
                  isFavorited={isFavorited(productSlug, variantSlug)}
                  onToggle={() => toggleFavorite(productSlug, variantSlug)}
                  className="absolute px-8.25 right-0 h-full border-l border-primary-00"
                />
              )}
                </div>
                <div className="min-h-0 w-full flex-1 p-8">
                  <div className="relative h-full w-full">
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes={imageSizes}
                      className={`object-contain ${
                        hasHoverImage
                          ? "transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                          : ""
                      }`}
                      loading={index === 0 ? "eager" : undefined}
                    />
                    {hasHoverImage && (
                      <Image
                        src={hoverImage}
                        alt=""
                        fill
                        sizes={imageSizes}
                        className="object-contain opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                      />
                    )}
                  </div>
                </div>
                {isVariant && isLoggedIn && (
                <div className="h-8 py-7 shrink-0 w-full border-t border-primary-01 flex items-center justify-center gap-2">
                  <p className="hl-xs uppercase text-secondary-02">Precio</p>
                  <p className="hl-xs">{priceFormatter.format(price)}</p>
                  <p className="hl-xs uppercase text-secondary-02">X M2</p>
                </div>
                )}
              </Link>
            </div>
            );
          })}
          <GridFillers
            items={gridItems}
            cols={cols}
            minRows={visibleRows}
            crosses
          />
        </div>
      </div>
    </div>
  );
}
