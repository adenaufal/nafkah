"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useApp } from "@/state/AppContext";
import { AppIcon } from "./icons";

interface SearchItem {
  code: string;
  name: string;
  province: string;
  hasData: boolean;
}

/**
 * Type-ahead over region names and provinces with a full keyboard path:
 * type → ArrowDown/Up → Enter (fly + open detail) → Escape.
 */
export function SearchBox() {
  const { state, metricsReady, select, pin } = useApp();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: SearchItem[] = useMemo(() => {
    const feats = state.geometry?.features ?? [];
    return feats.map((f) => ({
      code: f.properties.kode,
      name: f.properties.name,
      province: f.properties.province,
      hasData: metricsReady && state.costs.has(f.properties.kode),
    }));
  }, [state.geometry, state.costs, metricsReady]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.province.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [items, query]);

  const choose = useCallback(
    (item: SearchItem) => {
      select(item.code);
      setQuery("");
      setOpen(false);
    },
    [select],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      return;
    }
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active] ?? results[0];
      if (item) choose(item);
    }
  };

  const empty = query.trim() !== "" && results.length === 0;

  return (
    <div
      className="relative"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-owns="search-listbox"
    >
      <label htmlFor="region-search" className="sr-only">
        Cari kabupaten/kota atau provinsi
      </label>
      <AppIcon
        name="magnifyingGlass"
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        id="region-search"
        ref={inputRef}
        type="search"
        autoComplete="off"
        value={query}
        placeholder={
          state.geometry ? "Cari wilayah atau provinsi…" : "Memuat wilayah…"
        }
        disabled={!state.geometry}
        aria-autocomplete="list"
        aria-controls="search-listbox"
        aria-activedescendant={
          open && results[active]
            ? `search-opt-${results[active].code}`
            : undefined
        }
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm shadow-sm placeholder:text-muted focus:border-accent"
      />

      {open && (results.length > 0 || empty) && (
        <ul
          id="search-listbox"
          role="listbox"
          className="absolute z-30 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card text-sm shadow-lg"
        >
          {empty ? (
            <li role="status" className="px-3 py-2.5 text-muted">
              Tidak ada wilayah yang cocok dengan “{query}”.
            </li>
          ) : (
            results.map((item, i) => (
              <li
                key={item.code}
                role="option"
                id={`search-opt-${item.code}`}
                aria-selected={i === active}
              >
                <div
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(item);
                  }}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left ${
                    i === active ? "bg-accent-soft" : ""
                  }`}
                >
                  <AppIcon name="mapPin" size={16} className="shrink-0 text-muted" />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="min-w-0 flex-1 text-left"
                    aria-label={`Buka detail ${item.name}`}
                  >
                    <span className="block truncate font-medium">
                      {item.name}
                    </span>
                    <span className="block text-xs text-muted">
                      {item.province} · {item.code}
                      {!item.hasData && " · belum ada data"}
                    </span>
                  </button>
                  {item.hasData && (
                    <button
                      type="button"
                      tabIndex={-1}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        pin(item.code);
                      }}
                      aria-label={`Sematkan ${item.name} ke baki perbandingan`}
                      className="inline-flex shrink-0 items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[11px] text-muted hover:border-accent hover:text-accent"
                    >
                      <AppIcon name="pushPin" size={13} />
                      Pin
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
