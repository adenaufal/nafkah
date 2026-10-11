"use client";

import type { ReactNode } from "react";
import { Printer } from "@phosphor-icons/react";
import { DocHeader } from "@/components/doc/DocHeader";
import { Toc } from "@/components/doc/Toc";
import { useDocTheme } from "@/state/theme";
import { BOOKLET_PAGES } from "./pages";

const TOC = BOOKLET_PAGES.map((p, i) => ({
  id: p.id,
  label: p.label,
  page: i + 1,
}));

export function PrintButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-ink px-3 text-[13px] font-semibold text-paper hover:opacity-90 pointer-coarse:h-11 ${className}`}
    >
      <Printer size={16} weight="bold" aria-hidden="true" />
      Cetak / simpan PDF
    </button>
  );
}

/**
 * Screen frame for the booklet: the reading-page header with a print
 * button, and the contents rail. Neither prints; the sheets do.
 */
export function BookletChrome({ children }: { children: ReactNode }) {
  const [dark, setDark] = useDocTheme();
  return (
    <div className="doc-page min-h-dvh">
      <DocHeader
        current="booklet"
        dark={dark}
        onToggleTheme={() => setDark(!dark)}
        actions={
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Cetak atau simpan PDF"
            title="Cetak / simpan PDF"
            className="grid h-9 w-9 place-items-center rounded-[10px] text-ink-2 hover:bg-paper-2 hover:text-ink pointer-coarse:h-11 pointer-coarse:w-11"
          >
            <Printer size={17} aria-hidden="true" />
          </button>
        }
      />
      <div className="mx-auto max-w-6xl px-5 xl:grid xl:grid-cols-[200px_minmax(0,1fr)] xl:gap-10 xl:px-8 print:block print:max-w-none print:p-0">
        <Toc items={TOC} breakpoint="xl" />
        {children}
      </div>
    </div>
  );
}
