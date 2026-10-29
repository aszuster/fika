import Catalog from "@/components/catalog/Catalog";
import { getFilters, getProducts } from "@/data/catalog";

export default async function Home() {
  const [products, filterOptions] = await Promise.all([getProducts(), getFilters()]);

  return <Catalog products={products} filterOptions={filterOptions} />;
}
