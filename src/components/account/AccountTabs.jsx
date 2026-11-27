"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "motion/react";
import Button from "@/components/buttons/Button";
import { createClient } from "@/utils/supabase/client";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import TabBar from "./TabBar";
import PerfilSection from "./PerfilSection";
import FavoritosSection from "./FavoritosSection";
import ProyectosSection from "./ProyectosSection";
import CuentaIntro from "./CuentaIntro";

const TABS = [
  { key: "perfil", label: "Perfil" },
  { key: "favoritos", label: "Favoritos" },
  { key: "proyectos", label: "Proyectos" },
];

const INTRO_SEEN_KEY = "fika-cuenta-intro-visto";
// Momento (ms desde que se entra) en que arranca cada fase de la intro.
const INTRO_PHASE_2_AT = 2000;
const INTRO_PHASE_3_AT = 4700;

const subscribeNoop = () => () => {};
// Mientras no se sepa (servidor e hidratación) es null: en mobile se tapa la
// vista para que no se vea la pantalla final un instante antes de la intro.
const getPlayIntroServer = () => null;
const getPlayIntro = () =>
  !sessionStorage.getItem(INTRO_SEEN_KEY) &&
  window.matchMedia("(max-width: 1023.98px)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const AccountTabs = ({
  profile,
  favorites,
  projects,
  quoteRequests,
  catalog,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  // La URL es la fuente de verdad: así un link a /mi-cuenta?tab=... funciona
  // aunque ya estemos dentro de "Mi cuenta" (la página no se vuelve a montar).
  const activeTab = TABS.some(({ key }) => key === requestedTab)
    ? requestedTab
    : null;

  // pushState actualiza la URL (y useSearchParams) sin volver a pedir los
  // datos al servidor, a diferencia de router.push.
  const setActiveTab = (key) => {
    window.history.pushState(null, "", `?tab=${key}`);
  };

  // Intro de 3 partes (solo mobile, la primera vez en la sesión).
  const playIntro = useSyncExternalStore(
    subscribeNoop,
    getPlayIntro,
    getPlayIntroServer,
  );
  const [introPhase, setIntroPhase] = useState(1);
  const isIntroRunning = !activeTab && playIntro && introPhase < 3;

  useEffect(() => {
    if (activeTab || !playIntro) return;
    const timers = [
      setTimeout(() => setIntroPhase(2), INTRO_PHASE_2_AT),
      setTimeout(() => setIntroPhase(3), INTRO_PHASE_3_AT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [activeTab, playIntro]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!activeTab) {
    return (
      <div className="bg-primary-03 h-[calc(100dvh-3.125rem)] flex flex-col">
        {/* Durante la intro la barra no se ve (solo mobile); aparece con
            fundido en la última pantalla. */}
        <div
          className={`transition-opacity duration-600 ease-in-out ${
            playIntro === null || isIntroRunning
              ? "max-lg:opacity-0 max-lg:pointer-events-none"
              : ""
          }`}
        >
          <TabBar
            tabs={TABS}
            activeTab={activeTab}
            onSelect={setActiveTab}
            mobileLabel="Mi cuenta"
          />
        </div>

        <div className="flex flex-1 relative">
          {/* En mobile el centro se calcula contando la barra de "Mi cuenta"
              (25px = la mitad de su alto), para que quede centrado en la
              pantalla. En desktop, el centro de esta zona. */}
          <div className="w-full h-px bg-primary-01 absolute top-[calc(50%-1.5625rem)] lg:top-1/2 -translate-y-20 lg:-translate-y-16.25 z-40"></div>
          <div className="w-full h-px bg-primary-01 absolute bottom-[calc(50%+1.5625rem)] lg:bottom-1/2 translate-y-20 lg:translate-y-16.25 z-40"></div>
          {/* Mobile: solo la columna del medio, a todo el ancho y del alto
              de la pantalla (sin scroll). Desktop: con las grillas a los lados. */}
          <div className="hidden lg:block w-full h-full relative">
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

          <div className="bg-primary-03 h-full w-full lg:border-x border-primary-01 flex flex-col items-center justify-center gap-10 relative">
            {/* Mobile: grilla de 4 (2 columnas, 2 filas) con la cruz al medio,
                en el espacio de arriba hasta la primera línea (50% - 25px de
                la barra - 80px de la línea = 6.5625rem). */}
            <div
              aria-hidden="true"
              className="lg:hidden absolute inset-x-0 top-0 h-[calc(50%-6.5625rem)]"
            >
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-primary-01" />
              <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary-01" />
              <Image
                src="/img/cross.svg"
                width={24}
                height={24}
                alt=""
                className="absolute top-1/2 left-1/2 -translate-1/2"
              />
            </div>
            <p className="hidden lg:block hl-lg text-center w-full uppercase px-5 absolute top-1/2 left-1/2 -translate-1/2">
              Hola{profile?.full_name ? ` ${profile.full_name}` : ""}
            </p>
            <div className="h-full flex flex-col justify-end lg:justify-between items-center px-5 pt-12 pb-12 lg:px-0 lg:pb-21 lg:pt-33">
              <div className="w-[calc(100%-2.5rem)] max-w-60 flex flex-col gap-2 text-center absolute top-[calc(50%-1.5625rem)] left-1/2 -translate-1/2 lg:static lg:w-auto lg:translate-none">
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

          {/* Intro (solo mobile). Al terminar se marca como vista en la
              sesión para no repetirla. */}
          {playIntro === null && (
            <div className="lg:hidden absolute inset-x-0 -top-12.5 bottom-0 z-40 bg-primary-03" />
          )}
          <AnimatePresence
            onExitComplete={() => sessionStorage.setItem(INTRO_SEEN_KEY, "1")}
          >
            {isIntroRunning && (
              <CuentaIntro phase={introPhase} name={profile?.full_name} />
            )}
          </AnimatePresence>
          <div className="hidden lg:block w-full h-full relative">
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
    // Alto fijo de la pantalla (menos el navbar): así scrollea solo el
    // ScrollArea de adentro y no la página entera.
    <div className="bg-primary-03 h-[calc(100dvh-3.125rem)] flex flex-col">
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onSelect={setActiveTab}
        mobileLabel="Mi cuenta"
      />

      {/* Instancia propia de Lenis: el mismo scroll suave que el resto del sitio.
          Los paneles que se abren encima llevan data-lenis-prevent para que la
          rueda sobre ellos no mueva esta lista. */}
      <ScrollArea className="flex-1" lenisOptions={{ orientation: "vertical" }}>
        {activeTab === "perfil" && <PerfilSection profile={profile} />}
        {activeTab === "favoritos" && (
          <FavoritosSection
            favorites={favorites}
            projects={projects}
            catalog={catalog}
          />
        )}
        {activeTab === "proyectos" && (
          <ProyectosSection
            projects={projects}
            quoteRequests={quoteRequests}
            catalog={catalog}
          />
        )}
      </ScrollArea>
    </div>
  );
};

export default AccountTabs;
