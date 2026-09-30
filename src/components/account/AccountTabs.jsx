"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import PerfilSection from "./PerfilSection";
import FavoritosSection from "./FavoritosSection";
import ProyectosSection from "./ProyectosSection";

const TABS = [
  { key: "perfil", label: "Perfil" },
  { key: "favoritos", label: "Favoritos" },
  { key: "proyectos", label: "Proyectos" },
];

const TabBar = ({ activeTab, onSelect }) => (
  <div className="flex w-full relative h-12.5  border-b border-primary-00">
    <div className="w-full"></div>
  <div className="w-full h-full flex items-center justify-center gap-px border-x border-primary-00 bg-primary-00">
    {TABS.map(({ key, label }) => (
      <div key={key} className="w-full h-full flex items-center justify-center bg-primary-03">
      <button
        type="button"
        onClick={() => onSelect(key)}
        className={`btn-sm   border px-1.25 rounded-sm cursor-pointer transition-colors duration-300 ease-in-out ${
          activeTab === key
            ? "border-primary-00"
            : "border-transparent text-primary-00"
        }`}
      >
        {label}
      </button>
      </div>
    ))}
  </div>
  <div className="w-full"></div>
  </div>
);

const AccountTabs = ({ profile, favorites, projects, quoteRequests }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab = TABS.some(({ key }) => key === requestedTab)
    ? requestedTab
    : null;

  const [activeTab, setActiveTab] = useState(initialTab);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!activeTab) {
    return (
      <div className="bg-primary-03 h-[calc(100dvh-4.5rem)] flex flex-col">
        <TabBar activeTab={activeTab} onSelect={setActiveTab} />

        <div className="flex flex-1 relative">
          <div className="w-full h-px bg-primary-01 absolute top-1/2 -translate-y-16.25 z-40"></div>
          <div className="w-full h-px bg-primary-01 absolute bottom-1/2 translate-y-16.25 z-40"></div>
          <div className="w-full h-full relative">
            <div className="grid grid-cols-2 bg-primary-01 gap-x-px w-full h-full relative">
              <div className="h-full w-px bg-primary-01 left-1/2 -translate-x-16.25 z-40 absolute"></div>
              <div className="h-full w-px bg-primary-01 left-1/2 translate-x-16.25 z-40 absolute"></div>
              <div className="h-32.5 w-5 bg-primary-00 left-1/2 top-1/2 -translate-1/2 z-40 absolute"></div>

              <div className="bg-primary-03"></div>
              <div className="bg-primary-03"></div>
              <div className="bg-primary-03"></div>
              <div className="relative bg-primary-03"></div>
            </div>
          </div>
          <div className="bg-primary-03 h-full w-full border-x border-primary-01 flex flex-col items-center justify-center gap-10 relative">
            <p className="hl-lg text-center w-full uppercase absolute top-1/2 left-1/2 -translate-1/2">
              Hola{profile?.full_name ? ` ${profile.full_name}` : ""}
            </p>
            <div className="h-full flex flex-col justify-between items-center pb-21 pt-33">
              <div className="max-w-79 flex flex-col gap-2 text-center">
                <p className="by-sm font-normal! text-secondary-01">
                  Bienvenido/a a la comunidad Fika.{" "}
                </p>
                <p className="by-sm font-normal! text-secondary-01">
                  Ahora podés acceder a beneficios exclusivos, guardar tus
                  productos favoritos y gestionar tus consultas de manera más
                  simple.
                </p>
              </div>
              <Button
                copy="Cerrar sesión"
                variant="tertiary"
                onClick={handleSignOut}
              />
            </div>
          </div>
          <div className="w-full h-full relative">
            <div className="grid grid-cols-2 bg-primary-01 gap-x-px w-full h-full relative">
              <div className="h-full w-px bg-primary-01 left-1/2 -translate-x-16.25 z-40 absolute"></div>
              <div className="h-full w-px bg-primary-01 left-1/2 translate-x-16.25 z-40 absolute"></div>
              <div className="h-32.5 w-5 bg-primary-00 left-1/2 top-1/2 -translate-1/2 z-40 absolute"></div>

              <div className="bg-primary-03"></div>
              <div className="bg-primary-03"></div>
              <div className="bg-primary-03"></div>
              <div className="relative bg-primary-03"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-03 h-[calc(100%-4.5rem)] flex flex-col">
      <TabBar activeTab={activeTab} onSelect={setActiveTab} />

      <div className="flex-1 overflow-y-auto">
        {activeTab === "perfil" && <PerfilSection profile={profile} />}
        {activeTab === "favoritos" && (
          <FavoritosSection favorites={favorites} projects={projects} />
        )}
        {activeTab === "proyectos" && (
          <ProyectosSection projects={projects} quoteRequests={quoteRequests} />
        )}
      </div>
    </div>
  );
};

export default AccountTabs;
