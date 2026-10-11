import { C, FONT } from "../theme";

/**
 * A reply as it looked under the first Nafkah thread: anonymous (no names
 * or avatars), just the words people wrote.
 */
export function Bubble({
  text,
  x,
  y,
  rotate,
  t,
  out = 0,
}: {
  text: string;
  x: number;
  y: number;
  rotate: number;
  /** 0→1 pop in. */
  t: number;
  /** 0→1 leave. */
  out?: number;
}) {
  if (t <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${(0.7 + 0.3 * t) * (1 - 0.2 * out)})`,
        opacity: Math.min(1, t * 1.5) * (1 - out),
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 30px 20px 20px",
        borderRadius: 30,
        background: C.white,
        boxShadow: "0 2px 6px rgb(30 27 24 / 0.08), 0 18px 44px rgb(30 27 24 / 0.16)",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 999,
          background: C.paper3,
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <svg width={30} height={30} viewBox="0 0 24 24" fill={C.rule2}>
          <circle cx="12" cy="8.5" r="4.5" />
          <path d="M3.5 21c.9-4.3 4.3-6.8 8.5-6.8s7.6 2.5 8.5 6.8z" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: FONT.sans,
          fontSize: 38,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: "-0.005em",
        }}
      >
        {text}
      </span>
    </div>
  );
}
