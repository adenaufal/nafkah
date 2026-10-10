import { useCurrentFrame } from "remotion";
import { useFormat, type Format } from "../format";
import { POP, springAt } from "../motion";
import type { Emphasis, SceneId } from "../script";
import { C, FONT } from "../theme";
import { TOKENS, type TimedToken } from "../timeline";

const EM_BG: Record<Emphasis, string> = {
  accent: C.accent,
  green: "#0b7a4b",
  red: C.danger,
  blue: "#22698a",
};

/** Pages already spelled out large on screen. */
const SILENT: [SceneId, number][] = [
  ["cta", 1],
  ["cta", 2],
];

interface Page {
  key: string;
  tokens: TimedToken[];
  start: number;
  end: number;
}

const PAGES: Page[] = [];
for (const t of TOKENS) {
  const key = `${t.seg}:${t.page}`;
  const last = PAGES[PAGES.length - 1];
  if (last?.key === key) {
    last.tokens.push(t);
    last.end = t.end;
  } else {
    PAGES.push({ key, tokens: [t], start: t.start, end: t.end });
  }
}

/**
 * Portrait: in the gap between the cards and the platform's own caption,
 * clear of the right-hand action rail. Landscape: centred lower third.
 */
const PLACE: Record<Format, { y: number; left: number; right: number; size: number }> = {
  portrait: { y: 1372, left: 80, right: 120, size: 76 },
  landscape: { y: 962, left: 160, right: 160, size: 70 },
};

/** Word-by-word captions, TikTok style, in the app's type. */
export function Captions() {
  const frame = useCurrentFrame();
  const place = PLACE[useFormat()];
  const idx = PAGES.findIndex((p, i) => {
    const next = PAGES[i + 1];
    const until = Math.min(next ? next.start : Infinity, p.end + 14);
    return frame >= p.start && frame < until;
  });
  if (idx < 0) return null;
  const page = PAGES[idx];
  if (SILENT.some(([s, n]) => page.key === `${s}:${n}`)) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: place.left,
        right: place.right,
        top: place.y,
        transform: "translateY(-50%)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        columnGap: 20,
        rowGap: 8,
      }}
    >
      {page.tokens.map((t, i) => {
        // The opening word is already there on frame 0 (it is the thumbnail).
        const p = t.start <= 1 ? 1 : springAt(frame, t.start - 1, POP);
        const shown = frame >= t.start - 1;
        const bg = t.em ? EM_BG[t.em] : undefined;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: FONT.sans,
              fontWeight: 800,
              fontSize: place.size,
              lineHeight: 1.12,
              letterSpacing: "-0.015em",
              color: bg ? C.white : C.ink,
              background: bg,
              borderRadius: bg ? 18 : 0,
              padding: bg ? "0 18px 6px" : 0,
              opacity: shown ? Math.min(1, p * 1.6) : 0,
              transform: `translateY(${(1 - p) * 18}px) scale(${0.86 + 0.14 * p})`,
            }}
          >
            {t.show}
          </span>
        );
      })}
    </div>
  );
}
