import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { IndonesiaMap } from "../components/IndonesiaMap";
import { Logo } from "../components/ui";
import { MAP, blendBands, classify, countBands } from "../data";
import { loadFonts } from "../fonts";
import { BAND_FILL, BAND_LABEL, BAND_ORDER, C, DISPLAY_STYLE, FONT } from "../theme";
import type { BandCounts } from "../types";
import { RequestReceipt } from "./components/RequestReceipt";
import { UiShot } from "./components/UiShot";
import { UPD, covered, shot } from "./data";

loadFonts();

/*
 * Stills for v0.4.0: the Reels/TikTok cover, and 16:9 images for X and
 * Threads (one lead image and three details). Every count is recomputed
 * here from the same per-region figures the video colours the map with.
 */

type Profile = "room" | "owner" | "ownerSupport";

function coverageOf(code: string, profile: Profile): number {
  const v = UPD.perRegion[code];
  const cost = profile === "room" ? v.cost : profile === "owner" ? v.costOwner : v.costOwner + UPD.support;
  return (v.umk / cost) * 100;
}

const bandsOf = (profile: Profile) => MAP.regions.map((r) => classify(coverageOf(r.code, profile)));
const fillsOf = (profile: Profile) => bandsOf(profile).map((b) => blendBands([b]));
const countsOf = (profile: Profile): BandCounts => countBands(bandsOf(profile));

const HEADLINE: CSSProperties = {
  ...DISPLAY_STYLE,
  fontWeight: 620,
  lineHeight: 1.0,
  letterSpacing: "-0.02em",
  color: C.ink,
};

function Chip({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-block",
        fontFamily: FONT.sans,
        fontSize: 30,
        fontWeight: 800,
        letterSpacing: "0.12em",
        color: C.accentInk,
        background: C.accentSoft,
        padding: "16px 30px",
        borderRadius: 999,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Caveat({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ position: "absolute", fontFamily: FONT.sans, fontSize: 25, fontWeight: 600, color: C.muted, ...style }}>
      {UPD.profiles.room.replace("rusun/kost · ", "")} · UMK 2026 · Biaya hidup = estimasi model, bukan survei ·
      nafkah.adenaufal.com
    </div>
  );
}

/** Cover for Reels/TikTok; the content sits in the centre 1080×1350 of the profile grid. */
export function UpdateCover() {
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", top: 318, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Logo scale={0.9} />
      </div>
      <div style={{ ...HEADLINE, position: "absolute", top: 438, left: 60, right: 60, textAlign: "center", fontSize: 120 }}>
        Kalian minta,
        <br />
        <span style={{ color: C.accent }}>sekarang ada.</span>
      </div>
      <div style={{ position: "absolute", left: 540 - 470 * 0.9, top: 720 }}>
        <RequestReceipt scale={0.9} />
      </div>
      <div style={{ position: "absolute", top: 1380, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip>UPDATE v0.4.0 · GRATIS</Chip>
      </div>
    </AbsoluteFill>
  );
}

/** Lead image for X / Threads. */
export function Update16x9() {
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", top: 96, left: 110 }}>
        <Logo scale={0.95} />
      </div>
      <div style={{ ...HEADLINE, position: "absolute", top: 236, left: 110, fontSize: 118 }}>
        Kalian minta,
        <br />
        <span style={{ color: C.accent }}>sekarang ada.</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 112,
          width: 700,
          fontFamily: FONT.sans,
          fontSize: 36,
          fontWeight: 500,
          lineHeight: 1.45,
          color: C.ink2,
        }}
      >
        Enam permintaan dari komentar TikTok &amp; Instagram, sekarang ada di peta biaya hidup 514 kabupaten/kota.
      </div>
      <Chip style={{ position: "absolute", top: 760, left: 110 }}>UPDATE v0.4.0 · GRATIS</Chip>
      <div
        style={{
          position: "absolute",
          top: 892,
          left: 112,
          fontFamily: FONT.sans,
          fontSize: 34,
          fontWeight: 700,
          color: C.ink,
        }}
      >
        nafkah.adenaufal.com
      </div>
      <div
        style={{
          position: "absolute",
          top: 948,
          left: 112,
          fontFamily: FONT.sans,
          fontSize: 26,
          fontWeight: 600,
          color: C.muted,
        }}
      >
        Biaya hidup = estimasi model, bukan survei.
      </div>
      <div style={{ position: "absolute", left: 900, top: 196 }}>
        <RequestReceipt />
      </div>
    </AbsoluteFill>
  );
}

