"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppProvider, useApp } from "@/state/AppContext";
import { useComparison } from "@/state/derived";
import { geometryBounds, mergeBounds } from "@/lib/geo";
import { regionTitle } from "@/lib/names";
import { CompareSheet, CompareTray } from "./compare/Compare";
import { useGlobalKeys, useMediaQuery } from "./hooks";
import type { MapApi } from "./map/AtlasMap";
import {
  MapControls,
  MapKey,
  MapStatus,
  MapTooltip,
  MethodChip,
} from "./map/MapOverlays";
import { Masthead } from "./Masthead";
import { MobileSheet, type Snap } from "./MobileSheet";
import { NationalStory } from "./rail/NationalStory";
import { ProfileEditor } from "./rail/ProfileEditor";
import { RegionStory } from "./rail/RegionStory";
import { SearchSheet, type SearchHandle } from "./search/RegionSearch";

// MapLibre must never run during SSR.
const AtlasMap = dynamic(() => import("./map/AtlasMap"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center bg-paper-2 text-sm text-muted">
      Memuat peta…
    </div>
  ),
});

type View = "national" | "region" | "profile";

/**
 * Atlas: the rail tells the story (national answer → region story → profile)
 * and the map beside it is the evidence — nothing ever covers the map with a
 * scrim. On phones the rail rides in a bottom sheet over a full-bleed map.
 */
