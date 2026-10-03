"use client";

import { useApp } from "@/state/AppContext";
import { AFFORDABILITY_BANDS } from "@/lib/calculations";
import { assumptionSummary } from "@/lib/profile";

/** Always available beside the map, even after the onboarding card is closed. */
export function MapMethodNote() {
  const { state, setAboutOpen } = useApp();
  const bands = AFFORDABILITY_BANDS;

  return (
    <details className="relative z-30 shrink-0 border-b border-border bg-card px-3 text-xs sm:px-4">
      <summary className="cursor-pointer py-2 font-medium text-muted focus-visible:outline-2 focus-visible:outline-accent">
        Biaya hidup estimasi · Metode &amp; batasan
      </summary>
      <div className="max-h-[35dvh] max-w-3xl space-y-2 overflow-y-auto pb-3 leading-relaxed text-muted">
        <p>
          Biaya hidup dihitung dari 10 kategori estimasi yang disesuaikan dengan
          asumsi rumah tangga. Pilihan awal untuk 1 orang; profil aktif: {assumptionSummary(state.assumptions)}.
        </p>
        <p>
          Pada mode Cakupan, persentase = pendapatan ÷ biaya bulanan × 100%.
          Nyaman ≥ {bands.comfortableAt}%; Cukup ≥ {bands.manageableAt}% dan &lt; {bands.comfortableAt}%;
          Ketat ≥ {bands.tightAt}% dan &lt; {bands.manageableAt}%; Tak Cukup &lt; {bands.tightAt}%.
          Warna berubah saat asumsi diubah.
        </p>
        <p>
          UMK/UMP adalah acuan upah minimum resmi, bukan gaji aktual semua pekerja.
          Pendapatan sendiri atau gaji asal relokasi dapat dipakai sebagai pembanding.
          Sumber, periode, dan tingkat keterpercayaan angka tersedia di detail wilayah.
        </p>
        <button
          type="button"
          onClick={() => setAboutOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex min-h-9 items-center rounded-lg border border-border px-3 font-semibold text-accent hover:bg-accent-soft"
        >
          Baca metode lengkap
        </button>
      </div>
    </details>
  );
}
