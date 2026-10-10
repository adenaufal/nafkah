import type { BookletFacts } from "@/data/bookletFacts";
import { BAND_ORDER } from "@/lib/bands";
import { dotDomain, dotScale, stackDots } from "@/lib/dotStrip";
import { pct } from "@/lib/format";
import { BAND, Dots } from "./figures";
import { fillRef, PROVINCES_REF } from "./sprite";

/*
 * The map screen as a labelled sketch: where the four steps on this page
 * happen. Not a screenshot — it is drawn from the same data (the map, the
 * counts, the dot strip), so it cannot go stale when the numbers change.
 * Coordinates are in a 672 × 330 frame (≈ the text width of a sheet).
 */

const W = 672;
const H = 330;
const RAIL = 216;
const HEAD = 36;

function Callout({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill="var(--accent)" />
      <text
        x={x}
        y={y + 0.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={10.5}
        fontWeight={700}
        fill="var(--on-accent)"
      >
        {n}
      </text>
    </g>
  );
}

export function AppSketch({ f }: { f: BookletFacts }) {
  const n = f.national;
  // The rail's headline and distribution, as the app shows them.
  const total = n.total || 1;
  let left = 14;
  const bar = BAND_ORDER.map((band) => {
    const w = (n.counts[band] / total) * 188;
    const seg = { band, x: left, w: Math.max(0, w - 1.5) };
    left += w;
    return seg;
  });
  // A small dot strip from the real coverages.
  const domain = dotDomain(f.ranked.map((r) => r.coverage));
  const x = dotScale(domain, 188, 3);
  const dots = stackDots(f.ranked, (r) => x(r.coverage), {
    d: 2.4,
    mid: 0,
    plotH: 34,
  });
  // Two pinned cities in the comparison tray.
  const pins = f.cities.slice(1, 3);
  const profile = `${f.profile.split(" · ").slice(0, 3).join(" · ")}…`;
  const mapW = W - RAIL - 24;
  const mapH = (mapW / f.map.width) * f.map.height;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Sketsa layar peta Nafkah: kolom cari di atas (1), kotak Hitung dengan (2) dan Ubah profil (3) di panel kiri, peta di kanan, dan baki perbandingan di bawah peta (4)."
      className="block h-auto w-full"
      fontFamily="inherit"
    >
      <rect
        x={0.5}
        y={0.5}
        width={W - 1}
        height={H - 1}
        rx={10}
        fill="#fff"
        stroke="var(--rule-2)"
      />
      {/* Header */}
      <line x1={0} x2={W} y1={HEAD} y2={HEAD} stroke="var(--rule)" />
      <rect x={14} y={10} width={16} height={16} rx={4} fill="var(--accent)" />
      <text x={22} y={18.5} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={800} fill="#fff">
        N
      </text>
      <text x={36} y={22.5} fontSize={13} fontWeight={600} fill="var(--ink)" className="f-display">
        Nafkah
      </text>
      <rect x={232} y={8} width={210} height={20} rx={10} fill="var(--paper-2)" />
      <text x={245} y={21.5} fontSize={8.5} fill="var(--muted)">
        Cari kabupaten/kota…
      </text>
      <rect x={421} y={12} width={12} height={12} rx={3} fill="#fff" stroke="var(--rule-2)" />
      <text x={427} y={21} textAnchor="middle" fontSize={8} fill="var(--muted)">
        /
      </text>
      <text x={548} y={21.5} fontSize={8.5} fontWeight={600} fill="var(--ink-2)">
        Metode
      </text>
      <text x={590} y={21.5} fontSize={8.5} fontWeight={600} fill="var(--ink-2)">
        Bagikan
      </text>
      <circle cx={648} cy={18} r={6} fill="none" stroke="var(--ink-2)" />

      {/* Rail */}
      <line x1={RAIL} x2={RAIL} y1={HEAD} y2={H - 1} stroke="var(--rule)" />
      <text x={14} y={54} fontSize={6.5} fontWeight={600} letterSpacing={1} fill="var(--muted)">
        UMK {f.wageYear} × ESTIMASI BIAYA HIDUP
      </text>
      <text fontSize={12.5} fontWeight={560} fill="var(--ink)" className="f-display">
        <tspan x={14} y={72}>
          Di <tspan fill="var(--accent)">{n.below}</tspan> dari {n.total} daerah,
        </tspan>
        <tspan x={14} y={87}>
          upah minimum belum menutup
        </tspan>
        <tspan x={14} y={102}>
          biaya hidup {f.noun}.
        </tspan>
      </text>
      <rect x={14} y={114} width={188} height={64} rx={8} fill="var(--paper-2)" />
      <text x={24} y={128} fontSize={6.5} fontWeight={700} letterSpacing={1} fill="var(--muted)">
        HITUNG DENGAN
      </text>
      <rect x={24} y={134} width={168} height={17} rx={5} fill="var(--paper-3)" />
      <rect x={26} y={136} width={54} height={13} rx={4} fill="#fff" />
      {[
        ["Upah daerah", 53],
        ["Gajiku", 109],
        ["Upah kotaku", 163],
      ].map(([t, cx]) => (
        <text key={t} x={cx} y={145.5} textAnchor="middle" fontSize={7} fontWeight={600} fill="var(--ink-2)">
          {t}
        </text>
      ))}
      <text x={24} y={168} fontSize={7} fill="var(--ink-2)">
        Untuk: {profile}
      </text>
      <text x={192} y={168} textAnchor="end" fontSize={7} fontWeight={700} fill="var(--accent-ink)">
        Ubah profil
      </text>
      <text x={14} y={196} fontSize={7.5} fontWeight={700} fill="var(--ink)">
        Sebaran {n.total} daerah
      </text>
      {bar.map((s) => (
        <rect key={s.band} x={s.x} y={202} width={s.w} height={6} rx={1.5} fill={BAND[s.band].fill} />
      ))}
      {BAND_ORDER.map((band, i) => (
        <g key={band}>
          <text x={14 + i * 48} y={226} fontSize={12} fill="var(--ink)" className="f-display tnum">
            {n.counts[band]}
          </text>
          <text x={14 + i * 48} y={236} fontSize={6.5} fill="var(--muted)">
            {BAND[band].label}
          </text>
        </g>
      ))}
      <g transform="translate(14 278)">
        {BAND_ORDER.map((band) => (
          <Dots
            key={band}
            points={dots.filter((p) => p.item.band === band)}
            r={1.05}
            color={BAND[band].fill}
          />
        ))}
      </g>
      <text x={14} y={312} fontSize={6.5} fill="var(--muted)">
        Setiap titik satu daerah · median {pct(n.medianCoverage, 1)}
      </text>

      {/* Map */}
      <svg
        x={RAIL + 12}
        y={HEAD + 30}
        width={mapW}
        height={mapH}
        viewBox={`0 0 ${f.map.width} ${f.map.height}`}
      >
        {BAND_ORDER.filter((band) => n.counts[band] > 0).map((band) => (
          <use key={band} href={fillRef("all", band)} fill={BAND[band].fill} fillRule="evenodd" />
        ))}
        <use href={PROVINCES_REF} fill="none" stroke="#fff" strokeWidth={0.5} />
      </svg>

      {/* Comparison tray */}
      <rect x={340} y={286} width={262} height={28} rx={14} fill="#fff" stroke="var(--rule-2)" />
      {pins.map((c, i) => (
        <g key={c.code}>
          <circle cx={356 + i * 88} cy={300} r={6} fill="var(--ink)" />
          <text x={356 + i * 88} y={300.5} textAnchor="middle" dominantBaseline="middle" fontSize={7} fontWeight={700} fill="#fff">
            {i + 1}
          </text>
          <text x={366 + i * 88} y={303} fontSize={7.5} fontWeight={600} fill="var(--ink)">
            {c.label.replace(/^Kota /, "")}{" "}
            <tspan fill={BAND[c.band].ink}>{pct(c.coverage)}</tspan>
          </text>
        </g>
      ))}
      <rect x={536} y={291} width={60} height={18} rx={9} fill="var(--ink)" />
      <text x={566} y={302.5} textAnchor="middle" fontSize={7.5} fontWeight={700} fill="#fff">
        Bandingkan
      </text>

      {/* Steps on this page */}
      <Callout n={1} x={456} y={18} />
      <Callout n={2} x={208} y={124} />
      <Callout n={3} x={208} y={164} />
      <Callout n={4} x={616} y={300} />
    </svg>
  );
}
