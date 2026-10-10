import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BAND_COLORS, BAND_COLORS_DARK } from "./calculations";

/** Static pages paint band swatches from CSS variables; keep them in sync. */
describe("band colour CSS variables", () => {
  const css = readFileSync(resolve("src/app/globals.css"), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  /** Body of the rule whose selector list names `selector` and sets bands. */
  const block = (selector: string) => {
    for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const list = selectors.split(",").map((s) => s.trim());
      if (list.includes(selector) && body.includes("--band-")) return body;
    }
    return "";
  };

  it("match BAND_COLORS in light and dark", () => {
    for (const [band, color] of Object.entries(BAND_COLORS)) {
      expect(block(":root")).toContain(`--band-${band}: ${color};`);
    }
    for (const [band, color] of Object.entries(BAND_COLORS_DARK)) {
      expect(block(".dark")).toContain(`--band-${band}: ${color};`);
    }
  });

  it("keep booklet sheets on the light palette in dark mode", () => {
    for (const [band, color] of Object.entries(BAND_COLORS)) {
      expect(block(".sheet")).toContain(`--band-${band}: ${color};`);
    }
  });
});
