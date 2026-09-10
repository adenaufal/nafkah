import { DEFAULT_ASSUMPTIONS } from "@/lib/calculations";
import type {
  AffordabilityBand,
  Assumptions,
  ColorMode,
  HouseholdType,
  HousingType,
  LifestyleLevel,
  TransportMode,
  WageBasis,
} from "@/lib/types";
import { MAX_CHILDREN, normalizeAssumptions } from "./persist";

const SHARE_VERSION = "1";
const MAX_SHARED_REGIONS = 5;
const REGION_CODE = /^\d{2}\.\d{2}$/;

const HOUSEHOLDS: HouseholdType[] = ["single", "couple", "family"];
const LIFESTYLES: LifestyleLevel[] = ["budget", "moderate", "comfortable"];
const HOUSING: HousingType[] = ["room", "studio", "oneBedroom"];
const TRANSPORT: TransportMode[] = [
  "motorcycle",
  "publicTransport",
  "rideHailing",
];
const WAGE_BASIS: WageBasis[] = ["gross", "takeHome"];
const COLOR_MODES: ColorMode[] = ["coverage", "cost", "wage"];
const BANDS: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];

export interface SharedView {
  assumptions: Assumptions;
  pinned: string[];
  selectedCode: string | null;
  colorMode: ColorMode;
  legendFilter: AffordabilityBand | null;
}

function enumValue<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  return value != null && allowed.includes(value as T)
    ? (value as T)
    : fallback;
}

function booleanValue(value: string | null, fallback: boolean): boolean {
  if (value === "1") return true;
  if (value === "0") return false;
  return fallback;
}

function boundedInteger(
  value: string | null,
  min: number,
  max: number,
  fallback: number,
): number {
  if (value == null || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback;
}

function positiveInteger(value: string | null): number | null {
  if (value == null || !/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function regionCodes(value: string | null): string[] {
  if (!value) return [];
  return [...new Set(value.split(",").filter((code) => REGION_CODE.test(code)))].slice(
    0,
    MAX_SHARED_REGIONS,
  );
}

/** Parse a versioned shared view. Unknown or malformed values degrade safely. */
export function decodeSharedView(search: string): SharedView | null {
  const params = new URLSearchParams(search);
  if (params.get("naf") !== SHARE_VERSION) return null;

  const assumptions = normalizeAssumptions({
    ...DEFAULT_ASSUMPTIONS,
    householdType: enumValue(
      params.get("hh"),
      HOUSEHOLDS,
      DEFAULT_ASSUMPTIONS.householdType,
    ),
    children: boundedInteger(
      params.get("kids"),
      0,
      MAX_CHILDREN,
      DEFAULT_ASSUMPTIONS.children,
    ),
    lifestyle: enumValue(
      params.get("life"),
      LIFESTYLES,
      DEFAULT_ASSUMPTIONS.lifestyle,
    ),
    housing: enumValue(
      params.get("home"),
      HOUSING,
      DEFAULT_ASSUMPTIONS.housing,
    ),
    transport: enumValue(
      params.get("transport"),
      TRANSPORT,
      DEFAULT_ASSUMPTIONS.transport,
    ),
    includeSavings: booleanValue(
      params.get("savings"),
      DEFAULT_ASSUMPTIONS.includeSavings,
    ),
    wageBasis: enumValue(
      params.get("wage"),
      WAGE_BASIS,
      DEFAULT_ASSUMPTIONS.wageBasis,
    ),
    dualIncome: booleanValue(
      params.get("dual"),
      DEFAULT_ASSUMPTIONS.dualIncome,
    ),
    customIncome: positiveInteger(params.get("income")),
    installmentMonthly: positiveInteger(params.get("installment")),
  });
  const selected = params.get("f");

  return {
    assumptions,
    pinned: regionCodes(params.get("r")),
    selectedCode: selected && REGION_CODE.test(selected) ? selected : null,
    colorMode: enumValue(
      params.get("color"),
      COLOR_MODES,
      "coverage",
    ),
    legendFilter: enumValue<AffordabilityBand | "">(
      params.get("band"),
      BANDS,
      "",
    ) || null,
  };
}

/** Create a canonical share URL containing only state understood by Nafkah. */
export function buildShareUrl(baseUrl: string, view: SharedView): string {
  const url = new URL(baseUrl);
  url.search = "";

  const { assumptions: a } = view;
  url.searchParams.set("naf", SHARE_VERSION);
  if (view.pinned.length > 0)
    url.searchParams.set("r", regionCodes(view.pinned.join(",")).join(","));
  if (view.selectedCode && REGION_CODE.test(view.selectedCode))
    url.searchParams.set("f", view.selectedCode);
  url.searchParams.set("hh", a.householdType);
  url.searchParams.set("kids", String(a.children));
  url.searchParams.set("life", a.lifestyle);
  url.searchParams.set("home", a.housing);
  url.searchParams.set("transport", a.transport);
  url.searchParams.set("savings", a.includeSavings ? "1" : "0");
  url.searchParams.set("wage", a.wageBasis);
  url.searchParams.set("dual", a.dualIncome ? "1" : "0");
  if (a.customIncome != null && a.customIncome > 0)
    url.searchParams.set("income", String(Math.floor(a.customIncome)));
  if (a.installmentMonthly != null && a.installmentMonthly > 0)
    url.searchParams.set("installment", String(Math.floor(a.installmentMonthly)));
  url.searchParams.set("color", view.colorMode);
  if (view.legendFilter) url.searchParams.set("band", view.legendFilter);

  return url.toString();
}
