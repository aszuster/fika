import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import VariantsPanel, {
  VariantsPanelFromUrl,
} from "@/components/product/VariantsPanel";
import { getProducts, getProductBySlug } from "@/data/catalog";

export async function generateStaticParams() {
  return (await getProducts()).map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const { title, image, chipSize, meshSize, meshesPerBox, m2PerBox, variants } =
    product;

  // Solo lo que necesita la ficha técnica: el panel la arma junto con los
  // datos de la variante elegida.
  const specs = { chipSize, meshSize, meshesPerBox, m2PerBox };

  const productColumn = (
    <div className="relative border-r border-primary-00 h-full min-w-0 flex flex-col justify-center items-center">
      <div className="h-21.75 shrink-0 border-b border-primary-01 flex items-center justify-center px-7.5 w-full">
        <p className="hl-lg uppercase">{title}</p>
      </div>
      <div className="relative h-full w-100">
        <Image src={image} alt="" fill className="object-contain" />
      </div>
      <div className="absolute bottom-7.5 left-7.5 w-65.5 font-sans text-[10px] leading-3.5">
        <p className="font-semibold pb-2">
          El color de los mosaicos pueden variar de un lote a otro.{" "}
        </p>
        <p className="font-normal">
          Si está realizando un pedido adicional para que coincida con los
          mosaicos existentes, verifique el numero de lote que figura en las
          cajas para asegurarse de que el lote sea el mismo al instalado
          previamente.
        </p>
      </div>
    </div>
  );

  const panelProps = {
    productSlug: slug,
    productTitle: title,
    variants,
    specs,
  };

  return (
    <div className="bg-primary-03 h-[calc(100%-3.125rem)]">
      <Suspense
        fallback={<VariantsPanel {...panelProps}>{productColumn}</VariantsPanel>}
      >
        <VariantsPanelFromUrl {...panelProps}>{productColumn}</VariantsPanelFromUrl>
      </Suspense>
    </div>
  );
}
