"use client";

import { useEffect, useRef } from "react";
import { DownloadSimple, X } from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import { categoryLabel, useComparison, wageLabel } from "@/state/derived";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { bandTheme } from "@/lib/bands";
import { pct, rp, rpShort, rpSigned } from "@/lib/format";
import { regionLabel } from "@/lib/names";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { wageKind } from "@/lib/wages";
import { BudgetBar } from "@/components/ui";

/** Floating chips for the pinned regions, with the compare action. */
export function CompareTray({
  onOpen,
  hidden = false,
  className = "",
}: {
  onOpen: () => void;
  /** Kept mounted (focus returns here) but out of sight while comparing. */
  hidden?: boolean;
  className?: string;
}) {
  const { state, metrics, regionByCode, unpin, select } = useApp();
  const { items } = useComparison();
  const theme = bandTheme(state.darkMode);
  const canCompare = items.length >= 2;
  return (
    <div
      role="region"
      aria-label="Daerah yang dibandingkan"
      className={`anim-rise flex items-center gap-1.5 rounded-[14px] border border-rule bg-paper p-1.5 shadow-[var(--shadow)] ${hidden ? "invisible" : ""} ${className}`}
    >
      <ul className="thin-scroll flex min-w-0 items-center gap-1 overflow-x-auto">
        {state.pinned.map((code, i) => {
          const m = metrics.get(code);
          const region = regionByCode.get(code);
          const name = region ? regionLabel(region) : code;
          return (
            <li
              key={code}
              className="flex shrink-0 items-center rounded-[10px] bg-paper-2 pl-1"
            >
              <button
                type="button"
                onClick={() => select(code)}
                className="flex items-center gap-1.5 py-1.5 pl-1.5 pr-1 text-[13px] font-medium pointer-coarse:min-h-10"
              >
                <span
                  aria-hidden="true"
                  className="grid h-[18px] w-[18px] place-items-center rounded-full bg-ink text-[10.5px] font-bold text-paper"
                >
                  {i + 1}
                </span>
                {name}
                {m && (
                  <span
                    className="tnum text-[12px] font-semibold"
                    style={{ color: theme[m.band].ink }}
                  >
                    {pct(m.coveragePercent)}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => unpin(code)}
                aria-label={`Keluarkan ${name} dari perbandingan`}
                className="grid h-7 w-7 place-items-center rounded-[8px] text-muted hover:text-ink pointer-coarse:h-10 pointer-coarse:w-10"
              >
                <X size={12} weight="bold" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <button
        id="compare-open"
        type="button"
        onClick={onOpen}
        disabled={!canCompare}
        title={
          canCompare
            ? undefined
            : "Tambahkan satu daerah lagi untuk membandingkan"
        }
        className="h-9 shrink-0 rounded-[10px] bg-ink px-3.5 text-[13px] font-semibold text-paper disabled:bg-paper-3 disabled:text-ink-2 pointer-coarse:h-11"
      >
        {canCompare ? (
          <>
            <span className="max-xl:hidden">Lihat perbandingan</span>
            <span className="xl:hidden" aria-hidden="true">
              Lihat
            </span>
            <span className="sr-only xl:hidden">Lihat perbandingan</span>
          </>
        ) : (
          "+1 daerah lagi"
        )}
      </button>
    </div>
  );
}

/**
 * Side-by-side reading of pinned regions. On desktop it rises over the lower
 * map only (non-modal: the rail and map stay usable); on phones it takes the
 * screen as a dialog.
 */
export function CompareSheet({
  onClose,
  modal,
}: {
  onClose: () => void;
  modal: boolean;
}) {
  const { state, unpin, select } = useApp();
  const { items, exportCsv, exportStatus, summary } = useComparison();
  const heading = useRef<HTMLHeadingElement>(null);
  const dialogRef = useDialogFocus<HTMLElement>(modal, onClose, heading);
  const regionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (modal) return;
    regionRef.current
      ?.querySelector<HTMLElement>("h2")
      ?.focus({ preventScroll: true });
  }, [modal]);
  const theme = bandTheme(state.darkMode);
  // One label for the whole income row. In relocation mode the income is
  // the origin city's; otherwise UMK/UMP can differ per column, so the kind
  // is named only when every region shares it.
  const incomeRowLabel = (() => {
    const first = items[0]?.metric;
    if (!first) return "Pendapatan";
    const a = state.assumptions;
    if (state.originCode) {
      return wageLabel(first, a, wageKind(state.wages.get(state.originCode)));
    }
    const kinds = new Set(items.map((i) => wageKind(state.wages.get(i.code))));
    return kinds.size === 1
      ? wageLabel(first, a, [...kinds][0])
      : wageLabel(first, a)
          .replace(/^UMK/, "Upah minimum")
          .replace("UMK pasangan", "upah minimum pasangan");
  })();
  const firstCol = modal ? 132 : 184;
  const colMin = modal ? 148 : 176;
  const cols = `${firstCol}px repeat(${items.length}, minmax(${colMin}px, 1fr))`;
  const maxByCat = Object.fromEntries(
    EXPENSE_CATEGORIES.map((c) => [
      c.key,
      Math.max(...items.map((i) => i.metric.breakdown[c.key])),
    ]),
  );

  return (
    <section
      ref={(el) => {
        regionRef.current = el;
        dialogRef.current = el;
      }}
      role={modal ? "dialog" : "region"}
      aria-modal={modal || undefined}
      aria-label="Perbandingan daerah"
      className={
        modal
          ? "anim-fade fixed inset-0 z-[60] flex flex-col bg-paper"
          : "anim-rise absolute inset-x-5 bottom-5 z-30 flex max-h-[min(640px,calc(100%-40px))] flex-col overflow-hidden rounded-[16px] border border-rule bg-paper shadow-[var(--shadow-lg)]"
      }
    >
      <header className="flex items-center gap-3 border-b border-rule px-5 py-3 max-md:px-4">
        <div className="min-w-0">
          <h2
            ref={heading}
            tabIndex={-1}
            className="f-display text-[20px] font-[580] leading-tight outline-none"
          >
            Perbandingan {items.length} daerah
          </h2>
          <p className="truncate text-[12.5px] text-muted">Profil: {summary}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] border border-rule-2 px-3 text-[13px] font-semibold hover:border-ink pointer-coarse:h-11 pointer-coarse:min-w-11 max-md:justify-center"
          >
            <DownloadSimple size={15} aria-hidden="true" />
            <span className="max-sm:sr-only">
              {exportStatus === "done" ? "CSV diunduh" : "Ekspor CSV"}
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup perbandingan"
            className="grid h-9 w-9 place-items-center rounded-[10px] hover:bg-paper-2 pointer-coarse:h-11 pointer-coarse:w-11"
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </header>
      {exportStatus === "error" && (
        <p
          role="alert"
          className="border-b border-rule bg-accent-soft px-5 py-2 text-[12.5px]"
        >
          CSV belum bisa disimpan di browser ini. Coba lagi, atau salin tautan
          lewat Bagikan.
        </p>
      )}

      <div className="thin-scroll min-h-0 flex-1 overflow-auto overscroll-contain">
        <div
          className="grid text-[13.5px]"
          style={{
            gridTemplateColumns: cols,
            minWidth: firstCol + items.length * colMin,
          }}
          role="table"
          aria-label="Tabel perbandingan"
        >
          <div role="row" className="contents">
            <div
              role="columnheader"
              className="sticky left-0 z-[1] bg-paper px-5 py-4 max-md:px-3"
            >
              <span className="sr-only">Keterangan</span>
            </div>
            {items.map(({ code, region, metric }) => (
              <div
                role="columnheader"
                key={code}
                className="border-l border-rule px-4 py-4 max-md:px-3"
              >
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      select(code);
                      if (modal) onClose();
                    }}
                    className="min-w-0 flex-1 text-left"
                    title={`${regionLabel(region)}, ${region.province}`}
                  >
                    <span className="f-display line-clamp-2 block break-words text-[18px] font-[580] leading-tight hover:text-accent-ink max-md:text-[16px]">
                      {regionLabel(region)}
                    </span>
                    <span className="block truncate text-[12px] text-muted">
                      {region.province}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => unpin(code)}
                    aria-label={`Keluarkan ${regionLabel(region)} dari perbandingan`}
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] text-muted hover:bg-paper-2 hover:text-ink pointer-coarse:h-10 pointer-coarse:w-10"
                  >
                    <X size={13} weight="bold" aria-hidden="true" />
                  </button>
                </div>
                <p
                  className="f-display tnum mt-3 text-[34px] font-[560] leading-none"
                  style={{ color: theme[metric.band].ink }}
                >
                  {pct(metric.coveragePercent)}
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[12.5px] text-ink-2">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full"
                    style={{ background: theme[metric.band].fill }}
                  />
                  {theme[metric.band].label} ·{" "}
                  <span
                    className={`tnum font-semibold ${metric.surplusOrDeficit >= 0 ? "text-ok" : "text-danger"}`}
                  >
                    {rpSigned(metric.surplusOrDeficit)}
                  </span>
                </p>
                <BudgetBar
                  compact
                  metric={metric}
                  dark={state.darkMode}
                  wageText={rpShort(metric.wageAmount)}
                  rows={EXPENSE_CATEGORIES.map((c) => ({
                    key: c.key,
                    label: categoryLabel(c.key, state.assumptions),
                    value: metric.breakdown[c.key],
                  })).sort((x, y) => y.value - x.value)}
                />
              </div>
            ))}
          </div>
          <Row label={incomeRowLabel}>
            {items.map(({ code, metric }) => (
              <Cell key={code} strong>
                {rp(metric.wageAmount)}
              </Cell>
            ))}
          </Row>
          <Row label="Biaya hidup / bulan">
            {items.map(({ code, metric }) => (
              <Cell key={code} strong>
                {rp(metric.totalMonthlyCost)}
              </Cell>
            ))}
          </Row>
          {EXPENSE_CATEGORIES.map((c) => (
            <Row
              key={c.key}
              label={categoryLabel(c.key, state.assumptions)}
              muted
            >
              {items.map(({ code, metric }) => {
                const v = metric.breakdown[c.key];
                const top = items.length > 1 && v > 0 && v === maxByCat[c.key];
                return (
                  <Cell key={code}>
                    <span
                      className={top ? "font-semibold text-ink" : undefined}
                    >
                      {rp(v)}
                    </span>
                    {top && (
                      <>
                        <span
                          aria-hidden="true"
                          className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle"
                        />
                        <span className="sr-only"> (tertinggi)</span>
                      </>
                    )}
                  </Cell>
                );
              })}
            </Row>
          ))}
        </div>
      </div>
      <footer className="border-t border-rule px-5 py-2.5 text-[12px] text-muted max-md:px-4">
        <span
          aria-hidden="true"
          className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle"
        />{" "}
        biaya tertinggi per kategori. Semua biaya adalah estimasi model; upah
        dari SK resmi 2026.
      </footer>
    </section>
  );
}

function Row({
  label,
  children,
  muted = false,
}: {
  label: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div role="row" className="contents">
      <div
        role="rowheader"
        className={`sticky left-0 z-[1] border-t border-rule bg-paper px-5 py-2 max-md:px-3 max-md:text-[12.5px] ${muted ? "text-ink-2" : "font-semibold"}`}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Cell({
  children,
  strong = false,
}: {
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div
      role="cell"
      className={`tnum border-l border-t border-rule px-4 py-2 text-right max-md:px-3 ${strong ? "font-semibold" : "text-ink-2"}`}
    >
      {children}
    </div>
  );
}
