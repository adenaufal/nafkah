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
import type { FeatureCollection, Geometry } from "geojson";

export const MAX_PINS = 5;

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
};

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
  | { type: "view/reset" };

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
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    dispatch({ type: "theme/set", dark: mq.matches });
  }, [loadGeo, loadData]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
