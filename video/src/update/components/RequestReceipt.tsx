import type { ReactNode } from "react";
import { C, FONT } from "../../theme";

/**
 * What the TikTok & Instagram wave of 11–12 October asked for, as themes from
 * the anonymous summary in ROADMAP.md: no names, no quoted comments. Same
 * order as the video.
 */
export const REQUESTS = [
  "Rumah sendiri / ikut orang tua",
  "Kiriman ke orang tua",
  "Mobil & jalan kaki/sepeda",
  "Gaji pasangan yang beda",
  "Struk jadi gambar & teks",
  "Asal angka & cara dibuat",
] as const;

/** The same requests as the header pill above each feature: "Kalian minta …". */
export const REQUEST_SHORT = [
  "rumah sendiri / ikut orang tua",
  "kiriman ke orang tua",
  "mobil & jalan kaki/sepeda",
  "gaji pasangan yang beda",
  "struk bisa dibagikan",
  "asal angka & cara dibuat",
] as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function Check({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5l3.2 3L13 4.5" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * "Permintaan kalian" as a receipt, in the app's receipt style: requests
 * print line by line, each gets a check, then the "sudah ada" stamp lands.
 * Sizes are in video pixels for a 940 px receipt; `scale` shrinks it.
 */
export function RequestReceipt({
  shown = REQUESTS.length + 4,
  checks = REQUESTS.length,
  stamp = 1,
  scale = 1,
}: {
  /** Printed rows, fractional while the next one fades in. */
  shown?: number;
  /** Checked requests, fractional while the next check pops. */
  checks?: number;
  /** 0→1 the stamp slams down. */
  stamp?: number;
  scale?: number;
}) {
  const width = 940;
  const row = (i: number, node: ReactNode, height: number, key: string) => {
    const t = clamp01(shown - i);
    return (
      <div key={key} style={{ height: height * t, opacity: t, overflow: "hidden" }}>
        <div style={{ height }}>{node}</div>
      </div>
    );
  };
  const rule = (
    <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%", borderTop: `3px dashed ${C.rule2}` }} />
    </div>
  );
  const rows: ReactNode[] = [
    row(
      0,
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT.mono,
          fontSize: 27,
          color: C.muted,
        }}
      >
        <span style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>Permintaan kalian</span>
        <span>TikTok · IG · 11–12 Okt</span>
      </div>,
      58,
      "head",
    ),
    row(1, rule, 40, "r1"),
    ...REQUESTS.map((label, i) => {
      const c = clamp01(checks - i);
      return row(
        2 + i,
        <div style={{ height: "100%", display: "flex", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>
            {label}
          </span>
          <span style={{ flex: 1, minWidth: 30, borderBottom: `3px dotted ${C.rule2}`, marginTop: 14 }} />
          <span
            style={{
              width: 118,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 6,
              fontFamily: FONT.mono,
              fontSize: 30,
              fontWeight: 700,
              color: C.ok,
              opacity: Math.min(1, c * 1.5),
              transform: `scale(${0.5 + 0.5 * c})`,
              transformOrigin: "right center",
            }}
          >
            <Check size={30} color={C.ok} />
            ada
          </span>
        </div>,
        66,
        `q${i}`,
      );
    }),
    row(2 + REQUESTS.length, rule, 40, "r2"),
    row(
      3 + REQUESTS.length,
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: FONT.mono,
          fontSize: 27,
          color: C.muted,
        }}
      >
        <span style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>Nafkah v0.4.0</span>
        <span>12 Okt 2026</span>
      </div>,
      58,
      "foot",
    ),
  ];
  const s = clamp01(stamp);
  return (
    <div style={{ position: "relative", width, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
      <div style={{ background: C.paper2, borderRadius: "34px 34px 0 0", padding: "30px 46px 34px" }}>{rows}</div>
      <div
        style={{
          height: 20,
          background: `linear-gradient(-45deg, transparent 13px, ${C.paper2} 0) 0 0 / 27px 20px repeat-x, linear-gradient(45deg, transparent 13px, ${C.paper2} 0) 0 0 / 27px 20px repeat-x`,
        }}
      />
      {s > 0.001 && (
        <div
          style={{
            position: "absolute",
            right: 30,
            bottom: 4,
            transform: `rotate(-6deg) scale(${1 + 0.9 * (1 - s)})`,
            transformOrigin: "center",
            opacity: Math.min(1, s * 2),
            border: `7px solid ${C.ok}`,
            outline: `3px solid ${C.ok}`,
            outlineOffset: 6,
            borderRadius: 18,
            padding: "10px 26px 12px",
            fontFamily: FONT.sans,
            fontSize: 60,
            fontWeight: 800,
            letterSpacing: "0.04em",
            color: C.ok,
            background: "rgb(240 236 228 / 0.88)",
            whiteSpace: "nowrap",
          }}
        >
          SUDAH ADA
        </div>
      )}
    </div>
  );
}
