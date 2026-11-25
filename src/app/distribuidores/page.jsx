import DistribuidoresPanel from "@/components/distribuidores/DistribuidoresPanel";
import { getProvinciasConDistribuidores } from "@/data/distribuidores";

export default async function Distribuidores() {
  const provincias = await getProvinciasConDistribuidores();

  return (
    <div className="bg-primary-03 h-[calc(100dvh-3.125rem)] relative">
        <div className="grid grid-cols-4 grid-rows-1 h-full relative">
            <DistribuidoresPanel provincias={provincias} />
        </div>
    </div>
  );
}