/** Big count of regions at 100% or more, with the four-band bar under it. */
function Tally({ counts, label, style }: { counts: BandCounts; label: string; style?: CSSProperties }) {
  const total = BAND_ORDER.reduce((s, b) => s + counts[b], 0);
  return (
    <div style={{ position: "absolute", width: 760, ...style }}>
      <div style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, color: C.ink2 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 6 }}>
        <span style={{ ...DISPLAY_STYLE, fontSize: 104, fontWeight: 560, lineHeight: 1, color: C.ink, fontVariantNumeric: "tabular-nums lining-nums" }}>
          {covered(counts)}
        </span>
        <span style={{ fontFamily: FONT.sans, fontSize: 30, fontWeight: 600, color: C.muted }}>
          dari {total} daerah cukup atau nyaman
        </span>
      </div>
      <div style={{ display: "flex", gap: 4, height: 18, borderRadius: 6, overflow: "hidden", marginTop: 18 }}>
        {BAND_ORDER.map((b) => (
          <div key={b} style={{ flexGrow: counts[b], flexBasis: 0, minWidth: counts[b] ? 4 : 0, background: BAND_FILL[b] }} />
        ))}
      </div>
      <div style={{ display: "flex", gap: 26, marginTop: 14, fontFamily: FONT.sans, fontSize: 25, fontWeight: 650, color: C.ink2 }}>
        {BAND_ORDER.map((b) => (
          <span key={b} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 16, height: 16, borderRadius: 999, background: BAND_FILL[b] }} />
            {BAND_LABEL[b]} {counts[b]}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Two maps of the same 514 regions under two profiles, side by side. */
function MapPair({ left, right }: { left: Profile; right: Profile }) {
  const cam = (sx: number) => ({ fx: MAP.width / 2, fy: MAP.height / 2, sx, sy: 560, k: 0.8 });
  return (
    <>
      <IndonesiaMap fills={fillsOf(left)} cam={cam(500)} />
      <IndonesiaMap fills={fillsOf(right)} cam={cam(1420)} />
      <div style={{ position: "absolute", left: 952, top: 420, width: 16, height: 300 }}>
        <svg width={16} height={300}>
          <path d="M8 0V300" stroke={C.rule2} strokeWidth={3} strokeDasharray="8 10" />
        </svg>
      </div>
    </>
  );
}

function DetailHeader({ index, request, title }: { index: number; request: string; title: ReactNode }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 70,
          left: 100,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: FONT.sans,
          fontSize: 28,
          fontWeight: 600,
          color: C.muted,
        }}
      >
        <span style={{ width: 44, height: 44, borderRadius: 999, background: C.ok, display: "grid", placeItems: "center" }}>
          <svg width={26} height={26} viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3.2 3L13 4.5" stroke={C.white} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        Kalian minta <b style={{ color: C.ink }}>{request}</b>
        <span style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 700 }}>{index}/6</span>
      </div>
      <div style={{ ...HEADLINE, position: "absolute", top: 136, left: 100, fontSize: 74, lineHeight: 1.06 }}>{title}</div>
    </>
  );
}

