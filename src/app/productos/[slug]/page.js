import { notFound } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import VariantsPanel from "@/components/product/VariantsPanel";
import { products, getProductBySlug } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const {
    title,
    image,
    code,
    chipSize,
    meshSize,
    meshesPerBox,
    m2PerBox,
    application,
    variants,
  } = product;

  const details = [
    { label: "Código", value: code },
    { label: "Medida chip", value: chipSize },
    { label: "Medida malla", value: meshSize },
    { label: "Mallas por caja", value: meshesPerBox },
    { label: "M2/caja", value: m2PerBox },
    { label: "Aplicación", value: application },
  ];

  return (
    <div className="bg-primary-03 h-[calc(100%-4.5rem)]">
      <div className="flex w-full items-center px-7.25 h-12.5 border-b border-primary-00">
        <Button copy="Volver" url="/" variant="secondary" />
      </div>

      <div className="flex h-[calc(100dvh-7.625rem)] overflow-hidden">
        <div className="relative border-r border-primary-00 h-full w-160 flex flex-col justify-center items-center shrink-0">
          <div className="h-22.5 shrink-0 border-b border-primary-01 flex items-center justify-center px-7.5 w-full">
            <p className="hl-lg uppercase">{title}</p>
          </div>
          <div className="relative h-full w-113.5">
            <Image src={image} alt="" fill className="object-contain" />
          </div>
          <div className="absolute bottom-7.5 left-7.5 w-65.5 font-sans text-[10px] leading-3.5">
            <p className="font-semibold pb-2">El color de los mosaicos pueden variar de un lote a otro. </p>
            <p className="font-normal">Si está realizando un pedido adicional para que coincida con los mosaicos existentes, verifique el numero de lote que figura en las cajas para asegurarse de que el lote sea el mismo al instalado previamente.</p>
          </div>
        </div>

        <VariantsPanel variants={variants} details={details} />
      </div>
    </div>
  );
}
