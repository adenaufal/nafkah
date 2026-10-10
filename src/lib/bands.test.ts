import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { BAND_COLORS, BAND_COLORS_DARK } from "./calculations";

/** Static pages paint band swatches from CSS variables; keep them in sync. */
describe("band colour CSS variables", () => {
  const css = readFileSync(resolve("src/app/globals.css"), "utf8");
  const block = (selector: string) => {
    const start = css.indexOf(`${selector} {`);
    return css.slice(start, css.indexOf("}", start));
  };

  it("match BAND_COLORS in light and dark", () => {
    for (const [band, color] of Object.entries(BAND_COLORS)) {
      expect(block(":root")).toContain(`--band-${band}: ${color};`);
    }
    for (const [band, color] of Object.entries(BAND_COLORS_DARK)) {
      expect(block(".dark")).toContain(`--band-${band}: ${color};`);
    }
  });
});
