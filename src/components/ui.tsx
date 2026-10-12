"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { Minus, Plus, X } from "@phosphor-icons/react";
import { bandTheme } from "@/lib/bands";
import { rp, rpShort } from "@/lib/format";
import { parseRupiah, rupiahInput } from "@/lib/income";
import type { AffordabilityBand, RegionMetrics } from "@/lib/types";

/** Small caps line that opens a block. */
export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted ${className}`}
    >
      {children}
    </p>
  );
}

export function SectionTitle({
  id,
  children,
  aside,
}: {
  id?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-rule pb-2">
      <h2
        id={id}
        className="text-[13px] font-bold tracking-[-0.005em] text-ink"
      >
        {children}
      </h2>
      {aside}
    </div>
  );
}

/** Quiet segmented control (radiogroup with roving focus and arrow keys). */
export function Seg<T extends string>({
  label,
  value,
  options,
  onChange,
  hideLabel = false,
  showHint = false,
  size = "md",
  columns,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (v: T) => void;
  hideLabel?: boolean;
  /** Print the selected option's hint under the control. */
  showHint?: boolean;
  size?: "sm" | "md";
  /** Options per row; defaults to one row. Wrap long lists on narrow rails. */
  columns?: number;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (idx + (e.key === "ArrowRight" ? 1 : -1) + options.length) %
      options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };
  const id = `seg-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div>
      <p
        id={id}
        className={
          hideLabel ? "sr-only" : "mb-2 text-[13px] font-semibold text-ink-2"
        }
      >
        {label}
      </p>
      <div
        role="radiogroup"
        aria-labelledby={id}
        onKeyDown={onKey}
        className="grid rounded-[10px] bg-paper-2 p-[3px]"
        style={{
          gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))`,
        }}
      >
        {options.map((o, i) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={i === idx ? 0 : -1}
              title={o.hint}
              onClick={() => onChange(o.value)}
              className={`${size === "sm" ? "h-8 text-[12.5px] pointer-coarse:h-10" : "h-9 text-[13px] pointer-coarse:h-11"} min-w-0 truncate rounded-[8px] px-2 transition-[background,color,box-shadow] duration-150 ${
                on
                  ? "bg-paper font-semibold text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08),0_0_0_1px_var(--rule)]"
                  : "font-medium text-muted hover:text-ink"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {showHint && options[idx]?.hint && (
        <p className="mt-1.5 text-[12px] leading-[1.5] text-muted">
          {options[idx].hint}
        </p>
      )}
    </div>
  );
}

export function BandChip({
  band,
  dark,
  withRange = false,
}: {
  band: AffordabilityBand;
  dark: boolean;
  withRange?: boolean;
}) {
  const t = bandTheme(dark)[band];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper py-[3px] pl-1.5 pr-2.5 text-[12px] font-semibold text-ink">
      <span
        aria-hidden="true"
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: t.fill }}
      />
      {t.label}
      {withRange && <span className="font-normal text-muted">{t.range}</span>}
    </span>
  );
}

/** Warm neutral ramp for stacked cost lines (largest first). */
const RAMP_LIGHT = [
  "#7d604b",
  "#8f735d",
  "#a08670",
  "#b09a85",
  "#bfac98",
  "#cdbcaa",
  "#d8cab9",
  "#e1d5c7",
  "#e8ded2",
  "#eee6dc",
];
const RAMP_DARK = [
  "#e3d2c0",
  "#d2bfac",
  "#c0ad99",
  "#ad9a87",
  "#9a8775",
  "#867464",
  "#736354",
  "#615346",
  "#51463b",
  "#453b32",
];

/**
 * Stacked cost lines against a wage marker. The gap tells the story —
 * hatched green where income is left over, hatched red where costs run past.
 */
