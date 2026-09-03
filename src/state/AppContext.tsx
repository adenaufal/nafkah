"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  AffordabilityBand,
  Assumptions,
  BasemapId,
  ColorMode,
  CostProfile,
  LoadStatus,
  RegionFeatureProps,
  RegionMetrics,
  WageRecord,
} from "@/lib/types";
import {
  AFFORDABILITY_BANDS,
  computeAllMetrics,
  DEFAULT_ASSUMPTIONS,
} from "@/lib/calculations";
import { REGIONS } from "@/data/regions";
import { loadGeometry, loadRecords } from "@/data/loader";
import { loadPersisted, savePersisted } from "./persist";
import type { FeatureCollection, Geometry } from "geojson";

export const MAX_PINS = 5;

/**
 * tourIdx models the guided onboarding: null = off, -1 = opening card,
 * 0..steps-1 = spotlight steps, and `steps` (== length) = closing card.
 */
interface AppState {
  geometryStatus: LoadStatus;
  geometryError: string | null;
  geometry: FeatureCollection<Geometry, RegionFeatureProps> | null;
  dataStatus: LoadStatus;
  dataError: string | null;
  wages: Map<string, WageRecord>;
  costs: Map<string, CostProfile>;
  assumptions: Assumptions;
  pinned: string[];
  pinMessage: string | null;
  selectedCode: string | null;
  colorMode: ColorMode;
  legendFilter: AffordabilityBand | null;
  basemap: BasemapId;
  basemapUserSet: boolean;
  darkMode: boolean;
  /** Bumped when the map should refit to Indonesia. */
  resetViewToken: number;
  // Overlays (single-owner so header, mobile tab bar and about all agree).
  asumsiOpen: boolean;
  aboutOpen: boolean;
  // Onboarding.
  tourIdx: number | null;
  onboarded: boolean;
  onboardCardOpen: boolean;
}

const initialState: AppState = {
  geometryStatus: "idle",
  geometryError: null,
  geometry: null,
  dataStatus: "idle",
  dataError: null,
  wages: new Map(),
  costs: new Map(),
  assumptions: DEFAULT_ASSUMPTIONS,
  pinned: [],
  pinMessage: null,
  selectedCode: null,
  colorMode: "coverage",
  legendFilter: null,
  basemap: "light",
  basemapUserSet: false,
  darkMode: false,
  resetViewToken: 0,
  asumsiOpen: false,
  aboutOpen: false,
  tourIdx: null,
  onboarded: false,
  onboardCardOpen: true,
};

/** Client-only: pull persisted preferences over the static defaults. */
function initState(base: AppState): AppState {
  const p = loadPersisted();
  const onboarded = p.onboarded ?? false;
  return {
    ...base,
    darkMode: p.darkMode ?? base.darkMode,
    assumptions: p.assumptions ?? base.assumptions,
    pinned: p.pinned ?? base.pinned,
    onboarded,
    onboardCardOpen: !p.onboardCardDismissed,
    // First visit opens the guide; returning visitors land straight on the map.
    tourIdx: onboarded ? null : -1,
  };
}

