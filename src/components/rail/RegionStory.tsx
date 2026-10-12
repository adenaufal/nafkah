"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CaretDown,
  CaretUp,
  Check,
  MapPinLine,
  PencilSimple,
  Plus,
  ShareNetwork,
} from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import {
  breakdownRows,
  useNationalMedians,
  useRanking,
  useRegionDetail,
} from "@/state/derived";
import { bandTheme } from "@/lib/bands";
import { BAND_LABEL, isRegionalIncome } from "@/lib/calculations";
import { categoryLabel, confidenceLabel, wageLabel } from "@/lib/labels";
import { digits, formatDate, formatMonth, pct, rpShort } from "@/lib/format";
import {
  incomeTargets,
  rankPhrase,
  standoutCategories,
  versusMedian,
  type NationalMedians,
} from "@/lib/insights";
import { CORRECTION_FORM_URL } from "@/lib/links";
import { tierLabel, regionLabel } from "@/lib/names";
import { profileSummary } from "@/lib/profile";
import type { ReceiptCardInput } from "@/lib/receipt";
import { recordUsage } from "@/lib/usage";
import type { Assumptions, RegionMetrics } from "@/lib/types";
import { wageKind, type WageKind } from "@/lib/wages";
import { useShareLink } from "@/components/hooks";
import { BandChip, BudgetBar, Kicker, SectionTitle } from "@/components/ui";
import manifest from "../../../public/data/v2026.1/manifest.json";
import { DotStrip } from "./DotStrip";
import { IncomeControl } from "./IncomeControl";
import { ProvincePeers } from "./ProvincePeers";
import { Receipt } from "./Receipt";
import { ReceiptShareDialog } from "./ReceiptShare";

/** "UMP", "Gajimu", "Dua UMK Kota Bandung"… — the income in a sentence. */
function incomeSubject(
  m: RegionMetrics,
  a: Assumptions,
  originName: string | undefined,
  kind: WageKind,
): string {
  const net = a.wageBasis === "takeHome" ? " setelah potongan (estimasi)" : "";
  const where = m.wageSource === "origin" ? ` ${originName ?? "kota asal"}` : "";
  if (m.partnerWageSource === "custom") {
    const own = m.wageSource === "custom" ? "Gajimu" : `${kind}${where}${net}`;
    return `${own} ditambah gaji pasangan`;
  }
  if (m.wageSource === "custom")
    return m.partnerWageSource ? `Gajimu ditambah ${kind} pasangan` : "Gajimu";
  return `${m.partnerWageSource ? `Dua ${kind}` : kind}${where}${net}`;
}

