import type { CSSProperties, ReactNode } from "react";
import { C, DISPLAY_STYLE, FONT, UI } from "../theme";

/*
 * Atlas controls redrawn at video scale (UI × the app's CSS pixels), same
 * tokens as src/components/ui.tsx so the video reads as the real app.
 */

const px = (v: number) => v * UI;

/** `section.rounded-[16px] border border-rule bg-paper-2/50 p-4` */
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        borderRadius: px(16),
        border: `${px(1)}px solid ${C.rule}`,
        background: "#f4f1eb",
        padding: `${px(14)}px ${px(16)}px`,
        boxShadow: "0 2px 6px rgb(30 27 24 / 0.05), 0 22px 60px rgb(30 27 24 / 0.10)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Kicker({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: FONT.sans,
        fontSize: px(11.5),
        fontWeight: 700,
        letterSpacing: "0.13em",
        textTransform: "uppercase",
        color: C.muted,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/**
 * Segmented control. `at` is the selected index; fractional values slide
 * the pill between options (the app animates the same way on tap).
 */
export function Seg({ options, at, height = 40 }: { options: string[]; at: number; height?: number }) {
  const n = options.length;
  const pad = px(3);
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
        borderRadius: px(10),
        background: C.paper2,
        padding: pad,
        height: px(height),
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: pad,
          bottom: pad,
          left: `calc(${pad}px + (100% - ${pad * 2}px) * ${at / n})`,
          width: `calc((100% - ${pad * 2}px) / ${n})`,
          borderRadius: px(8),
          background: C.paper,
          boxShadow: `0 ${px(1)}px ${px(2)}px rgb(0 0 0 / 0.08), 0 0 0 ${px(1)}px ${C.rule}`,
        }}
      />
      {options.map((o, i) => {
        const on = 1 - Math.min(1, Math.abs(at - i));
        return (
          <div
            key={o}
            style={{
              position: "relative",
              display: "grid",
              placeItems: "center",
              fontFamily: FONT.sans,
              fontSize: px(13.5),
              fontWeight: on > 0.5 ? 650 : 500,
              color: on > 0.5 ? C.ink : C.muted,
              whiteSpace: "nowrap",
            }}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
}

/** Toggle chip (IncomeControl's Chip). */
export function Chip({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: px(6),
        height: px(36),
        padding: `0 ${px(13)}px`,
        borderRadius: 999,
        border: `${px(1)}px solid ${on ? C.accent : C.field}`,
        background: on ? C.accentSoft : "transparent",
        color: on ? C.accentInk : C.ink2,
        fontFamily: FONT.sans,
        fontSize: px(13.5),
        fontWeight: 650,
        boxSizing: "border-box",
      }}
    >
      {on && <Check size={px(13)} color={C.accentInk} />}
      {children}
    </div>
  );
}

/** Switch (role="switch"); `t` 0→1 slides the knob. */
export function Switch({ t }: { t: number }) {
  const w = px(40);
  const h = px(24);
  const knob = px(18);
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        borderRadius: 999,
        background: t > 0.5 ? C.accent : C.paper,
        border: `${px(1.5)}px solid ${t > 0.5 ? C.accent : C.field}`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: (h - px(3) - knob) / 2,
          left: px(1.5) + t * (w - px(6) - knob),
          width: knob,
          height: knob,
          borderRadius: 999,
          background: t > 0.5 ? C.paper : C.field,
        }}
      />
    </div>
  );
}

/** "− 0 anak +" stepper. */
export function Stepper({ value, unit }: { value: number; unit: string }) {
  const btn: CSSProperties = {
    width: px(31),
    height: px(31),
    display: "grid",
    placeItems: "center",
    borderRadius: px(8),
    color: C.ink,
    fontFamily: FONT.sans,
    fontSize: px(20),
    fontWeight: 500,
  };
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: px(4),
        padding: px(3),
        borderRadius: px(10),
        background: C.paper2,
      }}
    >
      <div style={{ ...btn, color: value === 0 ? C.rule2 : C.ink }}>−</div>
      <div
        style={{
          minWidth: px(62),
          textAlign: "center",
          fontFamily: FONT.sans,
          fontSize: px(14.5),
          fontWeight: 650,
          color: C.ink,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value} {unit}
      </div>
      <div style={btn}>+</div>
    </div>
  );
}

export function Check({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.2 3L13 4.5" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Masthead mark: terracotta "N" tile + Fraunces wordmark. */
export function Logo({ scale = 1 }: { scale?: number }) {
  const s = (v: number) => v * scale;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: s(18) }}>
      <div
        style={{
          width: s(72),
          height: s(72),
          borderRadius: s(22),
          background: C.accent,
          display: "grid",
          placeItems: "center",
          color: C.white,
          fontFamily: FONT.sans,
          fontWeight: 800,
          fontSize: s(36),
        }}
      >
        N
      </div>
      <div
        style={{
          ...DISPLAY_STYLE,
          fontSize: s(54),
          fontWeight: 620,
          letterSpacing: "-0.01em",
          color: C.ink,
          lineHeight: 1,
        }}
      >
        Nafkah
      </div>
    </div>
  );
}

export function Dot({ color, size }: { color: string; size: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        flexShrink: 0,
      }}
    />
  );
}
