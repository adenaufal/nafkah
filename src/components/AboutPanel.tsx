"use client";

import { useState } from "react";
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

/**
 * Slide-over "Tentang" (pattern matches AssumptionsPanel). The narrative is
 * organized along what/why/how/who/when/where lines, written as prose without
 * ever labeling the questions as headings.
 */
export function AboutPanel() {
  const { state } = useApp();
  const [open, setOpen] = useState(false);
  const bandPalette = bandColors(state.darkMode);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="inline-flex h-9 items-center rounded-lg border border-border px-2.5 text-xs font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3"
      >
        <span aria-hidden="true" className="sm:mr-1.5">
          ⓘ
        </span>
        <span className="hidden sm:inline">Tentang</span>
        <span className="sr-only sm:hidden">Tentang Nafkah</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Tentang Nafkah"
            className="fixed right-0 top-0 z-50 h-dvh w-[26rem] max-w-[92vw] overflow-y-auto border-l border-border bg-card p-5 text-sm shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Tentang Nafkah</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup laman tentang"
                className="rounded-lg border border-border px-2.5 py-1 hover:border-accent"
              >
                ✕
              </button>
            </div>

            <p className="leading-relaxed">
              <strong>Nafkah</strong> — biaya untuk menopang hidup sehari-hari —
              adalah peta interaktif yang menyandingkan upah minimum
              kabupaten/kota (UMK) dengan estimasi biaya hidup bulanan, di 514
              kabupaten/kota di 38 provinsi: dari Aceh sampai wilayah perbatasan
              Papua.
            </p>

            <section className="mt-4">
              <h3 className="text-sm font-semibold">Latar belakang</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Angka gaji saja bisa menyesatkan: rupiah yang sama terasa lapang
                di satu kota dan sulit bernapas di kota lain. Keputusan penting
                — pindah kerja antarwilayah, menawarkan gaji ke kandidat, sampai
                kajian upah daerah — sering diambil hanya dari nominal, tanpa
                sisi biaya hidup pembandingnya. Nafkah menghadirkan sisi
                tersebut dalam satu peta yang mudah dibandingkan.
              </p>
            </section>

            <section className="mt-4">
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
                pasangan suami/istri ikut bekerja dengan UMK/UMP daerah
                terpilih), gaya hidup, tipe hunian, moda transportasi, tabungan,
                pendapatan sendiri, sampai basis upah kotor atau take-home — dan
                berlaku seketika tanpa memuat ulang. Klik wilayah untuk rincian
                sepuluh kategori pengeluaran beserta sumber dan tanggal datanya;
                pin hingga lima wilayah untuk membandingkannya berdampingan.
              </p>
            </section>

            <section className="mt-4">
              <h3 className="text-sm font-semibold">
                Arti tiap pilihan asumsi
              </h3>
              <p className="mt-1 leading-relaxed text-muted">
                Semua pilihan hanya menskalakan biaya — peta dihitung ulang
                seketika. Ini arti masing-masing:
              </p>
              <dl className="mt-2 space-y-2 text-[13px] leading-relaxed">
                <div>
                  <dt className="font-medium">Tipe rumah tangga</dt>
                  <dd className="text-muted">
                    Single (1 orang), Pasangan (2 orang dewasa — opsi “2 upah”
                    berarti pasangan ikut bekerja dengan upah minimum setempat),
                    atau Keluarga (ditambah kebutuhan anak, termasuk
                    pendidikan).
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Pendapatan sendiri (opsional)</dt>
                  <dd className="text-muted">
                    Isi gaji bulananmu untuk menguji “apakah gaji saya cukup di
                    daerah ini” tanpa bergantung pada UMK — berguna saat
                    menimbang pindah domisili. Dengan opsi “2 upah”, pasangan
                    tetap diasumsikan berupah minimum setempat, jadi total
                    pemasukan = pendapatanmu + upah minimum daerah. Kosongkan
                    untuk kembali ke UMK/UPM. Angka ini hanya hidup di browsermu
                    — tidak dikirim atau disimpan ke mana pun.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Gaya hidup</dt>
                  <dd className="text-muted">
                    Hemat (pangan, rekreasi, dan tagihan dipangkas ke pilihan
                    paling irit), Standar (baseline model), atau Nyaman
                    (konsumsi dan rekreasi lebih longgar).
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">
                    Hunian — kerangka kelas menurut konteks Indonesia
                  </dt>
                  <dd className="text-muted">
                    <strong className="text-ink">Rusun / kost</strong> (menengah
                    ke bawah): satu kamar sewa, dapur dan kamar mandi sering
                    bersama — ±55% biaya hunian dasar wilayah.{" "}
                    <strong className="text-ink">Rumah KPR</strong> (menengah):
                    hunian mandiri standar pekerja stabil; ini baseline (×1).
                    Angkanya anggaran hunian bulanan setara dari benchmark sewa
                    pasar lokal, bukan simulasi cicilan bank — kalau kamu
                    mencicil KPR, pakai angka ini sebagai pembanding.{" "}
                    <strong className="text-ink">Apartemen</strong> (menengah ke
                    atas): kamar tidur terpisah plus ruang tamu/dapur dan
                    fasilitas gedung — ±145% baseline.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Transportasi</dt>
                  <dd className="text-muted">
                    Motor (bensin, servis, pangkas — baseline), Kendaraan umum
                    (KRL/TransJakarta/angkot, paling murah), atau Ojol (tarif
                    per perjalanan, paling mahal).
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Basis upah</dt>
                  <dd className="text-muted">
                    UMK kotor sesuai penetapan resmi, atau estimasi take-home
                    (±96% gaji kotor setelah potongan BPJS &amp; PPh — diberi
                    label estimasi).
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Tabungan / dana cadangan</dt>
                  <dd className="text-muted">
                    Bila dicentang, ±10% disisakan di atas biaya hidup sebagai
                    dana darurat — melihat “cukup” sekaligus bisa nabung.
                  </dd>
                </div>
              </dl>
            </section>

            <section className="mt-4">
              <h3 className="text-sm font-semibold">
                Sumber data &amp; kejujuran
              </h3>
              <p className="mt-1 leading-relaxed text-muted">
                Upah memakai UMP/UMK 2026 resmi (PP No. 49 Tahun 2025, berlaku 1
                Januari 2026); wilayah tanpa UMK mandiri menginduk pada Upah
                Minimum Provinsi (UMP). Biaya hidup adalah model estimasi dari
                agregasi Susenas, IHK BPS, dan benchmark pasar lokal — bukan
                survei primer di tiap kota. Karena itu setiap angka membawa
                label keterpercayaan (sample, estimate, atau official) beserta
                tanggal datanya, dan semuanya bisa ditelusuri pada tabel
                provenance di modal detail wilayah. Tidak ada angka yang tampil
                tanpa sumber.
              </p>
            </section>

            <section className="mt-4">
              <h3 className="text-sm font-semibold">Berguna untuk</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Calon pekerja yang menilai tawaran di kota lain, tim rekrutmen
                dan relokasi, peneliti, jurnalis data, perencana wilayah, hingga
                kamu yang sekadar ingin tahu apakah gaji hari ini masih masuk
                akal untuk tempat tinggalnya.
              </p>
            </section>

            <section className="mt-4">
              <h3 className="text-sm font-semibold">Membangun bersama</h3>
              <p className="mt-1 leading-relaxed text-muted">
                Nafkah eksperimen terbuka. Angka upah dan biaya hidup tinggal di
                file data yang mudah diperbaiki: tambahkan penetapan resmi
                terbaru, laporkan selisih, atau sambungkan sumber terverifikasi
                sesuai panduan di README repositori. Setiap perbaikan diperiksa
                lewat label keterpercayaan yang sama.
              </p>
            </section>

            <p className="mt-5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              ⚠ Semua angka pada Nafkah adalah estimasi, bukan nasihat keuangan.
              Biaya riil berbeda menurut lingkungan tempat tinggal, ukuran rumah
              tangga, tunjangan pekerjaan, dan gaya hidup personal.
            </p>
          </aside>
        </>
      )}
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
