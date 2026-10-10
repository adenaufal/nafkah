import { STORAGE_KEY } from "./persist";

/**
 * Inline <head> script: applies the saved theme before first paint so a
 * returning dark-mode visitor never sees a light flash while the client
 * shell boots. Mirrors AppProvider's rule — a light/dark basemap decides,
 * satellite/offline keep the saved theme, and a first visit follows the OS.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||"{}");var d;if(typeof p.darkMode!=="boolean"){d=matchMedia("(prefers-color-scheme: dark)").matches}else{var b=p.basemap||"light";d=b==="dark"?true:b==="light"?false:p.darkMode}if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;
