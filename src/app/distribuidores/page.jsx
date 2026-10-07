import { notFound } from "next/navigation";
import Image from "next/image";
import Button from "@/components/buttons/Button";
import DistribuidoresPanel from "@/components/distribuidores/DistribuidoresPanel";
import { provincias } from "@/data/distribuidores";


export default async function Distribuidores() {

  return (
    <div className="bg-primary-03 h-[calc(100dvh-4.5rem)] relative">
        <div className="grid grid-cols-4 grid-rows-1 h-full relative">
            <DistribuidoresPanel provincias={provincias} />
        </div>
    </div>
  );
}
