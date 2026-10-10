import { describe, expect, it } from "vitest";
import { initialState, reducer } from "./AppContext";

/*
 * The theme is restored on the next visit from the light/dark basemap, so
 * toggling the theme must keep the paper basemap paired with it. (Before the
 * redesign a returning visitor's dark theme reverted to light on reload.)
 */
describe("theme and basemap stay paired", () => {
  it("moves the paper basemap with the theme", () => {
    const dark = reducer(
      { ...initialState, basemap: "light", darkMode: false },
      { type: "theme/set", dark: true },
    );
    expect(dark).toMatchObject({ darkMode: true, basemap: "dark" });
    const light = reducer(dark, { type: "theme/set", dark: false });
    expect(light).toMatchObject({ darkMode: false, basemap: "light" });
  });

  it("leaves satellite and offline basemaps alone", () => {
    for (const basemap of ["satellite", "offline"] as const) {
      const next = reducer(
        { ...initialState, basemap, darkMode: false },
        { type: "theme/set", dark: true },
      );
      expect(next).toMatchObject({ darkMode: true, basemap });
    }
  });

  it("derives the theme when a paper basemap is chosen directly", () => {
    const next = reducer(
      { ...initialState, basemap: "satellite", darkMode: true },
      { type: "basemap/set", basemap: "light" },
    );
    expect(next).toMatchObject({ darkMode: false, basemap: "light" });
  });
});
