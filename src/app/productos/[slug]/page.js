import { notFound } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
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

  const { title, src, color, material, format, application } = product;

  const details = [
    { label: "Color", value: color },
    { label: "Material", value: material },
    { label: "Formato", value: format },
    { label: "Aplicación", value: application },
  ];

  return (
    <div className="bg-primary-03 h-[calc(100%-4.5rem)]">
      <div className="flex w-full items-center px-7.25 h-12.5 border-b border-primary-00">
        <Button copy="Volver" url="/" variant="secondary" />
      </div>

      <div className="grid grid-cols-2 h-[calc(100%-3.125rem-1px)]">
        <div className="relative border-r border-primary-00 p-17">
          <div className="relative h-full w-full">
            <Image src={src} alt="" fill sizes="50vw" className="object-contain" />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="h-21.75 shrink-0 border-b border-primary-01 flex items-center px-7.5">
            <p className="hl-lg uppercase">{title}</p>
          </div>
          <div className="grid grid-cols-2 gap-px bg-primary-01">
            {details.map(({ label, value }) => (
              <div key={label} className="h-12.5 flex flex-col justify-center px-7.5 bg-primary-03">
                <p className="text-secondary-02 by-sm">{label}</p>
                <p className="by-sm">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
