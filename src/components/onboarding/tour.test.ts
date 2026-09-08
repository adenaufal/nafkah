import { describe, expect, it } from "vitest";
import { placeTooltip, type SpotRect } from "./tour";

const FW = 1440;
const FH = 900;
const TW = 344;

describe("placeTooltip", () => {
  it("floats top-center when there is no target", () => {
    expect(placeTooltip(null, 424, FW, FH)).toEqual({
      left: Math.round((FW - 424) / 2),
      top: 90,
    });
  });

  it("places below a target near the top", () => {
    const spot: SpotRect = { key: "search", x: 20, y: 80, w: 260, h: 44 };
    const p = placeTooltip(spot, TW, FW, FH);
    expect(p.top).toBe(80 + 44 + 14);
    expect(p.bottom).toBeUndefined();
  });

  it("flips above when there is no room below", () => {
    const spot: SpotRect = { key: "compare", x: 400, y: 760, w: 600, h: 120 };
    const p = placeTooltip(spot, TW, FW, FH);
    expect(p.bottom).toBe(FH - 760 + 14);
    expect(p.top).toBeUndefined();
  });

  it("reserves the compact dock and map controls", () => {
    const p = placeTooltip(
      { key: "map", x: 0, y: 56, w: 375, h: 756 },
      351,
      375,
      812,
      224,
    );
    expect(p.bottom).toBe(238);
    expect(p.top).toBeUndefined();
  });

  it("reserves the desktop control lane when requested", () => {
    const left = placeTooltip(
      { key: "search", x: 20, y: 80, w: 296, h: 38 },
      TW,
      1200,
      FH,
      0,
      380,
    ).left;
    expect(left).toBe(380);
  });

  it("reserves the desktop right rail when requested", () => {
    const left = placeTooltip(
      { key: "legend", x: 888, y: 80, w: 296, h: 38 },
      TW,
      1200,
      FH,
      0,
      380,
      326,
    ).left;
    expect(left).toBe(530);
  });

  it("keeps desktop tooltips above the comparison panel", () => {
    const p = placeTooltip(
      { key: "compare", x: 340, y: 480, w: 520, h: 266 },
      TW,
      1200,
      800,
      334,
    );
    expect(p.bottom).toBe(348);
    expect(p.top).toBeUndefined();
  });

  it("clamps horizontally inside the frame", () => {
    const left = placeTooltip(
      { key: "asumsi", x: 1400, y: 10, w: 36, h: 36 },
      TW,
      FW,
      FH,
    ).left;
    expect(left).toBe(FW - TW - 14);
    const leftEdge = placeTooltip(
      { key: "map", x: -50, y: 10, w: 40, h: 40 },
      TW,
      FW,
      FH,
    ).left;
    expect(leftEdge).toBe(14);
  });
});
