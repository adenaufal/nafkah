"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/state/AppContext";
import { formatIDR } from "@/lib/format";
import type {
  Assumptions,
  HouseholdType,
  HousingType,
  LifestyleLevel,
  TransportMode,
  WageBasis,
} from "@/lib/types";

/**
 * Kontrol asumsi — dipakai bersama oleh slide-over desktop dan bottom sheet
 * mobile. Setiap perubahan langsung mewarnai ulang peta.
 */
type IncomeSource = "solo" | "dual";

export function AssumptionsControls() {
  const { state, setAssumptions, resetAssumptions } = useApp();
  const a = state.assumptions;
  const set = <K extends keyof Assumptions>(k: K, v: Assumptions[K]) =>
    setAssumptions({ ...a, [k]: v });

  const customActive = (a.customIncome ?? 0) > 0;
  const dualIncome = a.dualIncome && a.householdType !== "single";
  // Buffer teks input, disinkronkan saat asumsi berubah dari luar (reset dll).
  const [incomeRaw, setIncomeRaw] = useState(
    a.customIncome ? String(a.customIncome) : "",
  );
  useEffect(() => {
    setIncomeRaw(a.customIncome ? String(a.customIncome) : "");
  }, [a.customIncome]);
  const onIncomeChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 12);
    setIncomeRaw(digits);
    const parsed = Number(digits);
    set("customIncome", digits && parsed > 0 ? parsed : null);
  };

  return (
    <div className="space-y-4">
      <Segmented<HouseholdType>
        label="Tipe rumah tangga"
        value={a.householdType}
        onChange={(v) => set("householdType", v)}
        options={[
          { value: "single", label: "Single" },
          { value: "couple", label: "Pasangan" },
          { value: "family", label: "Keluarga" },
        ]}
      />
      {a.householdType !== "single" && (
        <>
          <Segmented<IncomeSource>
            label="Sumber pemasukan"
            value={a.dualIncome ? "dual" : "solo"}
            onChange={(v) => set("dualIncome", v === "dual")}
            options={[
              { value: "solo", label: "1 upah" },
              { value: "dual", label: "2 upah" },
            ]}
          />
          <p className="-mt-2 text-xs leading-relaxed text-muted">
            Pilihan "2 upah": pasangan suami/istri diasumsikan ikut bekerja
            dengan gaji UMK/UPM daerah yang dipilih — total pemasukan 2× upah
            minimum (atau pendapatanmu + upah minimum saat memakai Pendapatan
            sendiri).
          </p>
        </>
      )}
      <div>
        <label
          htmlFor="ctl-custom-income"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted"
        >
          Pendapatan sendiri (opsional)
        </label>
        <div className="flex gap-1.5">
          <input
            id="ctl-custom-income"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            aria-describedby="ctl-custom-income-hint"
            placeholder="cth. 4.500.000"
            value={incomeRaw ? Number(incomeRaw).toLocaleString("id-ID") : ""}
            onChange={(e) => onIncomeChange(e.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm tabular-nums placeholder:text-muted/60"
          />
          {customActive && (
            <button
              type="button"
              onClick={() => set("customIncome", null)}
              aria-label="Hapus pendapatan sendiri, kembali ke upah daerah"
              className="shrink-0 self-stretch rounded-lg border border-border px-2.5 text-sm text-muted hover:border-accent hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>
        <p
          id="ctl-custom-income-hint"
          className="mt-1.5 text-xs leading-relaxed text-muted"
        >
          {customActive
            ? `Pembagi: ${formatIDR(a.customIncome ?? 0)}${
                dualIncome ? " + upah minimum pasangan" : ""
              }. Kosongkan (✕) untuk kembali ke UMK/UPM.`
            : "Kosong = memakai UMK/UPM daerah. Isi gaji bulananmu untuk menguji keterjangkauan pribadi — peta langsung mewarnai ulang."}
        </p>
      </div>
      <Segmented<LifestyleLevel>
        label="Gaya hidup"
        value={a.lifestyle}
        onChange={(v) => set("lifestyle", v)}
        options={[
          { value: "budget", label: "Hemat" },
          { value: "moderate", label: "Standar" },
          { value: "comfortable", label: "Nyaman" },
        ]}
      />
      <Segmented<HousingType>
        label="Hunian"
        value={a.housing}
        onChange={(v) => set("housing", v)}
        options={[
          { value: "room", label: "Rusun / kost" },
          { value: "studio", label: "Rumah KPR" },
          { value: "oneBedroom", label: "Apartemen" },
        ]}
      />
      <p className="-mt-2 text-xs leading-relaxed text-muted">
        Kerangka kelas hunian: rusun/kost = menengah ke bawah, rumah KPR =
        menengah, apartemen = menengah ke atas. Arti lengkap tiap pilihan ada di
        panel Tentang (ⓘ).
      </p>
      <Segmented<TransportMode>
        label="Transportasi"
        value={a.transport}
        onChange={(v) => set("transport", v)}
        options={[
          { value: "motorcycle", label: "Motor" },
          { value: "publicTransport", label: "Kend. umum" },
          { value: "rideHailing", label: "Ojol" },
        ]}
      />
      <Segmented<WageBasis>
        label="Basis upah"
        value={a.wageBasis}
        onChange={(v) => set("wageBasis", v)}
        options={[
          { value: "gross", label: "UMK kotor" },
          { value: "takeHome", label: "Est. take-home" },
        ]}
      />
      <label className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm">
        <input
          type="checkbox"
          checked={a.includeSavings}
          onChange={(e) => set("includeSavings", e.target.checked)}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Sertakan tabungan / dana cadangan (±10%)
      </label>

      <button
        type="button"
        onClick={resetAssumptions}
        className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted hover:border-accent hover:text-accent"
      >
        Reset asumsi
      </button>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  const id = `ctl-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div role="radiogroup" aria-labelledby={id}>
      <p
        id={id}
        className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted"
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-0.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`flex-1 rounded-md px-2 py-1.5 text-[13px] transition-colors ${
              value === o.value
                ? "bg-accent font-medium text-on-accent shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Varian slide-over desktop. Mobile memakai BottomSheet. */
export function AssumptionsPanel({ desktop }: { desktop?: boolean }) {
  const [open, setOpen] = useState(false);
  if (!desktop) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="hidden h-9 items-center rounded-lg bg-accent px-3 text-xs font-semibold text-on-accent shadow-sm transition-colors hover:bg-accent-strong md:inline-flex"
      >
        <span aria-hidden="true" className="mr-1.5">
          ⚙
        </span>
        Asumsi
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
            aria-label="Asumsi rumah tangga"
            className="fixed right-0 top-0 z-50 h-dvh w-80 max-w-[88vw] overflow-y-auto border-l border-border bg-card p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Asumsi</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup panel asumsi"
                className="rounded-lg border border-border px-2.5 py-1 text-sm hover:border-accent"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-muted">
              Perubahan langsung mewarnai ulang peta. Kode pengali
              terdokumentasi di{" "}
              <code className="rounded bg-surface px-1">
                src/data/multipliers.ts
              </code>
              .
            </p>
            <AssumptionsControls />
          </aside>
        </>
      )}
    </>
  );
}
