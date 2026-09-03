/**
 * Small localStorage layer. Every displayed number stays client-side; the
 * "Pendapatan sendiri" copy promises customIncome never leaves the browser, so
 * these keys live only here. Every access is guarded — private windows, cleared
 * storage, or a stricter browser throw, and the app must still render.
 */

import type { Assumptions } from "@/lib/types";

const KEY = "nafkah.v1";

export interface Persisted {
  darkMode?: boolean;
  onboarded?: boolean;
  onboardCardDismissed?: boolean;
  assumptions?: Assumptions;
  pinned?: string[];
}

export function loadPersisted(): Persisted {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Persisted) : {};
  } catch {
    return {};
  }
}

export function savePersisted(patch: Persisted): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadPersisted();
    window.localStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }));
  } catch {
    /* storage unavailable — degrade silently */
  }
}
