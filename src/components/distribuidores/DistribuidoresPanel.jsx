"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ScrollArea from "@/components/scrollbar/ScrollArea";

const DistribuidoresMap = dynamic(() => import("./DistribuidoresMap"), {
  ssr: false,
});

export default function DistribuidoresPanel({ provincias }) {
  const [selected, setSelected] = useState(provincias[0]?.provincia);
  const [activeId, setActiveId] = useState(null);
  const actual = provincias.find((p) => p.provincia === selected);

  const localidades = Object.entries(
    Object.groupBy(actual?.distribuidores ?? [], (d) => d.localidad),
  ).sort(([a], [b]) => a.localeCompare(b, "es"));

  const selectProvincia = (provincia, id = null) => {
    setSelected(provincia);
    setActiveId(id);
  };

  return (
    <>
      <ScrollArea className="col-span-1 h-full">
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
      <ScrollArea className="col-span-1 border-l border-primary-01 h-full">
        {localidades.length ? (
          <ul className=" flex flex-col">
            {localidades.map(([localidad, distribuidores], index) => {
              const isActive = distribuidores.some((d) => d.id === activeId);
              const isLast = index === localidades.length - 1;
              return (
              <li key={localidad}>
                <h3
                  className={`hl-sm uppercase py-3 px-10 border-b ${index > 0 ? "border-t" : ""} ${
                    isActive ? "border-primary-00" : "border-primary-01"
                  }`}
                >
                  <span
                    className={`inline-block border rounded-sm px-2.5 py-0.5 -mx-2.5 -my-0.5 ${
                      isActive
                        ? "border-primary-00"
                        : "border-transparent"
                    }`}
                  >
                    {localidad}
                  </span>
                </h3>
                <ul
                  className={`flex flex-col gap-5 px-10 py-5 ${
                    isLast ? "border-b border-primary-01" : ""
                  }`}
                >
                  {distribuidores.map((d) => (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(d.id)}
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
                      <p className="by-sm">{d.telefono}</p>
                      {d.instagram ? <a target="_blank" href={`http://www.instagram.com/${d.instagram}`}><p className="by-sm">@{d.instagram}</p></a> : <></>}
                      {d.website ? <a target="_blank" href={`http://${d.website}`}><p className="by-sm">{d.website}</p></a> : <></>}

                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-7 px-10">No hay distribuidores en esta provincia.</p>
        )}
      </ScrollArea>
      <div className="col-span-2 h-full">
        <DistribuidoresMap
          provincias={provincias}
          provincia={actual}
          activeId={activeId}
          onSelect={selectProvincia}
        />
      </div>
    </>
  );
}
