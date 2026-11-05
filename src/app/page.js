import { cookies, headers } from "next/headers";
import Catalog from "@/components/catalog/Catalog";
import FormatChooser, {
  ALL_FORMATS_PARAM,
  FORMAT_CHOOSER_SEEN_COOKIE,
  formatParam,
} from "@/components/catalog/FormatChooser";
import { getFilters, getProducts } from "@/data/catalog";

// Ctrl+Shift+R pide el documento con "Cache-Control: no-cache". Se mira también
// sec-fetch-dest para no confundirlo con las navegaciones internas de Next.
const isHardReload = (requestHeaders) =>
  requestHeaders.get("sec-fetch-dest") === "document" &&
  Boolean(requestHeaders.get("cache-control")?.includes("no-cache"));

export default async function Home({ searchParams }) {
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
