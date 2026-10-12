import { bandTheme } from "./bands";
import type { ReceiptCard } from "./receipt";

/*
 * The receipt as a 1080×1350 PNG (4:5: feed posts, WhatsApp, X), drawn on a
 * canvas from the same figures as the on-screen receipt. Always the light
 * theme, so a shared image reads the same everywhere. Browser-only, and loaded
 * on demand so the map's first load does not carry it.
 */

const W = 1080;
const H = 1350;
const PAD = 72;
const C = {
  bg: "#f0ece4",
  paper: "#fbf9f4",
  ink: "#1e1b18",
  ink2: "#4a433d",
  muted: "#6b6660",
  rule: "#cdc4b6",
  accent: "#c2452d",
  ok: "#0b7a4b",
  danger: "#a5271f",
};

interface Fonts {
  display: string;
  sans: string;
  mono: string;
}

/** next/font family names live as CSS variables on the `.atlas` wrapper. */
function resolveFonts(): Fonts {
  const css = getComputedStyle(document.querySelector(".atlas") ?? document.body);
  const read = (name: string, fallback: string) => {
    const value = css.getPropertyValue(name).trim();
    return value ? `${value}, ${fallback}` : fallback;
  };
  return {
    display: read("--font-fraunces", "Georgia, serif"),
    sans: read("--font-jakarta", "system-ui, sans-serif"),
    mono: read("--font-mono", "ui-monospace, monospace"),
  };
}

/** Self-hosted fonts load lazily; a canvas does not wait for them by itself. */
async function loadFonts(f: Fonts): Promise<void> {
  if (!document.fonts) return;
  await Promise.all(
    [
      `600 64px ${f.display}`,
      `500 24px ${f.sans}`,
      `700 24px ${f.sans}`,
      `500 24px ${f.mono}`,
      `700 24px ${f.mono}`,
    ].map((spec) => document.fonts.load(spec).catch(() => [])),
  );
}

/** `text`, cut with an ellipsis if it is wider than `max`. */
function fit(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ctx.measureText(`${text.slice(0, mid).trimEnd()}…`).width <= max) lo = mid;
    else hi = mid - 1;
  }
  return `${text.slice(0, lo).trimEnd()}…`;
}

/** Greedy word wrap; whatever is left after `maxLines` joins the last line. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  max: number,
  maxLines: number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(next).width > max) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  const kept = lines.slice(0, maxLines - 1);
  const rest = lines.slice(maxLines - 1).join(" ");
  if (rest) kept.push(rest);
  return kept.map((l) => fit(ctx, l, max));
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Receipt paper: rounded top, torn (zigzag) bottom edge. */
function paperShape(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const r = 22;
  const teeth = Math.round(w / 28);
  const step = w / teeth;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.lineTo(x + w, y + h);
  for (let i = 1; i <= teeth; i++) {
    ctx.lineTo(x + w - (i - 0.5) * step, y + h + 12);
    ctx.lineTo(x + w - i * step, y + h);
  }
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function dashedRule(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number) {
  ctx.save();
  ctx.strokeStyle = C.rule;
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 7]);
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
  ctx.restore();
}

