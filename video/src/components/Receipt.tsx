import type { ReactNode } from "react";
import { digits, type ReceiptData } from "../data";
import { BAND_FILL, BAND_LABEL, C, FONT } from "../theme";
import type { AffordabilityBand } from "../types";

/*
 * "Struk bulanan" from src/components/rail/Receipt.tsx at video scale.
 * Rows print one by one; the paper scrolls so the newest line stays in the
 * window, and the expense lines can fold away to leave the sum.
 */

const S = 2.25;
const px = (v: number) => v * S;
const PAD_TOP = px(14);
const PAD_BOTTOM = px(16);

export interface ReceiptBottom {
  surplus: number;
  band: AffordabilityBand;
  coverage: number;
}

interface Row {
  key: string;
  height: number;
  /** Folds away with `collapse`, leaving income, total and the result. */
  fold?: boolean;
  node: ReactNode;
}

function rule(key: string, fold = false): Row {
  return {
    key,
    fold,
    height: px(22),
    node: (
      <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
        <div style={{ width: "100%", borderTop: `${px(1)}px dashed ${C.rule2}` }} />
      </div>
    ),
  };
}

function heading(key: string, text: string, fold = false): Row {
  return {
    key,
    fold,
    height: px(20),
    node: (
      <div
        style={{
          fontFamily: FONT.sans,
          fontSize: px(11),
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: C.muted,
        }}
      >
        {text}
      </div>
    ),
  };
}

function Line({ label, value, aside, strong = false }: { label: ReactNode; value: string; aside?: string; strong?: boolean }) {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "baseline", gap: px(8) }}>
      <span
        style={{
          fontFamily: FONT.sans,
          fontSize: px(13.5),
          fontWeight: strong ? 700 : 450,
          color: strong ? C.ink : C.ink2,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span style={{ flex: 1, minWidth: px(16), borderBottom: `${px(1)}px dotted ${C.rule2}`, marginBottom: px(3) }} />
      <span
        style={{
          fontFamily: FONT.mono,
          fontVariantNumeric: "tabular-nums",
          fontSize: px(13),
          fontWeight: strong ? 700 : 400,
          color: C.ink,
        }}
      >
        {value}
      </span>
      <span
        style={{
          width: px(36),
          textAlign: "right",
          fontFamily: FONT.sans,
          fontVariantNumeric: "tabular-nums",
          fontSize: px(11.5),
          color: C.muted,
        }}
      >
        {aside}
      </span>
    </div>
  );
}

export interface ReceiptProps {
  data: ReceiptData;
  width: number;
  windowHeight: number;
  /** Printed rows (fractional = the next one fading in). */
  shown: number;
  /** 0→1 fold the expense lines. */
  collapse?: number;
  incomeLabel: ReactNode;
  incomeValue: number;
  bottom: ReceiptBottom;
  /** Second bottom line flipped in with `flip` 0→1. */
  bottomAfter?: ReceiptBottom;
  flip?: number;
  /** 0→1 emphasis bump on the bottom figure. */
  pop?: number;
  /** Soft highlight on the total line (0→1). */
  totalGlow?: number;
}

function rowsOf(p: ReceiptProps): Row[] {
  const flip = p.flip ?? 0;
  const showAfter = p.bottomAfter && flip >= 0.5;
  const angle = p.bottomAfter ? (flip < 0.5 ? flip * 180 : (flip - 1) * 180) : 0;
  return [
    {
      key: "head",
      height: px(26),
      fold: true,
      node: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: FONT.mono,
            fontSize: px(11),
            color: C.muted,
          }}
        >
          <span style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>Struk bulanan</span>
          <span>rupiah / bulan</span>
        </div>
      ),
    },
    rule("r1", true),
    heading("h1", "Pemasukan"),
    {
      key: "income",
      height: px(25),
      node: <Line label={p.incomeLabel} value={digits(p.incomeValue)} strong />,
    },
    rule("r2"),
    heading("h2", "Pengeluaran · estimasi", true),
    ...p.data.rows.map<Row>((r) => ({
      key: r.key,
      height: px(25),
      fold: true,
      node: <Line label={r.label} value={digits(r.value)} aside={`${Math.round(r.share * 100)}%`} />,
    })),
    rule("r3", true),
    {
      key: "total",
      height: px(25),
      node: (
        <div
          style={{
            height: "100%",
            margin: `0 ${-px(8)}px`,
            padding: `0 ${px(8)}px`,
            borderRadius: px(6),
            background: `rgb(194 69 45 / ${0.12 * (p.totalGlow ?? 0)})`,
          }}
        >
          <Line label="Total pengeluaran" value={digits(p.data.total)} strong />
        </div>
      ),
    },
    {
      key: "double",
      height: px(18),
      node: (
        <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%", height: px(3), borderTop: `${px(1)}px solid ${C.ink}`, borderBottom: `${px(1)}px solid ${C.ink}` }} />
        </div>
      ),
    },
    {
      key: "bottom",
      height: px(52),
      node: (
        <div style={{ height: "100%", perspective: 900 }}>
          <div style={{ height: "100%", transform: `rotateX(${angle}deg)`, transformOrigin: "50% 60%" }}>
            <BottomLine bottom={showAfter ? p.bottomAfter! : p.bottom} pop={p.pop ?? 0} />
          </div>
        </div>
      ),
    },
  ];
}

