import Catalog from "@/components/catalog/Catalog";
import FormatChooser, {
  ALL_FORMATS_PARAM,
  formatParam,
} from "@/components/catalog/FormatChooser";
import { getFilters, getProducts } from "@/data/catalog";

export default async function Home({ searchParams }) {
  const [{ formato }, products, filterOptions] = await Promise.all([
    searchParams,
    getProducts(),
    getFilters(),
  ]);

  const formats = filterOptions.formats.filter(({ label }) =>
    products.some((product) => product.format === label),
  );
  const selectedFormat = formats.find(({ label }) => formatParam(label) === formato);

  // "Cerrar" en la elección: el catálogo completo, sin filtrar por formato.
  if (formato === ALL_FORMATS_PARAM) {
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
