"use client";
import { useSyncExternalStore } from "react";

// Mismo corte que el breakpoint `lg` de Tailwind (globals.css): por debajo es mobile.
export const MOBILE_QUERY = "(max-width: 1023.98px)";

const subscribe = (callback) => {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

const getSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;

// En el servidor no hay pantalla: se asume desktop y se corrige al hidratar.
const getServerSnapshot = () => false;

const useIsMobile = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useIsMobile;
