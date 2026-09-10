/**
 * Privacy-first usage counters.
 *
 * Only aggregate event names are stored locally. No URL, region code,
 * assumption value, or financial input is recorded, and nothing is sent to a
 * third party. Keeping this as a tiny opt-in-to-the-browser layer lets us
 * validate the important journey without introducing analytics credentials or
 * a server into the static app.
 */

export const USAGE_STORAGE_KEY = "nafkah.usage.v1";

export const USAGE_EVENTS = [
  "region_opened",
  "region_pinned",
  "comparison_started",
  "assumptions_changed",
  "legend_mode_changed",
  "legend_filter_changed",
  "theme_toggled",
  "basemap_changed",
  "relocation_origin_set",
  "relocation_origin_cleared",
  "share_requested",
  "share_completed",
  "correction_report_opened",
] as const;

export type UsageEvent = (typeof USAGE_EVENTS)[number];
export type UsageCounts = Record<UsageEvent, number>;

export type UsageStorage = Pick<Storage, "getItem" | "setItem">;

function browserStorage(): UsageStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function emptyCounts(): UsageCounts {
  return Object.fromEntries(
    USAGE_EVENTS.map((event) => [event, 0]),
  ) as UsageCounts;
}

/** Read counters defensively; old or edited browser state degrades to zero. */
export function readUsageCounts(
  storage: UsageStorage | null = browserStorage(),
): UsageCounts {
  const counts = emptyCounts();
  if (!storage) return counts;

  try {
    const raw = storage.getItem(USAGE_STORAGE_KEY);
    if (!raw) return counts;
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return counts;
    const candidate = parsed as Record<string, unknown>;
    for (const event of USAGE_EVENTS) {
      const value = candidate[event];
      if (typeof value === "number" && Number.isSafeInteger(value) && value >= 0)
        counts[event] = value;
    }
  } catch {
    return counts;
  }
  return counts;
}

/** Increment one local aggregate counter without ever throwing into the UI. */
export function recordUsage(
  event: UsageEvent,
  storage: UsageStorage | null = browserStorage(),
): void {
  if (!storage) return;
  try {
    const counts = readUsageCounts(storage);
    counts[event] += 1;
    storage.setItem(USAGE_STORAGE_KEY, JSON.stringify(counts));
  } catch {
    /* Private browsing or strict storage policies must not break the app. */
  }
}
