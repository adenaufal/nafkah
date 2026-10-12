"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import { useAssumptionActions, useRanking } from "@/state/derived";
import { MAX_CHILDREN } from "@/state/persist";
import { BAND_ORDER, bandTheme } from "@/lib/bands";
import type {
  HouseholdType,
  HousingType,
  LifestyleLevel,
  TransportMode,
} from "@/lib/types";
import { Kicker, MoneyField, Seg, Stepper, Toggle } from "@/components/ui";
import { IncomeControl, PartnerIncomeField } from "./IncomeControl";

/**
 * Assumptions live in the rail, not a modal: the map beside it stays fully
 * visible and recolours as each control changes, and the band strip at the
 * top shows the national result moving.
 */
export function ProfileEditor({ onBack }: { onBack: () => void }) {
  const { state } = useApp();
  const { a, set, setHousehold, reset } = useAssumptionActions();
  const ranking = useRanking();
  const theme = bandTheme(state.darkMode);
  const couple = a.householdType !== "single";

  return (
    <div className="anim-rise">
      <div className="rail-sticky sticky top-0 z-10 mb-6 border-b border-rule bg-paper/95 pb-3 pt-2.5 backdrop-blur">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 text-[13px] font-semibold text-ink-2 hover:bg-paper-2 hover:text-ink"
          >
            <ArrowLeft size={15} weight="bold" aria-hidden="true" />
            Kembali
          </button>
          <button
            type="button"
            onClick={reset}
            className="h-9 rounded-[10px] px-2.5 text-[13px] font-semibold text-muted hover:bg-paper-2 hover:text-ink"
          >
            Kembalikan ke awal
          </button>
        </div>
        {/* Live result: the national count, moving as you edit. */}
        <div className="mt-2 px-2.5">
          <div
            className="flex h-2 gap-[2px] overflow-hidden rounded-full"
            aria-hidden="true"
          >
            {BAND_ORDER.map((b) => (
              <span
                key={b}
                className="h-full transition-[flex-grow] duration-300"
                style={{
                  flexGrow: ranking.ready ? ranking.counts[b] || 0.001 : 1,
                  background: theme[b].fill,
                }}
              />
            ))}
          </div>
          <p className="tnum mt-1.5 text-[12.5px] text-ink-2">
            <b className="text-ink">{ranking.below}</b> dari {ranking.total}{" "}
            daerah di bawah 100% · <b className="text-ink">{ranking.covered}</b>{" "}
            cukup atau nyaman
          </p>
        </div>
      </div>

      <Kicker>Profil rumah tangga</Kicker>
      <h1
        tabIndex={-1}
        className="f-display mt-2 text-[30px] font-[560] leading-[1.1] tracking-[-0.012em] outline-none"
      >
        Hitung untuk hidupmu.
      </h1>
      <p className="mt-3 text-[14.5px] leading-[1.6] text-ink-2">
        Setiap pilihan langsung mewarnai ulang peta. Angka tetap di browsermu,
        kecuali kamu memilih Bagikan.
      </p>

      <div className="mt-8 space-y-8">
        <fieldset className="space-y-4">
          <legend className="mb-3 text-[13px] font-bold">
            Siapa yang dihitung
          </legend>
          <Seg<HouseholdType>
            label="Rumah tangga"
            value={a.householdType}
            onChange={setHousehold}
            options={[
              { value: "single", label: "Lajang" },
              { value: "couple", label: "Pasangan" },
              { value: "family", label: "Keluarga" },
            ]}
          />
          <Stepper
            id="profile-kids"
            label="Jumlah anak"
            unit="anak"
            value={a.children}
            min={0}
            max={MAX_CHILDREN}
            onChange={(v) => set("children", v)}
          />
          <p className="-mt-2 text-[12px] leading-[1.5] text-muted">
            Tiap anak menambah kebutuhan makan, pendidikan/pengasuhan, dan
            kesehatan lewat faktor per-anak (estimasi).
          </p>
          {couple && (
            <label className="flex items-center justify-between gap-3 text-[13px] font-semibold text-ink-2">
              Pasangan juga bekerja (2 upah)
              <Toggle
                checked={a.dualIncome}
                onChange={(v) => set("dualIncome", v)}
              />
            </label>
          )}
          {couple && a.dualIncome && <PartnerIncomeField />}
          <MoneyField
            id="profile-family-support"
            label="Tanggungan keluarga"
            hint="Kiriman rutin ke orang tua atau keluarga lain. Ditambahkan ke pengeluaran semua daerah."
            value={a.familySupportMonthly}
            onChange={(v) => set("familySupportMonthly", v)}
            placeholder="cth. 1.000.000"
          />
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-3 text-[13px] font-bold">Cara hidup</legend>
          <Seg<LifestyleLevel>
            label="Gaya hidup"
            showHint
            value={a.lifestyle}
            onChange={(v) => set("lifestyle", v)}
            options={[
              {
                value: "budget",
                label: "Hemat",
                hint: "Pangan, rekreasi & tagihan paling irit",
              },
              { value: "moderate", label: "Standar", hint: "Baseline model" },
              {
                value: "comfortable",
                label: "Longgar",
                hint: "Konsumsi & rekreasi lebih longgar",
              },
            ]}
          />
          <div>
            <Seg<HousingType>
              label="Hunian"
              showHint
              columns={2}
              value={a.housing}
              onChange={(v) => set("housing", v)}
              options={[
                {
                  value: "room",
                  label: "Rusun/kost",
                  hint: "Menengah ke bawah · ±55% anggaran hunian dasar",
                },
                {
                  value: "studio",
                  label: "Rumah KPR",
                  hint: "Menengah · anggaran setara sewa lokal; punya angsuran sendiri? Isi cicilan di bawah",
                },
                {
                  value: "oneBedroom",
                  label: "Apartemen",
                  hint: "Menengah ke atas · ±145% anggaran hunian dasar",
                },
                {
                  value: "owner",
                  label: "Rumah sendiri",
                  hint: "Sudah lunas atau ikut orang tua · biaya hunian Rp0; masih mencicil? Isi cicilan di bawah",
                },
              ]}
            />
            {(a.installmentMonthly ?? 0) > 0 && (
              <p className="mt-1.5 text-[12px] text-muted">
                Tidak dipakai selama cicilanmu terisi di bawah.
              </p>
            )}
          </div>
          <Seg<TransportMode>
            label="Transportasi"
            showHint
            columns={3}
            value={a.transport}
            onChange={(v) => set("transport", v)}
            options={[
              {
                value: "motorcycle",
                label: "Motor",
                hint: "Baseline model · BBM, servis, pajak, parkir",
              },
              {
                value: "publicTransport",
                label: "Kend. umum",
                hint: "±70% biaya motor",
              },
              {
                value: "rideHailing",
                label: "Ojol",
                hint: "±190% biaya motor",
              },
              {
                value: "car",
                label: "Mobil",
                hint: "±350% biaya motor · belum termasuk cicilan, asuransi, dan tol",
              },
              {
                value: "walk",
                label: "Jalan kaki",
                hint: "Jalan kaki atau sepeda · ±25% biaya motor untuk sesekali angkot/ojek",
              },
            ]}
          />
          <MoneyField
            id="profile-installment"
            label="Cicilan rumah sendiri"
            hint="Menggantikan estimasi sewa hunian daerah dengan angsuranmu."
            value={a.installmentMonthly}
            onChange={(v) => set("installmentMonthly", v)}
            placeholder="cth. 2.500.000"
          />
          <label className="flex items-center justify-between gap-3 text-[13px] font-semibold text-ink-2">
            Sisihkan tabungan / dana darurat (±10%)
            <Toggle
              checked={a.includeSavings}
              onChange={(v) => set("includeSavings", v)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[13px] font-bold">Pendapatan</legend>
          {/* "Pasangan juga bekerja" and the partner's salary sit above. */}
          <IncomeControl showDualIncome={false} />
        </fieldset>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-10 h-11 w-full rounded-[10px] bg-ink text-[14px] font-semibold text-paper hover:opacity-90"
      >
        Lihat hasilnya
      </button>
    </div>
  );
}
