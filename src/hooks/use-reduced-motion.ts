import { useSyncExternalStore } from "react";

const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
const getSnapshot = () => preference.matches;
const subscribe = (onChange: () => void) => {
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
};

// Keep video and scroll motion in sync when the visitor changes their OS preference.
export const useReducedMotion = () => useSyncExternalStore(subscribe, getSnapshot);