export function BudgetBar({
  metric,
  rows,
  dark,
  wageText,
  highlight,
  compact = false,
}: {
  metric: RegionMetrics;
  rows: { key: string; value: number; label: string }[];
  dark: boolean;
  wageText: string;
  highlight?: string | null;
  compact?: boolean;
}) {
  const wage = metric.wageAmount;
  const cost = metric.totalMonthlyCost;
  const max = Math.max(wage, cost) * 1.04 || 1;
  const wagePct = (wage / max) * 100;
  const costPct = (cost / max) * 100;
  const ramp = dark ? RAMP_DARK : RAMP_LIGHT;
  const surplus = wage >= cost;
  const h = compact ? 10 : 18;
  let x = 0;
  return (
    <div className={compact ? "pt-4" : "pt-7"}>
      <div className="relative" style={{ height: h }} aria-hidden="true">
        <div className="absolute inset-0 overflow-hidden rounded-[3px] bg-paper-2">
          {rows.map((r, i) => {
            const w = (r.value / max) * 100;
            const left = x;
            x += w;
            return (
              <span
                key={r.key}
                title={`${r.label}: ${rp(r.value)}`}
                className="absolute inset-y-0 border-r border-paper transition-colors duration-150"
                style={{
                  left: `${left}%`,
                  width: `${w}%`,
                  background:
                    highlight === r.key
                      ? "var(--accent)"
                      : ramp[Math.min(i, ramp.length - 1)],
                }}
              />
            );
          })}
          <span
            className={`absolute inset-y-0 ${surplus ? "hatch-ok" : "hatch-bad"}`}
            style={{
              left: `${Math.min(wagePct, costPct)}%`,
              width: `${Math.abs(wagePct - costPct)}%`,
            }}
          />
        </div>
        <span
          className="absolute w-[2px] rounded-full bg-ink"
          style={{ left: `calc(${wagePct}% - 1px)`, top: -6, bottom: -6 }}
        />
        <span
          className={`absolute whitespace-nowrap text-[11.5px] font-semibold text-ink ${compact ? "-top-[18px]" : "-top-[26px]"}`}
          style={
            wagePct > 60
              ? { right: `${100 - wagePct}%`, transform: "translateX(1px)" }
              : { left: `${wagePct}%`, transform: "translateX(-1px)" }
          }
        >
          {wageText}
        </span>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px] text-ink-2">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2.5 w-3.5 rounded-[2px]"
              style={{ background: ramp[2] }}
            />
            Biaya hidup{" "}
            <b className="tnum font-semibold text-ink">{rp(cost)}</b>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={`h-2.5 w-3.5 rounded-[2px] ${surplus ? "hatch-ok" : "hatch-bad"}`}
            />
            {surplus ? "Sisa" : "Kurang"}{" "}
            <b
              className={`tnum font-semibold ${surplus ? "text-ok" : "text-danger"}`}
            >
              {rp(wage - cost)}
            </b>
            <span className="text-muted">/bulan</span>
          </span>
        </div>
      )}
      <p className="sr-only">
        {wageText}. Biaya hidup {rpShort(cost)}. {surplus ? "Sisa" : "Kurang"}{" "}
        {rpShort(wage - cost)} per bulan.
      </p>
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  children,
  pressed,
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  pressed?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink ${className}`}
    >
      {children}
    </button>
  );
}

/** Checkbox styled as a switch; the visible label is the parent <label>. */
export function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        className="h-6 w-10 rounded-full bg-field transition-colors peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-paper"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"
      />
    </span>
  );
}

export function MoneyField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  optional = true,
}: {
  id: string;
  label: string;
  hint: string;
  value: number | null;
  onChange: (v: number | null) => void;
  placeholder: string;
  optional?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[13px] font-semibold text-ink-2"
      >
        {label}{" "}
        {optional && <span className="font-normal text-muted">(opsional)</span>}
      </label>
      <div className="flex h-11 items-center rounded-[10px] border border-field bg-paper focus-within:border-ink">
        <span className="pl-3 text-[14px] text-muted">Rp</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          aria-describedby={`${id}-hint`}
          placeholder={placeholder}
          value={rupiahInput(value)}
          onChange={(e) => onChange(parseRupiah(e.target.value))}
          className="tnum h-full min-w-0 flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-muted"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`Kosongkan ${label.toLowerCase()}`}
            className="mr-1 grid h-8 w-8 place-items-center rounded-[8px] text-muted hover:bg-paper-2 hover:text-ink"
          >
            <X size={14} weight="bold" aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <p
        id={`${id}-hint`}
        className="mt-1.5 text-[12px] leading-[1.5] text-muted"
      >
        {hint}
      </p>
    </div>
  );
}

/** − n + stepper; the value is announced politely as it changes. */
export function Stepper({
  id,
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span id={id} className="text-[13px] font-semibold text-ink-2">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={id}
        className="flex items-center gap-1 rounded-[10px] bg-paper-2 p-[3px]"
      >
        <button
          type="button"
          aria-label={`Kurangi ${label.toLowerCase()} menjadi ${value - 1}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid h-8 w-8 place-items-center rounded-[8px] hover:bg-paper disabled:opacity-35 pointer-coarse:h-10 pointer-coarse:w-10"
        >
          <Minus size={14} weight="bold" aria-hidden="true" />
        </button>
        <span
          aria-live="polite"
          className="tnum w-14 text-center text-[14px] font-semibold"
        >
          {value} {unit}
        </span>
        <button
          type="button"
          aria-label={`Tambah ${label.toLowerCase()} menjadi ${value + 1}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid h-8 w-8 place-items-center rounded-[8px] hover:bg-paper disabled:opacity-35 pointer-coarse:h-10 pointer-coarse:w-10"
        >
          <Plus size={14} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
