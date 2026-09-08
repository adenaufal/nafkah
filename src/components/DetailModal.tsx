"use client";

import { useRef } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "@/state/AppContext";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import { BAND_LABEL, bandColors } from "@/lib/calculations";
import {
  formatDate,
  formatIDR,
  formatIDRCompact,
  formatPct,
  formatSignedIDR,
} from "@/lib/format";
import type { Confidence } from "@/lib/types";
import { useDialogFocus } from "@/lib/useDialogFocus";

/**
 * Region detail modal. Opens on region click (map or search).
 * Closes on Escape, backdrop click, and the visible close button;
 * focus returns to the trigger element on close.
 */
export function DetailModal() {
  const { state, metrics, metricsReady, regionByCode, select, pin } = useApp();
  const bandPalette = bandColors(state.darkMode);
  const isDualIncome =
    state.assumptions.dualIncome &&
    state.assumptions.householdType !== "single";
  const code = state.selectedCode;
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const close = () => select(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(
    Boolean(code),
    close,
    closeBtnRef,
  );

  if (!code) return null;

  const region = regionByCode.get(code);
  const geoFeature = state.geometry?.features.find(
    (f) => f.properties.kode === code,
  );
  const displayName = region?.name ?? geoFeature?.properties.name ?? code;
  const province = region?.province ?? geoFeature?.properties.province ?? "";
  const metric = metricsReady ? metrics.get(code) : undefined;
  const wage = metricsReady ? state.wages.get(code) : undefined;
  const costs = metricsReady ? state.costs.get(code) : undefined;
  const narrative = state.narratives.get(code);
  const isPinned = state.pinned.includes(code);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 sm:items-center sm:p-5 lg:p-8"
      onClick={close}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Detail keterjangkauan ${displayName}`}
        onClick={(e) => e.stopPropagation()}
        className="flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:h-[min(90dvh,960px)] sm:w-[min(94vw,1180px)] sm:rounded-2xl 2xl:w-[min(90vw,1280px)]"
      >
        {/* Header */}
        <header className="z-10 flex shrink-0 items-start justify-between gap-3 border-b border-border bg-card p-4 sm:p-5">
          <div>
            <h2 className="text-lg font-semibold leading-tight">
              {displayName}
            </h2>
            <p className="text-sm text-muted">
              {province} · kode wilayah {code}
              {region && ` · ${region.tier}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {metric && (
              <button
                type="button"
                onClick={() => pin(code)}
                disabled={isPinned}
                aria-pressed={isPinned}
                className="rounded-lg border border-accent px-2.5 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-default disabled:border-border disabled:bg-surface disabled:text-muted sm:px-3"
              >
                <span className="sm:hidden">
                  {isPinned ? "Tersemat" : "Pin"}
                </span>
                <span className="hidden sm:inline">
                  {isPinned ? "Sudah disematkan" : "Pin untuk dibandingkan"}
                </span>
              </button>
            )}
            <button
              type="button"
              ref={closeBtnRef}
              onClick={close}
              aria-label="Tutup modal detail"
              className="rounded-lg border border-border px-2.5 py-1.5 text-sm hover:border-accent"
            >
              ✕
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:p-6">
          {/* Status tanpa data adalah pesannya sendiri, sesuai spesifikasi */}
          {metricsReady ? (
            !metric || !wage || !costs ? (
              <div
                role="status"
                className="rounded-lg border border-dashed border-border p-5 text-sm"
              >
                <p className="font-medium text-ink">
                  Belum ada data untuk {displayName}.
                </p>
                <p className="mt-1 text-muted">
                  Kabupaten/kota ini punya geometri batas wilayah, tetapi belum
                  memiliki catatan upah atau biaya di dataset saat ini. Wilayah
                  berdata diberi warna; sisanya tampil dengan pola arsir.
                  Menambah data cukup dengan menyunting berkas JSON di{" "}
                  <code className="rounded bg-surface px-1">
                    public/data/v2026.1/
                  </code>
                  .
                </p>
              </div>
            ) : (
              <>
                {/* KPI row */}
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Kpi
                    label={
                      metric.wageSource === "custom"
                        ? "Pendapatanmu (input sendiri)" +
                          (isDualIncome ? " + UMK pasangan" : "")
                        : (state.assumptions.wageBasis === "gross"
                            ? "UMK (kotor)"
                            : "UMK (est. take-home)") +
                          (isDualIncome ? " × 2" : "")
                    }
                    value={formatIDR(metric.wageAmount)}
                    provenance={
                      metric.wageSource === "custom" ? undefined : wage
                    }
                    note={
                      metric.wageSource === "custom"
                        ? `Pembanding UMK daerah: ${formatIDR(
                            metric.regionalWageAmount,
                          )}`
                        : undefined
                    }
                  />
                  <Kpi
                    label="Est. biaya bulanan"
                    value={formatIDR(metric.totalMonthlyCost)}
                    provenance={{
                      source: "Lihat tabel kategori di bawah",
                      asOf: costs.baseline.housing.asOf,
                      confidence: "sample",
                    }}
                  />
                  <Kpi
                    label="Cakupan gaji"
                    value={formatPct(metric.coveragePercent)}
                    accent={bandPalette[metric.band]}
                  />
                  <Kpi
                    label={
                      metric.surplusOrDeficit >= 0
                        ? "Surplus bulanan"
                        : "Defisit bulanan"
                    }
                    value={formatSignedIDR(metric.surplusOrDeficit)}
                    accent={
                      metric.surplusOrDeficit >= 0
                        ? "var(--ok)"
                        : "var(--danger)"
                    }
                  />
                </dl>

                {metric.wageSource === "region" && (
                  <p className="-mt-2 text-[11px] leading-relaxed text-muted">
                    UMK adalah lantai upah resmi, bukan gaji rata-rata yang
                    benar-benar dibayar di lapangan. Isi{" "}
                    <span className="font-medium text-ink">
                      Pendapatan sendiri
                    </span>{" "}
                    di panel asumsi untuk menghitung dengan gajimu.
                  </p>
                )}

                {/* Band + interpretation */}
                <div
                  className="rounded-xl border p-4"
                  style={{
                    borderColor: `${bandPalette[metric.band]}66`,
                    backgroundColor: `${bandPalette[metric.band]}14`,
                  }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: bandPalette[metric.band] }}
                  >
                    {BAND_LABEL[metric.band]}
                    <span className="ml-2 font-normal text-muted">
                      rasio{" "}
                      {metric.affordabilityRatio.toLocaleString("id-ID", {
                        maximumFractionDigits: 2,
                      })}{" "}
                      (biaya ÷ upah)
                    </span>
                  </p>
                  {narrative && (
                    <p className="mt-2 text-sm leading-relaxed">
                      {narrative.interpretation}
                    </p>
                  )}
                </div>

                {/* Category breakdown chart */}
                <section aria-label="Diagram perincian kategori">
                  <h3 className="mb-2 text-sm font-semibold">
                    Komposisi biaya bulanan
                  </h3>
                  <div
                    className="h-52 sm:h-56 lg:h-64"
                    role="img"
                    aria-label="Diagram batang biaya bulanan per kategori"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={EXPENSE_CATEGORIES.map((c) => ({
                          name: c.label.replace(" / pengasuhan anak", ""),
                          key: c.key,
                          value: Math.round(metric.breakdown[c.key]),
                          color: c.color,
                        }))}
                        layout="vertical"
                        margin={{ top: 0, right: 12, bottom: 0, left: 8 }}
                      >
                        <XAxis
                          type="number"
                          tickFormatter={formatIDRCompact}
                          tick={{ fontSize: 10, fill: "var(--muted)" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={118}
                          tick={{ fontSize: 10, fill: "var(--muted)" }}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: 10,
                            fontSize: 12,
                            color: "var(--ink)",
                          }}
                          labelStyle={{ color: "var(--ink)" }}
                          itemStyle={{ color: "var(--ink)" }}
                          formatter={(v: number) => formatIDR(v)}
                        />
                        <Bar
                          dataKey="value"
                          name="Monthly cost"
                          radius={[0, 4, 4, 0]}
                        >
                          {EXPENSE_CATEGORIES.map((c) => (
                            <Cell key={c.key} fill={c.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Rent + transport context */}
                {narrative && (
                  <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="rounded-lg bg-surface p-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Rentang sewa tipikal
                      </dt>
                      <dd className="mt-1 font-medium tabular-nums">
                        {formatIDRCompact(narrative.rentRange.min)} –{" "}
                        {formatIDRCompact(narrative.rentRange.max)}
                      </dd>
                      <dd className="mt-0.5 text-xs text-muted">
                        {narrative.rentRange.note}
                      </dd>
                    </div>
                    <div className="rounded-lg bg-surface p-3">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                        Konteks transportasi
                      </dt>
                      <dd className="mt-1 text-xs leading-relaxed">
                        {narrative.transportContext}
                      </dd>
                    </div>
                  </dl>
                )}

                {/* Provenance table: every number traces to source + asOf */}
                <section aria-label="Data provenance">
                  <h3 className="mb-2 text-sm font-semibold">
                    Sumber &amp; tanggal data
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[460px] border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border bg-surface text-left text-muted">
                          <th scope="col" className="px-3 py-2 font-medium">
                            Keterangan
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            Sumber
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            Per
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium">
                            Keyakinan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <ProvenanceRow label={`UMK ${wage.year}`} p={wage} />
                        {EXPENSE_CATEGORIES.map((c) => (
                          <ProvenanceRow
                            key={c.key}
                            label={c.label}
                            p={costs.baseline[c.key]}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                  ⚠ Angka di sini adalah estimasi, bukan nasihat keuangan. Biaya
                  riil berbeda menurut lingkungan tempat tinggal, ukuran rumah
                  tangga, tunjangan pekerjaan, dan keadaan personal.
                </p>
              </>
            )
          ) : (
            <p
              role="status"
              className="rounded-lg border border-dashed border-border p-4 text-sm text-muted"
            >
              Memuat data upah &amp; biaya…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
  provenance,
  note,
}: {
  label: string;
  value: string;
  accent?: string;
  provenance?: { source: string; asOf: string; confidence: Confidence };
  /** Catatan kecil di bawah nilai, mis. pembanding UMK saat pendapatan custom. */
  note?: string;
}) {
  return (
    <div className="rounded-lg border border-border p-3">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd
        className="mt-0.5 font-semibold tabular-nums"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </dd>
      {note && <dd className="mt-1 text-[11px] text-muted">{note}</dd>}
      {provenance && provenance.confidence !== "official" && (
        <dd className="mt-1">
          <ConfidenceBadge
            confidence={provenance.confidence}
            asOf={provenance.asOf}
          />
        </dd>
      )}
    </div>
  );
}

function ConfidenceBadge({
  confidence,
  asOf,
}: {
  confidence: Confidence;
  asOf?: string;
}) {
  const text =
    confidence === "sample"
      ? "Estimasi sampel"
      : confidence === "estimate"
        ? "Estimasi"
        : "Resmi";
  return (
    <span
      title={asOf ? `Datanya per ${formatDate(asOf)}` : undefined}
      className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400"
    >
      {text}
      {asOf && <span className="ml-1 opacity-70">· {asOf.slice(0, 7)}</span>}
    </span>
  );
}

function ProvenanceRow({
  label,
  p,
}: {
  label: string;
  p: { source: string; asOf: string; confidence: Confidence };
}) {
  return (
    <tr className="border-b border-border/60 align-top">
      <th scope="row" className="px-3 py-2 text-left font-medium">
        {label}
      </th>
      <td className="max-w-[280px] px-3 py-2 text-muted">{p.source}</td>
      <td className="px-3 py-2 whitespace-nowrap text-muted">
        <time dateTime={p.asOf}>{formatDate(p.asOf)}</time>
      </td>
      <td className="px-3 py-2">
        <ConfidenceBadge confidence={p.confidence} />
      </td>
    </tr>
  );
}
