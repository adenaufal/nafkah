"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "@/state/AppContext";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { REGION_BY_CODE } from "@/data/regions";
import { BAND_LABEL } from "@/lib/calculations";
import { formatIDR, formatIDRCompact, formatPct } from "@/lib/format";
import type { ExpenseCategoryKey, RegionMetrics } from "@/lib/types";

/**
 * Baki perbandingan wilayah tersemat + panel perbandingan berdampingan.
 * Baki bersama: pin dari peta, pencarian, atau baki semuanya masuk ke reducer
 * yang sama.
 */

export function PinnedTray() {
  const { state, unpin, select } = useApp();

  return (
    <div className="w-full">
      {state.pinMessage && (
        <p
          role="alert"
          className="mb-2 rounded-lg border border-amber-500/40 bg-card px-3 py-2 text-xs font-medium text-amber-700 shadow-md dark:text-amber-400"
        >
          {state.pinMessage}
        </p>
      )}
      {state.pinned.length > 0 && (
        <section
          aria-label="Wilayah yang disematkan untuk perbandingan"
          className="overflow-hidden rounded-xl border border-border bg-card/95 shadow-md backdrop-blur"
        >
          <header className="flex items-center justify-between border-b border-border px-3 py-2">
            <h2 className="text-xs font-semibold">Wilayah disematkan</h2>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
              {state.pinned.length}/5
            </span>
          </header>
          <ul className="grid gap-1.5 p-2">
            {state.pinned.map((code) => {
              const region = REGION_BY_CODE.get(code);
              const name = region?.name ?? code;
              return (
                <li
                  key={code}
                  className="flex min-w-0 items-center gap-1 rounded-lg border border-border bg-surface pl-2.5 text-xs font-medium"
                >
                  <button
                    type="button"
                    onClick={() => select(code)}
                    className="min-w-0 flex-1 truncate py-1.5 text-left hover:text-accent"
                    title={`Buka detail ${name}`}
                  >
                    {name}
                  </button>
                  <button
                    type="button"
                    onClick={() => unpin(code)}
                    aria-label={`Hapus ${name} dari perbandingan`}
                    className="m-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-danger"
                  >
                    ✕
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}

export function ComparisonPanel() {
  const { state, metrics } = useApp();
  const [open, setOpen] = useState(true);
  const customActive = (state.assumptions.customIncome ?? 0) > 0;

  const pinnedMetrics: RegionMetrics[] = state.pinned
    .map((c) => metrics.get(c))
    .filter((m): m is RegionMetrics => !!m);

  useEffect(() => {
    if (pinnedMetrics.length >= 2) setOpen(true);
  }, [pinnedMetrics.length]);

  if (pinnedMetrics.length < 2) return null;

  // Stacked composition data for recharts.
  const chartData = pinnedMetrics.map((m) => {
    const name = (REGION_BY_CODE.get(m.code)?.name ?? m.code).replace(
      /^Kota /,
      "",
    );
    const row: Record<string, string | number> = { name };
    for (const c of EXPENSE_CATEGORIES)
      row[c.key] = Math.round(m.breakdown[c.key as ExpenseCategoryKey]);
    return row;
  });

  return (
    <section
      aria-label="Perbandingan wilayah tersemat"
      className={`rounded-xl border border-border bg-card/95 shadow-lg backdrop-blur ${
        open ? "" : "max-h-11 overflow-hidden"
      }`}
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <h2 className="text-sm font-semibold">
          Bandingkan {pinnedMetrics.length} wilayah tersemat
        </h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-lg border border-border px-2.5 py-1 text-xs text-muted hover:border-accent"
        >
          {open ? "Sembunyikan" : "Tampilkan"}
        </button>
      </header>

      {open && (
        <div className="grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
          {/* Cards are easier to scan than a squeezed table on phones. */}
          <div className="grid gap-2 sm:hidden">
            {pinnedMetrics.map((m) => (
              <article
                key={m.code}
                className="rounded-lg border border-border p-3"
              >
                <h3 className="truncate text-sm font-semibold">
                  {REGION_BY_CODE.get(m.code)?.name ?? m.code}
                </h3>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs tabular-nums">
                  <MobileMetric
                    label="Cakupan"
                    value={formatPct(m.coveragePercent)}
                  />
                  <MobileMetric label="Tingkat" value={BAND_LABEL[m.band]} />
                  <MobileMetric
                    label="Biaya bulanan"
                    value={formatIDRCompact(m.totalMonthlyCost)}
                  />
                  <MobileMetric
                    label={customActive ? "Pendapatan" : "UMK"}
                    value={formatIDRCompact(m.wageAmount)}
                  />
                  {customActive && (
                    <MobileMetric
                      label="UMK daerah"
                      value={formatIDRCompact(m.regionalWageAmount)}
                    />
                  )}
                  <MobileMetric
                    label="Saldo"
                    value={formatSignedCompact(m.surplusOrDeficit)}
                    tone={m.surplusOrDeficit >= 0 ? "ok" : "danger"}
                  />
                </dl>
              </article>
            ))}
          </div>

          {/* Fixed-layout table keeps all five regions visible without a hover scrollbar. */}
          <table className="hidden w-full table-fixed border-collapse text-xs sm:table">
            <caption className="sr-only">
              Perbandingan keterjangkauan berdampingan
            </caption>
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th scope="col" className="w-28 py-1.5 pr-2 font-medium">
                  Metrik
                </th>
                {pinnedMetrics.map((m) => {
                  const name = (
                    REGION_BY_CODE.get(m.code)?.name ?? m.code
                  ).replace(/^Kota /, "");
                  return (
                    <th
                      key={m.code}
                      scope="col"
                      title={name}
                      className="px-1 py-1.5 text-right font-medium text-ink"
                    >
                      <span className="block truncate">{name}</span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <Row label="Cakupan">
                {pinnedMetrics.map((m) => (
                  <td key={m.code} className="px-1 py-1.5 text-right">
                    {formatPct(m.coveragePercent)}
                  </td>
                ))}
              </Row>
              <Row label="Surplus / defisit">
                {pinnedMetrics.map((m) => (
                  <td
                    key={m.code}
                    className={`px-1 py-1.5 text-right ${
                      m.surplusOrDeficit >= 0 ? "text-ok" : "text-danger"
                    }`}
                  >
                    {formatSignedCompact(m.surplusOrDeficit)}
                  </td>
                ))}
              </Row>
              <Row label="Est. biaya bulanan">
                {pinnedMetrics.map((m) => (
                  <td key={m.code} className="px-1 py-1.5 text-right">
                    {formatIDRCompact(m.totalMonthlyCost)}
                  </td>
                ))}
              </Row>
              <Row label={customActive ? "Pendapatan" : "UMK (basis)"}>
                {pinnedMetrics.map((m) => (
                  <td key={m.code} className="px-1 py-1.5 text-right">
                    {formatIDRCompact(m.wageAmount)}
                  </td>
                ))}
              </Row>
              {customActive && (
                <Row label="UMK daerah (pembanding)">
                  {pinnedMetrics.map((m) => (
                    <td key={m.code} className="px-1 py-1.5 text-right">
                      {formatIDRCompact(m.regionalWageAmount)}
                    </td>
                  ))}
                </Row>
              )}
              <Row label="Tingkat">
                {pinnedMetrics.map((m) => (
                  <td
                    key={m.code}
                    className="truncate px-1 py-1.5 text-right text-[11px]"
                  >
                    {BAND_LABEL[m.band]}
                  </td>
                ))}
              </Row>
            </tbody>
          </table>

          {/* Hide the secondary chart at tablet widths to protect map space. */}
          <div
            className="h-52 min-w-0 md:hidden lg:block lg:h-40 xl:h-48"
            role="img"
            aria-label="Komposisi biaya bulanan tiap wilayah tersemat"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatIDRCompact}
                  tick={{ fontSize: 11, fill: "var(--muted)" }}
                  tickLine={false}
                  axisLine={false}
                  width={62}
                />
                <Tooltip
                  wrapperStyle={{ zIndex: 50 }}
                  content={<CompareTooltip />}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {EXPENSE_CATEGORIES.map((c) => (
                  <Bar
                    key={c.key}
                    dataKey={c.key}
                    name={c.label}
                    stackId="cost"
                    fill={c.color}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Compact tooltip for the docked stacked bars. The built-in Recharts tooltip
 * lists all 10 stacked categories vertically (~260px tall) — taller than this
 * 160–208px chart — so its bottom (the rupiah numbers) was cut off. A
 * two-column grid plus a total row keeps the whole tooltip inside the chart.
 */
function CompareTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { dataKey?: string | number; value?: number | string }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;

  const rows = EXPENSE_CATEGORIES.map((c) => ({
    ...c,
    value: Number(payload.find((p) => p.dataKey === c.key)?.value ?? 0),
  }));
  const total = rows.reduce((s, r) => s + r.value, 0);

  return (
    <div className="w-[320px] max-w-full rounded-lg border border-border bg-card px-2.5 py-2 text-[11px] shadow-lg">
      <p className="mb-1.5 truncate font-semibold">{label}</p>
      <div className="grid grid-cols-2 grid-flow-col grid-rows-5 gap-x-3 gap-y-0.5">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: r.color }}
            />
            <span
              className="min-w-0 flex-1 truncate text-muted"
              title={r.label}
            >
              {r.label}
            </span>
            <span className="tabular-nums">{formatIDR(r.value)}</span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 flex justify-between gap-4 border-t border-border pt-1 font-semibold tabular-nums">
        <span>Total</span>
        <span>{formatIDR(total)}</span>
      </p>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <tr className="border-b border-border/60 last:border-0">
      <th
        scope="row"
        className="py-1.5 pr-2 text-left text-[11px] font-normal text-muted"
      >
        {label}
      </th>
      {children}
    </tr>
  );
}

function MobileMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "ok" | "danger";
}) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd
        className={
          tone === "ok" ? "text-ok" : tone === "danger" ? "text-danger" : ""
        }
      >
        {value}
      </dd>
    </div>
  );
}

function formatSignedCompact(value: number): string {
  return `${value >= 0 ? "+" : "−"}${formatIDRCompact(Math.abs(value))}`;
}