export function RegionStory({
  code,
  onBack,
  onEditProfile,
  onHover,
}: {
  code: string;
  onBack: () => void;
  onEditProfile: () => void;
  onHover: (code: string | null) => void;
}) {
  const { state, pin, unpin, setOrigin, select, retryData } = useApp();
  const d = useRegionDetail(code);
  const ranking = useRanking();
  const medians = useNationalMedians();
  const share = useShareLink();
  const [receiptShare, setReceiptShare] = useState(false);
  const [hl, setHl] = useState<string | null>(null);

  const peers = useMemo(
    () =>
      d ? ranking.ranked.filter((r) => r.provinceCode === d.provinceCode) : [],
    [ranking.ranked, d?.provinceCode], // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!d) return null;
  const theme = bandTheme(state.darkMode);
  const m = d.metric;
  const a = state.assumptions;
  const rows = breakdownRows(d, a);
  // UMK or UMP: the region's own record, or the origin city's for the income.
  const destKind = wageKind(d.wage);
  const originWage = state.originCode
    ? state.wages.get(state.originCode)
    : undefined;
  const incomeKind = wageKind(
    m?.wageSource === "region" ? d.wage : (originWage ?? d.wage),
  );
  // Take-home is estimated for every minimum wage in the income, the
  // partner's included; a typed salary is used as given.
  const netEstimate =
    a.wageBasis === "takeHome" &&
    [m?.wageSource, m?.partnerWageSource].some((s) => s && s !== "custom");
  const regionalIncome = m != null && isRegionalIncome(m);
  const rank = ranking.ranked.findIndex((r) => r.code === code) + 1;
  const provRank = peers.findIndex((r) => r.code === code) + 1;
  const originName = d.originRegion ? regionLabel(d.originRegion) : undefined;
  const singleWage = d.wage
    ? a.wageBasis === "gross"
      ? d.wage.grossMonthly
      : d.wage.estimatedTakeHomeMonthly
    : undefined;
  // The receipt's income line, on screen and in the shared copy alike.
  const receiptIncomeLabel = (metric: RegionMetrics) =>
    regionalIncome
      ? `${wageLabel(metric, a, incomeKind)} ${d.wage?.year ?? ""}`.trim()
      : wageLabel(metric, a, incomeKind);
  // Everything the shared receipt prints, provenance included.
  const receiptInput = (metric: RegionMetrics): ReceiptCardInput => {
    const wageSource = d.wageProvenance
      ? `${metric.wageSource === "origin" ? `${incomeKind} kota asal` : incomeKind} ${d.wageProvenance.year}: ${d.wageProvenance.source}.`
      : "";
    const incomeSource =
      metric.wageSource === "custom"
        ? `Pendapatan: isian pengguna, bukan dataset.${metric.partnerWageSource && metric.partnerWageSource !== "custom" ? ` Pasangan: ${wageSource}` : ""}`
        : `${wageSource}${metric.partnerWageSource === "custom" ? " Gaji pasangan: isian pengguna." : ""}`;
    return {
      place: `${d.label}, ${d.province}`,
      region: d.label,
      province: d.province,
      profile: profileSummary(a),
      incomeLabel: receiptIncomeLabel(metric),
      income: metric.wageAmount,
      lines: rows.map((r) => ({ label: r.label, value: r.value })),
      total: metric.totalMonthlyCost,
      surplusOrDeficit: metric.surplusOrDeficit,
      coveragePercent: metric.coveragePercent,
      band: metric.band,
      bandLabel: BAND_LABEL[metric.band],
      incomeSource,
      costAsOf: rows.reduce(
        (latest, r) =>
          r.provenance && r.provenance.asOf > latest ? r.provenance.asOf : latest,
        "",
      ),
      datasetVersion: manifest.datasetVersion,
    };
  };

  return (
    <article className="anim-rise" aria-labelledby="region-title">
      {/* Labels give way to icons as the bar narrows (sideways phone rail,
          small phones), sooner on touch where the buttons are wider. Toggle
          labels stay the same when pressed, so the row never changes width. */}
      <div className="rail-sticky @container sticky top-0 z-10 mb-6 flex items-center gap-2 border-b border-rule bg-paper/95 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] px-2 text-[13px] font-semibold text-ink-2 hover:bg-paper-2 hover:text-ink pointer-coarse:h-11 pointer-coarse:min-w-11"
        >
          <ArrowLeft size={15} weight="bold" aria-hidden="true" />
          <span className="@max-[21.5rem]:sr-only pointer-coarse:@max-[22.5rem]:sr-only">
            Semua daerah
          </span>
        </button>
        <div className="ml-auto flex items-center gap-1">
          {m && (
            <button
              type="button"
              onClick={() => (d.isPinned ? unpin(code) : pin(code))}
              aria-pressed={d.isPinned}
              className={`inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-[10px] border px-2.5 text-[13px] font-semibold transition-colors pointer-coarse:h-11 ${
                d.isPinned
                  ? "border-ink bg-ink text-paper"
                  : "border-rule-2 text-ink hover:border-ink"
              }`}
            >
              {d.isPinned ? (
                <Check size={14} weight="bold" aria-hidden="true" />
              ) : (
                <Plus size={14} weight="bold" aria-hidden="true" />
              )}
              Bandingkan
            </button>
          )}
          {d.wage && (
            <button
              type="button"
              onClick={() => setOrigin(d.isOrigin ? null : code)}
              aria-pressed={d.isOrigin}
              title="Pakai upah minimum daerah ini sebagai gaji saat melihat biaya daerah lain"
              className={`inline-flex h-9 min-w-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-[10px] px-2 text-[13px] font-semibold transition-colors pointer-coarse:h-11 pointer-coarse:min-w-11 ${
                d.isOrigin
                  ? "bg-accent-soft text-accent-ink"
                  : "text-ink-2 hover:bg-paper-2"
              }`}
            >
              <MapPinLine
                size={15}
                weight={d.isOrigin ? "fill" : "bold"}
                aria-hidden="true"
              />
              <span className="@max-[25rem]:sr-only pointer-coarse:@max-[26rem]:sr-only">
                Kota asal
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => void share.share()}
            aria-label={`${share.label}. ${share.hint}`}
            title={share.hint}
            className="grid h-9 w-9 place-items-center rounded-[10px] text-ink-2 hover:bg-paper-2 pointer-coarse:h-11 pointer-coarse:w-11"
          >
            {share.status === "copied" || share.status === "shared" ? (
              <Check size={16} weight="bold" aria-hidden="true" />
            ) : (
              <ShareNetwork size={16} aria-hidden="true" />
            )}
          </button>
          <span className="sr-only" aria-live="polite">
            {share.status !== "idle" ? share.label : ""}
          </span>
        </div>
      </div>

      <Kicker>
        {d.province}
        <span aria-hidden="true">·</span>
        {tierLabel(d.tier)}
        <span aria-hidden="true">·</span>
        <span className="tnum normal-case tracking-normal">{code}</span>
      </Kicker>
      <h1
        id="region-title"
        tabIndex={-1}
        className="f-display text-balance mt-2 text-[clamp(30px,3vw,42px)] font-[580] leading-[1.04] tracking-[-0.018em] outline-none"
      >
        {d.title}
      </h1>

      {state.dataStatus === "error" ? (
        <div
          role="alert"
          className="mt-6 rounded-[12px] border border-rule-2 p-5"
        >
          <p className="text-[14.5px] font-semibold">
            Data upah &amp; biaya belum bisa dimuat.
          </p>
          <p className="mt-1 text-[13.5px] leading-[1.55] text-ink-2">
            Batas wilayahnya tetap tampil di peta. Periksa koneksi, lalu coba
            lagi.
          </p>
          <button
            type="button"
            onClick={retryData}
            className="mt-3 h-10 rounded-[10px] bg-ink px-4 text-[13.5px] font-semibold text-paper"
          >
            Coba lagi
          </button>
        </div>
      ) : state.dataStatus !== "ready" ? (
        <div
          className="mt-6 space-y-3"
          role="status"
          aria-label="Memuat data daerah"
        >
          <div className="skel h-6 w-[85%]" />
          <div className="skel h-6 w-[60%]" />
          <div className="skel mt-6 h-5 w-full" />
          <div className="skel mt-6 h-40 w-full" />
        </div>
      ) : !m || !d.hasData ? (
        <div
          role="status"
          className="mt-6 rounded-[12px] border border-dashed border-rule-2 p-5 text-[14px] leading-[1.6]"
        >
          <p className="font-semibold">Belum ada data untuk {d.title}.</p>
          <p className="mt-1 text-ink-2">
            Batas wilayahnya ada di peta, tetapi catatan upah atau biayanya
            belum masuk dataset. Daerah seperti ini tampil berarsir.
          </p>
        </div>
      ) : (
        <>
          <p className="f-display text-pretty mt-5 text-[21px] leading-[1.38] text-ink">
            {incomeSubject(m, a, originName, incomeKind)}{" "}
            {m.surplusOrDeficit >= 0 ? (
              <>
                menutup{" "}
                <b
                  className="tnum font-[620]"
                  style={{ color: theme[m.band].ink }}
                >
                  {pct(m.coveragePercent)}
                </b>{" "}
                biaya hidup bulanan dan menyisakan{" "}
                <b className="tnum font-[620] text-ok">
                  {rpShort(m.surplusOrDeficit)}
                </b>
                .
              </>
            ) : (
              <>
                hanya menutup{" "}
                <b
                  className="tnum font-[620]"
                  style={{ color: theme[m.band].ink }}
                >
                  {pct(m.coveragePercent)}
                </b>{" "}
                biaya hidup bulanan — kurang{" "}
                <b className="tnum font-[620] text-danger">
                  {rpShort(m.surplusOrDeficit)}
                </b>{" "}
                setiap bulan.
              </>
            )}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
            <BandChip band={m.band} dark={state.darkMode} withRange />
            {rank > 0 && (
              <span className="tnum text-[12.5px] text-muted">
                {rankPhrase(rank, ranking.total, provRank, peers.length)}
              </span>
            )}
          </div>

          <section aria-label="Upah dibandingkan biaya hidup" className="mt-6">
            <BudgetBar
              metric={m}
              rows={rows}
              dark={state.darkMode}
              wageText={`${wageLabel(m, a, incomeKind)} ${rpShort(m.wageAmount)}`}
              highlight={hl}
            />
          </section>

          <Needed metric={m} />

          {medians && (
            <Versus metric={m} medians={medians} kind={destKind} a={a} />
          )}

          <section
            className="mt-8 rounded-[16px] border border-rule p-4"
            aria-labelledby="region-income"
          >
            <h2
              id="region-income"
              className="mb-2.5 text-[12px] font-bold uppercase tracking-[0.12em] text-muted"
            >
              Hitung dengan
            </h2>
            <IncomeControl seed={singleWage} compact />
          </section>

          {state.originCode && d.originRegion && !d.isOrigin && (
            <p className="mt-4 rounded-[10px] bg-accent-soft px-3.5 py-2.5 text-[13px] leading-[1.5]">
              <b>Mode pindah kota.</b> Gaji dari {originName}, biaya dari{" "}
              {d.label}.{" "}
              <button
                type="button"
                onClick={() => setOrigin(null)}
                className="font-semibold underline underline-offset-2"
              >
                Matikan
              </button>
            </p>
          )}

          <section className="mt-8" aria-label="Rincian bulanan">
            <Receipt
              metric={m}
              rows={rows}
              incomeLabel={receiptIncomeLabel(m)}
              incomeNote={
                regionalIncome
                  ? undefined
                  : `${m.partnerWageSource ? `Dua ${destKind}` : destKind} daerah ini: ${digits(m.regionalWageAmount)}`
              }
              medians={medians?.categories ?? null}
              dark={state.darkMode}
              highlight={hl}
              onHighlight={setHl}
            />
            <p className="mt-3 flex items-start justify-between gap-3 text-[12.5px] leading-[1.5] text-muted">
              <span>Profil: {profileSummary(a)}</span>
              <span className="flex shrink-0 flex-col items-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setReceiptShare(true)}
                  className="inline-flex items-center gap-1 font-semibold text-accent-ink hover:underline"
                >
                  <ShareNetwork size={13} weight="bold" aria-hidden="true" />
                  Bagikan struk
                </button>
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="inline-flex items-center gap-1 font-semibold text-accent-ink hover:underline"
                >
                  <PencilSimple size={13} weight="bold" aria-hidden="true" />
                  Ubah profil
                </button>
              </span>
            </p>
            {receiptShare && (
              <ReceiptShareDialog
                input={receiptInput(m)}
                personal={
                  m.wageSource === "custom" ||
                  m.partnerWageSource === "custom" ||
                  (a.installmentMonthly ?? 0) > 0 ||
                  m.familySupport > 0
                }
                onClose={() => setReceiptShare(false)}
              />
            )}
          </section>

          {d.narrative && (
            <section className="mt-10" aria-labelledby="region-note">
              <SectionTitle id="region-note">Catatan daerah</SectionTitle>
              <blockquote className="f-display text-pretty border-l-2 border-accent pl-4 text-[17px] leading-[1.55] text-ink-2">
                {d.narrative.interpretation}
              </blockquote>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-[13px] leading-[1.5] max-[380px]:grid-cols-1">
                <div>
                  <dt className="font-semibold text-ink">Sewa tipikal</dt>
                  <dd className="tnum mt-0.5 text-[15px] font-semibold">
                    {rpShort(d.narrative.rentRange.min)} –{" "}
                    {rpShort(d.narrative.rentRange.max)}
                  </dd>
                  <dd className="mt-1 text-ink-2">
                    {d.narrative.rentRange.note}
                  </dd>
                  <dd
                    className="mt-1.5 text-[11.5px] text-muted"
                    title={d.narrative.rentRange.provenance.source}
                  >
                    {confidenceLabel(
                      d.narrative.rentRange.provenance.confidence,
                    )}{" "}
                    model · per{" "}
                    {formatMonth(d.narrative.rentRange.provenance.asOf)} ·
                    konteks, tidak ikut dihitung
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Transportasi</dt>
                  <dd className="mt-0.5 text-ink-2">
                    {d.narrative.transportContext}
                  </dd>
                </div>
              </dl>
            </section>
          )}

          {ranking.ready && (
            <section className="mt-10" aria-labelledby="region-pos">
              <SectionTitle
                id="region-pos"
                aside={
                  <span className="tnum text-[12px] text-muted">
                    ▼ median {pct(ranking.medianCoverage, 1)}
                  </span>
                }
              >
                Posisinya di antara {ranking.total} daerah
              </SectionTitle>
              <DotStrip
                ranked={ranking.ranked}
                dark={state.darkMode}
                median={ranking.medianCoverage}
                focusCode={code}
                onHover={onHover}
                onSelect={select}
                height={84}
              />
            </section>
          )}

          {peers.length > 1 && (
            <section className="mt-10" aria-labelledby="region-prov">
              <SectionTitle
                id="region-prov"
                aside={
                  <span className="text-[12px] text-muted">
                    {peers.length} daerah
                  </span>
                }
              >
                Di {d.province}
              </SectionTitle>
              <ProvincePeers
                peers={peers}
                code={code}
                dark={state.darkMode}
                onSelect={select}
                onHover={onHover}
              />
            </section>
          )}

          <details className="group mt-10 border-t border-rule pt-3">
            <summary className="flex cursor-pointer list-none items-center justify-between py-1 text-[13px] font-bold">
              Sumber &amp; tanggal data (
              {rows.length +
                (d.narrative ? 1 : 0) +
                (d.wageProvenance ? 1 : 0) +
                (m.wageSource === "origin" && d.wage ? 1 : 0) +
                (netEstimate ? 1 : 0)}{" "}
              angka)
              <span
                aria-hidden="true"
                className="text-muted transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <table className="mt-2 w-full text-left text-[12px] leading-[1.45]">
              <thead className="text-muted">
                <tr>
                  <th scope="col" className="py-1.5 pr-2 font-medium">
                    Angka
                  </th>
                  <th scope="col" className="py-1.5 pr-2 font-medium">
                    Sumber
                  </th>
                  <th scope="col" className="py-1.5 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {d.wageProvenance && (
                  <ProvRow
                    label={`${m.wageSource === "origin" ? `${incomeKind} kota asal` : incomeKind} ${d.wageProvenance.year}`}
                    source={d.wageProvenance.source}
                    confidence={d.wageProvenance.confidence}
                    asOf={d.wageProvenance.asOf}
                  />
                )}
                {m.wageSource === "origin" && d.wage && (
                  <ProvRow
                    label={`${destKind} daerah ini ${d.wage.year}`}
                    source={d.wage.source}
                    confidence={d.wage.confidence}
                    asOf={d.wage.asOf}
                  />
                )}
                {netEstimate && d.wageProvenance && (
                  <ProvRow
                    label="Potongan BPJS & PPh"
                    source="Upah setelah potongan diperkirakan ±96% dari upah minimum kotor."
                    confidence="estimate"
                    asOf={d.wageProvenance.asOf}
                  />
                )}
                {rows.map((r) =>
                  r.provenance ? (
                    <ProvRow
                      key={r.key}
                      label={r.label}
                      source={r.provenance.source}
                      confidence={r.provenance.confidence}
                      asOf={r.provenance.asOf}
                    />
                  ) : (
                    <ProvRow
                      key={r.key}
                      label={r.label}
                      source="Isianmu, bukan dataset; sama untuk semua daerah."
                    />
                  ),
                )}
                {d.narrative && (
                  <ProvRow
                    label="Rentang sewa tipikal"
                    source={d.narrative.rentRange.provenance.source}
                    confidence={d.narrative.rentRange.provenance.confidence}
                    asOf={d.narrative.rentRange.provenance.asOf}
                  />
                )}
              </tbody>
            </table>
            <a
              href="/metode#sumber"
              className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-semibold text-accent-ink hover:underline"
            >
              Cara angka ini dihitung
              <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
            </a>
          </details>

          <div className="mt-6 flex items-center justify-between gap-4 rounded-[12px] border border-rule px-4 py-3">
            <p className="text-[12.5px] leading-[1.5] text-muted">
              Estimasi, bukan nasihat keuangan. Angka meleset? Laporan diperiksa
              manual dan tidak mengubah data otomatis.
            </p>
            <a
              href={CORRECTION_FORM_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => recordUsage("correction_report_opened")}
              aria-label={`Laporkan angka untuk ${d.label} (membuka formulir di tab baru)`}
              className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-accent-ink hover:underline"
            >
              Laporkan
              <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </>
      )}
    </article>
  );
}

