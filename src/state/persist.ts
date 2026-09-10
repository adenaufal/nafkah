/**
 * Small localStorage layer. Financial inputs stay client-side during ordinary
 * use. They are only encoded into a URL after the user explicitly chooses
 * "Bagikan". Every access is guarded — private windows, cleared storage, or a
 * stricter browser throw, and the app must still render.
 */

import { DEFAULT_ASSUMPTIONS } from "@/lib/calculations";
import type {
  AffordabilityBand,
  Assumptions,
  BasemapId,
  ColorMode,
} from "@/lib/types";

const KEY = "nafkah.v1";

/** Batas jumlah anak (AP-03) — clamp di satu tempat agar UI & state sepakat. */
export const MAX_CHILDREN = 5;

export interface Persisted {
  darkMode?: boolean;
  onboarded?: boolean;
  onboardCardDismissed?: boolean;
  assumptions?: Assumptions;
  pinned?: string[];
  selectedCode?: string | null;
  originCode?: string | null;
  colorMode?: ColorMode;
  legendFilter?: AffordabilityBand | null;
  basemap?: BasemapId;
}

const REGION_CODE = /^\d{2}\.\d{2}$/;
const MAX_PERSISTED_PINS = 5;
const HOUSEHOLDS = ["single", "couple", "family"] as const;
const LIFESTYLES = ["budget", "moderate", "comfortable"] as const;
const HOUSING = ["room", "studio", "oneBedroom"] as const;
const TRANSPORT = ["motorcycle", "publicTransport", "rideHailing"] as const;
const WAGE_BASES = ["gross", "takeHome"] as const;
const COLOR_MODES: ColorMode[] = ["coverage", "cost", "wage"];
const BANDS: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];
const BASEMAPS: BasemapId[] = ["light", "dark", "satellite", "offline"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function optionalRegionCode(value: unknown): string | null | undefined {
  if (value === null) return null;
  return typeof value === "string" && REGION_CODE.test(value) ? value : undefined;
}

function optionalEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | undefined {
  return typeof value === "string" && allowed.includes(value as T)
    ? (value as T)
    : undefined;
}

function boundedChildren(value: unknown, fallback: number): number {
  // State written by the app is numeric. Ignore strings and other edited
  // values rather than letting Number("...") smuggle malformed state into
  // the calculation core.
  const numeric = value === null ? 0 : value;
  if (typeof numeric !== "number" || !Number.isFinite(numeric)) return fallback;
  return Math.min(MAX_CHILDREN, Math.max(0, Math.floor(numeric)));
}

function positiveMoney(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const amount = Math.floor(value);
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
}

/**
 * Treat localStorage as untrusted input. Invalid preferences are discarded so
 * a hand-edited or stale value cannot poison the map state on the next visit.
 */
export function normalizePersisted(input: unknown): Persisted {
  if (!isRecord(input)) return {};

  const out: Persisted = {};
  const darkMode = optionalBoolean(input.darkMode);
  const onboarded = optionalBoolean(input.onboarded);
  const onboardCardDismissed = optionalBoolean(input.onboardCardDismissed);
  if (darkMode !== undefined) out.darkMode = darkMode;
  if (onboarded !== undefined) out.onboarded = onboarded;
  if (onboardCardDismissed !== undefined)
    out.onboardCardDismissed = onboardCardDismissed;

  if (isRecord(input.assumptions)) {
    out.assumptions = normalizeAssumptions(input.assumptions as Partial<Assumptions>);
  }

  if (Array.isArray(input.pinned)) {
    out.pinned = [
      ...new Set(
        input.pinned.filter(
          (code): code is string =>
            typeof code === "string" && REGION_CODE.test(code),
        ),
      ),
    ].slice(0, MAX_PERSISTED_PINS);
  }

  const selectedCode = optionalRegionCode(input.selectedCode);
  const originCode = optionalRegionCode(input.originCode);
  if (selectedCode !== undefined) out.selectedCode = selectedCode;
  if (originCode !== undefined) out.originCode = originCode;

  const colorMode = optionalEnum(input.colorMode, COLOR_MODES);
  const legendFilter =
    input.legendFilter === null
      ? null
      : optionalEnum(input.legendFilter, BANDS);
  const basemap = optionalEnum(input.basemap, BASEMAPS);
  if (colorMode !== undefined) out.colorMode = colorMode;
  if (legendFilter !== undefined) out.legendFilter = legendFilter;
  if (basemap !== undefined) out.basemap = basemap;

  return out;
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
  const raw = isRecord(input) ? input : {};
  const householdType =
    optionalEnum(raw.householdType, HOUSEHOLDS) ??
    DEFAULT_ASSUMPTIONS.householdType;
  const childrenInput =
    raw.children === undefined && householdType === "family"
      ? 2
      : raw.children;

  return {
    householdType,
    children: boundedChildren(
      childrenInput,
      DEFAULT_ASSUMPTIONS.children,
    ),
    lifestyle:
      optionalEnum(raw.lifestyle, LIFESTYLES) ?? DEFAULT_ASSUMPTIONS.lifestyle,
    housing:
      optionalEnum(raw.housing, HOUSING) ?? DEFAULT_ASSUMPTIONS.housing,
    transport:
      optionalEnum(raw.transport, TRANSPORT) ?? DEFAULT_ASSUMPTIONS.transport,
    includeSavings:
      typeof raw.includeSavings === "boolean"
        ? raw.includeSavings
        : DEFAULT_ASSUMPTIONS.includeSavings,
    wageBasis:
      optionalEnum(raw.wageBasis, WAGE_BASES) ?? DEFAULT_ASSUMPTIONS.wageBasis,
    dualIncome:
      typeof raw.dualIncome === "boolean"
        ? raw.dualIncome
        : DEFAULT_ASSUMPTIONS.dualIncome,
    customIncome:
      raw.customIncome === undefined
        ? DEFAULT_ASSUMPTIONS.customIncome
        : positiveMoney(raw.customIncome),
    installmentMonthly:
      raw.installmentMonthly === undefined
        ? DEFAULT_ASSUMPTIONS.installmentMonthly
        : positiveMoney(raw.installmentMonthly),
  };
}

export function loadPersisted(): Persisted {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return normalizePersisted(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function savePersisted(patch: Persisted): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadPersisted();
    window.localStorage.setItem(
      KEY,
      JSON.stringify(normalizePersisted({ ...current, ...patch })),
    );
  } catch {
    /* storage unavailable — degrade silently */
  }
}
