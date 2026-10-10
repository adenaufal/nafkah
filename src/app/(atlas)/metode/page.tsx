import type { Metadata } from "next";
import Link from "next/link";
import { methodFacts } from "@/data/buildTime";
import {
  CHILD_MULTIPLIERS,
  HOUSEHOLD_MULTIPLIERS,
  HOUSING_MULTIPLIERS,
  LIFESTYLE_MULTIPLIERS,
  TRANSPORT_MULTIPLIERS,
} from "@/data/multipliers";
import { EXPENSE_CATEGORIES } from "@/data/costs";
import {
  AFFORDABILITY_BANDS,
  BAND_LABEL,
  DEFAULT_ASSUMPTIONS,
} from "@/lib/calculations";
import { BAND_ORDER, bandRange } from "@/lib/bands";
import { formatDate, formatMonth, pct, rpShort } from "@/lib/format";
import { CORRECTION_FORM_URL } from "@/lib/links";
import { profileSummary } from "@/lib/profile";
import type { AffordabilityBand } from "@/lib/types";
import {
  MethodShell,
  ProfileBands,
  WorkedExample,
} from "@/components/doc/MethodLive";
import type { TocItem } from "@/components/doc/Toc";

export const metadata: Metadata = {
  title: "Metode perhitungan",
  description:
    "Bagaimana Nafkah menghitung cakupan upah terhadap biaya hidup di 514 kabupaten/kota: rumus, sumber UMK 2026, 10 kategori biaya, pengali profil, uji sensitivitas, dan batasannya.",
  alternates: { canonical: "/metode" },
};

const REPO = "https://github.com/adenaufal/nafkah";
const DOC = (file: string) => `${REPO}/blob/main/docs/${file}`;

const TOC: TocItem[] = [
  { id: "ringkas", label: "Ringkasnya" },
  { id: "rumus", label: "Rumusnya" },
  { id: "band", label: "Empat band" },
  { id: "upah", label: "Upah" },
  { id: "biaya", label: "Biaya hidup" },
  { id: "profil", label: "Profil & pengali" },
  { id: "keyakinan", label: "Seberapa yakin" },
  { id: "batasan", label: "Batasan" },
  { id: "versi", label: "Versi & koreksi" },
];

const MEANING: Record<AffordabilityBand, string> = {
  comfortable:
    "Biaya hidup tertutup dan masih tersisa seperlimanya atau lebih.",
  manageable: "Biaya hidup tertutup, sisanya tipis.",
  tight: "Kurang, sampai seperlima biaya hidup.",
  insufficient: "Kurang lebih dari seperlima biaya hidup.",
};

const num = (v: number) =>
  v.toLocaleString("id-ID", { maximumFractionDigits: 3 });
const times = (v: number | undefined) =>
  v === undefined ? "×1" : `×${num(v)}`;

