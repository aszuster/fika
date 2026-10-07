"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

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
      <div
        className="col-span-1  h-full min-h-0 overflow-y-auto"
        data-lenis-prevent
      >
        <ul className="hl-md uppercase p-7 flex flex-col gap-1">
          {provincias.map(({ provincia }) => (
            <li key={provincia}>
              <button
                type="button"
                onClick={() => selectProvincia(provincia)}
                aria-pressed={provincia === selected}
                className={`uppercase cursor-pointer ${provincia === selected ? "border rounded-sm py-1.25 px-2.5" : "border border-transparent px-2.5 py-1.25"}`}
              >
                {provincia}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="col-span-1 border-l border-primary-01 h-full min-h-0 overflow-y-auto"
        data-lenis-prevent
      >
        {localidades.length ? (
          <ul className=" flex flex-col">
            {localidades.map(([localidad, distribuidores]) => (
              <li key={localidad}>
                <h3 className="hl-sm uppercase border-b border-primary-01 py-3 pl-10">
                  {localidad}
                </h3>
                <ul className="flex flex-col gap-5 pl-10 py-5 border-b border-primary-01">
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
            ))}
          </ul>
        ) : (
          <p className="py-7 pl-10">No hay distribuidores en esta provincia.</p>
        )}
      </div>
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
