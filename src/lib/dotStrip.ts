/**
 * Layout for the dot strip: every region as one dot along the coverage
 * axis, stacked symmetrically where values crowd. Shared by the live strip
 * in the rail and the printed one in the booklet, so both draw the same
 * picture from the same numbers.
 */

export interface DotDomain {
  lo: number;
  hi: number;
  ticks: number[];
}

/**
 * 50–150% frames the default profile; a high salary or a frugal profile
 * pushes regions past it, so the axis widens to keep ~98% of dots apart.
 */
export function dotDomain(values: readonly number[]): DotDomain {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (q: number) =>
    sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] ?? 100;
  const lo = Math.min(50, Math.floor(at(0.01) / 10) * 10);
  const hi = Math.max(150, Math.ceil(at(0.99) / 10) * 10);
  const range = hi - lo;
  const step = range <= 120 ? 20 : range <= 260 ? 50 : 100;
  const ticks: number[] = [];
  for (
    let t = Math.ceil((lo + step / 2) / step) * step;
    t < hi - step / 3;
    t += step
  )
    ticks.push(t);
  return { lo, hi, ticks };
}

/** Value → x along an axis of `width` with `padX` on each side (clamped). */
export function dotScale(
  { lo, hi }: Pick<DotDomain, "lo" | "hi">,
  width: number,
  padX: number,
): (value: number) => number {
  return (v) =>
    padX + ((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo)) * (width - padX * 2);
}

/**
 * Bin dots `d` units wide along x, then stack each bin outward from the
 * middle line, alternating below and above. Crowded bins squeeze their
 * spacing to stay within `plotH`.
 */
export function stackDots<T>(
  items: readonly T[],
  x: (item: T) => number,
  { d, mid, plotH }: { d: number; mid: number; plotH: number },
): { item: T; cx: number; cy: number }[] {
  const bins = new Map<number, T[]>();
  for (const item of items) {
    const b = Math.round(x(item) / d);
    const list = bins.get(b);
    if (list) list.push(item);
    else bins.set(b, [item]);
  }
  const out: { item: T; cx: number; cy: number }[] = [];
  for (const [b, list] of bins) {
    const spacing = Math.min(
      d * 0.98,
      (plotH - d) / Math.max(1, list.length - 1),
    );
    list.forEach((item, i) => {
      const k = Math.ceil(i / 2) * (i % 2 === 0 ? 1 : -1);
      out.push({ item, cx: b * d, cy: mid + k * spacing });
    });
  }
  return out;
}