function Shell() {
  const { state, select } = useApp();
  // Layout follows the shape of the screen, not only its width:
  //  - a side rail on landscape tablets and desktops, and on short landscape
  //    screens (a phone turned sideways), where a bottom sheet would leave
  //    no map at all;
  //  - a bottom sheet over a full-width map on phones and portrait tablets,
  //    where a side rail would squeeze the map into a tall, narrow strip.
  const desktop = useMediaQuery("(min-width: 1024px)");
  const shortLandscape = useMediaQuery(
    "(orientation: landscape) and (max-height: 560px) and (min-width: 600px)",
  );
  const wide = desktop || shortLandscape;
  // The full header (search field, Metode, Tentang) fits from tablet width.
  const roomyHeader = useMediaQuery("(min-width: 768px)");
  // Hover cards and outlines only for a real pointer: on touch a tap would
  // leave them stuck over the map.
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  // Below this the map column is too narrow for the docked comparison.
  const large = useMediaQuery("(min-width: 1280px)");
  const [profileOpen, setProfileOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mapHover, setMapHover] = useState<{
    code: string;
    x: number;
    y: number;
  } | null>(null);
  const [listHover, setListHover] = useState<string | null>(null);
  const [provinceHover, setProvinceHover] = useState<string[] | null>(null);
  const [api, setApi] = useState<MapApi | null>(null);
  const [snap, setSnap] = useState<Snap>("half");
  const [sheetHeight, setSheetHeight] = useState(0);
  const search = useRef<SearchHandle>(null);
  const railScroll = useRef<HTMLDivElement>(null);
  const comparison = useComparison();

  const view: View = profileOpen
    ? "profile"
    : state.selectedCode
      ? "region"
      : "national";
  const viewKey = view === "region" ? `r-${state.selectedCode}` : view;

  // After a view change the user asked for, focus the new view's heading so
  // keyboard and screen-reader users land in it (the button they pressed is
  // gone). A change from a map click — a pointer user still looking at the
  // map — or one restored on load moves nothing.
  const fromMap = useRef(false);
  const firstView = useRef(true);
  const selectFromMap = useCallback(
    (code: string | null) => {
      if (code !== state.selectedCode) fromMap.current = true;
      select(code);
    },
    [select, state.selectedCode],
  );
  useEffect(() => {
    railScroll.current?.scrollTo({ top: 0 });
    // A hovered row from the previous view would otherwise stay outlined.
    setListHover(null);
    const quiet = firstView.current || fromMap.current;
    firstView.current = false;
    fromMap.current = false;
    if (quiet) return;
    const frame = requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>('#ringkasan h1[tabindex="-1"]')
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [viewKey]);

  // The desktop comparison is not a dialog, so hand focus back to the tray
  // ourselves when it closes (dialogs restore focus on their own).
  const compareWasOpen = useRef(false);
  useEffect(() => {
    const active = document.activeElement;
    if (
      compareWasOpen.current &&
      !compareOpen &&
      (!active || active === document.body)
    ) {
      document.getElementById("compare-open")?.focus({ preventScroll: true });
    }
    compareWasOpen.current = compareOpen;
  }, [compareOpen]);

  // Phones: a selection lifts the sheet out of its peek height.
  useEffect(() => {
    if (!wide && state.selectedCode)
      setSnap((s) => (s === "peek" ? "half" : s));
  }, [state.selectedCode, wide]);

  // The tab title follows the story, for history and bookmarks.
  const region = state.selectedCode
    ? state.regions.find((r) => r.code === state.selectedCode)
    : undefined;
  useEffect(() => {
    document.title = region
      ? `${regionTitle(region)} — Nafkah`
      : "Nafkah — Peta Kecukupan Gaji vs Biaya Hidup 514 Kabupaten/Kota Indonesia";
  }, [region]);

  useGlobalKeys({
    onSearch: () =>
      roomyHeader ? search.current?.focus() : setSearchOpen(true),
    onEscape: () => {
      if (searchOpen) return;
      if (compareOpen) setCompareOpen(false);
      else if (profileOpen) setProfileOpen(false);
      else if (state.selectedCode) select(null);
    },
  });

  // Hovering a province pushes every other region to the background.
  const dimCodes = useMemo(() => {
    if (!provinceHover) return null;
    const keep = new Set(provinceHover);
    return new Set(
      state.regions.map((r) => r.code).filter((c) => !keep.has(c)),
    );
  }, [provinceHover, state.regions]);

  const zoomTo = (codes: string[]) => {
    const keep = new Set(codes);
    const bounds = mergeBounds(
      (state.geometry?.features ?? [])
        .filter((f) => keep.has(f.properties.kode))
        .map((f) => geometryBounds(f.geometry)),
    );
    if (bounds) api?.fitBounds(bounds);
    if (!wide) setSnap("peek");
  };

  const goHome = () => {
    setProfileOpen(false);
    setCompareOpen(false);
    select(null);
    api?.fitIndonesia();
  };

  const railLabel =
    view === "region"
      ? "Cerita daerah"
      : view === "profile"
        ? "Profil rumah tangga"
        : "Ringkasan nasional";

  const rail = (
    <main
      id="ringkasan"
      key={viewKey}
      aria-label={railLabel}
      className="rail-pad"
      style={
        {
          "--rail-px": wide ? (desktop ? "2rem" : "1.25rem") : "1.25rem",
          "--rail-pt": wide ? (desktop ? "1.75rem" : "1rem") : "0.5rem",
        } as React.CSSProperties
      }
    >
      {view === "profile" ? (
        <ProfileEditor onBack={() => setProfileOpen(false)} />
      ) : view === "region" && state.selectedCode ? (
        <RegionStory
          code={state.selectedCode}
          onBack={() => select(null)}
          onEditProfile={() => setProfileOpen(true)}
          onHover={setListHover}
        />
      ) : (
        <NationalStory
          hoverCode={listHover}
          onHover={setListHover}
          onEditProfile={() => setProfileOpen(true)}
          onProvinceHover={setProvinceHover}
          onProvinceZoom={zoomTo}
        />
      )}
    </main>
  );

  const map = (
    <AtlasMap
      hoverCode={listHover ?? mapHover?.code ?? null}
      onHover={wide && finePointer ? setMapHover : undefined}
      onSelect={selectFromMap}
      dimUnselected
      dimCodes={dimCodes}
      onReady={setApi}
      // The control column sits on the right in both layouts; on phones the
      // sheet covers the bottom.
      padding={
        wide
          ? { bottom: compareOpen ? 380 : 0, right: 52 }
          : { bottom: sheetHeight, right: 52 }
      }
      markers={state.pinned.map((code, i) => ({ code, label: String(i + 1) }))}
    />
  );

  const pinToast = state.pinMessage && (
    <p
      role="alert"
      className="anim-fade absolute left-1/2 top-4 z-30 w-max max-w-[calc(100%-24px)] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-[13px] font-medium text-paper shadow-[var(--shadow)]"
    >
      {state.pinMessage}
    </p>
  );

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <a
        href="#ringkasan"
        className="sr-only z-50 rounded-[8px] bg-ink px-3 py-2 text-[13px] font-semibold text-paper focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
      >
        Langsung ke ringkasan
      </a>
      <Masthead
        wide={roomyHeader}
        searchRef={search}
        onOpenSearch={() => setSearchOpen(true)}
        onPicked={() => setProfileOpen(false)}
        onHome={goHome}
      />

      {wide ? (
        <div className="flex min-h-0 flex-1">
          <div
            ref={railScroll}
            className="thin-scroll relative z-10 min-h-0 w-[340px] shrink-0 overflow-y-auto border-r border-rule bg-paper lg:w-[400px] xl:w-[452px]"
          >
            {rail}
          </div>
          <section
            aria-label="Peta"
            className="relative min-h-0 flex-1 bg-paper-2"
          >
            {map}
            {mapHover && <MapTooltip hover={mapHover} />}
            <MapStatus />
            {/* On a short sideways phone the map is small: keep it clear. */}
            {desktop && view !== "national" && <MapKey />}
            {/* Touch pinches to zoom; on a sideways phone the +/− pair would
                take most of the map's height. */}
            <MapControls
              api={api}
              showZoom={desktop || finePointer}
              className="bottom-9 right-3"
            />
            {desktop && <MethodChip className="bottom-3 left-3" />}
            {state.pinned.length > 0 && (
              <CompareTray
                onOpen={() => setCompareOpen(true)}
                hidden={compareOpen}
                className="absolute bottom-12 left-1/2 z-20 max-w-[calc(100%-140px)] -translate-x-1/2"
              />
            )}
            {compareOpen && comparison.items.length >= 2 && (
              <CompareSheet
                modal={!large}
                onClose={() => setCompareOpen(false)}
              />
            )}
            {pinToast}
          </section>
        </div>
      ) : (
        <div className="phone-map relative min-h-0 flex-1 bg-paper-2">
          <section aria-label="Peta" className="absolute inset-0">
            {map}
          </section>
          <MapStatus />
          <MapControls
            api={api}
            showZoom={false}
            className="right-3 bottom-[calc(var(--sheet-h,50%)+12px)]"
          />
          {state.pinned.length > 0 && (
            // Stays mounted under the dialog so focus can return to it.
            <CompareTray
              onOpen={() => setCompareOpen(true)}
              hidden={compareOpen}
              className="absolute bottom-[calc(var(--sheet-h,50%)+12px)] left-3 z-10 max-w-[calc(100%-72px)]"
            />
          )}
          {pinToast}
          <MobileSheet
            snap={snap}
            onSnap={setSnap}
            onSettledHeight={setSheetHeight}
            label={railLabel}
            scrollRef={railScroll}
          >
            {rail}
          </MobileSheet>
          {compareOpen && comparison.items.length >= 2 && (
            <CompareSheet modal onClose={() => setCompareOpen(false)} />
          )}
          {searchOpen && (
            <SearchSheet
              onClose={() => setSearchOpen(false)}
              onPicked={() => {
                setSearchOpen(false);
                setProfileOpen(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function AppShell() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
