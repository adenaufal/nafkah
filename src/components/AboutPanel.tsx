"use client";

import { useRef, useState } from "react";
import { useApp } from "@/state/AppContext";
import {
  AFFORDABILITY_BANDS,
  BAND_LABEL,
  bandColors,
} from "@/lib/calculations";
import type { AffordabilityBand } from "@/lib/types";

const BAND_ORDER: AffordabilityBand[] = [
  "comfortable",
  "manageable",
  "tight",
  "insufficient",
];

const NAV: { id: string; label: string }[] = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "latar", label: "Latar belakang" },
  { id: "membaca", label: "Cara membacanya" },
  { id: "asumsi", label: "Arti asumsi" },
  { id: "sumber", label: "Sumber data" },
  { id: "bina", label: "Kontribusi" },
];

const REPO_URL = "https://github.com/adenaufal/nafkah";

/**
 * Drawer "Tentang" — dikendalikan dari context. Header sticky + daftar isi
 * horizontal; badan dibatasi 62ch agar terbaca. Di kaki: putar ulang tur dan
 * tampilkan kembali kartu 3 langkah.
 */
export function AboutDrawer() {
  const { state, setAboutOpen, openGuide, setOnboardCard } = useApp();
  const bandPalette = bandColors(state.darkMode);
  const [active, setActive] = useState("ringkasan");
  const bodyRef = useRef<HTMLDivElement>(null);

  if (!state.aboutOpen) return null;

  const goto = (id: string) => {
    setActive(id);
    bodyRef.current
      ?.querySelector(`#about-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        aria-hidden="true"
        onClick={() => setAboutOpen(false)}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tentang Nafkah"
        className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-card text-sm shadow-[-18px_0_50px_rgba(0,0,0,0.28)] sm:w-[480px] min-[1800px]:w-[600px]"
      >
        <header className="sticky top-0 z-10 border-b border-border bg-card px-5 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold tracking-[-0.015em]">
                Tentang Nafkah
              </h2>
              <p className="mt-0.5 text-xs text-muted">
                Data estimasi sampel · bukan nasihat keuangan
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAboutOpen(false)}
              aria-label="Tutup laman tentang"
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-border text-sm hover:border-accent"
            >
              ✕
            </button>
          </div>
          <nav
            aria-label="Daftar isi"
            className="-mx-5 mt-3 flex gap-1.5 overflow-x-auto px-5 pb-2.5"
          >
            {NAV.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-current={active === n.id}
                onClick={() => goto(n.id)}
                className={`h-8 shrink-0 rounded-full px-3 text-xs font-medium transition-colors ${
                  active === n.id
                    ? "bg-accent text-on-accent"
                    : "border border-border text-muted hover:border-accent"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </header>

        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <div className="max-w-[62ch] space-y-5">
            <section id="about-ringkasan">
              <p className="text-[15px] leading-[1.65]">
                <strong>Nafkah</strong> — biaya untuk menopang hidup sehari-hari
                — adalah peta interaktif yang menyandingkan upah minimum
                kabupaten/kota (UMK) dengan estimasi biaya hidup bulanan, di 514
                kabupaten/kota di 38 provinsi: dari Aceh sampai wilayah
                perbatasan Papua.
              </p>
            </section>

            <section id="about-latar">
              <h3 className="text-sm font-semibold">Latar belakang</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Angka gaji saja bisa menyesatkan: rupiah yang sama terasa lapang
                di satu kota dan sulit bernapas di kota lain. Keputusan penting —
                pindah kerja antarwilayah, menawarkan gaji ke kandidat, sampai
                kajian upah daerah — sering diambil hanya dari nominal, tanpa
                sisi biaya hidup pembandingnya. Nafkah menghadirkan sisi tersebut
                dalam satu peta yang mudah dibandingkan.
              </p>
            </section>

            <section id="about-membaca">
              <h3 className="text-sm font-semibold">Cara membacanya</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Setiap wilayah diwarnai dari rasio keterjangkauan: UMK dibagi
                estimasi biaya hidup bulanan, lalu dikelompokkan ke dalam empat
                band:
              </p>
              <ul className="mt-2 space-y-1">
                {BAND_ORDER.map((band) => (
                  <li key={band} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-3 w-5 shrink-0 rounded-sm"
                      style={{ backgroundColor: bandPalette[band] }}
                    />
                    <span className="font-medium">{BAND_LABEL[band]}</span>
                    <span className="tabular-nums text-muted">
                      {bandRange(band)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 leading-relaxed text-muted">
                Angka di dalamnya mengikuti asumsi yang bisa kamu ubah sendiri —
                komposisi rumah tangga (termasuk opsi dua penghasilan ketika
                pasangan ikut bekerja dengan UMK/UMP daerah terpilih), gaya
                hidup, tipe hunian, moda transportasi, tabungan, pendapatan
                sendiri, sampai basis upah kotor atau take-home — dan berlaku
                seketika tanpa memuat ulang. Klik wilayah untuk rincian sepuluh
                kategori pengeluaran beserta sumber dan tanggal datanya; pin
                hingga lima wilayah untuk membandingkannya berdampingan.
              </p>
            </section>

            <section id="about-asumsi">
              <h3 className="text-sm font-semibold">Arti tiap pilihan asumsi</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Semua pilihan hanya menskalakan biaya — peta dihitung ulang
                seketika. Ini arti masing-masing:
              </p>
              <dl className="mt-2 space-y-2 text-[13px] leading-relaxed">
                {[
                  [
                    "Tipe rumah tangga",
                    "Single (1 orang), Pasangan (2 orang dewasa — opsi “2 upah” berarti pasangan ikut bekerja dengan upah minimum setempat), atau Keluarga (ditambah kebutuhan anak, termasuk pendidikan).",
                  ],
                  [
                    "Pendapatan sendiri (opsional)",
                    "Isi gaji bulananmu untuk menguji “apakah gaji saya cukup di daerah ini” tanpa bergantung pada UMK. Dengan opsi “2 upah”, pasangan tetap diasumsikan berupah minimum setempat. Kosongkan untuk kembali ke UMK/UPM. Angka ini hanya hidup di browsermu — tidak dikirim atau disimpan ke mana pun.",
                  ],
                  [
                    "Gaya hidup",
                    "Hemat (pangan, rekreasi, dan tagihan dipangkas ke pilihan paling irit), Standar (baseline model), atau Nyaman (konsumsi dan rekreasi lebih longgar).",
                  ],
                  [
                    "Hunian",
                    "Rusun / kost (menengah ke bawah, ±55% biaya hunian dasar), Rumah KPR (menengah, baseline ×1), Apartemen (menengah ke atas, ±145% baseline). Angkanya anggaran hunian bulanan setara dari benchmark sewa pasar lokal, bukan simulasi cicilan bank.",
                  ],
                  [
                    "Transportasi",
                    "Motor (baseline), Kendaraan umum (paling murah), atau Ojol (tarif per perjalanan, paling mahal).",
                  ],
                  [
                    "Basis upah",
                    "UMK kotor sesuai penetapan resmi, atau estimasi take-home (±96% gaji kotor setelah potongan BPJS & PPh — diberi label estimasi).",
                  ],
                  [
                    "Tabungan / dana cadangan",
                    "Bila dicentang, ±10% disisakan di atas biaya hidup sebagai dana darurat — melihat “cukup” sekaligus bisa nabung.",
                  ],
                ].map(([term, def]) => (
                  <div
                    key={term}
                    className="border-l-2 border-border pl-3"
                  >
                    <dt className="font-medium">{term}</dt>
                    <dd className="text-muted">{def}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section id="about-sumber">
              <h3 className="text-sm font-semibold">Sumber data & kejujuran</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Upah memakai UMP/UMK 2026 resmi (PP No. 49 Tahun 2025, berlaku 1
                Januari 2026); wilayah tanpa UMK mandiri menginduk pada Upah
                Minimum Provinsi (UMP). Biaya hidup adalah model estimasi dari
                agregasi Susenas, IHK BPS, dan benchmark pasar lokal — bukan
                survei primer di tiap kota. Setiap angka membawa label
                keterpercayaan (sample, estimate, atau official) beserta tanggal
                datanya, dan bisa ditelusuri pada tabel provenance di modal
                detail wilayah.
              </p>
              <p className="mt-2 rounded-lg border border-border bg-surface p-3 text-[13px] leading-relaxed">
                <strong className="text-ink">
                  UMK itu patokan resmi, bukan gaji nyata.
                </strong>{" "}
                <span className="text-muted">
                  Upah minimum adalah <em>lantai</em> yang ditetapkan pemerintah
                  — bukan potret gaji rata-rata yang benar-benar dibayar. Baca
                  warna peta sebagai “apakah lantai upah resmi cukup di sini”,
                  bukan “berapa yang orang benar-benar terima”. Untuk mengujinya
                  dengan angkamu sendiri, pakai kolom{" "}
                  <strong className="text-ink">Pendapatan sendiri</strong> di
                  panel asumsi.
                </span>
              </p>
              <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
                ⚠ Semua angka pada Nafkah adalah estimasi, bukan nasihat
                keuangan. Biaya riil berbeda menurut lingkungan tempat tinggal,
                ukuran rumah tangga, tunjangan pekerjaan, dan gaya hidup
                personal.
              </p>

              <div className="mt-4 rounded-xl border border-accent/30 bg-accent-soft p-3.5">
                <div className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">📖</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-ink">
                      Booklet Resmi: Maps Ekonomi & Biaya Hidup
                    </h4>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
                      Dokumentasi interaktif dan siap cetak (PDF A4) yang merangkum
                      seluruh fitur peta, metodologi, dan simulasi asumsi.
                    </p>
                    <a
                      href="/booklet"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-on-accent transition-colors hover:bg-accent-strong"
                    >
                      Buka Booklet Interaktif & PDF ↗
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section id="about-bina">
              <h3 className="text-sm font-semibold">Membangun bersama</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Nafkah adalah eksperimen terbuka. Angka upah dan biaya hidup
                tinggal di file data yang mudah diperiksa dan diperbaiki:
                tambahkan penetapan resmi terbaru, laporkan selisih, atau
                sambungkan sumber terverifikasi lewat{" "}
                <em>issue</em> atau <em>pull request</em> di GitHub — setiap
                usulan diverifikasi dengan SK/penetapan resmi lewat label
                keterpercayaan yang sama.
              </p>

              <dl className="mt-3 space-y-1.5 rounded-lg border border-border bg-surface p-3 text-[12.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Dibuat &amp; dirawat</dt>
                  <dd className="font-semibold">Ade Naufal</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Aplikasi web</dt>
                  <dd>
                    <a
                      href="https://nafkah.adenaufal.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-accent hover:underline"
                    >
                      nafkah.adenaufal.com
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Lisensi</dt>
                  <dd className="text-right font-semibold">
                    Kode MIT · Data CC-BY-4.0
                  </dd>
                </div>
              </dl>

              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-border px-3.5 text-xs font-bold text-ink transition-colors hover:border-accent hover:text-accent"
              >
                Lihat kode &amp; kirim koreksi di GitHub ↗
              </a>
            </section>

            <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  setAboutOpen(false);
                  openGuide();
                }}
                className="h-11 flex-1 rounded-[11px] bg-accent px-4 text-sm font-bold text-on-accent hover:bg-accent-strong"
              >
                Putar ulang tur panduan
              </button>
              <button
                type="button"
                onClick={() => {
                  setOnboardCard(true);
                  setAboutOpen(false);
                }}
                className="h-11 rounded-[11px] border border-border px-4 text-sm font-semibold text-muted hover:border-accent hover:text-accent"
              >
                Tampilkan kartu 3 langkah
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function bandRange(band: AffordabilityBand): string {
  const b = AFFORDABILITY_BANDS;
  switch (band) {
    case "comfortable":
      return `≥ ${b.comfortableAt}%`;
    case "manageable":
      return `${b.manageableAt}–${b.comfortableAt - 1}%`;
    case "tight":
      return `${b.tightAt}–${b.manageableAt - 1}%`;
    case "insufficient":
      return `< ${b.tightAt}%`;
  }
}
