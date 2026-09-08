export const DESKTOP_BREAKPOINT = 1200;

const COMPARISON_CHART_WIDE_BREAKPOINT = 1440;

export type ShellMode = "compact" | "desktop";

export function getShellMode(viewportWidth: number): ShellMode {
  return viewportWidth >= DESKTOP_BREAKPOINT ? "desktop" : "compact";
}

export function compactOverlayWidth(viewportWidth: number): number {
  return Math.min(Math.max(viewportWidth - 24, 0), 424);
}

/**
 * Keep Recharts mounted only when its CSS layout gives it measurable space.
 * The chart is secondary at tablet and narrow-desktop widths.
 */
export function shouldRenderComparisonChart(viewportWidth: number): boolean {
  return (
    viewportWidth < 768 ||
    (viewportWidth >= 1024 && viewportWidth < DESKTOP_BREAKPOINT) ||
    viewportWidth >= COMPARISON_CHART_WIDE_BREAKPOINT
  );
}
