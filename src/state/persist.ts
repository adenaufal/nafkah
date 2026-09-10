/**
 * Small localStorage layer. Financial inputs stay client-side during ordinary
 * use. They are only encoded into a URL after the user explicitly chooses
 * "Bagikan". Every access is guarded — private windows, cleared storage, or a
 * stricter browser throw, and the app must still render.
 */

import { DEFAULT_ASSUMPTIONS } from "@/lib/calculations";
import type { Assumptions } from "@/lib/types";

const KEY = "nafkah.v1";

/** Batas jumlah anak (AP-03) — clamp di satu tempat agar UI & state sepakat. */
export const MAX_CHILDREN = 5;

export interface Persisted {
  darkMode?: boolean;
  onboarded?: boolean;
  onboardCardDismissed?: boolean;
  assumptions?: Assumptions;
  pinned?: string[];
}

/**
 * Rapikan asumsi yang tersimpan (validasi manual lewat localStorage, bisa
 * berisi apa saja) ke bentuk Assumptions penuh:
 *  - v0.1 → v1.1: profil "Keluarga" lama berarti pasangan + 2 anak, jadi state
 *    lama tanpa `children` dimigrasi ke 2 agar angka v0.1 tidak berubah diam-diam.
 *  - `children` di-clamp ke 0..MAX_CHILDREN.
 *  - `installmentMonthly` hanya berlaku bila angka positif; selain itu null.
 */
export function normalizeAssumptions(
  input: Partial<Assumptions> | null | undefined,
): Assumptions {
  const a: Assumptions = { ...DEFAULT_ASSUMPTIONS, ...(input ?? {}) };
  if (a.householdType === "family" && input?.children === undefined) {
    a.children = 2;
  }
  a.children = Math.min(
    MAX_CHILDREN,
    Math.max(0, Math.floor(Number(a.children) || 0)),
  );
  const installment = Number(a.installmentMonthly);
  a.installmentMonthly =
    Number.isFinite(installment) && installment > 0
      ? Math.floor(installment)
      : null;
  return a;
}

export function loadPersisted(): Persisted {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Persisted;
    return {
      ...parsed,
      assumptions: parsed.assumptions
        ? normalizeAssumptions(parsed.assumptions)
        : undefined,
    };
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
