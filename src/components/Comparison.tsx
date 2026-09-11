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
import { BAND_LABEL, bandColors } from "@/lib/calculations";
import { assumptionSummary } from "@/lib/profile";
import { formatIDR, formatIDRCompact, formatPct } from "@/lib/format";
import { shouldRenderComparisonChart } from "@/lib/responsive";
import type { ExpenseCategoryKey, RegionMetrics } from "@/lib/types";
import { AppIcon } from "./icons";

/**
 * Baki perbandingan wilayah tersemat + panel perbandingan berdampingan.
 * Baki bersama: pin dari peta, pencarian, atau baki semuanya masuk ke reducer
 * yang sama.
 */

export function PinnedTray() {
  const { state, metrics, regionByCode, unpin, select } = useApp();
  const palette = bandColors(state.darkMode);

  return (
    <div data-tour="pins" className="w-full">
      {state.pinMessage && (
        <p
          role="alert"
          className="mb-2 rounded-lg border border-amber-500/40 bg-card px-3 py-2 text-xs font-medium text-amber-700 shadow-md dark:text-amber-400"
        >
          {state.pinMessage}
        </p>
      )}
      {state.pinned.length > 0 ? (
        <section
          aria-label="Wilayah yang disematkan untuk perbandingan"
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_6px_22px_rgba(0,0,0,0.10)]"
        >
          <header className="flex items-center justify-between border-b border-border px-3.5 py-2.5">
            <h2 className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-muted">
              <AppIcon name="pushPin" size={14} />
              Disematkan
            </h2>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-bold tabular-nums text-accent min-[1400px]:text-xs min-[1400px]:px-2.5 min-[1400px]:py-0.5">
              {state.pinned.length}/5
            </span>
          </header>
          <ul className="grid gap-1.5 p-2">
            {state.pinned.map((code) => {
              const region = regionByCode.get(code);
              const name = region?.name ?? code;
              const m = metrics.get(code);
              return (
                <li
                  key={code}
                  className="flex min-w-0 items-center gap-2.5 rounded-[10px] bg-surface py-2 pl-2.5 pr-1"
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                    style={{
                      backgroundColor: m ? palette[m.band] : "var(--border)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => select(code)}
                    className="min-w-0 flex-1 text-left"
                    title={`Buka detail ${name}`}
                  >
                    <span className="block truncate text-[13px] font-semibold hover:text-accent">
                      {name}
                    </span>
                    <span className="block truncate text-[11px] text-muted">
                      {region?.province ?? ""}
                    </span>
                  </button>
                  {m && (
                    <span className="shrink-0 text-right leading-tight">
                      <span className="block text-[13.5px] font-bold tabular-nums">
                        {formatPct(m.coveragePercent)}
                      </span>
                      <span
                        className={`block text-[11px] font-semibold tabular-nums ${
                          m.surplusOrDeficit >= 0 ? "text-ok" : "text-danger"
                        }`}
                      >
                        {formatSignedCompact(m.surplusOrDeficit)}
                      </span>
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => unpin(code)}
                    aria-label={`Hapus ${name} dari perbandingan`}
                    className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-red-500/10 hover:text-danger min-[1400px]:h-8 min-[1400px]:w-8"
                  >
                    <AppIcon name="x" size={15} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <section
          aria-label="Wilayah disematkan"
          className="rounded-2xl border border-dashed border-border bg-card p-3.5 text-xs leading-relaxed text-muted"
        >
          <p className="font-semibold text-ink">
            Belum ada wilayah disematkan.
          </p>
          <p className="mt-1">
            Klik wilayah di peta lalu <strong className="text-ink">Pin</strong>{" "}
            — dua wilayah sudah cukup untuk membandingkan.
          </p>
        </section>
      )}
    </div>
  );
}

export function ComparisonPanel() {
  const { state, metrics, regionByCode, setOrigin } = useApp();
  const [open, setOpen] = useState(true);
  const [showChart, setShowChart] = useState(() =>
    shouldRenderComparisonChart(
      typeof window === "undefined" ? 1440 : window.innerWidth,
    ),
  );
  const customActive = (state.assumptions.customIncome ?? 0) > 0;
  const origin = state.originCode
    ? regionByCode.get(state.originCode)
    : undefined;

  useEffect(() => {
    const syncChartVisibility = () =>
      setShowChart(shouldRenderComparisonChart(window.innerWidth));
    syncChartVisibility();
    window.addEventListener("resize", syncChartVisibility);
    return () => window.removeEventListener("resize", syncChartVisibility);
  }, []);

  const pinnedMetrics: RegionMetrics[] = state.pinned
    .map((c) => metrics.get(c))
    .filter((m): m is RegionMetrics => !!m);

  useEffect(() => {
    if (pinnedMetrics.length >= 2) setOpen(true);
  }, [pinnedMetrics.length]);

  if (pinnedMetrics.length < 2) return null;

  // Stacked composition data for recharts.
  const chartData = pinnedMetrics.map((m) => {
    const name = (regionByCode.get(m.code)?.name ?? m.code).replace(
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
      data-tour="compare"
      aria-label="Perbandingan wilayah tersemat"
      className={`rounded-2xl border border-border bg-card shadow-[0_-2px_34px_rgba(0,0,0,0.16)] ${
        open ? "" : "max-h-12 overflow-hidden"
      }`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <div className="min-w-0">
          <h2 className="text-[14.5px] font-bold">
            Bandingkan {pinnedMetrics.length} wilayah
          </h2>
          <p className="truncate text-[11.5px] text-muted">
            {assumptionSummary(state.assumptions)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="h-8 shrink-0 rounded-lg border border-border px-3 text-xs font-semibold text-muted hover:border-accent min-[1400px]:h-9 min-[1400px]:text-xs min-[1800px]:h-9.5 min-[1800px]:px-3.5"
        >
          {open ? "Sembunyikan" : "Tampilkan"}
        </button>
      </header>

      <div className="border-b border-border bg-surface px-4 py-2.5 text-[11.5px] leading-relaxed">
        {origin ? (
          <div className="flex items-center justify-between gap-3">
            <p>
              <strong>Relokasi aktif:</strong> gaji asal dari{" "}
              <span className="font-semibold">{origin.name}</span> → biaya
              setiap kolom tetap dihitung sebagai kota tujuan.
            </p>
            <button
              type="button"
              onClick={() => setOrigin(null)}
              className="shrink-0 rounded-md border border-border px-2 py-1 font-semibold text-muted hover:border-accent hover:text-accent min-[1400px]:px-2.5 min-[1400px]:py-1.5 min-[1400px]:text-xs"
            >
              Hapus asal
            </button>
          </div>
        ) : (
          <p className="text-muted">
            Tip relokasi: buka detail satu wilayah lalu pilih{" "}
            <strong className="text-ink">Jadikan gaji asal</strong>. Biaya
            pada panel ini tetap mengikuti kota tujuan.
          </p>
        )}
      </div>

      {open && (
        <div className="comparison-content grid min-w-0 gap-4 p-3 sm:p-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)]">
          {/* Cards are easier to scan than a squeezed table on phones. */}
          <div className="grid gap-2 sm:hidden">
            {pinnedMetrics.map((m) => (
              <article
                key={m.code}
                className="rounded-lg border border-border p-3"
              >
                <h3 className="truncate text-sm font-semibold">
                  {regionByCode.get(m.code)?.name ?? m.code}
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
                    label={
                      origin ? "Gaji asal" : customActive ? "Pendapatan" : "UMK"
                    }
                    value={formatIDRCompact(m.wageAmount)}
                  />
                  {(customActive || origin) && (
                    <MobileMetric
                      label={origin ? "UMK tujuan" : "UMK daerah"}
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
                    regionByCode.get(m.code)?.name ?? m.code
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
              <Row
                label={
                  origin ? "Gaji asal" : customActive ? "Pendapatan" : "UMK (basis)"
                }
              >
                {pinnedMetrics.map((m) => (
                  <td key={m.code} className="px-1 py-1.5 text-right">
                    {formatIDRCompact(m.wageAmount)}
                  </td>
                ))}
              </Row>
              {(customActive || origin) && (
                <Row
                  label={origin ? "UMK tujuan (pembanding)" : "UMK daerah (pembanding)"}
                >
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
          {showChart && (
            <div
              className="comparison-chart h-52 min-w-0 md:hidden lg:block lg:h-40 xl:h-48"
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
          )}
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
  const toneClass = { ok: "text-ok", danger: "text-danger" } as const;
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className={tone ? toneClass[tone] : ""}>{value}</dd>
    </div>
  );
}

function formatSignedCompact(value: number): string {
  return `${value >= 0 ? "+" : "−"}${formatIDRCompact(Math.abs(value))}`;
}