/** Content height for `shown` rows (plus padding) with folding applied. */
export function receiptHeight(p: ReceiptProps): number {
  const rows = rowsOf(p);
  const collapse = p.collapse ?? 0;
  let h = PAD_TOP;
  rows.forEach((r, i) => {
    const t = Math.min(1, Math.max(0, p.shown - i));
    h += r.height * t * (r.fold ? 1 - collapse : 1);
  });
  if (p.shown >= rows.length) h += PAD_BOTTOM;
  return h;
}

export function receiptRowCount(p: ReceiptProps): number {
  return rowsOf(p).length;
}

export function Receipt(p: ReceiptProps) {
  const rows = rowsOf(p);
  const collapse = p.collapse ?? 0;
  const scroll = Math.max(0, receiptHeight(p) + px(9) - p.windowHeight);
  // Lines scrolling out of the window fade instead of being sliced.
  const fade = Math.min(1, scroll / px(20)) * px(26);
  const mask = `linear-gradient(to bottom, transparent 0, #000 ${fade}px)`;
  return (
    <div
      style={{
        position: "relative",
        width: p.width,
        height: p.windowHeight,
        overflow: "hidden",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        <div
          style={{
            background: C.paper2,
            borderRadius: `${px(14)}px ${px(14)}px 0 0`,
            padding: `${PAD_TOP}px ${px(20)}px ${p.shown >= rows.length ? PAD_BOTTOM : 0}px`,
          }}
        >
          {rows.map((r, i) => {
            const t = Math.min(1, Math.max(0, p.shown - i));
            const k = r.fold ? 1 - collapse : 1;
            return (
              <div
                key={r.key}
                style={{
                  height: r.height * t * k,
                  overflow: r.key === "bottom" ? "visible" : "hidden",
                  opacity: t * (r.fold ? Math.max(0, 1 - collapse * 1.6) : 1),
                }}
              >
                <div style={{ height: r.height }}>{r.node}</div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            height: px(9),
            background: `linear-gradient(-45deg, transparent ${px(6)}px, ${C.paper2} 0) 0 0 / ${px(12)}px ${px(9)}px repeat-x, linear-gradient(45deg, transparent ${px(6)}px, ${C.paper2} 0) 0 0 / ${px(12)}px ${px(9)}px repeat-x`,
          }}
        />
      </div>
    </div>
  );
}

function BottomLine({ bottom, pop }: { bottom: ReceiptBottom; pop: number }) {
  const surplus = bottom.surplus >= 0;
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
      <div>
        <div
          style={{
            fontFamily: FONT.sans,
            fontSize: px(11.5),
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: C.muted,
          }}
        >
          {surplus ? "Sisa" : "Kurang"}
        </div>
        <div
          style={{
            marginTop: px(4),
            display: "flex",
            alignItems: "center",
            gap: px(6),
            fontFamily: FONT.sans,
            fontSize: px(12.5),
            fontWeight: 650,
            color: C.ink2,
          }}
        >
          <span style={{ width: px(10), height: px(10), borderRadius: 999, background: BAND_FILL[bottom.band] }} />
          {BAND_LABEL[bottom.band]} · tertutup {Math.round(bottom.coverage)}%
        </div>
      </div>
      <div
        style={{
          fontFamily: FONT.mono,
          fontVariantNumeric: "tabular-nums",
          fontSize: px(28),
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          color: surplus ? C.ok : C.danger,
          transform: `scale(${1 + 0.14 * Math.sin(Math.PI * pop)})`,
          transformOrigin: "right bottom",
        }}
      >
        {surplus ? "+" : "−"}
        {digits(bottom.surplus)}
      </div>
    </div>
  );
}
