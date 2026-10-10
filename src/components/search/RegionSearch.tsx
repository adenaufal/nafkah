"use client";

import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Crosshair,
  MagnifyingGlass,
  SpinnerGap,
  X,
} from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import { bandTheme } from "@/lib/bands";
import { pct } from "@/lib/format";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { useRegionSearch, type SearchHit } from "./useRegionSearch";
import { useLocateRegion } from "./useLocateRegion";

export interface SearchHandle {
  focus: () => void;
}

/**
 * Masthead type-ahead (desktop): type → ↑/↓ → Enter opens the region story.
 * With an empty query the list offers "Daerah di lokasiku".
 */
export const SearchBar = forwardRef<
  SearchHandle,
  { onPicked?: (code: string) => void }
>(function SearchBar({ onPicked }, ref) {
  const { state, select } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  useImperativeHandle(ref, () => ({ focus: () => input.current?.focus() }), []);
  const hits = useRegionSearch(q, 7);

  const choose = (code: string) => {
    select(code);
    setQ("");
    setOpen(false);
    input.current?.blur();
    onPicked?.(code);
  };
  const locator = useLocateRegion(choose);
  const empty = q.trim() === "";
  // Option 0 is the locate action while the query is empty.
  const count = empty ? 1 : hits.length;
  const showList = open && (empty ? state.geometryStatus === "ready" : true);

  return (
    <div className="relative w-[min(380px,32vw)]">
      <label htmlFor={`${listId}-input`} className="sr-only">
        Cari kabupaten/kota atau provinsi
      </label>
      <MagnifyingGlass
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        ref={input}
        id={`${listId}-input`}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList ? `${listId}-${active}` : undefined}
        autoComplete="off"
        value={q}
        disabled={state.regions.length === 0}
        placeholder={
          state.regions.length
            ? "Cari kabupaten/kota…"
            : "Memuat daftar daerah…"
        }
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(0);
          locator.clear();
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((i) => Math.min(i + 1, count - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if (e.key === "Enter") {
            e.preventDefault();
            if (empty) locator.locate();
            else if (hits[active]) choose(hits[active].code);
          } else if (e.key === "Escape") {
            e.preventDefault();
            setQ("");
            input.current?.blur();
          }
        }}
        className="h-10 w-full rounded-full border border-field bg-paper-2 pl-9 pr-12 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus:bg-paper disabled:opacity-60"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-[5px] border border-rule bg-paper px-1.5 text-[11px] font-medium text-muted">
        /
      </kbd>
      {showList && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Hasil pencarian"
          className="anim-fade absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[12px] border border-rule bg-paper py-1 shadow-[var(--shadow)]"
        >
          {empty ? (
            <LocateOption
              id={`${listId}-0`}
              active={active === 0}
              status={locator.status}
              message={locator.message}
              onChoose={locator.locate}
            />
          ) : hits.length === 0 ? (
            <li
              role="presentation"
              className="px-4 py-3 text-[13.5px] text-muted"
            >
              Tidak ada daerah yang cocok dengan “{q.trim()}”.
            </li>
          ) : (
            hits.map((h, i) => (
              <HitRow
                key={h.code}
                id={`${listId}-${i}`}
                hit={h}
                active={i === active}
                onHover={() => setActive(i)}
                onChoose={() => choose(h.code)}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
});

function HitRow({
  id,
  hit,
  active,
  onHover,
  onChoose,
}: {
  id: string;
  hit: SearchHit;
  active: boolean;
  onHover: () => void;
  onChoose: () => void;
}) {
  const { state, metrics, metricsReady } = useApp();
  const m = metricsReady ? metrics.get(hit.code) : undefined;
  const theme = bandTheme(state.darkMode);
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onMouseDown={(e) => {
        e.preventDefault();
        onChoose();
      }}
      onMouseEnter={onHover}
      className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${active ? "bg-paper-2" : ""}`}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium">
          {hit.label}
        </span>
        <span className="block truncate text-[12px] text-muted">
          {hit.province}
        </span>
      </span>
      {m && (
        <span className="tnum flex items-center gap-1.5 text-[13px] font-semibold">
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full"
            style={{ background: theme[m.band].fill }}
          />
          {pct(m.coveragePercent)}
        </span>
      )}
    </li>
  );
}

function LocateOption({
  id,
  active,
  status,
  message,
  onChoose,
}: {
  id: string;
  active: boolean;
  status: ReturnType<typeof useLocateRegion>["status"];
  message: string | null;
  onChoose: () => void;
}) {
  return (
    <li
      id={id}
      role="option"
      aria-selected={active}
      onMouseDown={(e) => {
        e.preventDefault();
        onChoose();
      }}
      className={`flex cursor-pointer items-start gap-3 px-4 py-2.5 ${active ? "bg-paper-2" : ""}`}
    >
      <span className="mt-0.5 text-accent-ink">
        {status === "locating" ? (
          <SpinnerGap size={16} className="animate-spin" aria-hidden="true" />
        ) : (
          <Crosshair size={16} weight="bold" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold">
          {status === "locating" ? "Mencari lokasimu…" : "Daerah di lokasiku"}
        </span>
        <span
          className={`block text-[12px] leading-[1.45] ${status === "error" ? "text-danger" : "text-muted"}`}
          role={status === "error" ? "alert" : undefined}
        >
          {message ?? "Lokasi hanya dipakai di perangkatmu, tidak disimpan."}
        </span>
      </span>
    </li>
  );
}

/**
 * Full-screen search for phones: the field is always visible, results fill
 * the screen, and the locate action sits on top.
 */
export function SearchSheet({
  onClose,
  onPicked,
}: {
  onClose: () => void;
  onPicked: (code: string) => void;
}) {
  const { state, select } = useApp();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(true, onClose, input);
  const hits = useRegionSearch(q, 12);
  const choose = (code: string) => {
    select(code);
    onPicked(code);
  };
  const locator = useLocateRegion(choose);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cari daerah"
      className="anim-fade fixed inset-0 z-[60] flex flex-col bg-paper"
    >
      <div className="flex items-center gap-2 border-b border-rule px-2 py-2">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup pencarian"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink-2 hover:bg-paper-2"
        >
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
        </button>
        <label htmlFor="sheet-search" className="sr-only">
          Cari kabupaten/kota atau provinsi
        </label>
        <input
          ref={input}
          id="sheet-search"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            locator.clear();
          }}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || !hits[0]) return;
            // Without this the trailing keypress lands on the restored opener
            // (the masthead search button) and reopens the sheet.
            e.preventDefault();
            choose(hits[0].code);
          }}
          placeholder={
            state.regions.length
              ? "Cari kabupaten/kota…"
              : "Memuat daftar daerah…"
          }
          disabled={state.regions.length === 0}
          className="h-11 min-w-0 flex-1 rounded-full border border-field bg-paper-2 px-4 text-[16px] text-ink outline-none placeholder:text-muted focus:border-ink"
        />
        {q && (
          <button
            type="button"
            onClick={() => {
              setQ("");
              input.current?.focus();
            }}
            aria-label="Kosongkan pencarian"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-muted hover:bg-paper-2 hover:text-ink"
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="thin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {q.trim() === "" ? (
          <div className="p-2">
            <button
              type="button"
              onClick={locator.locate}
              disabled={state.geometryStatus !== "ready"}
              className="flex w-full items-start gap-3 rounded-[12px] px-3 py-3 text-left hover:bg-paper-2 disabled:opacity-50"
            >
              <span className="mt-0.5 text-accent-ink">
                {locator.status === "locating" ? (
                  <SpinnerGap
                    size={18}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  <Crosshair size={18} weight="bold" aria-hidden="true" />
                )}
              </span>
              <span>
                <span className="block text-[15px] font-semibold">
                  {locator.status === "locating"
                    ? "Mencari lokasimu…"
                    : "Daerah di lokasiku"}
                </span>
                <span
                  role={locator.status === "error" ? "alert" : undefined}
                  className={`block text-[13px] leading-[1.45] ${locator.status === "error" ? "text-danger" : "text-muted"}`}
                >
                  {locator.message ??
                    "Lokasi hanya dipakai di perangkatmu, tidak disimpan."}
                </span>
              </span>
            </button>
            <p className="px-3 pt-4 text-[13px] leading-[1.55] text-muted">
              Ketik nama kota, kabupaten, atau provinsi. “Kab. Bandung” dan
              “Kota Bandung” adalah dua daerah berbeda.
            </p>
          </div>
        ) : hits.length === 0 ? (
          <p role="status" className="p-5 text-[14px] text-muted">
            Tidak ada daerah yang cocok dengan “{q.trim()}”.
          </p>
        ) : (
          <ul aria-label="Hasil pencarian" className="p-1">
            {hits.map((h) => (
              <SheetHit key={h.code} hit={h} onChoose={() => choose(h.code)} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SheetHit({ hit, onChoose }: { hit: SearchHit; onChoose: () => void }) {
  const { state, metrics, metricsReady } = useApp();
  const m = metricsReady ? metrics.get(hit.code) : undefined;
  const theme = bandTheme(state.darkMode);
  return (
    <li>
      <button
        type="button"
        onClick={onChoose}
        className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-left hover:bg-paper-2"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-medium">
            {hit.label}
          </span>
          <span className="block truncate text-[12.5px] text-muted">
            {hit.province}
          </span>
        </span>
        {m && (
          <span className="tnum flex items-center gap-1.5 text-[14px] font-semibold">
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: theme[m.band].fill }}
            />
            {pct(m.coveragePercent)}
          </span>
        )}
      </button>
    </li>
  );
}
