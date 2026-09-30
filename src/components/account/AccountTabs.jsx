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
      <div className="bg-primary-03 h-[calc(100%-4.5rem)] flex flex-col items-center justify-center gap-10">
        <p className="hl-lg uppercase">
          Hola{profile?.full_name ? ` ${profile.full_name}` : ""}
        </p>
        <div className="flex gap-8">
          {TABS.map(({ key, label }) => (
            <Button
              key={key}
              copy={label}
              variant="secondary"
              onClick={() => setActiveTab(key)}
            />
          ))}
        </div>
        <Button copy="Cerrar sesión" variant="tertiary" onClick={handleSignOut} />
      </div>
    );
  }

  return (
    <div className="bg-primary-03 h-[calc(100%-4.5rem)] flex flex-col">
      <div className="flex h-12.5 shrink-0 border-b border-primary-00 px-7.25">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`btn-sm px-7.25 h-full border-b-2 cursor-pointer transition-colors duration-300 ease-in-out ${
              activeTab === key
                ? "border-primary-00"
                : "border-transparent text-secondary-02"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

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
