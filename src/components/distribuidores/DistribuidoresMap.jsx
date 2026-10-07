"use client";

import { useEffect, useRef } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import { getVersion, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

setWorkerUrl(
  `https://unpkg.com/maplibre-gl@${getVersion()}/dist/maplibre-gl-worker.mjs`,
);

const MAPTILER_STYLE = "01a11721-a9d1-7229-8e6e-c49425feb72f";
const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
const mapStyle = key
  ? `https://api.maptiler.com/maps/${MAPTILER_STYLE}/style.json?key=${key}`
  : "https://demotiles.maplibre.org/style.json";

export default function DistribuidoresMap({
  provincias,
  provincia,
  activeId,
  onSelect,
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !provincia) return;
    const active = provincia.distribuidores.find((d) => d.id === activeId);
    if (active) {
      map.flyTo({
        center: active.coords,
        zoom: Math.max(provincia.zoom, 13),
        duration: 1200,
      });
    } else {
      map.flyTo({
        center: provincia.centro,
        zoom: provincia.zoom,
        duration: 1200,
      });
    }
  }, [provincia, activeId]);

  return (
    <Map
      ref={mapRef}
      mapStyle={mapStyle}
      initialViewState={{
        longitude: provincia?.centro[0] ?? -64,
        latitude: provincia?.centro[1] ?? -38,
        zoom: provincia?.zoom ?? 3.5,
      }}
      style={{ width: "100%", height: "100%" }}
      attributionControl={{ compact: true }}
    >
      <NavigationControl position="top-right" showCompass={false} />

      {provincias.flatMap((p) =>
        p.distribuidores.map((d) => {
          const isActive = d.id === activeId;
          return (
            <Marker
              key={d.id}
              longitude={d.coords[0]}
              latitude={d.coords[1]}
              anchor="center"
              className="relative"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                onSelect(p.provincia, d.id);
              }}
            >
              <button type="button" aria-label={d.nombre}>
                <span
                  aria-hidden
                  className={`size-11.25 shrink-0 rounded-full border flex items-center justify-center ${isActive ? "bg-primary-00" : "bg-transparent"}`}
                >
                  <span
                    className={`size-2 rounded-full ${isActive ? "bg-primary-03" : "bg-primary-00"}`}
                  />
                </span>
              </button>
              {/* {isActive ? 
              <div className="absolute top-0 left-0 w-5 h-5 bg-amber-50"></div> : <></>} */}
            </Marker>
          );
        }),
      )}
    </Map>
  );
}
