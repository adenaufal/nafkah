import { describe, expect, it } from "vitest";
import { dotDomain, dotScale, stackDots } from "./dotStrip";

describe("dotDomain", () => {
  it("frames the default profile at 50–150% with 20-point ticks", () => {
    const values = Array.from({ length: 200 }, (_, i) => 60 + (i % 80));
    expect(dotDomain(values)).toEqual({
      lo: 50,
      hi: 150,
      ticks: [60, 80, 100, 120, 140],
    });
  });

  it("widens for a high salary and coarsens the ticks", () => {
    const values = Array.from({ length: 200 }, (_, i) => 100 + i * 1.5);
    const d = dotDomain(values);
    expect(d.lo).toBe(50);
    expect(d.hi).toBe(400);
    expect(d.ticks).toEqual([100, 200, 300]);
  });
});

describe("dotScale", () => {
  it("maps the domain onto the padded width and clamps outliers", () => {
    const x = dotScale({ lo: 50, hi: 150 }, 220, 10);
    expect(x(50)).toBe(10);
    expect(x(100)).toBe(110);
    expect(x(150)).toBe(210);
    expect(x(400)).toBe(210);
    expect(x(0)).toBe(10);
  });
});

describe("stackDots", () => {
  it("stacks equal values outward from the middle, alternating sides", () => {
    const dots = stackDots([100, 100, 100, 100], (v) => v, {
      d: 5,
      mid: 50,
      plotH: 80,
    });
    expect(dots.map((p) => p.cx)).toEqual([100, 100, 100, 100]);
    expect(dots.map((p) => Math.round(p.cy * 10) / 10)).toEqual([
      50, 45.1, 54.9, 40.2,
    ]);
  });

  it("squeezes a crowded bin to fit the plot height", () => {
    const dots = stackDots(
      Array.from({ length: 21 }, () => 7),
      (v) => v,
      { d: 4, mid: 30, plotH: 44 },
    );
    const ys = dots.map((p) => p.cy);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(40, 6);
  });
});
