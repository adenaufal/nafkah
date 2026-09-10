import { describe, expect, it } from "vitest";
import { DEFAULT_ASSUMPTIONS } from "@/lib/calculations";
import { buildShareUrl, decodeSharedView } from "./share";

describe("shared view URL", () => {
  it("round-trips comparison regions, assumptions, and map filters", () => {
    const assumptions = {
      ...DEFAULT_ASSUMPTIONS,
      householdType: "family" as const,
      children: 3,
      dualIncome: true,
      customIncome: 8_500_000,
      installmentMonthly: 2_750_000,
    };

    const url = buildShareUrl("https://nafkah.example/?utm_source=test#map", {
      assumptions,
      pinned: ["31.73", "32.73"],
      selectedCode: "32.73",
      originCode: "31.73",
      colorMode: "cost",
      legendFilter: "tight",
    });

    const parsedUrl = new URL(url);
    expect(parsedUrl.searchParams.has("utm_source")).toBe(false);
    expect(parsedUrl.searchParams.get("naf")).toBe("2");
    expect(parsedUrl.hash).toBe("#map");
    expect(decodeSharedView(parsedUrl.search)).toEqual({
      assumptions,
      pinned: ["31.73", "32.73"],
      selectedCode: "32.73",
      originCode: "31.73",
      colorMode: "cost",
      legendFilter: "tight",
    });
  });

  it("keeps reading v1 links without an origin region", () => {
    const view = decodeSharedView("?naf=1&r=31.73&f=31.73&color=coverage");

    expect(view?.pinned).toEqual(["31.73"]);
    expect(view?.selectedCode).toBe("31.73");
    expect(view?.originCode).toBeNull();
  });

  it("ignores URLs without a supported Nafkah share version", () => {
    expect(decodeSharedView("?utm_source=test")).toBeNull();
    expect(decodeSharedView("?naf=99&r=31.73")).toBeNull();
  });

  it("sanitizes tampered values and limits the comparison to five regions", () => {
    const view = decodeSharedView(
      "?naf=1&r=31.73,31.73,bad,32.73,33.73,34.71,35.78,36.71" +
        "&f=not-a-code&hh=unknown&kids=99&income=-20&installment=abc" +
        "&origin=not-a-code&color=neon&band=unknown",
    );

    expect(view).not.toBeNull();
    expect(view?.pinned).toEqual([
      "31.73",
      "32.73",
      "33.73",
      "34.71",
      "35.78",
    ]);
    expect(view?.selectedCode).toBeNull();
    expect(view?.originCode).toBeNull();
    expect(view?.assumptions).toEqual(DEFAULT_ASSUMPTIONS);
    expect(view?.colorMode).toBe("coverage");
    expect(view?.legendFilter).toBeNull();
  });
});
