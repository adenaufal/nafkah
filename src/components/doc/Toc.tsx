"use client";

import { useEffect, useRef, useState } from "react";

export interface TocItem {
  id: string;
  label: string;
  /** Printed page number (the booklet). */
  page?: number;
}

/* Literal class names per breakpoint, so Tailwind can see them. */
const WIDE = {
  lg: { min: 1024, column: "lg:block", chips: "lg:hidden" },
  xl: { min: 1280, column: "xl:block", chips: "xl:hidden" },
} as const;

/**
 * Table of contents that marks the section being read. Sticky column on
 * wide screens; a scrollable chip row under the header on phones. The
 * booklet switches at `xl`, where an A4 sheet fits beside the column.
 */
export function Toc({
  items,
  breakpoint = "lg",
}: {
  items: TocItem[];
  breakpoint?: keyof typeof WIDE;
}) {
  const wide = WIDE[breakpoint];
  const [active, setActive] = useState(items[0]?.id);
  const chips = useRef<HTMLOListElement>(null);
  // Phones: keep the chip for the current section in view.
  useEffect(() => {
    const list = chips.current;
    const chip = list?.querySelector<HTMLElement>('[aria-current="location"]');
    if (!list || !chip || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: chip.offsetLeft - 20, behavior: "smooth" });
  }, [active]);
  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);
    // The section being read is the last one whose top has passed a line
    // just under the sticky header (and the phone chip row).
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerWidth >= wide.min ? 120 : 150;
      let current = els[0]?.id;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      }
      // At the very bottom the last section wins even if it is short.
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 4
      ) {
        current = els[els.length - 1]?.id ?? current;
      }
      if (current) setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, wide.min]);

  return (
    <>
      <nav
        aria-label="Daftar isi"
        className={`no-print sticky top-24 hidden self-start ${wide.column}`}
      >
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Daftar isi
        </p>
        <ol className="space-y-0.5 border-l border-rule">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "location" : undefined}
                className={`-ml-px flex gap-2.5 border-l-2 py-1.5 pl-4 text-[13.5px] transition-colors ${
                  active === i.id
                    ? "border-accent font-semibold text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {i.page !== undefined && (
                  <span className="tnum w-4 shrink-0 text-right font-normal text-muted">
                    {i.page}
                  </span>
                )}
                {i.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <nav
        aria-label="Daftar isi"
        className={`no-print sticky top-14 z-20 -mx-5 border-b border-rule bg-paper/92 px-5 py-2 backdrop-blur ${wide.chips}`}
      >
        <ol
          ref={chips}
          className="thin-scroll relative flex gap-1.5 overflow-x-auto"
        >
          {items.map((i) => (
            <li key={i.id} className="shrink-0">
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "location" : undefined}
                className={`block rounded-full px-3 py-2.5 text-[12.5px] font-medium ${
                  active === i.id
                    ? "bg-ink text-paper"
                    : "border border-rule text-ink-2"
                }`}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
