import { C, FONT } from "../../theme";

/** Header over each feature: the request it answers, already checked off. */
export function RequestPill({ label, index, t }: { label: string; index: number; t: number }) {
  if (t <= 0.001) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "12px 30px 12px 12px",
        borderRadius: 999,
        background: C.white,
        boxShadow: "0 2px 6px rgb(30 27 24 / 0.08), 0 14px 36px rgb(30 27 24 / 0.12)",
        opacity: Math.min(1, t * 1.5),
        transform: `translateY(${(1 - t) * -24}px) scale(${0.9 + 0.1 * t})`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 52,
          height: 52,
          borderRadius: 999,
          background: C.ok,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <svg width={30} height={30} viewBox="0 0 16 16" fill="none">
          <path d="M3 8.5l3.2 3L13 4.5" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span style={{ fontFamily: FONT.sans, fontSize: 31, fontWeight: 600, color: C.muted }}>
        Kalian minta{" "}
        <span style={{ fontWeight: 800, color: C.ink }}>{label}</span>
      </span>
      <span style={{ fontFamily: FONT.mono, fontSize: 25, fontWeight: 700, color: C.muted }}>{index}/6</span>
    </div>
  );
}

/** Result stamp over the map, like the teaser's "491 dari 514". */
export function Stamp({ text, color, t }: { text: string; color: string; t: number }) {
  if (t <= 0.01) return null;
  return (
    <div
      style={{
        transform: `translate(-50%, -50%) rotate(-3deg) scale(${0.6 + 0.4 * t})`,
        opacity: Math.min(1, t * 1.4),
        background: color,
        color: C.white,
        fontFamily: FONT.sans,
        fontWeight: 800,
        fontSize: 46,
        padding: "18px 34px",
        borderRadius: 22,
        boxShadow: "0 18px 50px rgb(30 27 24 / 0.3)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
}
