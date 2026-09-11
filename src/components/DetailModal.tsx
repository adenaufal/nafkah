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
import { CORRECTION_FORM_URL } from "@/lib/links";
import { recordUsage } from "@/lib/usage";
import { AppIcon } from "./icons";

/**
 * Region detail modal. Opens on region click (map or search).
 * Closes on Escape, backdrop click, and the visible close button;
 * focus returns to the trigger element on close.
 */
export function DetailModal() {
  const {
    state,
    metrics,
    metricsReady,
    regionByCode,
    select,
    pin,
    setOrigin,
  } = useApp();
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
  const isOrigin = state.originCode === code;
  const originRegion = state.originCode
    ? regionByCode.get(state.originCode)
    : undefined;
  const wageProvenance =
    metric?.wageSource === "origin" && state.originCode
      ? state.wages.get(state.originCode) ?? wage
      : wage;

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
        className="flex h-[94dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:h-[min(90dvh,960px)] sm:w-[min(94vw,1180px)] sm:rounded-2xl 2xl:w-[min(90vw,1280px)] min-[1400px]:h-[min(90dvh,980px)] min-[1400px]:w-[min(92vw,1320px)] min-[1600px]:w-[min(90vw,1440px)] min-[1800px]:h-[min(90dvh,1060px)] min-[1800px]:w-[min(88vw,1580px)] min-[2200px]:h-[min(90dvh,1140px)] min-[2200px]:w-[min(84vw,1740px)] min-[2560px]:w-[min(80vw,1840px)]"
      >
        {/* Header */}
        <header className="z-10 flex shrink-0 items-start justify-between gap-3 border-b border-border bg-card p-4 sm:p-5 min-[1400px]:p-6 min-[1800px]:p-7">
          <div>
            <h2 className="text-lg font-semibold leading-tight min-[1400px]:text-xl min-[1800px]:text-2xl">
              {displayName}
            </h2>
            <p className="text-sm text-muted min-[1400px]:text-[15px] min-[1800px]:text-base">
              {province} · kode wilayah {code}
              {region && ` · ${region.tier}`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 min-[1400px]:gap-2.5 min-[1800px]:gap-3">
            {metric && (
              <button
                type="button"
                onClick={() => pin(code)}
                disabled={isPinned}
                aria-pressed={isPinned}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent px-2.5 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-on-accent disabled:cursor-default disabled:border-border disabled:bg-surface disabled:text-muted sm:px-3 min-[1400px]:h-10 min-[1400px]:px-3.5 min-[1400px]:text-sm min-[1800px]:h-11 min-[1800px]:px-4 min-[1800px]:text-[14.5px]"
              >
                <AppIcon
                  name="pushPin"
                  size={15}
                  weight={isPinned ? "fill" : "regular"}
                />
                <span className="sm:hidden">
                  {isPinned ? "Tersemat" : "Pin"}
                </span>
                <span className="hidden sm:inline">
                  {isPinned ? "Sudah disematkan" : "Pin untuk dibandingkan"}
                </span>
              </button>
            )}
            {wage && (
              <button
                type="button"
                onClick={() => setOrigin(isOrigin ? null : code)}
                aria-pressed={isOrigin}
                className="inline-flex items-center justify-center rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent sm:px-3 min-[1400px]:h-10 min-[1400px]:px-3.5 min-[1400px]:text-sm min-[1800px]:h-11 min-[1800px]:px-4 min-[1800px]:text-[14.5px]"
              >
                <span className="sm:hidden">
                  {isOrigin ? "Asal aktif" : "Jadikan asal"}
                </span>
                <span className="hidden sm:inline">
                  {isOrigin ? "Hapus kota asal" : "Jadikan gaji asal"}
                </span>
              </button>
            )}
            <button
              type="button"
              ref={closeBtnRef}
              onClick={close}
              aria-label="Tutup modal detail"
              className="inline-flex items-center justify-center rounded-lg border border-border px-2.5 py-1.5 text-sm hover:border-accent min-[1400px]:h-10 min-[1400px]:w-10 min-[1400px]:p-0 min-[1800px]:h-11 min-[1800px]:w-11"
            >
              <AppIcon name="x" size={17} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-5 lg:p-6 min-[1400px]:space-y-6 min-[1400px]:p-7 min-[1800px]:p-8">
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
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 min-[1400px]:gap-4">
                  <Kpi
                    label={
                      metric.wageSource === "custom"
                        ? "Pendapatanmu (input sendiri)" +
                          (isDualIncome ? " + UMK pasangan" : "")
                        : metric.wageSource === "origin"
                          ? "Gaji asal (UMK)" + (isDualIncome ? " × 2" : "")
                        : (state.assumptions.wageBasis === "gross"
                            ? "UMK (kotor)"
                            : "UMK (est. take-home)") +
                          (isDualIncome ? " × 2" : "")
                    }
                    value={formatIDR(metric.wageAmount)}
                    provenance={
                      metric.wageSource === "custom"
                        ? undefined
                        : wageProvenance
                    }
                    note={
                      metric.wageSource === "custom"
                        ? `Pembanding UMK daerah: ${formatIDR(
                            metric.regionalWageAmount,
                          )}`
                        : metric.wageSource === "origin"
                          ? `Kota asal: ${
                              originRegion?.name ?? state.originCode ?? "—"
                            }. UMK tujuan: ${formatIDR(
                              metric.regionalWageAmount,
                            )}`
                        : undefined
                    }
                  />
                  <Kpi
                    label={
                      state.originCode
                        ? "Est. biaya kota tujuan"
                        : "Est. biaya bulanan"
                    }
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

                {state.originCode && (
                  <p className="-mt-2 rounded-lg border border-accent/30 bg-accent-soft p-3 text-[12px] leading-relaxed min-[1400px]:text-[13px] min-[1800px]:text-sm">
                    <strong>Mode relokasi:</strong> gaji asal dari{" "}
                    <span className="font-semibold">
                      {originRegion?.name ?? state.originCode}
                    </span>{" "}
                    dibandingkan dengan biaya kota tujuan{" "}
                    <span className="font-semibold">{displayName}</span>.
                    {metric.wageSource === "custom" &&
                      " Pendapatan sendiri tetap menjadi gaji utama; asal dipakai untuk upah pasangan bila 2 upah aktif."}
                  </p>
                )}

                {metric.wageSource === "region" && (
                  <p className="-mt-2 text-[11px] leading-relaxed text-muted min-[1400px]:text-xs">
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
                  className="rounded-xl border p-4 min-[1400px]:p-5 min-[1800px]:p-6"
                  style={{
                    borderColor: `${bandPalette[metric.band]}66`,
                    backgroundColor: `${bandPalette[metric.band]}14`,
                  }}
                >
                  <p
                    className="text-sm font-semibold min-[1400px]:text-base min-[1800px]:text-[17px]"
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
                    <p className="mt-2 text-sm leading-relaxed min-[1400px]:text-[15px] min-[1800px]:text-base">
                      {narrative.interpretation}
                    </p>
                  )}
                </div>

                {/* Visual breakdown & regional narrative */}
                <div className="grid gap-5 min-[1400px]:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] min-[1400px]:items-start min-[1400px]:gap-6">
                  {/* Category breakdown chart */}
                  <section aria-label="Diagram perincian kategori">
                    <h3 className="mb-2 text-sm font-semibold min-[1400px]:text-base">
                      Komposisi biaya bulanan
                    </h3>
                    <div
                      className="h-52 sm:h-56 lg:h-64 min-[1400px]:h-72 min-[1800px]:h-80"
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
                    <section aria-label="Konteks hunian dan transportasi" className="space-y-2">
                      <h3 className="text-sm font-semibold min-[1400px]:text-base">
                        Konteks daerah
                      </h3>
                      <dl className="grid gap-3 text-sm sm:grid-cols-2 min-[1400px]:grid-cols-1 min-[1400px]:gap-3.5">
                        <div className="rounded-lg bg-surface p-3 min-[1400px]:p-4">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Rentang sewa tipikal
                          </dt>
                          <dd className="mt-1 font-medium tabular-nums min-[1400px]:text-[15px]">
                            {formatIDRCompact(narrative.rentRange.min)} –{" "}
                            {formatIDRCompact(narrative.rentRange.max)}
                          </dd>
                          <dd className="mt-0.5 text-xs text-muted min-[1400px]:text-[13px]">
                            {narrative.rentRange.note}
                          </dd>
                          <dd className="mt-2 border-t border-border/60 pt-2 text-[10px] leading-relaxed text-muted min-[1400px]:text-[11px]">
                            <span className="block">
                              Sumber: {narrative.rentRange.provenance.source}
                            </span>
                            <time dateTime={narrative.rentRange.provenance.asOf}>
                              Per {" "}
                              {formatDate(narrative.rentRange.provenance.asOf)}
                            </time>{" "}
                            <ConfidenceBadge
                              confidence={narrative.rentRange.provenance.confidence}
                            />
                          </dd>
                        </div>
                        <div className="rounded-lg bg-surface p-3 min-[1400px]:p-4">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                            Konteks transportasi
                          </dt>
                          <dd className="mt-1 text-xs leading-relaxed min-[1400px]:text-[13px]">
                            {narrative.transportContext}
                          </dd>
                        </div>
                      </dl>
                    </section>
                  )}
                </div>

                {/* Provenance table: every number traces to source + asOf */}
                <section aria-label="Data provenance">
                  <h3 className="mb-2 text-sm font-semibold min-[1400px]:text-base">
                    Sumber &amp; tanggal data
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full min-w-[460px] border-collapse text-xs min-[1400px]:text-[13px]">
                      <thead>
                        <tr className="border-b border-border bg-surface text-left text-muted">
                          <th scope="col" className="px-3 py-2 font-medium min-[1400px]:px-4 min-[1400px]:py-2.5">
                            Keterangan
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium min-[1400px]:px-4 min-[1400px]:py-2.5">
                            Sumber
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium min-[1400px]:px-4 min-[1400px]:py-2.5">
                            Per
                          </th>
                          <th scope="col" className="px-3 py-2 font-medium min-[1400px]:px-4 min-[1400px]:py-2.5">
                            Keyakinan
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <ProvenanceRow
                          label={`${metric.wageSource === "origin" ? "UMK kota asal" : "UMK"} ${wageProvenance!.year}`}
                          p={wageProvenance!}
                        />
                        {metric.wageSource === "origin" && (
                          <ProvenanceRow
                            label={`UMK kota tujuan ${wage.year}`}
                            p={wage}
                          />
                        )}
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

                <p className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300 min-[1400px]:p-4 min-[1400px]:text-[13px] min-[1800px]:p-5 min-[1800px]:text-sm">
                  <AppIcon
                    name="warning"
                    size={16}
                    weight="bold"
                    className="mr-1.5 inline-block align-[-3px]"
                  />
                  Angka di sini adalah estimasi, bukan nasihat keuangan. Biaya
                  riil berbeda menurut lingkungan tempat tinggal, ukuran rumah
                  tangga, tunjangan pekerjaan, dan keadaan personal.
                </p>

                <div className="flex flex-col gap-2 rounded-xl border border-accent/30 bg-accent-soft p-3 sm:flex-row sm:items-center sm:justify-between min-[1400px]:p-4">
                  <p className="text-[12px] leading-relaxed text-muted min-[1400px]:text-[13px] min-[1800px]:text-sm">
                    Menemukan angka atau sumber yang perlu diperbaiki? Laporan
                    diperiksa manual dan tidak mengubah data otomatis.
                  </p>
                  <a
                    href={CORRECTION_FORM_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => recordUsage("correction_report_opened")}
                    aria-label={`Laporkan angka untuk ${displayName}`}
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-[10px] bg-accent px-3.5 text-xs font-bold text-on-accent transition-colors hover:bg-accent-strong min-[1400px]:h-11 min-[1400px]:px-4 min-[1400px]:text-sm"
                  >
                    Laporkan angka ini
                    <AppIcon name="arrowUpRight" size={14} weight="bold" />
                  </a>
                </div>
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
    <div className="rounded-lg border border-border p-3 min-[1400px]:p-4 min-[1800px]:p-5">
      <dt className="text-[11px] text-muted min-[1400px]:text-xs min-[1800px]:text-[13px]">{label}</dt>
      <dd
        className="mt-0.5 font-semibold tabular-nums min-[1400px]:text-lg min-[1800px]:text-xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </dd>
      {note && <dd className="mt-1 text-[11px] text-muted min-[1400px]:text-xs">{note}</dd>}
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
      className="inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400 min-[1400px]:px-2.5 min-[1400px]:py-1 min-[1400px]:text-[11.5px] min-[1800px]:text-xs"
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
      <th scope="row" className="px-3 py-2 text-left font-medium min-[1400px]:px-4 min-[1400px]:py-2.5">
        {label}
      </th>
      <td className="max-w-[280px] px-3 py-2 text-muted min-[1400px]:max-w-[360px] min-[1400px]:px-4 min-[1400px]:py-2.5">{p.source}</td>
      <td className="px-3 py-2 whitespace-nowrap text-muted min-[1400px]:px-4 min-[1400px]:py-2.5">
        <time dateTime={p.asOf}>{formatDate(p.asOf)}</time>
      </td>
      <td className="px-3 py-2 min-[1400px]:px-4 min-[1400px]:py-2.5">
        <ConfidenceBadge confidence={p.confidence} />
      </td>
    </tr>
  );
}