/** The income this region asks for, at the Cukup and Nyaman thresholds. */
function Needed({ metric }: { metric: RegionMetrics }) {
  const { enough, comfortable } = incomeTargets(metric.totalMonthlyCost);
  return (
    <section aria-labelledby="region-needed" className="mt-6">
      <h2 id="region-needed" className="sr-only">
        Pendapatan yang dibutuhkan
      </h2>
      <dl className="grid grid-cols-2 overflow-hidden rounded-[12px] border border-rule">
        <div className="px-4 py-3">
          <dt className="text-[12px] font-semibold text-muted">
            Agar cukup (100%)
          </dt>
          <dd className="f-display tnum mt-0.5 text-[22px] font-[560] leading-tight">
            {rpShort(enough)}
          </dd>
        </div>
        <div className="border-l border-rule px-4 py-3">
          <dt className="text-[12px] font-semibold text-muted">
            Agar nyaman (120%)
          </dt>
          <dd className="f-display tnum mt-0.5 text-[22px] font-[560] leading-tight">
            {rpShort(comfortable)}
          </dd>
        </div>
      </dl>
      <p className="mt-1.5 text-[12px] text-muted">
        Pendapatan rumah tangga per bulan untuk profil ini (estimasi).
      </p>
    </section>
  );
}

