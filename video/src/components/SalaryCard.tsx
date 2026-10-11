import { rupiahInput } from "../data";
import { C, DISPLAY_STYLE, FONT, UI } from "../theme";
import { Card, Kicker, Seg } from "./ui";
import { Touch } from "./Touch";

const px = (v: number) => v * UI;

/** SALARY_STEPS in src/lib/income.ts: 1–10 jt per 100 rb, then per 500 rb. */
function stepIndex(v: number): number {
  if (v <= 10_000_000) return Math.round((Math.max(v, 1_000_000) - 1_000_000) / 100_000);
  return 90 + Math.round((Math.min(v, 25_000_000) - 10_000_000) / 500_000);
}
const LAST = 120;

const TICKS: [number, string][] = [
  [1_000_000, "Rp1 jt"],
  [5_000_000, "Rp5 jt"],
  [10_000_000, "Rp10 jt"],
  [25_000_000, "Rp25 jt"],
];

/** "Hitung dengan" card in Gajiku mode (IncomeControl + SalaryField). */
export function SalaryCard({
  salary,
  modeAt,
  press,
  width,
}: {
  salary: number;
  /** 0 = Upah daerah, 1 = Gajiku (fractional while the pill slides). */
  modeAt: number;
  /** 0→1 finger on the slider thumb. */
  press: number;
  width: number;
}) {
  const fill = stepIndex(salary) / LAST;
  const thumb = px(22);
  const inner = width - px(16) * 2;
  const thumbX = thumb / 2 + fill * (inner - thumb);
  return (
    <Card style={{ width, boxSizing: "border-box" }}>
      <Kicker style={{ marginBottom: px(8) }}>Hitung dengan</Kicker>
      <Seg options={["Upah daerah", "Gajiku", "Upah kotaku"]} at={modeAt} height={36} />
      <div
        style={{
          marginTop: px(9),
          display: "flex",
          alignItems: "baseline",
          gap: px(8),
          borderRadius: px(12),
          border: `${px(1)}px solid ${C.field}`,
          background: C.paper,
          padding: `${px(3)}px ${px(14)}px`,
          opacity: Math.min(1, modeAt),
        }}
      >
        <span style={{ fontFamily: FONT.sans, fontSize: px(15), fontWeight: 650, color: C.muted }}>Rp</span>
        <span
          style={{
            ...DISPLAY_STYLE,
            fontVariantNumeric: "tabular-nums lining-nums",
            flex: 1,
            fontSize: px(27),
            fontWeight: 560,
            letterSpacing: "-0.01em",
            color: C.ink,
            lineHeight: 1.25,
          }}
        >
          {rupiahInput(salary)}
        </span>
        <span style={{ fontFamily: FONT.sans, fontSize: px(12.5), color: C.muted }}>/bulan</span>
      </div>
      <div style={{ position: "relative", height: px(28), marginTop: px(3), opacity: Math.min(1, modeAt) }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: px(11),
            height: px(6),
            borderRadius: 999,
            background: `linear-gradient(to right, ${C.accent} 0 ${thumbX}px, ${C.rule2} ${thumbX}px 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: thumbX - thumb / 2,
            top: px(14) - thumb / 2,
            width: thumb,
            height: thumb,
            borderRadius: 999,
            background: C.paper,
            border: `${px(2)}px solid ${C.accent}`,
            boxShadow: `0 ${px(2)}px ${px(6)}px rgb(0 0 0 / 0.18)`,
            boxSizing: "border-box",
          }}
        />
        <Touch x={thumbX} y={px(14)} press={press} />
      </div>
      <div style={{ position: "relative", height: px(14), opacity: Math.min(1, modeAt) }}>
        {TICKS.map(([v, label], i) => {
          const at = (stepIndex(v) / LAST) * 100;
          const pos =
            i === 0
              ? { left: 0 }
              : i === TICKS.length - 1
                ? { right: 0 }
                : { left: `${at}%`, transform: "translateX(-50%)" };
          return (
            <span
              key={v}
              style={{
                position: "absolute",
                top: 0,
                whiteSpace: "nowrap",
                fontFamily: FONT.sans,
                fontSize: px(11),
                color: C.muted,
                fontVariantNumeric: "tabular-nums",
                ...pos,
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </Card>
  );
}
