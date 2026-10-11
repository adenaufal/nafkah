"use client";

import { useEffect, useId, useState } from "react";
import { Check, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import { useAssumptionActions, useMedianWage } from "@/state/derived";
import { rpShort } from "@/lib/format";
import {
  SALARY_STEPS,
  parseRupiah,
  roundSalary,
  rupiahInput,
  salaryStepIndex,
} from "@/lib/income";
import { regionLabel } from "@/lib/names";
import { useRegionSearch } from "@/components/search/useRegionSearch";
import { MoneyField, Seg } from "@/components/ui";

type IncomeMode = "umk" | "gaji" | "asal";

const MODES: { value: IncomeMode; label: string; hint: string }[] = [
  { value: "umk", label: "Upah daerah", hint: "UMK/UMP tiap daerah" },
  { value: "gaji", label: "Gajiku", hint: "Satu gaji untuk semua daerah" },
  {
    value: "asal",
    label: "Upah kotaku",
    hint: "Upah minimum kotamu, biaya daerah tujuan",
  },
];

/** Labelled points under the slider, placed where they really are. */
const TICKS = [1_000_000, 5_000_000, 10_000_000, 25_000_000];
const LAST_STEP = SALARY_STEPS.length - 1;

/**
 * Which income the map divides by: each region's own minimum wage (UMK, or
 * the provincial UMP where a region has none), the visitor's salary (one
 * number tested against every region — the slider recolours the map live),
 * or the minimum wage of the city they would move from.
 */
export function IncomeControl({
  seed,
  compact = false,
  showDualIncome = true,
}: {
  /** Starting salary when switching to "Gajiku" (rounded to 100 rb). */
  seed?: number;
  compact?: boolean;
  /** The profile editor has its own switch and salary field for this. */
  showDualIncome?: boolean;
}) {
  const { state, setOrigin } = useApp();
  const { a, set } = useAssumptionActions();
  const medianWage = useMedianWage();
  const derived: IncomeMode =
    (a.customIncome ?? 0) > 0 ? "gaji" : state.originCode ? "asal" : "umk";
  const [mode, setMode] = useState<IncomeMode>(derived);
  // Follow changes made elsewhere (shared link, region "Kota asal" button).
  useEffect(() => {
    if (derived !== "umk") setMode(derived);
  }, [derived]);

  const start = roundSalary(seed ?? medianWage ?? 3_500_000);

  const choose = (next: IncomeMode) => {
    setMode(next);
    if (next === "umk") {
      if (a.customIncome) set("customIncome", null);
      if (state.originCode) setOrigin(null);
    } else if (next === "gaji") {
      if (state.originCode) setOrigin(null);
      if (!a.customIncome) set("customIncome", start);
    } else if (a.customIncome) {
      set("customIncome", null);
    }
  };

  const couple = a.householdType !== "single";
  const net = a.wageBasis === "takeHome";

  return (
    <div>
      <Seg<IncomeMode>
        label="Hitung dengan"
        value={mode}
        options={MODES}
        onChange={choose}
        hideLabel
        size={compact ? "sm" : "md"}
      />
      {mode === "umk" && (
        <p className="mt-2.5 text-[12.5px] leading-[1.55] text-muted">
          Tiap daerah memakai upah minimumnya sendiri (UMK atau UMP) — lantai
          resmi, bukan gaji rata-rata.
        </p>
      )}
      {mode === "gaji" && (
        <SalaryField
          value={a.customIncome}
          fallback={start}
          onChange={(v) => set("customIncome", v)}
        />
      )}
      {mode === "asal" && <OriginPicker />}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {couple && showDualIncome && (
          <Chip
            on={a.dualIncome}
            onClick={() => set("dualIncome", !a.dualIncome)}
            title="Pendapatan ditambah gaji pasangan, atau upah minimum daerah bila tidak diisi"
          >
            Pasangan ikut bekerja
          </Chip>
        )}
        {mode !== "gaji" && (
          <Chip
            on={net}
            onClick={() => set("wageBasis", net ? "gross" : "takeHome")}
          >
            Setelah potongan
          </Chip>
        )}
      </div>
      {net && mode !== "gaji" && (
        <p className="mt-2 text-[12px] leading-[1.5] text-muted">
          Estimasi: upah bersih ±96% dari upah minimum kotor, setelah potongan
          BPJS &amp; PPh.
        </p>
      )}
      {couple && showDualIncome && a.dualIncome && (
        <div className="mt-3">
          <PartnerIncomeField />
        </div>
      )}
    </div>
  );
}

/**
 * The working partner's own salary, one number for every region. Empty keeps
 * them on the minimum wage the user's income would use: each region's UMK or
 * UMP, or the origin city's when moving.
 */
export function PartnerIncomeField() {
  const { state } = useApp();
  const { a, set } = useAssumptionActions();
  const id = useId();
  return (
    <MoneyField
      id={`${id}-partner`}
      label="Gaji pasangan"
      hint={
        a.partnerIncome
          ? "Dipakai untuk semua daerah dan hanya tersimpan di browsermu."
          : state.originCode
            ? "Kosong = upah minimum kota asal."
            : "Kosong = upah minimum (UMK/UMP) tiap daerah."
      }
      value={a.partnerIncome}
      onChange={(v) => set("partnerIncome", v)}
      placeholder="cth. 4.000.000"
    />
  );
}

function Chip({
  on,
  onClick,
  title,
  children,
}: {
  on: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-semibold transition-colors pointer-coarse:h-10 ${
        on
          ? "border-accent bg-accent-soft text-accent-ink"
          : "border-field text-ink-2 hover:border-ink-2"
      }`}
    >
      {on && <Check size={12} weight="bold" aria-hidden="true" />}
      {children}
    </button>
  );
}

function SalaryField({
  value,
  fallback,
  onChange,
}: {
  value: number | null;
  fallback: number;
  onChange: (v: number | null) => void;
}) {
  const id = useId();
  const shown = value ?? fallback;
  const pos = salaryStepIndex(shown);
  const fill = (pos / LAST_STEP) * 100;
  return (
    <div className="mt-3">
      <label htmlFor={`${id}-amount`} className="sr-only">
        Gajimu per bulan, rupiah
      </label>
      <div className="flex items-baseline gap-2 rounded-[12px] border border-field bg-paper px-3.5 py-2 focus-within:border-ink">
        <span className="text-[15px] font-semibold text-muted">Rp</span>
        <input
          id={`${id}-amount`}
          inputMode="numeric"
          autoComplete="off"
          placeholder={rupiahInput(fallback)}
          aria-describedby={`${id}-hint`}
          value={rupiahInput(value)}
          onChange={(e) => onChange(parseRupiah(e.target.value))}
          className="f-display tnum min-w-0 flex-1 bg-transparent text-[26px] font-[560] leading-tight tracking-[-0.01em] text-ink outline-none placeholder:text-muted"
        />
        <span className="text-[12.5px] text-muted">/bulan</span>
      </div>
      <input
        type="range"
        min={0}
        max={LAST_STEP}
        value={pos}
        aria-label="Geser gaji"
        aria-valuetext={rpShort(shown)}
        onChange={(e) => onChange(SALARY_STEPS[Number(e.target.value)])}
        className="range-input mt-1.5"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      {/* Stops are finer below 10 jt, so labels sit at their true places. */}
      <div
        className="tnum relative h-4 text-[11px] text-muted"
        aria-hidden="true"
      >
        {TICKS.map((t, i) => {
          const at = (salaryStepIndex(t) / LAST_STEP) * 100;
          return (
            <span
              key={t}
              className="absolute top-0 whitespace-nowrap"
              style={
                i === 0
                  ? { left: 0 }
                  : i === TICKS.length - 1
                    ? { right: 0 }
                    : { left: `${at}%`, transform: "translateX(-50%)" }
              }
            >
              {rpShort(t)}
            </span>
          );
        })}
      </div>
      <p
        id={`${id}-hint`}
        className="mt-1.5 text-[12px] leading-[1.5] text-muted"
      >
        {value
          ? "Geser atau ketik — peta menghitung ulang semua daerah. Angka ini hanya tersimpan di browsermu."
          : "Kosong = memakai upah minimum tiap daerah. Ketik atau geser untuk mencoba gajimu."}
      </p>
    </div>
  );
}

function OriginPicker() {
  const { state, setOrigin, regionByCode } = useApp();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const hits = useRegionSearch(q, 5).filter((h) => state.wages.has(h.code));
  const listId = useId();
  const origin = state.originCode
    ? regionByCode.get(state.originCode)
    : undefined;

  if (origin) {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-accent/50 bg-accent-soft px-3.5 py-2.5">
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-accent-ink">
            Kota asal
          </p>
          <p className="truncate text-[15px] font-bold">
            {regionLabel(origin)}
          </p>
          <p className="text-[12px] leading-[1.45] text-ink-2">
            Gaji = upah minimum kota ini; biaya = daerah tujuan.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOrigin(null)}
          aria-label="Hapus kota asal"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-paper/60 pointer-coarse:h-11 pointer-coarse:w-11"
        >
          <X size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>
    );
  }

  const pick = (code: string) => {
    setOrigin(code);
    setQ("");
  };

  return (
    <div className="relative mt-3">
      <div className="flex h-11 items-center gap-2 rounded-[12px] border border-field bg-paper px-3 focus-within:border-ink">
        <MagnifyingGlass size={16} className="text-muted" aria-hidden="true" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" && q) {
              // Clear the list, keep the view.
              e.preventDefault();
              setQ("");
              return;
            }
            if (!hits.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => (i + 1) % hits.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (i - 1 + hits.length) % hits.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              pick(hits[active].code);
            }
          }}
          placeholder="Aku sekarang tinggal di…"
          role="combobox"
          aria-label="Cari kota asal"
          aria-expanded={hits.length > 0}
          aria-controls={listId}
          aria-activedescendant={
            hits.length ? `${listId}-${active}` : undefined
          }
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted"
        />
      </div>
      {hits.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Kota asal"
          className="anim-fade absolute inset-x-0 top-[calc(100%+6px)] z-30 rounded-[12px] border border-rule bg-paper p-1 shadow-[var(--shadow)]"
        >
          {hits.map((h, i) => (
            <li
              key={h.code}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(h.code)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer flex-col rounded-[8px] px-3 py-2 ${i === active ? "bg-paper-2" : ""}`}
            >
              <span className="text-[14px] font-semibold">{h.label}</span>
              <span className="text-[12px] text-muted">{h.province}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[12px] leading-[1.5] text-muted">
        Mau pindah? Pilih kotamu sekarang — peta membandingkan upah minimum
        kotamu dengan biaya hidup di tiap daerah tujuan.
      </p>
    </div>
  );
}
