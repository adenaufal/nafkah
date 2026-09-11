"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/state/AppContext";
import { MAX_CHILDREN } from "@/state/persist";
import { assumptionSummary } from "@/lib/profile";
import { formatIDR } from "@/lib/format";
import type {
  Assumptions,
  HouseholdType,
  HousingType,
  LifestyleLevel,
  TransportMode,
  WageBasis,
} from "@/lib/types";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { AppIcon } from "./icons";

/**
 * Kontrol asumsi dalam tiga kelompok (rumah tangga / biaya hidup / basis upah).
 * Dipakai bersama oleh drawer desktop dan mobile. Setiap perubahan langsung
 * mewarnai ulang peta — tidak ada tombol "Terapkan".
 */
type IncomeSource = "solo" | "dual";

function Group({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`space-y-4 ${className}`}>
      <h3 className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-accent min-[1400px]:text-[11.5px] min-[1800px]:text-xs">
        {title}
      </h3>
      {children}
    </section>
  );
}

export function AssumptionsControls() {
  const { state, setAssumptions } = useApp();
  const a = state.assumptions;
  const set = <K extends keyof Assumptions>(k: K, v: Assumptions[K]) =>
    setAssumptions({ ...a, [k]: v });

  const customActive = (a.customIncome ?? 0) > 0;
  const installmentActive = (a.installmentMonthly ?? 0) > 0;
  const dualIncome = a.dualIncome && a.householdType !== "single";
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

  const [installmentRaw, setInstallmentRaw] = useState(
    a.installmentMonthly ? String(a.installmentMonthly) : "",
  );
  useEffect(() => {
    setInstallmentRaw(a.installmentMonthly ? String(a.installmentMonthly) : "");
  }, [a.installmentMonthly]);
  const onInstallmentChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 12);
    setInstallmentRaw(digits);
    const parsed = Number(digits);
    set("installmentMonthly", digits && parsed > 0 ? parsed : null);
  };

  return (
    <div className="grid gap-7 min-[1800px]:grid-cols-2 min-[1800px]:gap-x-8 min-[2560px]:grid-cols-1">
      <Group title="Rumah tangga">
        <Segmented<HouseholdType>
          label="Tipe rumah tangga"
          value={a.householdType}
          onChange={(v) => {
            // Preset: memilih Keluarga mengisi 2 anak bila belum diatur.
            if (v === "family" && a.children === 0) {
              setAssumptions({ ...a, householdType: "family", children: 2 });
            } else {
              set("householdType", v);
            }
          }}
          options={[
            { value: "single", label: "Single" },
            { value: "couple", label: "Pasangan" },
            { value: "family", label: "Keluarga" },
          ]}
        />
        <div>
          <Stepper
            label="Jumlah anak"
            value={a.children}
            min={0}
            max={MAX_CHILDREN}
            onChange={(v) => set("children", v)}
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted min-[1400px]:text-xs min-[1800px]:text-[12.5px]">
            Tiap anak menambah kebutuhan makan, pendidikan/pengasuhan, dan
            kesehatan lewat faktor per-anak (basis model, estimasi).
          </p>
        </div>
        {a.householdType !== "single" && (
          <div>
            <Segmented<IncomeSource>
              label="Sumber pemasukan"
              value={a.dualIncome ? "dual" : "solo"}
              onChange={(v) => set("dualIncome", v === "dual")}
              options={[
                { value: "solo", label: "1 upah" },
                { value: "dual", label: "2 upah" },
              ]}
            />
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted min-[1400px]:text-xs min-[1800px]:text-[12.5px]">
              “2 upah”: pasangan diasumsikan ikut bekerja dengan UMK/UPM daerah
              terpilih.
            </p>
          </div>
        )}
        <div>
          <label
            htmlFor="ctl-custom-income"
            className="mb-1.5 block text-xs font-semibold text-muted min-[1400px]:text-[13px] min-[1800px]:text-sm"
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
              className="h-11 min-w-0 flex-1 rounded-[11px] border border-border bg-surface px-3 text-sm tabular-nums placeholder:text-muted/60 min-[1800px]:h-12 min-[1800px]:text-[15px]"
            />
            {customActive && (
              <button
                type="button"
                onClick={() => set("customIncome", null)}
                aria-label="Hapus pendapatan sendiri, kembali ke upah daerah"
                className="shrink-0 self-stretch rounded-[11px] border border-border px-2.5 text-sm text-muted hover:border-accent hover:text-ink min-[1800px]:px-3"
              >
                <AppIcon name="x" size={16} />
              </button>
            )}
          </div>
          <p
            id="ctl-custom-income-hint"
            className="mt-1.5 text-[11px] leading-relaxed text-muted min-[1400px]:text-xs min-[1800px]:text-[12.5px]"
          >
            {customActive
              ? `Pembagi: ${formatIDR(a.customIncome ?? 0)}${
                  dualIncome ? " + upah minimum pasangan" : ""
                }. Kosongkan kolom untuk kembali ke UMK/UMP.`
              : "Kosong = memakai UMK/UMP daerah. Angka tetap di browsermu, kecuali saat kamu memilih Bagikan."}
          </p>
        </div>
      </Group>

      <Group title="Biaya hidup">
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
        <div>
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
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted min-[1400px]:text-xs min-[1800px]:text-[12.5px]">
            Kerangka kelas: rusun/kost = menengah ke bawah, rumah KPR =
            menengah, apartemen = menengah ke atas. Arti lengkap di panel
            Tentang.
          </p>
        </div>
        <div>
          <label
            htmlFor="ctl-installment"
            className="mb-1.5 block text-xs font-semibold text-muted min-[1400px]:text-[13px] min-[1800px]:text-sm"
          >
            Cicilan KPR / angsuran (opsional)
          </label>
          <div className="flex gap-1.5">
            <input
              id="ctl-installment"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              aria-describedby="ctl-installment-hint"
              placeholder="cth. 2.500.000"
              value={
                installmentRaw
                  ? Number(installmentRaw).toLocaleString("id-ID")
                  : ""
              }
              onChange={(e) => onInstallmentChange(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-[11px] border border-border bg-surface px-3 text-sm tabular-nums placeholder:text-muted/60 min-[1800px]:h-12 min-[1800px]:text-[15px]"
            />
            {installmentActive && (
              <button
                type="button"
                onClick={() => set("installmentMonthly", null)}
                aria-label="Hapus cicilan, kembali ke estimasi hunian daerah"
                className="shrink-0 self-stretch rounded-[11px] border border-border px-2.5 text-sm text-muted hover:border-accent hover:text-ink min-[1800px]:px-3"
              >
                <AppIcon name="x" size={16} />
              </button>
            )}
          </div>
          <p
            id="ctl-installment-hint"
            className="mt-1.5 text-[11px] leading-relaxed text-muted min-[1400px]:text-xs min-[1800px]:text-[12.5px]"
          >
            {installmentActive
              ? `Hunian dihitung dari cicilanmu: ${formatIDR(
                  a.installmentMonthly ?? 0,
                )} — menggantikan estimasi sewa daerah. Kosongkan kolom untuk kembali.`
              : "Menggantikan estimasi sewa hunian dengan angsuranmu. Kosong = estimasi daerah. Angka ikut masuk tautan hanya saat kamu memilih Bagikan."}
          </p>
        </div>
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
      </Group>

      <Group title="Basis upah" className="min-[1800px]:col-span-2 min-[2560px]:col-span-1">
        <div className="grid gap-4 min-[1800px]:grid-cols-2 min-[1800px]:items-end min-[1800px]:gap-8 min-[2560px]:grid-cols-1">
          <Segmented<WageBasis>
            label="Basis upah"
            value={a.wageBasis}
            onChange={(v) => set("wageBasis", v)}
            options={[
              { value: "gross", label: "UMK kotor" },
              { value: "takeHome", label: "Est. take-home" },
            ]}
          />
          <label className="flex min-h-11 items-center gap-2.5 rounded-[11px] border border-border px-3 py-2.5 text-sm min-[1800px]:min-h-12 min-[1800px]:text-[15px]">
            <input
              type="checkbox"
              checked={a.includeSavings}
              onChange={(e) => set("includeSavings", e.target.checked)}
              className="h-[18px] w-[18px] accent-[var(--accent)]"
            />
            Sertakan tabungan / dana cadangan (±10%)
          </label>
        </div>
      </Group>
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
      <p id={id} className="mb-1.5 text-xs font-semibold text-muted min-[1400px]:text-[13px] min-[1800px]:text-sm">
        {label}
      </p>
      <div className="flex gap-[3px] rounded-[11px] border border-border bg-surface p-[3px] min-[1400px]:p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`h-[34px] flex-1 rounded-lg text-[13px] transition-colors min-[1400px]:h-9 min-[1400px]:text-[13.5px] min-[1800px]:h-10 min-[1800px]:text-sm ${
              value === o.value
                ? "bg-accent font-bold text-on-accent"
                : "font-medium text-muted hover:text-ink"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Stepper angka (dipakai untuk jumlah anak). Tombol minus/plus dengan target sentuh
 * penuh; nilai diumumkan lewat aria-live agar pembaca layar ikut terbarui.
 */
function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const id = `ctl-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div role="group" aria-labelledby={id}>
      <p id={id} className="mb-1.5 text-xs font-semibold text-muted min-[1400px]:text-[13px] min-[1800px]:text-sm">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Kurangi ${label.toLowerCase()} menjadi ${value - 1}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-border text-lg disabled:cursor-default disabled:text-muted/40 hover:not-disabled:border-accent hover:not-disabled:text-ink min-[1800px]:h-12 min-[1800px]:w-12"
        >
          <AppIcon name="minus" size={17} weight="bold" />
        </button>
        <span
          aria-live="polite"
          className="min-w-16 text-center text-sm font-semibold tabular-nums min-[1400px]:text-[15px] min-[1800px]:text-base"
        >
          {value} anak
        </span>
        <button
          type="button"
          aria-label={`Tambah ${label.toLowerCase()} menjadi ${value + 1}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-border text-lg disabled:cursor-default disabled:text-muted/40 hover:not-disabled:border-accent hover:not-disabled:text-ink min-[1800px]:h-12 min-[1800px]:w-12"
        >
          <AppIcon name="plus" size={17} weight="bold" />
        </button>
      </div>
    </div>
  );
}

/**
 * Drawer asumsi — dikendalikan dari context (tombol pengaturan header desktop & tab
 * Asumsi mobile). Header & footer sticky; kolom jadi dua di layar sangat lebar.
 */
export function AssumptionsDrawer() {
  const { state, setAsumsiOpen, resetAssumptions } = useApp();
  const dialogRef = useDialogFocus(state.asumsiOpen, () =>
    setAsumsiOpen(false),
  );
  if (!state.asumsiOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        aria-hidden="true"
        onClick={() => setAsumsiOpen(false)}
      />
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Asumsi rumah tangga"
        className="assumptions-drawer fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-border bg-card shadow-[-18px_0_50px_rgba(0,0,0,0.28)]"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-card px-5 py-4 min-[1400px]:px-6 min-[1400px]:py-5 min-[1800px]:px-8 min-[1800px]:py-6 min-[2400px]:px-9">
          <div>
            <h2 className="text-lg font-bold tracking-[-0.015em] min-[1400px]:text-xl min-[1800px]:text-2xl">Asumsi</h2>
            <p className="mt-0.5 text-xs text-muted min-[1400px]:text-[13px] min-[1800px]:text-sm">
              Setiap perubahan langsung mewarnai ulang peta.
            </p>
            <p className="mt-1 text-xs text-muted min-[1400px]:text-[13px] min-[1800px]:text-sm" aria-live="polite">
              Profil:{" "}
              <span className="font-medium text-ink">
                {assumptionSummary(state.assumptions)}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAsumsiOpen(false)}
            aria-label="Tutup panel asumsi"
            className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-border text-sm hover:border-accent min-[1400px]:h-10 min-[1400px]:w-10 min-[1800px]:h-11 min-[1800px]:w-11"
          >
            <AppIcon name="x" size={17} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 min-[1400px]:px-6 min-[1400px]:py-6 min-[1800px]:px-8 min-[1800px]:py-7 min-[2400px]:px-9">
          <AssumptionsControls />
        </div>

        <footer className="sticky bottom-0 z-10 flex gap-2.5 border-t border-border bg-card px-5 py-3.5 min-[1400px]:px-6 min-[1400px]:py-4 min-[1800px]:px-8 min-[1800px]:py-5 min-[2400px]:px-9">
          <button
            type="button"
            onClick={resetAssumptions}
            className="h-11 rounded-[11px] border border-border px-4 text-sm font-semibold text-muted hover:border-accent hover:text-accent min-[1400px]:h-12 min-[1400px]:px-5 min-[1400px]:text-[14.5px] min-[1800px]:h-[50px] min-[1800px]:text-base"
          >
            Reset asumsi
          </button>
          <button
            type="button"
            onClick={() => setAsumsiOpen(false)}
            className="h-11 flex-1 rounded-[11px] bg-accent px-4 text-sm font-bold text-on-accent hover:bg-accent-strong min-[1400px]:h-12 min-[1400px]:text-[14.5px] min-[1800px]:h-[50px] min-[1800px]:text-base"
          >
            Lihat peta
          </button>
        </footer>
      </aside>
    </>
  );
}
