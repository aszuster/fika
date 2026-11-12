import { useSyncExternalStore } from "react";

// Si el intro está en pantalla. Lo que corre detrás (el scroll del catálogo, el
// modal de registro) lo consulta para esperar a que termine.
let isPlaying = false;
const listeners = new Set();

export const setIntroPlaying = (value) => {
  isPlaying = value;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const useIntroPlaying = () =>
  useSyncExternalStore(
    subscribe,
    () => isPlaying,
    () => false,
  );