/**
 * Why this region lands where it does, against the national middle: its
 * wage (when the region's own UMK is used), its total cost, and the cost
 * lines that push it furthest up or down.
 */
function Versus({
  metric,
  medians,
  kind,
  a,
}: {
  metric: RegionMetrics;
  medians: NationalMedians;
  /** UMK or UMP — the region's own wage. */
  kind: WageKind;
  a: Assumptions;
}) {
  const { heavier, lighter } = standoutCategories(metric, medians.categories);
  const wage = versusMedian(metric.regionalWageAmount, medians.regionalWage);
  const cost = versusMedian(metric.totalMonthlyCost, medians.totalCost);
  // dir: above/below the median; good: whether that helps the household.
  const lines: {
    key: string;
    dir: "up" | "down" | null;
    good: boolean;
    text: React.ReactNode;
  }[] = [];

  const relative = (ratio: number | null, near: number) =>
    ratio === null || Math.abs(ratio) < near
      ? null
      : `${pct(Math.abs(ratio * 100))} ${ratio > 0 ? "di atas" : "di bawah"}`;

  if (isRegionalIncome(metric)) {
    const rel = relative(wage.ratio, 0.05);
    lines.push({
      key: "wage",
      dir: rel ? (wage.diff > 0 ? "up" : "down") : null,
      good: wage.diff > 0,
      text: (
        <>
          <b>{metric.partnerWageSource ? `Dua ${kind}` : kind}</b>{" "}
          {rpShort(metric.regionalWageAmount)} —{" "}
          {rel
            ? `${rel} median nasional ${rpShort(medians.regionalWage)}`
            : "setara median nasional"}
          .
        </>
      ),
    });
  }
  const costRel = relative(cost.ratio, 0.03);
  lines.push({
    key: "cost",
    dir: costRel ? (cost.diff > 0 ? "up" : "down") : null,
    good: cost.diff < 0,
    text: (
      <>
        <b>Biaya hidup</b> {rpShort(metric.totalMonthlyCost)} —{" "}
        {costRel
          ? `${costRel} median nasional ${rpShort(medians.totalCost)}`
          : "setara median nasional"}
        .
      </>
    ),
  });
  if (heavier) {
    lines.push({
      key: "heavier",
      dir: "up",
      good: false,
      text: (
        <>
          <b>{categoryLabel(heavier.key, a)}</b> {rpShort(heavier.value)} —{" "}
          {heavier.ratio !== null &&
            `${pct(heavier.ratio * 100)} di atas median; `}
          penyumbang selisih terbesar.
        </>
      ),
    });
  }
  if (lighter) {
    lines.push({
      key: "lighter",
      dir: "down",
      good: true,
      text: (
        <>
          <b>{categoryLabel(lighter.key, a)}</b> {rpShort(lighter.value)} —{" "}
          {lighter.ratio !== null &&
            `${pct(Math.abs(lighter.ratio * 100))} di bawah median; `}
          yang paling meringankan.
        </>
      ),
    });
  }

  return (
    <section aria-labelledby="region-versus" className="mt-7">
      <h2
        id="region-versus"
        className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted"
      >
        Dibanding median nasional
      </h2>
      <ul className="space-y-1.5 text-[13.5px] leading-[1.5] text-ink-2 [&_b]:font-semibold [&_b]:text-ink">
        {lines.map((l) => (
          <li key={l.key} className="flex gap-2">
            {l.dir === null ? (
              <span
                aria-hidden="true"
                className="mt-[9px] h-[2px] w-3 shrink-0 bg-muted"
              />
            ) : (
              (() => {
                const Icon = l.dir === "up" ? CaretUp : CaretDown;
                return (
                  <Icon
                    size={14}
                    weight="bold"
                    className={`mt-[3px] shrink-0 ${l.good ? "text-ok" : "text-danger"}`}
                    aria-hidden="true"
                  />
                );
              })()
            )}
            <span>{l.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** One provenance line; without confidence it is the user's own number. */
function ProvRow({
  label,
  source,
  confidence,
  asOf,
}: {
  label: string;
  source: string;
  confidence?: Parameters<typeof confidenceLabel>[0];
  asOf?: string;
}) {
  return (
    <tr className="border-t border-rule align-top">
      <th scope="row" className="py-2 pr-2 font-medium">
        {label}
      </th>
      <td className="py-2 pr-2 text-ink-2">{source}</td>
      <td className="whitespace-nowrap py-2">
        {confidence ? confidenceLabel(confidence) : "Isianmu"}
        {asOf && (
          <time
            dateTime={asOf}
            className="block text-muted"
            title={formatDate(asOf)}
          >
            {asOf.slice(0, 7)}
          </time>
        )}
      </td>
    </tr>
  );
}
