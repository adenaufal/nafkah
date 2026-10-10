"use client";

import { useEffect, useState } from "react";
import { loadPersisted, savePersisted } from "./persist";

/**
 * Theme for pages that run without AppProvider (Tentang). Writes the same
 * pair AppProvider would — the paper basemap follows the theme — so the map
 * opens in the theme chosen here.
 */
export function persistTheme(dark: boolean): void {
  const p = loadPersisted();
  const basemap =
    p.basemap === "satellite" || p.basemap === "offline"
      ? p.basemap
      : dark
        ? "dark"
        : "light";
  savePersisted({ darkMode: dark, basemap });
  document.documentElement.classList.toggle("dark", dark);
}

/** Current theme (set before paint by the boot script) plus a setter. */
export function useDocTheme(): [boolean, (dark: boolean) => void] {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  return [
    dark,
    (next: boolean) => {
      persistTheme(next);
      setDark(next);
    },
  ];
}
