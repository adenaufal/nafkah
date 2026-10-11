import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Touch } from "../components/Touch";
import { Receipt, receiptRowCount, type ReceiptProps } from "../components/Receipt";
import { MAP, NUM } from "../data";
import { useFormat } from "../format";
import { POP, SMOOTH, SNAPPY, lerp, ramp, springAt } from "../motion";
import { cameraAt, mapHiddenAt, openAt, type Cam } from "../story";
import { C, DISPLAY_STYLE, FONT } from "../theme";
import { SCENE, cue } from "../timeline";

/** Portrait: a bottom sheet. The receipt window runs to just above the captions. */
const SHEET_Y = 600;
const RECEIPT_TOP = SHEET_Y + 227;
const RECEIPT_BOTTOM = 1294;

/**
 * Landscape: a rail on the left, as the app shows a region on desktop. The
 * receipt is drawn at the sheet's size (940 wide) and scaled into the rail.
 */
export const RAIL = { x: 90, top: 118, width: 705, receiptTop: 286, receiptBottom: 880 };
const RAIL_SCALE = RAIL.width / 940;

const JOGJA = MAP.regions.find((r) => r.code === NUM.jogja.code)!;

/** Map camera → screen. */
const screen = (cam: Cam, x: number, y: number): [number, number] => [
  cam.sx + (x - cam.fx) * cam.k,
  cam.sy + (y - cam.fy) * cam.k,
];

/** 0→1 the landscape rail is open (the map is masked beside it until it hides). */
export function railAt(frame: number): number {
  if (frame >= mapHiddenAt()) return 0;
  return Math.min(1, springAt(frame, openAt() + 2, SNAPPY));
}

/** Kota Yogyakarta: region story + struk bulanan, then "Upah kotaku". */
export function Region() {
  const frame = useCurrentFrame();
  const format = useFormat();
  const { width, height } = useVideoConfig();
  const from = SCENE.receipt.from;
  const to = SCENE.app.from;
  if (frame < from - 2 || frame > to + 20) return null;

  const landscape = format === "landscape";
  const cam = cameraAt(frame, format);
  const open = openAt();
  const sheetIn = springAt(frame, open + 2, SNAPPY);
  const sheetOut = springAt(frame, to - 6, SMOOTH, 10);

  // Printing starts with "keluar struk…" and runs at ~2 frames a line.
  const base: Omit<ReceiptProps, "shown"> = {
    data: NUM.jogja,
    width: 940,
    windowHeight: landscape
      ? (RAIL.receiptBottom - RAIL.receiptTop) / RAIL_SCALE
      : RECEIPT_BOTTOM - RECEIPT_TOP,
    incomeLabel: "UMK 2026",
    incomeValue: NUM.jogja.wage,
    bottom: { surplus: NUM.jogja.surplus, band: NUM.jogja.band, coverage: NUM.jogja.coverage },
  };
  const rows = receiptRowCount({ ...base, shown: 0 });
  const printAt = Math.max(cue("print") - 4, open + 10);
  const shown = interpolate(frame, [printAt, printAt + rows * 2.2], [0, rows], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Upah kotaku": wage of Kota Jakarta Selatan against Jogja's costs.
  const wage = cue("wage");
  const collapse = ramp(frame, wage + 2, wage + 18);
  const incomeT = ramp(frame, wage + 10, wage + 28);
  const after = NUM.jogjaWithJakselWage;
  const flipAt = cue("surplus") - 3;
  const flip = ramp(frame, flipAt, flipAt + 12);
  const pop = frame < flipAt ? ramp(frame, cue("short") + 2, cue("short") + 16) : ramp(frame, flipAt + 10, flipAt + 26);

  const [jx, jy] = screen(cam, JOGJA.cx, JOGJA.cy);
  const [kx, ky] = screen(cam, MAP.pins.jaksel[0], MAP.pins.jaksel[1]);
  const tx = cam.sx - cam.fx * cam.k;
  const ty = cam.sy - cam.fy * cam.k;

  const pinIn = springAt(frame, open, POP);
  const origin = springAt(frame, wage, POP);
  const arc = ramp(frame, wage + 6, wage + 26);
  const out = 1 - sheetOut;

  // Arc from Jakarta to Jogja, bowing north, with a dot riding its tip.
  const mx = (kx + jx) / 2;
  const my = Math.min(ky, jy) - 150;
  const arcPath = `M ${kx} ${ky} Q ${mx} ${my} ${jx} ${jy}`;
  const at = (t: number) => [
    (1 - t) ** 2 * kx + 2 * (1 - t) * t * mx + t ** 2 * jx,
    (1 - t) ** 2 * ky + 2 * (1 - t) * t * my + t ** 2 * jy,
  ];
  const [dotX, dotY] = at(arc);
  const destLabel = pinIn * (1 - ramp(frame, wage, wage + 8));

  const receipt = (
    <Receipt
      {...base}
      shown={shown}
      collapse={collapse}
      incomeLabel={incomeT > 0.5 ? "UMP kota asal" : "UMK 2026"}
      incomeValue={lerp(NUM.jogja.wage, after.wage, incomeT)}
      bottomAfter={{ surplus: after.surplus, band: after.band, coverage: after.coverage }}
      flip={flip}
      pop={pop}
      totalGlow={ramp(frame, cue("live"), cue("live") + 8) * (1 - ramp(frame, flipAt + 10, flipAt + 20))}
    />
  );

  return (
    <>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: out }}>
        {/* Selected region outline, as on the app's map. */}
        <g transform={`translate(${tx} ${ty}) scale(${cam.k})`} opacity={pinIn}>
          <path d={JOGJA.d} fill="none" stroke={C.ink} strokeWidth={4} vectorEffect="non-scaling-stroke" />
        </g>
        {arc > 0 && (
          <>
            <path
              d={arcPath}
              fill="none"
              stroke={C.ink}
              strokeWidth={6}
              strokeLinecap="round"
              pathLength={1000}
              strokeDasharray={`${1000 * arc} 1000`}
            />
            {arc < 1 && <circle cx={dotX} cy={dotY} r={13} fill={C.accent} stroke={C.paper} strokeWidth={5} />}
          </>
        )}
      </svg>

      <div style={{ position: "absolute", inset: 0, opacity: out }}>
        <Touch x={jx} y={jy} press={Math.min(ramp(frame, open - 8, open - 3), 1 - ramp(frame, open + 3, open + 8))} ripple={ramp(frame, open, open + 14)} />
        <MapPin x={jx} y={jy} t={pinIn} label={destLabel > 0.01 ? "Kota Yogyakarta" : null} labelT={destLabel} tone="dest" />
        {origin > 0.01 && <MapPin x={kx} y={ky} t={origin} label="Kota asal: Jakarta Selatan" labelT={origin} tone="origin" />}
      </div>

      {landscape ? (
        <div
          style={{
            position: "absolute",
            left: RAIL.x,
            top: RAIL.top,
            width: RAIL.width,
            opacity: out * Math.min(1, sheetIn * 1.4),
            transform: `translateX(${-(1 - sheetIn) * 160 - sheetOut * 120}px)`,
          }}
        >
          <RegionTitle kicker={23} title={80} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: RAIL.receiptTop - RAIL.top,
              transform: `scale(${RAIL_SCALE})`,
              transformOrigin: "0 0",
            }}
          >
            {receipt}
          </div>
        </div>
      ) : (
        <Sheet top={SHEET_Y + (1 - sheetIn) * 1300 + sheetOut * 260} height={height} opacity={out}>
          <RegionTitle kicker={27} title={92} />
          <div style={{ marginTop: 24 }}>{receipt}</div>
        </Sheet>
      )}
    </>
  );
}

