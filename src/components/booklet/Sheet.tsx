import type { ReactNode } from "react";
import { pageLabel, pageNumber, type BookletPageId } from "./pages";

/*
 * Type for the sheets. Sizes are set for paper (A4 at 100%: 12.5px ≈ 9.4pt
 * body text) and step up on phones, where the sheet is a fluid column.
 */
export const T = {
  body: "text-[14.5px] leading-[1.6] text-ink-2 paper:text-[12.5px] [&_b]:font-semibold [&_b]:text-ink",
  small: "text-[12.5px] leading-[1.5] text-muted paper:text-[10.5px]",
  label:
    "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted paper:text-[9.5px]",
  /** Column headings in tables. */
  th: "py-1.5 text-[11px] font-medium text-muted paper:text-[9.5px]",
} as const;

/*
 * paper: covers wide screens and print, so size and margins are written
 * once. Desk styling (gap, border, shadow) uses min-[880px]: instead — a
 * print page is ~794px wide, so it never matches there — and print: only
 * overrides plain utilities: two media variants on one property would
 * leave the winner to stylesheet order.
 */
const FRAME = [
  "sheet relative flex scroll-mt-32 flex-col border-b border-rule px-5 pb-8 pt-10 xl:scroll-mt-20",
  "paper:h-[297mm] paper:w-[210mm] paper:overflow-hidden paper:px-[16mm] paper:pb-[9mm] paper:pt-[13mm]",
  "min-[880px]:mx-auto min-[880px]:my-8 min-[880px]:rounded-[2px] min-[880px]:border min-[880px]:shadow-[var(--shadow)]",
  "print:border-0 print:break-after-page print:last:break-after-auto",
].join(" ");

/**
 * One A4 page. On paper-sized screens and in print it is exactly
 * 210 × 297 mm with its own margins (the booklet sets @page margin 0), so
 * one sheet is one printed page; on phones it is a fluid column.
 */
export function Sheet({
  id,
  children,
  bare = false,
  className = "",
}: {
  id: BookletPageId;
  children: ReactNode;
  /** No footer (the covers). */
  bare?: boolean;
  className?: string;
}) {
  const n = pageNumber(id);
  return (
    <article
      id={id}
      aria-labelledby={`${id}-h`}
      className={`${FRAME} ${className}`}
    >
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {!bare && (
        <footer className="mt-8 flex items-baseline justify-between gap-4 border-t border-rule pt-2.5 paper:mt-4">
          <span className={T.label}>Nafkah · {pageLabel(id)}</span>
          <span className="f-display tnum text-[14px] text-ink paper:text-[12px]">
            {n}
          </span>
        </footer>
      )}
    </article>
  );
}

/** Section label (the heading) and the page's one-line message. */
export function SheetHead({
  id,
  title,
  lead,
}: {
  id: BookletPageId;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <header>
      <h2
        id={`${id}-h`}
        className="flex items-baseline gap-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-accent-ink paper:text-[10px]"
      >
        <span className="tnum">{String(pageNumber(id)).padStart(2, "0")}</span>{" "}
        {pageLabel(id)}
      </h2>
      <p className="f-display text-balance mt-2.5 text-[28px] font-[560] leading-[1.1] tracking-[-0.015em] text-ink paper:text-[27px]">
        {title}
      </p>
      {lead && (
        <p className="text-pretty mt-3 text-[15.5px] leading-[1.55] text-ink-2 paper:max-w-[64ch] paper:text-[13px]">
          {lead}
        </p>
      )}
    </header>
  );
}