type Action =
  | { type: "geometry/loading" }
  | { type: "geometry/ready"; geometry: AppState["geometry"] }
  | { type: "geometry/error"; message: string }
  | { type: "data/loading" }
  | {
      type: "data/ready";
      wages: Map<string, WageRecord>;
      costs: Map<string, CostProfile>;
    }
  | { type: "data/error"; message: string }
  | { type: "assumptions/set"; assumptions: Assumptions }
  | { type: "assumptions/reset" }
  | { type: "pin/add"; code: string }
  | { type: "pin/remove"; code: string }
  | { type: "pin/clearMessage" }
  | { type: "select"; code: string | null }
  | { type: "colorMode/set"; mode: ColorMode }
  | { type: "legendFilter/set"; band: AffordabilityBand | null }
  | { type: "basemap/set"; basemap: BasemapId }
  | { type: "theme/set"; dark: boolean }
  | { type: "view/reset" }
  | { type: "overlay/asumsi"; open: boolean }
  | { type: "overlay/about"; open: boolean }
  | { type: "tour/set"; idx: number | null }
  | { type: "onboardCard/set"; open: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "geometry/loading":
      return { ...state, geometryStatus: "loading", geometryError: null };
    case "geometry/ready":
      return { ...state, geometryStatus: "ready", geometry: action.geometry };
    case "geometry/error":
      return {
        ...state,
        geometryStatus: "error",
        geometryError: action.message,
      };
    case "data/loading":
      return { ...state, dataStatus: "loading", dataError: null };
    case "data/ready":
      return {
        ...state,
        dataStatus: "ready",
        wages: action.wages,
        costs: action.costs,
      };
    case "data/error":
      return { ...state, dataStatus: "error", dataError: action.message };
    case "assumptions/set":
      return { ...state, assumptions: action.assumptions };
    case "assumptions/reset":
      return { ...state, assumptions: DEFAULT_ASSUMPTIONS };
    case "pin/add": {
      if (state.pinned.includes(action.code)) {
        return { ...state, pinMessage: "Wilayah ini sudah disematkan." };
      }
      if (state.pinned.length >= MAX_PINS) {
        return {
          ...state,
          pinMessage: `Baki perbandingan maksimal ${MAX_PINS} wilayah — hapus satu dulu.`,
        };
      }
      if (!state.costs.has(action.code)) {
        return {
          ...state,
          pinMessage:
            "Wilayah ini belum punya data biaya, jadi tidak bisa disematkan.",
        };
      }
      return {
        ...state,
        pinned: [...state.pinned, action.code],
        pinMessage: null,
      };
    }
    case "pin/remove":
      return {
        ...state,
        pinned: state.pinned.filter((c) => c !== action.code),
      };
    case "pin/clearMessage":
      return { ...state, pinMessage: null };
    case "select":
      return { ...state, selectedCode: action.code };
    case "colorMode/set":
      return { ...state, colorMode: action.mode };
    case "legendFilter/set":
      return { ...state, legendFilter: action.band };
    case "basemap/set":
      return { ...state, basemap: action.basemap, basemapUserSet: true };
    case "theme/set": {
      // Basemap follows the UI theme unless the user overrode it explicitly.
      const basemap = state.basemapUserSet
        ? state.basemap
        : action.dark
          ? ("dark" as const)
          : ("light" as const);
      return { ...state, darkMode: action.dark, basemap };
    }
    case "view/reset":
      return { ...state, resetViewToken: state.resetViewToken + 1 };
    case "overlay/asumsi":
      // Opening one drawer closes the other and any mobile sheet owner reacts.
      return {
        ...state,
        asumsiOpen: action.open,
        aboutOpen: action.open ? false : state.aboutOpen,
      };
    case "overlay/about":
      return {
        ...state,
        aboutOpen: action.open,
        asumsiOpen: action.open ? false : state.asumsiOpen,
      };
    case "tour/set": {
      // Leaving the intro means the user has seen onboarding at least once.
      const onboarded = action.idx === null || action.idx >= 0;
      return {
        ...state,
        tourIdx: action.idx,
        onboarded: state.onboarded || onboarded,
        // The tour never drives app state — it only highlights — so close any
        // open drawer/sheet when a run starts to avoid covering its targets.
        asumsiOpen: action.idx !== null ? false : state.asumsiOpen,
        aboutOpen: action.idx !== null ? false : state.aboutOpen,
      };
    }
    case "onboardCard/set":
      return { ...state, onboardCardOpen: action.open };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  metrics: Map<string, RegionMetrics>;
  metricsReady: boolean;
  setAssumptions: (a: Assumptions) => void;
  resetAssumptions: () => void;
  pin: (code: string) => void;
  unpin: (code: string) => void;
  select: (code: string | null) => void;
  setColorMode: (m: ColorMode) => void;
  setLegendFilter: (b: AffordabilityBand | null) => void;
  setBasemap: (b: BasemapId) => void;
  setDarkMode: (d: boolean) => void;
  resetView: () => void;
  retryGeometry: () => void;
  retryData: () => void;
  setAsumsiOpen: (open: boolean) => void;
  setAboutOpen: (open: boolean) => void;
  /** Open the guide at the intro card (? Panduan, About "replay"). */
  openGuide: () => void;
  /** Jump straight into the highlighted steps ("Tunjukkan caranya"). */
  beginTourSteps: () => void;
  setTourIdx: (idx: number | null) => void;
  setOnboardCard: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, initState);

  const loadGeo = useCallback(async () => {
    dispatch({ type: "geometry/loading" });
    try {
      const geometry = await loadGeometry();
      dispatch({ type: "geometry/ready", geometry });
    } catch (e) {
      dispatch({
        type: "geometry/error",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }, []);

  const loadData = useCallback(async () => {
    dispatch({ type: "data/loading" });
    try {
      const { wages, costs } = await loadRecords();
      dispatch({ type: "data/ready", wages, costs });
    } catch (e) {
      dispatch({
        type: "data/error",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  }, []);

  useEffect(() => {
    void loadGeo();
    void loadData();
    // Respect a saved theme; otherwise follow the OS preference on first visit.
    if (loadPersisted().darkMode == null) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      dispatch({ type: "theme/set", dark: mq.matches });
    }
  }, [loadGeo, loadData]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  // Persist preferences (client-only; guarded inside savePersisted).
  useEffect(() => savePersisted({ darkMode: state.darkMode }), [state.darkMode]);
  useEffect(
    () => savePersisted({ assumptions: state.assumptions }),
    [state.assumptions],
  );
  useEffect(() => savePersisted({ pinned: state.pinned }), [state.pinned]);
  useEffect(
    () => savePersisted({ onboarded: state.onboarded }),
    [state.onboarded],
  );
  useEffect(
    () => savePersisted({ onboardCardDismissed: !state.onboardCardOpen }),
    [state.onboardCardOpen],
  );

  // Auto-dismiss pin refusal messages.
  useEffect(() => {
    if (!state.pinMessage) return;
    const t = setTimeout(() => dispatch({ type: "pin/clearMessage" }), 4000);
    return () => clearTimeout(t);
  }, [state.pinMessage]);

  const codes = useMemo(() => REGIONS.map((r) => r.code), []);
  const metrics = useMemo(
    () =>
      computeAllMetrics(
        codes,
        state.wages,
        state.costs,
        state.assumptions,
        AFFORDABILITY_BANDS,
      ),
    [codes, state.wages, state.costs, state.assumptions],
  );
  const metricsReady = state.dataStatus === "ready";

  const value: AppContextValue = {
    state,
    metrics,
    metricsReady,
    setAssumptions: (a) =>
      dispatch({ type: "assumptions/set", assumptions: a }),
    resetAssumptions: () => dispatch({ type: "assumptions/reset" }),
    pin: (code) => dispatch({ type: "pin/add", code }),
    unpin: (code) => dispatch({ type: "pin/remove", code }),
    select: (code) => dispatch({ type: "select", code }),
    setColorMode: (mode) => dispatch({ type: "colorMode/set", mode }),
    setLegendFilter: (band) => dispatch({ type: "legendFilter/set", band }),
    setBasemap: (basemap) => dispatch({ type: "basemap/set", basemap }),
    setDarkMode: (dark) => dispatch({ type: "theme/set", dark }),
    resetView: () => dispatch({ type: "view/reset" }),
    retryGeometry: () => void loadGeo(),
    retryData: () => void loadData(),
    setAsumsiOpen: (open) => dispatch({ type: "overlay/asumsi", open }),
    setAboutOpen: (open) => dispatch({ type: "overlay/about", open }),
    openGuide: () => dispatch({ type: "tour/set", idx: -1 }),
    beginTourSteps: () => dispatch({ type: "tour/set", idx: 0 }),
    setTourIdx: (idx) => dispatch({ type: "tour/set", idx }),
    setOnboardCard: (open) => dispatch({ type: "onboardCard/set", open }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
