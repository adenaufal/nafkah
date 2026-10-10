"use client";

import { bandTheme } from "@/lib/bands";
import { digits, pct, rp } from "@/lib/format";
import type { ExpenseCategoryKey, RegionMetrics } from "@/lib/types";
import type { BreakdownRow } from "@/state/derived";

/**
 * The month as a receipt: income on top, every estimated cost line below,
 * and what is left (or missing) at the bottom — the format people already
 * use to judge a month. Lines hover-link to the budget bar above.
 */
export function Receipt({
  metric,
  rows,
  incomeLabel,
  incomeNote,
  medians,
  dark,
  highlight,
  onHighlight,
}: {
  metric: RegionMetrics;
  rows: BreakdownRow[];
  incomeLabel: string;
  /** e.g. the destination's own UMK when another income is used. */
  incomeNote?: string;
  medians: Record<ExpenseCategoryKey, number> | null;
  dark: boolean;
  highlight: string | null;
  onHighlight: (key: string | null) => void;
}) {
  const theme = bandTheme(dark)[metric.band];
  const surplus = metric.surplusOrDeficit >= 0;
  return (
    <figure aria-labelledby="receipt-title" className="relative">
      <div className="rounded-t-[14px] bg-paper-2 px-5 pb-5 pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <p
            id="receipt-title"
            className="f-mono text-[11px] uppercase tracking-[0.16em] text-muted"
          >
            Struk bulanan
          </p>
          <p className="f-mono text-[11px] text-muted">rupiah / bulan</p>
        </div>

        <Rule />
        <Heading>Pemasukan</Heading>
        <Line label={incomeLabel} value={digits(metric.wageAmount)} strong />
        {incomeNote && (
          <p className="f-mono -mt-0.5 text-[11px] text-muted">{incomeNote}</p>
        )}

        <Rule />
        <Heading>Pengeluaran · estimasi</Heading>
        <ul className="mt-1" onMouseLeave={() => onHighlight(null)}>
          {rows.map((r) => {
            const mid = medians?.[r.key];
            const ratio = mid ? r.value / mid - 1 : null;
            return (
              <li
                key={r.key}
                onMouseEnter={() => onHighlight(r.key)}
                title={
                  mid
                    ? `Median nasional: ${rp(mid)} (${ratio! >= 0 ? "+" : "−"}${pct(Math.abs(ratio! * 100))})`
                    : undefined
                }
                className={`-mx-2 rounded-[6px] px-2 transition-colors ${highlight === r.key ? "bg-paper" : ""}`}
              >
                <Line
                  label={r.label}
                  value={digits(r.value)}
                  aside={pct(r.share * 100)}
                />
              </li>
            );
          })}
        </ul>

        <Rule />
        <Line
          label="Total pengeluaran"
          value={digits(metric.totalMonthlyCost)}
          strong
        />
        <div className="my-3 h-[3px] border-y border-ink" aria-hidden="true" />
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-muted">
              {surplus ? "Sisa" : "Kurang"}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-2">
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: theme.fill }}
              />
              {theme.label} · tertutup {pct(metric.coveragePercent)}
            </p>
          </div>
          <p
            className={`f-mono tnum text-[28px] font-bold leading-none tracking-[-0.03em] ${surplus ? "text-ok" : "text-danger"}`}
          >
            {surplus ? "+" : "−"}
            {digits(metric.surplusOrDeficit)}
          </p>
        </div>
      </div>
      <div className="receipt-edge" aria-hidden="true" />
    </figure>
  );
}

function Rule() {
  return (
    <div
      className="my-3 border-t border-dashed border-rule-2"
      aria-hidden="true"
    />
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
      {children}
    </p>
  );
}

function Line({
  label,
  value,
  aside,
  strong = false,
}: {
  label: string;
  value: string;
  aside?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2 py-[3px]">
      <span
        className={`min-w-0 truncate text-[13.5px] ${strong ? "font-bold text-ink" : "text-ink-2"}`}
      >
        {label}
      </span>
      <span
        aria-hidden="true"
        className="mb-[3px] min-w-4 flex-1 border-b border-dotted border-rule-2"
      />
      <span
        className={`f-mono tnum shrink-0 text-[13px] ${strong ? "font-bold" : ""}`}
      >
        {value}
      </span>
      {/* Always present so every figure lines up in one column. */}
      <span className="tnum w-9 shrink-0 text-right text-[11.5px] text-muted">
        {aside}
      </span>
    </div>
  );
}