function draw(ctx: CanvasRenderingContext2D, card: ReceiptCard, f: Fonts) {
  const band = bandTheme(false)[card.band];
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Brand row.
  roundedRect(ctx, PAD, 60, 52, 52, 13);
  ctx.fillStyle = C.accent;
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 32px ${f.display}`;
  ctx.textAlign = "center";
  ctx.fillText("N", PAD + 26, 97);
  ctx.textAlign = "left";
  ctx.fillStyle = C.ink;
  ctx.font = `600 36px ${f.display}`;
  ctx.fillText("Nafkah", PAD + 68, 98);
  ctx.textAlign = "right";
  ctx.fillStyle = C.muted;
  ctx.font = `500 20px ${f.mono}`;
  ctx.fillText("STRUK BULANAN", W - PAD, 94);
  ctx.textAlign = "left";

  // Region, then province and profile.
  const width = W - 2 * PAD;
  let y = 196;
  let size = 64;
  ctx.font = `600 ${size}px ${f.display}`;
  while (size > 40 && ctx.measureText(card.region).width > width) {
    size -= 4;
    ctx.font = `600 ${size}px ${f.display}`;
  }
  ctx.fillStyle = C.ink;
  ctx.fillText(fit(ctx, card.region, width), PAD, y);
  y += 40;
  ctx.font = `500 24px ${f.sans}`;
  ctx.fillStyle = C.ink2;
  for (const line of wrap(ctx, `${card.province} · ${card.profile}`, width, 2)) {
    ctx.fillText(line, PAD, y);
    y += 32;
  }

  // Coverage, the number people repost.
  y += 86;
  ctx.font = `600 112px ${f.display}`;
  ctx.fillStyle = band.ink;
  ctx.fillText(card.coverage, PAD - 4, y);
  const bx = PAD + ctx.measureText(card.coverage).width + 28;
  ctx.font = `500 24px ${f.sans}`;
  ctx.fillStyle = C.muted;
  ctx.fillText("biaya hidup bulanan tertutup", bx, y - 50);
  ctx.beginPath();
  ctx.arc(bx + 10, y - 12, 10, 0, Math.PI * 2);
  ctx.fillStyle = band.fill;
  ctx.fill();
  ctx.font = `700 30px ${f.sans}`;
  ctx.fillStyle = band.ink;
  ctx.fillText(card.bandLabel, bx + 30, y - 2);

  // Footer first: the receipt takes whatever height is left above it.
  ctx.font = `500 19px ${f.sans}`;
  const footer = card.footer.flatMap((t) => wrap(ctx, t, width, 2));
  const footerTop = H - 44 - (footer.length - 1) * 27;

  const top = y + 40;
  const x0 = PAD;
  const x1 = W - PAD;
  const in0 = x0 + 44;
  const in1 = x1 - 44;
  const valueRight = in1 - 74;
  const fixed = 36 + 20 + 48 + 26 + 38 + 26 + 44 + 30 + 58 + 26;
  const room = footerTop - 40 - 12 - top - fixed;
  const lh = Math.max(28, Math.min(42, room / Math.max(1, card.lines.length)));
  const height = fixed + lh * card.lines.length;

  ctx.save();
  ctx.shadowColor = "rgba(30, 27, 24, 0.12)";
  ctx.shadowBlur = 28;
  ctx.shadowOffsetY = 10;
  paperShape(ctx, x0, top, x1 - x0, height);
  ctx.fillStyle = C.paper;
  ctx.fill();
  ctx.restore();

  const heading = (text: string, at: number) => {
    ctx.font = `700 19px ${f.mono}`;
    ctx.fillStyle = C.muted;
    ctx.fillText(text, in0, at);
  };
  const row = (
    label: string,
    value: string,
    share: string,
    at: number,
    strong = false,
  ) => {
    ctx.font = `${strong ? 700 : 500} 24px ${f.mono}`;
    ctx.fillStyle = C.ink;
    ctx.textAlign = "right";
    ctx.fillText(value, valueRight, at);
    const valueWidth = ctx.measureText(value).width;
    ctx.textAlign = "left";
    ctx.font = `${strong ? 700 : 500} 24px ${f.sans}`;
    ctx.fillStyle = strong ? C.ink : C.ink2;
    const text = fit(ctx, label, valueRight - valueWidth - in0 - 32);
    ctx.fillText(text, in0, at);
    // Dotted leader between label and figure, as on a printed receipt.
    ctx.fillStyle = C.rule;
    const from = in0 + ctx.measureText(text).width + 12;
    for (let x = from; x < valueRight - valueWidth - 12; x += 9)
      ctx.fillRect(x, at - 6, 3, 3);
    if (share) {
      ctx.font = `500 18px ${f.sans}`;
      ctx.fillStyle = C.muted;
      ctx.textAlign = "right";
      ctx.fillText(share, in1, at);
      ctx.textAlign = "left";
    }
  };

  let ry = top + 36 + 20;
  heading("PEMASUKAN", ry);
  ctx.font = `500 18px ${f.mono}`;
  ctx.textAlign = "right";
  ctx.fillText(card.unit, in1, ry);
  ctx.textAlign = "left";
  ry += 48;
  row(card.income.label, card.income.value, "", ry, true);
  ry += 26;
  dashedRule(ctx, in0, in1, ry - 8);
  ry += 38;
  heading("PENGELUARAN · ESTIMASI", ry);
  for (const line of card.lines) {
    ry += lh;
    row(line.label, line.value, line.share, ry);
  }
  ry += 26;
  dashedRule(ctx, in0, in1, ry - 8);
  ry += 44;
  row("Total pengeluaran", card.total, "", ry, true);
  ry += 18;
  ctx.fillStyle = C.ink;
  ctx.fillRect(in0, ry, in1 - in0, 2);
  ctx.fillRect(in0, ry + 6, in1 - in0, 2);
  ry += 12 + 58;
  ctx.font = `700 20px ${f.sans}`;
  ctx.fillStyle = C.muted;
  ctx.fillText(card.result.label.toUpperCase(), in0, ry - 6);
  ctx.font = `700 40px ${f.mono}`;
  ctx.fillStyle = card.result.surplus ? C.ok : C.danger;
  ctx.textAlign = "right";
  ctx.fillText(card.result.value, in1, ry);
  ctx.textAlign = "left";

  // Where the numbers come from, and what they are not.
  ctx.font = `500 19px ${f.sans}`;
  footer.forEach((line, i) => {
    const last = i === footer.length - 1;
    ctx.fillStyle = last ? C.ink2 : C.muted;
    ctx.font = `${last ? 700 : 500} 19px ${f.sans}`;
    ctx.fillText(line, PAD, footerTop + i * 27);
  });
}

/** Render the card to a PNG blob. */
export async function renderReceiptPng(card: ReceiptCard): Promise<Blob> {
  const fonts = resolveFonts();
  await loadFonts(fonts);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia di browser ini.");
  draw(ctx, card, fonts);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Gambar gagal dibuat."))),
      "image/png",
    ),
  );
}
