import type { BookletFacts, BookletRegion } from "@/data/bookletFacts";
import { BAND_ORDER } from "@/lib/bands";
import type { Point } from "@/lib/svgMap";
import type { AffordabilityBand } from "@/lib/types";
import { BAND, BandBar, BandKey, IndonesiaMap, type MapLabel } from "../figures";
import { Sheet, SheetHead, T } from "../Sheet";

/*
 * Two windows on the same map, split at the Makassar Strait. Sumatra,
 * Java, Bali, NTB and Kalimantan sit west of it; Sulawesi, NTT, Maluku
 * and Papua east. Windows overlap by a degree so no coast is cut short.
 */
const HALVES = [
  {
    id: "barat",
    title: "Bagian barat",
    places: "Sumatra, Jawa, Bali, Nusa Tenggara Barat, Kalimantan",
    nw: [94.9, 6.3] as Point,
    se: [119.4, -9.4] as Point,
    labels: [
      { text: "SUMATRA", at: [96.8, -3.6] },
      { text: "KALIMANTAN", at: [113.4, 1.2] },
      { text: "JAWA", at: [110.2, -5.3] },
    ] as MapLabel[],
    // Province codes 11–52 and 61–65.
    has: (code: string) => {
      const p = Number(code);
      return p <= 52 || (p >= 61 && p <= 65);
    },
  },
  {
    id: "timur",
    title: "Bagian timur",
    places: "Sulawesi, Nusa Tenggara Timur, Maluku, Papua",
    nw: [118.4, 5.7] as Point,
    se: [141.1, -11.2] as Point,
    labels: [
      { text: "SULAWESI", at: [122.7, -0.4] },
      { text: "MALUKU", at: [128.4, -1.0] },
      { text: "PAPUA", at: [138.6, -6.4] },
      { text: "NUSA TENGGARA", at: [122.4, -7.2] },
    ] as MapLabel[],
    has: (code: string) => {
      const p = Number(code);
      return p === 53 || p >= 71;
    },
  },
];

function counts(rows: BookletRegion[]): Record<AffordabilityBand, number> {
  const out = { comfortable: 0, manageable: 0, tight: 0, insufficient: 0 };
  for (const r of rows) out[r.band] += 1;
  return out;
}

export function Maps({ f }: { f: BookletFacts }) {
  const view = (nw: Point, se: Point): [number, number, number, number] => {
    const [x0, y0] = f.map.project(nw);
    const [x1, y1] = f.map.project(se);
    return [x0, y0, x1 - x0, y1 - y0];
  };

  return (
    <Sheet id="peta">
      <SheetHead
        id="peta"
        title="Setiap kabupaten/kota, diwarnai menurut cakupannya."
      />
      <BandKey counts={f.national.counts} className="mt-4" />

      {HALVES.map((half, i) => {
        const rows = f.ranked.filter((r) => half.has(r.provinceCode));
        const c = counts(rows);
        const below = c.tight + c.insufficient;
        return (
          <figure
            key={half.id}
            className={
              i === 0
                ? "mt-6 paper:mt-[4mm]"
                : "mt-8 grid gap-4 paper:mt-[5mm] paper:grid-cols-[1fr_128mm] paper:gap-[6mm]"
            }
          >
            <figcaption className={i === 0 ? "flex flex-wrap items-baseline justify-between gap-x-4" : "paper:order-first paper:self-end"}>
              <span>
                <span className="f-display text-[18px] font-[560] text-ink paper:text-[15px]">
                  {half.title}
                </span>
                <span className={`${T.small} ${i === 0 ? "ml-2" : "block"}`}>
                  {half.places}
                </span>
              </span>
              <span className={`${T.small} tnum ${i === 0 ? "" : "mt-3 block"}`}>
                {rows.length} daerah · {below} di bawah 100%
                {i === 0 && (
                  <span className="text-ink-2">
                    {BAND_ORDER.map((band) => (
                      <span key={band} className="ml-3 inline-flex items-center gap-1">
                        <span
                          aria-hidden="true"
                          className="h-2 w-2 rounded-[2px]"
                          style={{ background: BAND[band].fill }}
                        />
                        {c[band]}
                        <span className="sr-only"> {BAND[band].label}</span>
                      </span>
                    ))}
                  </span>
                )}
              </span>
              {i === 1 && (
                <span className="mt-3 block max-w-[46ch]">
                  <BandBar counts={c} className="h-2" />
                  <span className="mt-2 block space-y-0.5">
                    {BAND_ORDER.map((band) => (
                      <span
                        key={band}
                        className="tnum flex justify-between text-[12px] text-ink-2 paper:text-[10px]"
                      >
                        <span>{BAND[band].label}</span>
                        <span className="font-semibold text-ink">{c[band]}</span>
                      </span>
                    ))}
                  </span>
                </span>
              )}
            </figcaption>
            <div className={i === 0 ? "mt-2" : ""}>
              <IndonesiaMap
                facts={f}
                counts={f.national.counts}
                view={view(half.nw, half.se)}
                labels={half.labels}
                label={`Peta Indonesia ${half.title.toLowerCase()} (${half.places}): ${rows.length} daerah, ${below} di bawah 100%.`}
              />
            </div>
          </figure>
        );
      })}

      <p className={`${T.small} mt-4 paper:mt-auto paper:pt-3`}>
        Garis putih tebal: batas provinsi. Pulau yang sangat kecil tidak
        tergambar pada skala ini, tetapi tetap dihitung.
      </p>
    </Sheet>
  );
}
