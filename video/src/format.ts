import { useVideoConfig } from "remotion";

/**
 * The same edit in two shapes: 9:16 for Threads, Reels and TikTok, 16:9 for
 * YouTube, X and other landscape players. Scenes read the shape from the
 * composition, so one component tree renders both.
 */
export type Format = "portrait" | "landscape";

export function useFormat(): Format {
  const { width, height } = useVideoConfig();
  return width > height ? "landscape" : "portrait";
}
