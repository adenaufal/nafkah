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
