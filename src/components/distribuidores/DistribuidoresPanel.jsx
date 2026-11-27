"use client";

import { useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import ScrollArea from "@/components/scrollbar/ScrollArea";
import Select from "@/components/forms/Select";
import TabBar from "@/components/account/TabBar";
import Chevron from "@/svg/Chevron";

const DistribuidoresMap = dynamic(() => import("./DistribuidoresMap"), {
  ssr: false,
});

const INTRO_TEXT =
  "FIKA cuenta con una red de distribuidores que garantiza asesoramiento y disponibilidad en cada región. Encontrá el más cercano y empezá tu proyecto.";

const MOBILE_TABS = [
  { key: "lista", label: "Lista" },
  { key: "mapa", label: "Mapa" },
];

// Solo se monta el mapa de la vista visible (mobile o desktop): así no se
// cargan dos mapas. En el servidor todavía no se sabe (null) y no se monta
// ninguno (el mapa igual es solo de cliente).
const DESKTOP_QUERY = "(min-width: 1024px)";
const subscribeDesktop = (callback) => {
  const media = window.matchMedia(DESKTOP_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};
const getIsDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;
const getIsDesktopServer = () => null;

// Lista de distribuidores de una provincia, agrupados por localidad. La usan
// la vista desktop y las dos pestañas de mobile.
const DistribuidoresList = ({ localidades, activeId, onSelect }) =>
  localidades.length ? (
    <ul className=" flex flex-col">
      {localidades.map(([localidad, distribuidores], index) => {
        const isActive = distribuidores.some((d) => d.id === activeId);
        const isLast = index === localidades.length - 1;
        return (
          <li key={localidad}>
            <h3
              className={`hl-sm uppercase py-3 px-5 lg:px-10 border-b ${index > 0 ? "border-t" : ""} ${
                isActive ? "border-primary-00" : "border-primary-01"
              }`}
            >
              <span
                className={`inline-block border rounded-sm px-2.5 py-0.5 -mx-2.5 -my-0.5 ${
                  isActive ? "border-primary-00" : "border-transparent"
                }`}
              >
                {localidad}
              </span>
            </h3>
            <ul
              className={`flex flex-col gap-5 px-5 lg:px-10 py-5 ${
                isLast ? "border-b border-primary-01" : ""
              }`}
            >
              {distribuidores.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(d.id)}
                    aria-pressed={d.id === activeId}
                    className="text-left cursor-pointer relative flex items-center gap-1.5"
                  >
                    <span
                      aria-hidden
                      className={`size-4 shrink-0 rounded-full border flex items-center justify-center ${d.id === activeId ? "bg-primary-00" : "bg-primary-03"}`}
                    >
                      <span
                        className={`size-1 rounded-full ${d.id === activeId ? "bg-primary-03" : "bg-primary-00"}`}
                      />
                    </span>
                    <p className="uppercase hl-xs pt-0.5">{d.nombre}</p>
                  </button>
                  <div className="flex flex-col gap-1 pt-1">
                    <p className="by-sm">{d.direccion}</p>
                    {d.telefono ? <p className="by-sm">{d.telefono}</p> : <></>}
                    {d.instagram ? (
                      <a
                        target="_blank"
                        href={`http://www.instagram.com/${d.instagram}`}
                      >
                        <p className="by-sm">@{d.instagram}</p>
                      </a>
                    ) : (
                      <></>
                    )}
                    {/* En el Studio se puede cargar con o sin https://. */}
                    {d.website ? (
                      <a
                        target="_blank"
                        href={
                          /^https?:\/\//.test(d.website)
                            ? d.website
                            : `https://${d.website}`
                        }
                      >
                        <p className="by-sm">
                          {d.website
                            .replace(/^https?:\/\//, "")
                            .replace(/\/$/, "")}
                        </p>
                      </a>
                    ) : (
                      <></>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="py-7 px-5 lg:px-10">No hay distribuidores en esta provincia.</p>
  );

export default function DistribuidoresPanel({ provincias }) {
  const [selected, setSelected] = useState(provincias[0]?.provincia);
  const [activeId, setActiveId] = useState(null);
  // Mobile: primero la lista de provincias; al elegir una, su pantalla con
  // las pestañas Lista / Mapa.
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("lista");
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getIsDesktop,
    getIsDesktopServer,
  );
  const actual = provincias.find((p) => p.provincia === selected);

  const localidades = Object.entries(
    Object.groupBy(actual?.distribuidores ?? [], (d) => d.localidad),
  ).sort(([a], [b]) => a.localeCompare(b, "es"));

  const selectProvincia = (provincia, id = null) => {
    setSelected(provincia);
    setActiveId(id);
  };

  const openMobileProvincia = (provincia) => {
    selectProvincia(provincia);
    setMobileTab("lista");
    setIsMobileOpen(true);
  };

  const map = (
    <DistribuidoresMap
      provincias={provincias}
      provincia={actual}
      activeId={activeId}
      onSelect={selectProvincia}
    />
  );

  return (
    <>
      {/* ---------- Mobile ---------- */}
      <div className="lg:hidden h-full flex flex-col">
        {!isMobileOpen ? (
          <ScrollArea className="h-full" viewportClassName="flex flex-col">
            <div className="shrink-0 px-5 py-12 border-b border-primary-01 flex justify-center">
              <p className="by-sm font-normal! text-secondary-01 text-center max-w-73.25">
                {INTRO_TEXT}
              </p>
            </div>
            <ul className="flex flex-col">
              {provincias.map(({ provincia }) => (
                <li key={provincia} className="border-b border-primary-01">
                  <button
                    type="button"
                    onClick={() => openMobileProvincia(provincia)}
                    className="w-full h-12.5 px-5 flex items-center justify-between gap-4 hl-sm text-[25px]! uppercase text-left cursor-pointer"
                  >
                    {provincia}
         
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <>
            <div className="h-12.5 shrink-0 border-b border-primary-00 flex items-center">
              <Select
                value={selected}
                onChange={(provincia) => selectProvincia(provincia)}
                options={provincias.map(({ provincia }) => provincia)}
                // Provincias: font mono a 25px, en la barra y en la lista.
                className="h-full px-5 font-mono font-light text-[1.5625rem] leading-8 uppercase"
                optionClassName="font-mono! font-light! text-[1.5625rem]! leading-8! uppercase px-5!"
              />
            </div>
            <TabBar
              tabs={MOBILE_TABS}
              activeTab={mobileTab}
              onSelect={setMobileTab}
              fullWidth={false}
              className="border-x-0!"
            />
            {mobileTab === "mapa" && (
              <div className="h-[45%] shrink-0 border-b border-primary-00">
                {isDesktop === false && map}
              </div>
            )}
            <ScrollArea className="flex-1">
              <DistribuidoresList
                localidades={localidades}
                activeId={activeId}
                onSelect={setActiveId}
              />
            </ScrollArea>
          </>
        )}
      </div>

      {/* ---------- Desktop ---------- */}
      <ScrollArea className="hidden lg:block col-span-1 h-full">
        <ul className="hl-md uppercase p-7 flex flex-col gap-1 ">
          {provincias.map(({ provincia }) => (
            <li key={provincia}>
              <button
                type="button"
                onClick={() => selectProvincia(provincia)}
                aria-pressed={provincia === selected}
                className={`uppercase cursor-pointer text-left ${provincia === selected ? "border rounded-sm py-1.25 px-2.5" : "border border-transparent px-2.5 py-1.25"}`}
              >
                {provincia}
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <ScrollArea className="hidden lg:block col-span-1 border-l border-primary-01 h-full">
        <DistribuidoresList
          localidades={localidades}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </ScrollArea>
      <div className="hidden lg:block col-span-2 h-full">
        {isDesktop === true && map}
      </div>
    </>
  );
}
