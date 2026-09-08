import { describe, expect, it } from "vitest";
import {
  compactOverlayWidth,
  getShellMode,
  shouldRenderComparisonChart,
} from "./responsive";

describe("responsive shell mode", () => {
  it("keeps tablet widths in compact chrome until desktop has room for both rails", () => {
    expect(getShellMode(768)).toBe("compact");
    expect(getShellMode(1199)).toBe("compact");
    expect(getShellMode(1200)).toBe("desktop");
    expect(getShellMode(2560)).toBe("desktop");
  });

  it("caps compact onboarding overlays without squeezing phone layouts", () => {
    expect(compactOverlayWidth(375)).toBe(351);
    expect(compactOverlayWidth(447)).toBe(423);
    expect(compactOverlayWidth(448)).toBe(424);
    expect(compactOverlayWidth(768)).toBe(424);
    expect(compactOverlayWidth(1199)).toBe(424);
  });

  it("renders the secondary comparison chart only when its container is measurable", () => {
    expect(shouldRenderComparisonChart(767)).toBe(true);
    expect(shouldRenderComparisonChart(768)).toBe(false);
    expect(shouldRenderComparisonChart(1023)).toBe(false);
    expect(shouldRenderComparisonChart(1024)).toBe(true);
    expect(shouldRenderComparisonChart(1199)).toBe(true);
    expect(shouldRenderComparisonChart(1200)).toBe(false);
    expect(shouldRenderComparisonChart(1439)).toBe(false);
    expect(shouldRenderComparisonChart(1440)).toBe(true);
  });
});
