"use client";

import Link from "next/link";
import { ArrowLeft, Moon, Sun } from "@phosphor-icons/react";

const link =
  "inline-flex h-9 items-center rounded-[10px] px-3 text-[13.5px] font-semibold text-ink-2 hover:bg-paper-2 hover:text-ink pointer-coarse:h-11";

/** Slim header for the reading pages: back to the map, sibling pages, theme. */
export function DocHeader({
  current,
  dark,
  onToggleTheme,
}: {
  current: "metode" | "tentang";
  dark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <header className="no-print sticky top-0 z-30 border-b border-rule bg-paper/92 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-5 max-sm:px-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-[10px]"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-[10px] bg-accent text-[15px] font-extrabold text-on-accent"
          >
            N
          </span>
          <span className="f-display text-[21px] font-[620] tracking-[-0.01em]">
            Nafkah
          </span>
        </Link>
        <Link href="/" className={`${link} ml-2 gap-1.5 max-sm:hidden`}>
          <ArrowLeft size={15} weight="bold" aria-hidden="true" />
          Kembali ke peta
        </Link>
        <nav aria-label="Halaman" className="ml-auto flex items-center gap-0.5">
          <Link
            href="/metode"
            aria-current={current === "metode" ? "page" : undefined}
            className={`${link} aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]`}
          >
            Metode
          </Link>
          <Link
            href="/tentang"
            aria-current={current === "tentang" ? "page" : undefined}
            className={`${link} aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-[6px]`}
          >
            Tentang
          </Link>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={dark ? "Pakai tema terang" : "Pakai tema gelap"}
            title={dark ? "Tema terang" : "Tema gelap"}
            className="grid h-9 w-9 place-items-center rounded-[10px] text-ink-2 hover:bg-paper-2 hover:text-ink pointer-coarse:h-11 pointer-coarse:w-11"
          >
            {dark ? (
              <Sun size={17} aria-hidden="true" />
            ) : (
              <Moon size={17} aria-hidden="true" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
