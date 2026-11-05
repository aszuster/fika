import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import Catalog from "@/components/catalog/Catalog";
import FormatChooser, {
  ALL_FORMATS_PARAM,
  FORMAT_CHOOSER_SEEN_COOKIE,
  formatParam,
} from "@/components/catalog/FormatChooser";
import Intro from "@/components/intro/Intro";
import { getFilters, getProducts } from "@/data/catalog";

// Con esta cookie de sesión el intro no se repite.
const INTRO_SEEN_COOKIE = "fika-intro-seen";

// Carga completa de la página: las navegaciones internas de Next no son "document".
const isDocumentRequest = (requestHeaders) =>
  requestHeaders.get("sec-fetch-dest") === "document";

// Ctrl+Shift+R pide el documento con "Cache-Control: no-cache".
const isHardReload = (requestHeaders) =>
  isDocumentRequest(requestHeaders) &&
  Boolean(requestHeaders.get("cache-control")?.includes("no-cache"));

// El intro queda fuera del Suspense para llegar al navegador sin esperar los
// datos del catálogo: la home carga detrás.
export default async function Home({ searchParams }) {
  const [{ intro }, cookieStore, requestHeaders] = await Promise.all([
    searchParams,
    cookies(),
    headers(),
  ]);
  // /?intro y Ctrl+Shift+R lo muestran siempre, para poder revisarlo.
  const showIntro =
    intro !== undefined ||
    isHardReload(requestHeaders) ||
    (isDocumentRequest(requestHeaders) && !cookieStore.has(INTRO_SEEN_COOKIE));

  return (
    <>
      {showIntro && <Intro cookieName={INTRO_SEEN_COOKIE} />}
      <Suspense>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function HomeContent({ searchParams }) {
  const [{ formato }, cookieStore, requestHeaders, products, filterOptions] = await Promise.all([
    searchParams,
    cookies(),
    headers(),
    getProducts(),
    getFilters(),
  ]);

  const formats = filterOptions.formats.filter(({ label }) =>
    products.some((product) => product.format === label),
  );
  const selectedFormat = formats.find(({ label }) => formatParam(label) === formato);

  if (isHardReload(requestHeaders)) {
    return <FormatChooser formats={formats} />;
  }

  const chooserSeen = cookieStore.has(FORMAT_CHOOSER_SEEN_COOKIE);

  // "Cerrar" en la elección, o volver a la home después de haberla visto: el
  // catálogo completo, sin filtrar por formato.
  if (formato === ALL_FORMATS_PARAM || (!selectedFormat && chooserSeen)) {
    return <Catalog key="todos" products={products} filterOptions={filterOptions} />;
  }

  if (!selectedFormat) {
    return <FormatChooser formats={formats} />;
  }

  return (
    <Catalog
      key={selectedFormat.label}
      products={products}
      filterOptions={filterOptions}
      initialFormat={selectedFormat.label}
    />
  );
}
