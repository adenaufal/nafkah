import { describe, expect, it } from "vitest";
import {
  readUsageCounts,
  recordUsage,
  type UsageStorage,
} from "./usage";

function memoryStorage(initial?: string): UsageStorage & { value: string | null } {
  return {
    value: initial ?? null,
    getItem() {
      return this.value;
    },
    setItem(_key, value) {
      this.value = value;
    },
  };
}

describe("privacy-first usage counters", () => {
  it("increments only named aggregate events", () => {
    const storage = memoryStorage();

    recordUsage("region_opened", storage);
    recordUsage("region_opened", storage);
    recordUsage("share_completed", storage);

    const counts = readUsageCounts(storage);
    expect(counts.region_opened).toBe(2);
    expect(counts.share_completed).toBe(1);
    expect(storage.value).toContain('"region_opened":2');
    expect(storage.value).not.toContain("31.73");
  });

  it("ignores malformed or unknown local state", () => {
    const storage = memoryStorage(
      JSON.stringify({ region_opened: -2, unknown: 99, share_completed: 3.5 }),
    );

    const counts = readUsageCounts(storage);
    expect(counts.region_opened).toBe(0);
    expect(counts.share_completed).toBe(0);
    expect(counts.assumptions_changed).toBe(0);
  });
});