/** Rumah sendiri / ikut orang tua: the default map against biaya hunian Rp0. */
export function UpdateHome16x9() {
  const room = countsOf("room");
  const owner = countsOf("owner");
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <DetailHeader
        index={1}
        request="rumah sendiri / ikut orang tua"
        title={
          <>
            Tinggal di rumah sendiri atau ikut
            <br />
            orang tua? <span style={{ color: C.ok }}>Biaya hunian Rp0.</span>
          </>
        }
      />
      <div style={{ position: "absolute", right: 90, top: 60 }}>
        <UiShot states={["hunian-owner"]} scale={1.45} />
      </div>
      <MapPair left="room" right="owner" />
      <Tally counts={room} label="Rusun/kost (pilihan awal)" style={{ left: 100, top: 742 }} />
      <Tally counts={owner} label="Rumah sendiri" style={{ left: 1020, top: 742 }} />
      <Caveat style={{ left: 100, top: 1012 }} />
    </AbsoluteFill>
  );
}

/** Tanggungan keluarga: rumah sendiri, then the app's example of Rp1 jt a month. */
export function UpdateSupport16x9() {
  const owner = countsOf("owner");
  const support = countsOf("ownerSupport");
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <DetailHeader
        index={2}
        request="kiriman ke orang tua"
        title={
          <>
            Rutin kirim ke orang tua?
            <br />
            Isi <span style={{ color: C.accent }}>tanggungan keluarga.</span>
          </>
        }
      />
      <div style={{ position: "absolute", right: 90, top: 70 }}>
        <UiShot states={[`support-${String(UPD.support).length}`]} scale={1.6} />
      </div>
      <MapPair left="owner" right="ownerSupport" />
      <Tally counts={owner} label="Rumah sendiri" style={{ left: 100, top: 742 }} />
      <Tally counts={support} label="Rumah sendiri + Rp1 jt/bulan ke orang tua" style={{ left: 1020, top: 742 }} />
      <Caveat style={{ left: 100, top: 1012 }} />
    </AbsoluteFill>
  );
}

/** The receipt image the app makes, with amounts and with only percentages. */
export function UpdateShare16x9() {
  const on = shot("struk-on");
  const off = shot("struk-off");
  const h = 790;
  const w = h * 0.8;
  const gap = 36;
  const x0 = 1830 - 2 * w - gap;
  const card: CSSProperties = {
    position: "absolute",
    top: 110,
    width: w,
    height: h,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgb(30 27 24 / 0.14), 0 30px 70px rgb(30 27 24 / 0.22)",
  };
  const label: CSSProperties = {
    position: "absolute",
    top: 928,
    width: w,
    textAlign: "center",
    fontFamily: FONT.sans,
    fontSize: 30,
    fontWeight: 700,
    color: C.ink2,
  };
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", top: 96, left: 100 }}>
        <Logo scale={0.8} />
      </div>
      <div style={{ ...HEADLINE, position: "absolute", top: 220, left: 100, width: 440, fontSize: 64, lineHeight: 1.06 }}>
        Struk bulanan jadi <span style={{ color: C.accent }}>gambar.</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 102,
          width: 420,
          fontFamily: FONT.sans,
          fontSize: 30,
          fontWeight: 500,
          lineHeight: 1.45,
          color: C.ink2,
        }}
      >
        Nominal rupiah bisa disembunyikan, atau salin struknya sebagai teks.
      </div>
      <div style={{ position: "absolute", top: 700, left: 100 }}>
        <UiShot states={["footer"]} scale={1.2} />
      </div>
      <div style={{ ...card, left: x0 }}>
        <Img src={staticFile(on.file)} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ ...card, left: x0 + w + gap }}>
        <Img src={staticFile(off.file)} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ ...label, left: x0 }}>Nominal tampil</div>
      <div style={{ ...label, left: x0 + w + gap }}>Nominal disembunyikan</div>
      <div style={{ position: "absolute", top: 1012, left: 100, fontFamily: FONT.sans, fontSize: 25, fontWeight: 600, color: C.muted }}>
        Contoh: Kota Yogyakarta · {UPD.profiles.ownerSupport} · Biaya hidup = estimasi model, bukan survei
      </div>
    </AbsoluteFill>
  );
}
