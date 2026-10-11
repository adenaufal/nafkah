"use client";

import { useState } from "react";
import { bandTheme } from "@/lib/bands";
import { AFFORDABILITY_BANDS, classify } from "@/lib/calculations";
import { pct, rp, rpShort, rpSigned } from "@/lib/format";
import {
  parseRupiah,
  rupiahInput,
  SALARY_STEPS,
  salaryStepIndex,
} from "@/lib/income";
import type { WageKind } from "@/lib/wages";

export interface CityRow {
  code: string;
  label: string;
  province: string;
  wage: number;
  wageKind: WageKind;
  /** Monthly cost of living for the booklet's profile. */
  cost: number;
}

const BAND = bandTheme(false);

/**
 * One salary tested in several cities: the page's only live figure. The
 * cost lines were computed at build time; the division is the map's own
 * formula (income ÷ cost × 100) and the band comes from the same classify.
 * The table prints with whatever salary is set.
 */
export function SalaryTable({
  cities,
  initial,
  presets,
  noun,
}: {
  cities: CityRow[];
  initial: number;
  presets: { label: string; value: number }[];
  noun: string;
}) {
  const [salary, setSalary] = useState(initial);
  const [text, setText] = useState(rupiahInput(initial));
  const set = (v: number) => {
    setSalary(v);
    setText(rupiahInput(v));
  };

  const rows = [...cities]
    .sort((a, b) => b.cost - a.cost)
    .map((c) => {
      const coverage = (salary / c.cost) * 100;
      return {
        ...c,
        coverage,
        band: classify(coverage, AFFORDABILITY_BANDS),
        wageCoverage: (c.wage / c.cost) * 100,
        surplus: salary - c.cost,
      };
    });
  const covered = rows.filter(
    (r) => r.coverage >= AFFORDABILITY_BANDS.manageableAt,
  ).length;
  const best = rows.reduce((a, b) => (b.coverage > a.coverage ? b : a));
  const worst = rows.reduce((a, b) => (b.coverage < a.coverage ? b : a));
  const scaleMax = Math.max(150, ...rows.map((r) => r.coverage));
  const at = (v: number) => `${(Math.min(v, scaleMax) / scaleMax) * 100}%`;
  const step = salaryStepIndex(salary);
  const td =
    "py-2 text-[13px] text-ink-2 paper:py-[5px] paper:text-[10.5px]";

  return (
    <div>
      <div className="rounded-[12px] border border-rule bg-paper px-4 py-3.5 print:border-0 print:bg-transparent print:p-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <label
            htmlFor="bk-salary"
            className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted paper:text-[9.5px]"
          >
            Gaji yang diuji
          </label>
          {/* Paper shows the figure as text, not as a form field. */}
          <p className="tnum hidden items-baseline gap-1.5 print:flex">
            <span className="f-display text-[20px] font-[560] text-ink">
              {rp(salary)}
            </span>
            <span className="text-[12px] text-muted">per bulan</span>
          </p>
          <div className="flex h-10 items-center gap-1.5 rounded-[10px] border border-field bg-white px-3 focus-within:outline focus-within:outline-2 focus-within:outline-accent print:hidden">
            <span className="text-[14px] font-semibold text-muted">Rp</span>
            <input
              id="bk-salary"
              inputMode="numeric"
              autoComplete="off"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                const v = parseRupiah(e.target.value);
                if (v) setSalary(v);
              }}
              onBlur={() => setText(rupiahInput(salary))}
              className="f-display tnum w-[8.5em] bg-transparent text-[20px] font-[560] text-ink outline-none"
              aria-describedby="bk-salary-hint"
            />
            <span className="text-[13px] text-muted">/ bulan</span>
          </div>
          <input
            type="range"
            min={0}
            max={SALARY_STEPS.length - 1}
            value={step}
            onChange={(e) => set(SALARY_STEPS[Number(e.target.value)])}
            aria-label="Geser gaji"
            aria-valuetext={rp(salary)}
            className="range-input min-w-[180px] flex-1 print:hidden"
            style={{
              ["--fill" as string]: `${(step / (SALARY_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
        <div
          role="group"
          aria-label="Pilihan cepat"
          className="mt-3 flex flex-wrap gap-1.5 print:hidden"
        >
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={salary === p.value}
              onClick={() => set(p.value)}
              className={`h-8 rounded-full px-3 text-[12.5px] font-semibold transition-colors pointer-coarse:h-10 ${
                salary === p.value
                  ? "bg-ink text-paper"
                  : "border border-rule-2 text-ink-2 hover:border-ink-2"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p
          id="bk-salary-hint"
          className="mt-2 text-[12px] text-muted print:hidden"
        >
          Ketik atau geser; tabel di bawah dan versi cetaknya ikut berubah.
        </p>
      </div>

      <p
        aria-live="polite"
        className="text-pretty mt-5 text-[15.5px] leading-[1.55] text-ink paper:text-[13px]"
      >
        Dengan <b className="font-semibold">{rp(salary)}</b>, biaya hidup{" "}
        {noun}{" "}
        {covered === 0 ? (
          <>
            belum tertutup di <b className="font-semibold">satu pun</b> dari{" "}
            {rows.length} kota ini.
          </>
        ) : covered === rows.length ? (
          <>
            tertutup di{" "}
            <b className="font-semibold">seluruh {rows.length}</b> kota ini.
          </>
        ) : (
          <>
            tertutup di{" "}
            <b className="font-semibold">
              {covered} dari {rows.length}
            </b>{" "}
            kota ini.
          </>
        )}{" "}
        Paling lega di {best.label} ({pct(best.coverage)}), paling berat di{" "}
        {worst.label} ({pct(worst.coverage)}).
      </p>

      <div className="thin-scroll relative mt-4 overflow-x-auto paper:overflow-visible">
        <table className="tnum w-full min-w-[620px] border-t border-ink text-left paper:min-w-0">
          <caption className="sr-only">
            Cakupan gaji {rp(salary)} dan upah minimum di kota-kota besar
          </caption>
          <thead>
            <tr className="border-b border-rule">
              {[
                ["Kota", ""],
                ["Biaya hidup", "text-right"],
                ["Upah minimum", "text-right"],
                [`Gaji ${rpShort(salary)}`, "w-[30%] pl-3"],
                ["Sisa / kurang", "text-right"],
              ].map(([t, cls]) => (
                <th
                  key={t}
                  scope="col"
                  className={`py-1.5 pr-3 text-[11px] font-medium text-muted last:pr-0 paper:text-[9.5px] ${cls}`}
                >
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-b border-rule align-middle">
                <th scope="row" className={`${td} pr-3 text-left font-normal`}>
                  <span className="block font-semibold text-ink">{r.label}</span>
                  <span className="block text-[11.5px] text-muted paper:text-[9px]">
                    {r.province}
                  </span>
                </th>
                <td className={`${td} pr-3 text-right`}>{rp(r.cost)}</td>
                <td className={`${td} pr-3 text-right`}>
                  {rp(r.wage)}
                  <span className="block text-[11.5px] text-muted paper:text-[9px]">
                    {r.wageKind} · {pct(r.wageCoverage)}
                  </span>
                </td>
                <td className={`${td} pl-3 pr-3`}>
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="relative h-2.5 flex-1 rounded-full bg-paper-2"
                    >
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: at(r.coverage),
                          background: BAND[r.band].fill,
                        }}
                      />
                      <span
                        className="absolute -inset-y-1 w-px bg-ink"
                        style={{ left: at(AFFORDABILITY_BANDS.manageableAt) }}
                      />
                    </span>
                    <span className="w-11 shrink-0 text-right font-semibold text-ink">
                      {pct(r.coverage)}
                    </span>
                  </span>
                  <span className="sr-only"> ({BAND[r.band].label})</span>
                </td>
                <td
                  className={`${td} text-right font-semibold ${r.surplus >= 0 ? "text-ok" : "text-danger"}`}
                >
                  {rpSigned(r.surplus)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[12px] leading-[1.5] text-muted paper:text-[10px]">
        Garis tegak di batang: 100%. Persen di bawah upah minimum adalah
        cakupan upah minimum kota itu sendiri, seperti di peta.
      </p>
    </div>
  );
}
