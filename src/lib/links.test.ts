import { describe, expect, it } from "vitest";

import { CORRECTION_FORM_URL } from "./links";

describe("public contribution links", () => {
  it("keeps the correction form on the live Airtable page", () => {
    expect(CORRECTION_FORM_URL).toBe(
      "https://airtable.com/appri285d7CNF5mqc/pagbuVQAdt3s9mEaV/form",
    );
  });
});