function Sheet({ top, height, opacity, children }: { top: number; height: number; opacity: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height,
        background: C.paper,
        borderRadius: "56px 56px 0 0",
        boxShadow: "0 -10px 40px rgb(30 27 24 / 0.12)",
        padding: "0 70px",
        boxSizing: "border-box",
        opacity,
      }}
    >
      <div style={{ width: 96, height: 10, borderRadius: 999, background: C.rule2, margin: "22px auto 0" }} />
      <div style={{ marginTop: 30 }}>{children}</div>
    </div>
  );
}

/** Province kicker + region name, as at the top of the app's region story. */
function RegionTitle({ kicker, title }: { kicker: number; title: number }) {
  const kickerStyle: CSSProperties = {
    fontFamily: FONT.sans,
    fontSize: kicker,
    fontWeight: 650,
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color: C.muted,
  };
  return (
    <>
      <div style={kickerStyle}>Daerah Istimewa Yogyakarta · Kota</div>
      <div
        style={{
          ...DISPLAY_STYLE,
          marginTop: 10,
          fontSize: title,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          color: C.ink,
          lineHeight: 1.05,
        }}
      >
        Kota Yogyakarta
      </div>
    </>
  );
}

function MapPin({
  x,
  y,
  t,
  label,
  labelT,
  tone,
}: {
  x: number;
  y: number;
  t: number;
  label: string | null;
  labelT: number;
  tone: "dest" | "origin";
}) {
  if (t <= 0.01) return null;
  const color = tone === "dest" ? C.ink : C.accent;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      <div
        style={{
          position: "absolute",
          left: -14,
          top: -14,
          width: 28,
          height: 28,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 0 6px ${C.paper}, 0 4px 14px rgb(0 0 0 / 0.3)`,
          transform: `scale(${t})`,
        }}
      />
      {label && <div
        style={{
          position: "absolute",
          left: 0,
          top: 34,
          transform: `translateX(-50%) scale(${0.7 + 0.3 * labelT})`,
          opacity: Math.min(1, labelT * 1.5),
          whiteSpace: "nowrap",
          background: tone === "dest" ? C.ink : C.accent,
          color: C.white,
          fontFamily: FONT.sans,
          fontSize: 32,
          fontWeight: 700,
          padding: "12px 22px",
          borderRadius: 16,
          boxShadow: "0 8px 22px rgb(0 0 0 / 0.22)",
        }}
      >
        {label}
      </div>}
    </div>
  );
}
