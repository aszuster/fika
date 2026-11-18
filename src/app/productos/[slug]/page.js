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

  const lotNotice = (
    <>
      <p className="font-semibold pb-2 text-center lg:text-left max-w-65 lg:max-w-full mx-auto">
        El color de los mosaicos pueden variar de un lote a otro.{" "}
      </p>
      <p className="font-normal text-center lg:text-left max-w-65 lg:max-w-full mx-auto">
        Si está realizando un pedido adicional para que coincida con los
        mosaicos existentes, verifique el numero de lote que figura en las
        cajas para asegurarse de que el lote sea el mismo al instalado
        previamente.
      </p>
    </>
  );

  const productColumn = (
    <div className="relative border-b lg:border-b-0 lg:border-r border-primary-00 lg:h-full min-w-0 flex flex-col justify-center items-center">
      <div className="h-12.5 lg:h-21.75 shrink-0 border-b border-primary-01 flex items-center justify-center px-7.5 w-full">
        <p className="hl-lg uppercase text-center">{title}</p>
      </div>
      <div className="relative h-60 w-3/4 lg:h-full lg:w-full max-w-100 my-7.5 lg:my-0">
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 1023px) 75vw, 400px"
          className="object-contain"
        />
      </div>
      {/* En desktop el aviso va sobre la columna; en mobile, al final de la página. */}
      <div className="hidden lg:block absolute bottom-7.5 left-7.5 w-65.5 font-sans text-[10px] leading-3.5">
        {lotNotice}
      </div>
    </div>
  );

  const mobileFooter = (
    <div className="lg:hidden flex flex-col items-center  border-t border-primary-00 mx-auto px-0  py-10 font-sans text-[12px] leading-4">
      <div className="mb-7 w-5.5 h-5.5 bg-primary-00 rounded-full relative after:absolute after:top-1/2 after:left-1/2 after:-translate-1/2 after:rounded-full after:h-1 after:w-1 after:bg-primary-03">
      </div>
      {lotNotice}
    </div>
  );

  const panelProps = {
    productSlug: slug,
    productTitle: title,
    variants,
    specs,
    mobileFooter,
  };

  return (
    <div className="bg-primary-03 lg:h-[calc(100%-3.125rem)]">
      <Suspense
        fallback={<VariantsPanel {...panelProps}>{productColumn}</VariantsPanel>}
      >
        <VariantsPanelFromUrl {...panelProps}>{productColumn}</VariantsPanelFromUrl>
      </Suspense>
    </div>
  );
}