function Section({
  id,
  n,
  title,
  children,
}: {
  id: string;
  n?: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-h`}
      className="scroll-mt-32 pt-14 lg:scroll-mt-20"
    >
      <h2
        id={`${id}-h`}
        className="f-display flex items-baseline gap-3 text-[28px] font-[580] leading-tight tracking-[-0.012em]"
      >
        {n !== undefined && (
          <span
            className="tnum text-[15px] font-semibold text-accent"
            aria-hidden="true"
          >
            {String(n).padStart(2, "0")}
          </span>
        )}
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15.5px] leading-[1.7] text-ink-2 [&_b]:font-semibold [&_b]:text-ink">
        {children}
      </div>
    </section>
  );
}

function Swatch({ band }: { band: AffordabilityBand }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-3 w-3 shrink-0 rounded-full"
      style={{ background: `var(--band-${band})` }}
    />
  );
}

export default function MetodePage() {
  const f = methodFacts();
  const b = AFFORDABILITY_BANDS;
  const lo = 50;
  const hi = 150;
  const at = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  const segments: { band: AffordabilityBand; from: number; to: number }[] = [
    { band: "insufficient", from: lo, to: b.tightAt },
    { band: "tight", from: b.tightAt, to: b.manageableAt },
    { band: "manageable", from: b.manageableAt, to: b.comfortableAt },
    { band: "comfortable", from: b.comfortableAt, to: hi },
  ];

  return (
    <MethodShell toc={TOC}>
      <main id="isi" className="min-w-0 max-w-[70ch] pb-24 pt-10">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Metode · dataset {f.datasetVersion}
          </p>
          <h1 className="f-display text-balance mt-3 text-[clamp(34px,4.4vw,48px)] font-[580] leading-[1.06] tracking-[-0.018em]">
            Bagaimana Nafkah menghitung cukup atau tidaknya upah.
          </h1>
          <p className="text-pretty mt-5 text-[18px] leading-[1.6] text-ink-2">
            Setiap warna di peta berasal dari satu pembagian: pendapatan dibagi
            estimasi biaya hidup bulanan. Halaman ini menjelaskan dari mana
            kedua angka itu datang, bagaimana profilmu mengubahnya, dan seberapa
            jauh hasilnya bisa dipegang.
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-y border-rule py-3 text-[13px]">
            {[
              ["Dataset", f.datasetVersion],
              ["Dirilis", formatDate(f.generatedAt)],
              [
                "Cakupan",
                `${f.regionCount} kab/kota · ${f.provinceCount} provinsi`,
              ],
              ["Lisensi data", "CC BY 4.0"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-1.5">
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </header>

        <Section id="ringkas" title="Ringkasnya">
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              {
                t: "Satu rumus",
                d: "Cakupan = pendapatan ÷ biaya hidup bulanan × 100%. Warna peta hanya membaca angka ini.",
              },
              {
                t: "Upah resmi",
                d: `UMK/UMP 2026 dari SK gubernur tiap provinsi, berstatus resmi untuk ${f.regionCount} daerah.`,
              },
              {
                t: "Biaya hasil model",
                d: "10 kategori pengeluaran per daerah, dimodelkan dari agregat Susenas, IHK BPS, dan benchmark harga lokal — bukan survei langsung di tiap kota.",
              },
              {
                t: "Bergantung profil",
                d: "Lajang atau keluarga, kost atau KPR: satu pilihan bisa memindahkan ratusan daerah antarband.",
              },
            ].map((x) => (
              <li key={x.t} className="rounded-[14px] border border-rule p-4">
                <p className="text-[14px] font-bold text-ink">{x.t}</p>
                <p className="mt-1 text-[14px] leading-[1.6]">{x.d}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="rumus" n={1} title="Rumusnya">
          <div className="rounded-[16px] border border-rule bg-paper-2 px-6 py-5 text-ink max-sm:px-4">
            <p className="f-display text-[clamp(19px,2.4vw,24px)] leading-[1.45]">
              Cakupan = <span className="text-accent-ink">Pendapatan</span> ÷{" "}
              <span className="text-accent-ink">Biaya hidup bulanan</span> ×
              100%
            </p>
            <p className="f-display mt-1 text-[clamp(16px,2vw,19px)] leading-[1.45] text-ink-2">
              Sisa (atau kurang) = Pendapatan − Biaya hidup bulanan
            </p>
          </div>
          <p>
            <b>Pendapatan</b> awalnya UMK/UMP daerah itu sendiri. Kamu bisa
            menggantinya dengan <b>gajimu</b> (satu angka yang diuji di semua
            daerah) atau dengan <b>UMK kota asal</b> untuk simulasi pindah kota
            — biayanya tetap biaya daerah tujuan. Bila pasangan ikut bekerja,
            pendapatan ditambah satu upah minimum daerah yang sama.
          </p>
          <p>
            <b>Biaya hidup bulanan</b> adalah jumlah 10 kategori pengeluaran
            daerah itu setelah dikalikan faktor profil (bagian 5).
          </p>
          <WorkedExample />
        </Section>

        <Section id="band" n={2} title="Empat band">
          <p>
            Cakupan dikelompokkan ke empat band. Ambangnya konstanta di kode,
            bukan hasil penyesuaian agar peta terlihat lebih hijau atau lebih
            merah.
          </p>
          <div className="pt-6" aria-hidden="true">
            <div className="relative h-3.5 overflow-hidden rounded-[3px]">
              {segments.map((s) => (
                <span
                  key={s.band}
                  className="absolute inset-y-0"
                  style={{
                    left: at(s.from),
                    width: `calc(${at(s.to)} - ${at(s.from)})`,
                    background: `var(--band-${s.band})`,
                  }}
                />
              ))}
            </div>
            <div className="tnum relative mt-1.5 h-4 text-[12px] text-muted">
              {[b.tightAt, b.manageableAt, b.comfortableAt].map((t) => (
                <span
                  key={t}
                  className="absolute -translate-x-1/2"
                  style={{ left: at(t) }}
                >
                  {t}%
                </span>
              ))}
            </div>
          </div>
          <table className="w-full text-left text-[14px]">
            <caption className="sr-only">
              Band keterjangkauan dan artinya
            </caption>
            <thead className="text-[12px] text-muted">
              <tr className="border-b border-rule">
                <th scope="col" className="py-2 pr-3 font-medium">
                  Band
                </th>
                <th scope="col" className="py-2 pr-3 font-medium">
                  Cakupan
                </th>
                <th scope="col" className="py-2 font-medium">
                  Artinya
                </th>
              </tr>
            </thead>
            <tbody>
              {BAND_ORDER.map((band) => (
                <tr key={band} className="border-b border-rule align-top">
                  <th
                    scope="row"
                    className="py-2.5 pr-3 font-semibold text-ink"
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <Swatch band={band} />
                      {BAND_LABEL[band]}
                    </span>
                  </th>
                  <td className="tnum whitespace-nowrap py-2.5 pr-3">
                    {bandRange(band)}
                  </td>
                  <td className="py-2.5">{MEANING[band]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <ProfileBands />
          <p className="text-[14px] text-muted">
            Warna band selalu disertai nama dan angkanya — di peta, legenda, dan
            setiap daerah — jadi tidak ada informasi yang hanya bergantung pada
            warna. Daerah tanpa data tampil berarsir.
          </p>
        </Section>

        <Section id="upah" n={3} title="Upah">
          <p>
            Upah memakai UMP/UMK 2026 resmi (PP No. 49 Tahun 2025, berlaku 1
            Januari 2026). Daerah tanpa UMK sendiri memakai Upah Minimum
            Provinsi (UMP): di dataset ini {f.wage.umk} daerah memakai UMK dan{" "}
            {f.wage.ump} memakai UMP, dan aplikasi menyebut keduanya sesuai
            sumbernya. Rentangnya {rpShort(f.wage.min)} sampai{" "}
            {rpShort(f.wage.max)} per bulan, dengan median{" "}
            {rpShort(f.wage.median)}
            {f.wage.allOfficial ? "; semuanya berstatus resmi" : ""}.
          </p>
          <aside className="rounded-[14px] border-l-[3px] border-accent bg-accent-soft/60 px-4 py-3 text-[14.5px]">
            <b>UMK itu lantai, bukan gaji nyata.</b> Upah minimum adalah batas
            bawah yang ditetapkan pemerintah — bukan potret gaji yang
            benar-benar dibayar. Baca warna peta sebagai “apakah lantai upah
            resmi cukup di sini”. Untuk angkamu sendiri, pilih <b>Gajiku</b> di
            peta.
          </aside>
          {f.wage.takeHomeShare !== null && (
            <p>
              Opsi <b>setelah potongan</b> memakai estimasi take-home{" "}
              {pct(f.wage.takeHomeShare * 100)} dari upah kotor (potongan BPJS
              &amp; PPh) dan diberi label estimasi.
            </p>
          )}
          <details className="group rounded-[14px] border border-rule">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-[14px] font-semibold text-ink">
              Dasar hukum upah per provinsi ({f.wageSources.length} provinsi)
              <span
                aria-hidden="true"
                className="text-muted transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="thin-scroll max-h-[420px] overflow-y-auto border-t border-rule">
              <table className="w-full text-left text-[13px] leading-[1.5]">
                <thead className="sticky top-0 bg-paper text-[12px] text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Provinsi
                    </th>
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Sumber (SK)
                    </th>
                    <th
                      scope="col"
                      className="py-2 pr-4 text-right font-medium"
                    >
                      Daerah
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {f.wageSources.flatMap((p) =>
                    p.sources.map((s, i) => (
                      <tr
                        key={`${p.province}-${i}`}
                        className="border-t border-rule align-top"
                      >
                        {i === 0 && (
                          <th
                            scope="row"
                            rowSpan={p.sources.length}
                            className="px-4 py-2 font-semibold text-ink"
                          >
                            {p.province}
                          </th>
                        )}
                        <td className="py-2 pr-4">{s.source}</td>
                        <td className="tnum py-2 pr-4 text-right">
                          {s.regions}
                        </td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </details>
        </Section>

        <Section id="biaya" n={4} title="Biaya hidup">
          <p>
            Biaya hidup bulanan adalah jumlah 10 kategori. Nilai dasarnya
            disimpan per daerah untuk satu profil acuan — lajang, gaya hidup
            standar, hunian dasar (“Rumah KPR” di aplikasi), motor, dengan
            tabungan — lalu dikalikan faktor profil. Setiap nilai membawa{" "}
            <b>sumber</b>, <b>tanggal</b>, dan <b>status keyakinan</b> sendiri,
            per kategori per daerah.
          </p>
          <p className="text-[12px] text-muted sm:hidden" aria-hidden="true">
            Geser tabel ke samping untuk kolom lain →
          </p>
          <div
            id="sumber"
            className="thin-scroll scroll-mt-32 overflow-x-auto lg:scroll-mt-20"
          >
            <table className="w-full min-w-[520px] text-left text-[13px] leading-[1.5]">
              <caption className="sr-only">
                Sumber tiap kategori biaya hidup
              </caption>
              <thead className="text-[12px] text-muted">
                <tr className="border-b border-rule">
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Kategori
                  </th>
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Cara angkanya disusun
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {f.categories.map((c) => (
                  <tr key={c.key} className="border-b border-rule align-top">
                    <th
                      scope="row"
                      className="py-2.5 pr-3 font-semibold text-ink"
                    >
                      {c.label}
                    </th>
                    <td className="py-2.5 pr-3">
                      {c.sources.length === 1
                        ? c.sources[0].source
                        : `${c.sources.length} sumber berbeda — lihat detail tiap daerah.`}
                    </td>
                    <td className="whitespace-nowrap py-2.5">
                      {c.sources.length === 1 ? (
                        <>
                          {c.sources[0].confidence === "official"
                            ? "Resmi"
                            : c.sources[0].confidence === "estimate"
                              ? "Estimasi"
                              : "Sampel"}
                          <span className="block text-[12px] text-muted">
                            per {formatMonth(c.sources[0].asOf)}
                          </span>
                        </>
                      ) : (
                        "Beragam"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[14px] text-muted">
            Status bisa berbeda per sel: upah sebuah daerah bisa resmi sementara
            sewanya masih estimasi. Rentang sewa tipikal yang tampil di cerita
            daerah hanya konteks dan tidak ikut menghitung cakupan.
          </p>
        </Section>

        <Section id="profil" n={5} title="Profil & pengali">
          <p>
            Profil tidak mengganti data daerah; ia mengalikan nilai dasar tiap
            kategori. Semua faktor adalah data yang bisa diperiksa di{" "}
            <a
              href={`${REPO}/blob/main/src/data/multipliers.ts`}
              className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
            >
              src/data/multipliers.ts
            </a>
            .
          </p>
          <p className="text-[12px] text-muted sm:hidden" aria-hidden="true">
            Geser tabel ke samping untuk kolom lain →
          </p>
          <div className="thin-scroll overflow-x-auto">
            <table className="tnum w-full min-w-[520px] text-left text-[13px]">
              <caption className="sr-only">
                Pengali per kategori untuk pasangan, tiap anak, dan gaya hidup
              </caption>
              <thead className="text-[12px] text-muted">
                <tr className="border-b border-rule">
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Kategori
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">
                    Pasangan
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">
                    + tiap anak
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-medium">
                    Hemat
                  </th>
                  <th scope="col" className="py-2 text-right font-medium">
                    Longgar
                  </th>
                </tr>
              </thead>
              <tbody>
                {EXPENSE_CATEGORIES.map((c) => (
                  <tr key={c.key} className="border-b border-rule">
                    <th scope="row" className="py-2 pr-3 font-medium text-ink">
                      {c.label}
                    </th>
                    <td className="py-2 pr-3 text-right">
                      {times(HOUSEHOLD_MULTIPLIERS.couple[c.key])}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {CHILD_MULTIPLIERS[c.key]
                        ? `+${num(CHILD_MULTIPLIERS[c.key]!)}`
                        : "—"}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {times(LIFESTYLE_MULTIPLIERS.budget[c.key])}
                    </td>
                    <td className="py-2 text-right">
                      {times(LIFESTYLE_MULTIPLIERS.comfortable[c.key])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            <b>Keluarga = pasangan + anak.</b> Faktor anak ditambahkan ke faktor
            rumah tangga — makanan untuk dua anak, misalnya,{" "}
            {num(HOUSEHOLD_MULTIPLIERS.couple.food ?? 1)} + 2 ×{" "}
            {num(CHILD_MULTIPLIERS.food ?? 0)} ={" "}
            {num(
              (HOUSEHOLD_MULTIPLIERS.couple.food ?? 1) +
                2 * (CHILD_MULTIPLIERS.food ?? 0),
            )}{" "}
            — mengikuti konsep skala ekuivalensi OECD-modified (estimasi, bukan
            survei primer).
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[14px] border border-rule p-4">
              <dt className="text-[14px] font-bold text-ink">
                Hunian (kategori sewa)
              </dt>
              <dd className="tnum mt-1 text-[14px]">
                Rusun/kost {times(HOUSING_MULTIPLIERS.room)} · Rumah KPR{" "}
                {times(HOUSING_MULTIPLIERS.studio)} · Apartemen{" "}
                {times(HOUSING_MULTIPLIERS.oneBedroom)}
              </dd>
              <dd className="mt-1 text-[13px] text-muted">
                Cicilan sendiri menggantikan seluruh kategori hunian dengan
                angkamu.
              </dd>
            </div>
            <div className="rounded-[14px] border border-rule p-4">
              <dt className="text-[14px] font-bold text-ink">Transportasi</dt>
              <dd className="tnum mt-1 text-[14px]">
                Motor {times(TRANSPORT_MULTIPLIERS.motorcycle)} · Kend. umum{" "}
                {times(TRANSPORT_MULTIPLIERS.publicTransport)} · Ojol{" "}
                {times(TRANSPORT_MULTIPLIERS.rideHailing)}
              </dd>
              <dd className="mt-1 text-[13px] text-muted">
                Tanpa tabungan, kategori dana cadangan menjadi nol.
              </dd>
            </div>
          </dl>
          <p>
            <b>Pilihan awal</b> peta adalah{" "}
            {profileSummary(DEFAULT_ASSUMPTIONS)}, upah kotor. Hunian awalnya
            rusun/kost karena pembanding utama peta ini adalah penerima upah
            minimum lajang; alasannya dicatat di{" "}
            <a
              href={DOC("kalibrasi-default-2026-09.md")}
              className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
            >
              catatan kalibrasi
            </a>
            .
          </p>
        </Section>

        <Section id="keyakinan" n={6} title="Seberapa yakin?">
          <p>
            Warna peta bukan sifat tetap sebuah daerah. Tabel ini menghitung
            ulang seluruh {f.sensitivity[0]?.distribution.total} daerah untuk
            beberapa profil lajang, memakai dataset yang sama persis — dihitung
            saat situs dibangun, bukan diketik tangan.
          </p>
          <p className="text-[12px] text-muted sm:hidden" aria-hidden="true">
            Geser tabel ke samping untuk kolom lain →
          </p>
          <div className="thin-scroll overflow-x-auto">
            <table className="tnum w-full min-w-[560px] text-left text-[13px]">
              <caption className="sr-only">
                Jumlah daerah per band untuk tiap profil pembanding, dan median
                cakupan
              </caption>
              <thead className="text-[12px] text-muted">
                <tr className="border-b border-rule">
                  <th scope="col" className="py-2 pr-3 font-medium">
                    Profil
                  </th>
                  <th scope="col" className="w-[30%] py-2 pr-3 font-medium">
                    Sebaran
                  </th>
                  {BAND_ORDER.map((band) => (
                    <th
                      key={band}
                      scope="col"
                      className="whitespace-nowrap py-2 pr-2 text-right font-medium"
                    >
                      {BAND_LABEL[band]}
                    </th>
                  ))}
                  <th scope="col" className="py-2 text-right font-medium">
                    Median
                  </th>
                </tr>
              </thead>
              <tbody>
                {f.sensitivity.map((row) => (
                  <tr key={row.id} className="border-b border-rule align-top">
                    <th scope="row" className="py-2.5 pr-3 font-normal">
                      <span className="block font-semibold text-ink">
                        {row.label}
                      </span>
                      <span className="block text-[12px] text-muted">
                        {row.note}
                      </span>
                    </th>
                    <td className="py-3 pr-3">
                      <span
                        className="flex h-2.5 gap-[2px] overflow-hidden rounded-full"
                        aria-hidden="true"
                      >
                        {BAND_ORDER.map((band) => (
                          <span
                            key={band}
                            style={{
                              flexGrow: row.distribution.counts[band],
                              background: `var(--band-${band})`,
                            }}
                          />
                        ))}
                      </span>
                    </td>
                    {BAND_ORDER.map((band) => (
                      <td key={band} className="py-2.5 pr-2 text-right">
                        {row.distribution.counts[band]}
                      </td>
                    ))}
                    <td className="py-2.5 text-right">
                      {pct(row.distribution.medianCoverage)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Bacalah angka di peta sebagai rentang, bukan vonis. Jarak antara
            baris pertama dan baris “hemat” adalah ukuran ketidakpastian model —
            bukan bukti bahwa salah satunya benar.
          </p>
        </Section>

        <Section id="batasan" n={7} title="Batasan yang perlu kamu tahu">
          <ul className="space-y-3">
            {[
              [
                "Bukan survei primer.",
                "Biaya hidup dimodelkan dari agregat; belum ada pengukuran langsung di setiap kabupaten/kota.",
              ],
              [
                "Satu angka per daerah.",
                "Biaya di pusat kota dan pinggiran bisa jauh berbeda; angka di sini adalah tipikal daerah.",
              ],
              [
                "UMK bukan gaji aktual.",
                "Banyak pekerja dibayar di atas atau di bawah upah minimum. Pakai Gajiku untuk angkamu sendiri.",
              ],
              [
                "Profil adalah penyederhanaan.",
                "Kebutuhan anak, kesehatan, atau tanggungan lain berbeda di tiap keluarga.",
              ],
              [
                "Data punya tanggal.",
                `Upah berlaku sejak ${formatDate(f.wage.asOf[0] ?? "2026-01-01")}; tanggal tiap nilai biaya tercantum di detail daerah.`,
              ],
              [
                "Sampel komunitas terpisah.",
                "Data yang dikumpulkan dari pengguna belum memengaruhi peta.",
              ],
              [
                "Bukan nasihat keuangan.",
                "Gunakan sebagai pembanding awal, bukan dasar tunggal keputusan.",
              ],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>
                  <b>{t}</b> {d}
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="versi" n={8} title="Versi, koreksi & audit">
          <p>
            Dataset aktif adalah <b>{f.datasetVersion}</b>, dirilis{" "}
            {formatDate(f.generatedAt)}: {f.regionCount} kabupaten/kota (
            {f.kabupatenCount} kabupaten, {f.kotaCount} kota) di{" "}
            {f.provinceCount} provinsi. Setiap perubahan data diperiksa skema
            dan uji integritas otomatis sebelum digabung, dan dicatat di{" "}
            <a
              href="/data/CHANGELOG.md"
              className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
            >
              catatan perubahan dataset
            </a>
            .
          </p>
          <div className="flex flex-col gap-3 rounded-[16px] border border-rule p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14.5px]">
              <b>Menemukan angka yang meleset?</b> Sertakan daerah, kategori,
              nilai lama dan usulan, periode, dan sumbernya. Laporan diperiksa
              manual terhadap penetapan resmi dan tidak mengubah data secara
              otomatis.
            </p>
            <a
              href={CORRECTION_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 shrink-0 items-center justify-center rounded-[10px] bg-accent px-4 text-[13.5px] font-bold text-on-accent hover:bg-accent-strong"
            >
              Laporkan angka
              <span className="sr-only"> (membuka formulir di tab baru)</span>
            </a>
          </div>
          <ul className="grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
            {[
              ["Kode & dataset di GitHub", REPO],
              ["Alur pencatatan koreksi", DOC("correction-ledger.md")],
              ["Audit daftar wilayah", DOC("audit-wilayah-2026-09.md")],
              ["Data komunitas", DOC("community-data.md")],
            ].map(([label, href]) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/booklet"
                className="font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent"
              >
                Booklet siap cetak (PDF A4)
              </Link>
            </li>
          </ul>
          <div className="rounded-[14px] bg-paper-2 px-4 py-3">
            <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
              Cara mengutip
            </p>
            <p className="mt-1 text-[14px] text-ink">
              Nafkah, dataset {f.datasetVersion} ({formatDate(f.generatedAt)}).
              nafkah.adenaufal.com — data CC BY 4.0, kode MIT.
            </p>
          </div>
        </Section>

        <p className="mt-16 border-t border-rule pt-5 text-[14px] text-muted">
          Siap mencoba dengan angkamu?{" "}
          <Link
            href="/"
            className="font-semibold text-accent-ink hover:underline"
          >
            Kembali ke peta →
          </Link>{" "}
          ·{" "}
          <Link
            href="/tentang"
            className="font-semibold text-accent-ink hover:underline"
          >
            Tentang Nafkah
          </Link>
        </p>
      </main>
    </MethodShell>
  );
}
