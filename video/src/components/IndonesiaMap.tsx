import { memo, type CSSProperties } from "react";
import { useVideoConfig } from "remotion";
import { MAP } from "../data";
import type { Cam } from "../story";
import { C } from "../theme";

const Paths = memo(function Paths({ fills, dim }: { fills: string[]; dim?: (code: string) => number }) {
  return (
    <>
      {MAP.regions.map((r, i) => (
        <path
          key={r.code}
          d={r.d}
          fill={fills[i]}
          fillOpacity={dim ? dim(r.code) : 1}
          stroke={C.paper}
          strokeWidth={0.9}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </>
  );
});

/**
 * 514 kabupaten/kota as SVG (projected from the app's regions.topojson).
 * Full-frame canvas; the camera places a map point at a screen point.
 */
export function IndonesiaMap({
  fills,
  cam,
  opacity = 1,
  dim,
  style,
  children,
}: {
  fills: string[];
  cam: Cam;
  opacity?: number;
  /** Per-region fill opacity (spotlight a region). */
  dim?: (code: string) => number;
  /** Extra styles on the canvas (e.g. a mask beside a rail). */
  style?: CSSProperties;
  /** Extra layers in map units (pins, arcs), drawn above the regions. */
  children?: React.ReactNode;
}) {
  const { width, height } = useVideoConfig();
  const tx = cam.sx - cam.fx * cam.k;
  const ty = cam.sy - cam.fy * cam.k;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0, opacity, ...style }}
    >
      <g transform={`translate(${tx} ${ty}) scale(${cam.k})`}>
        <Paths fills={fills} dim={dim} />
        {children}
      </g>
    </svg>
  );
}

/** Screen position of a map point under a camera. */
export function toScreen(cam: Cam, x: number, y: number): [number, number] {
  return [cam.sx + (x - cam.fx) * cam.k, cam.sy + (y - cam.fy) * cam.k];
}
