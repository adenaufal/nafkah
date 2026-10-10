"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  DotsThreeVertical,
  MagnifyingGlass,
  Moon,
  ShareNetwork,
  Sun,
} from "@phosphor-icons/react";
import { useApp } from "@/state/AppContext";
import manifest from "../../public/data/v2026.1/manifest.json";
import { useShareLink } from "./hooks";
import { SearchBar, type SearchHandle } from "./search/RegionSearch";

const navLink =
  "inline-flex h-9 items-center rounded-[10px] px-3 text-[13.5px] font-semibold text-ink-2 hover:bg-paper-2 hover:text-ink";

export function Masthead({
  wide,
  searchRef,
  onOpenSearch,
  onPicked,
  onHome,
}: {
  wide: boolean;
  searchRef: React.RefObject<SearchHandle | null>;
  /** Phones: open the full-screen search. */
  onOpenSearch: () => void;
  onPicked: (code: string) => void;
  onHome: () => void;
}) {
  const { state, setDarkMode } = useApp();
  const share = useShareLink();
  const dark = state.darkMode;

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-4 border-b border-rule bg-paper px-5 max-md:gap-1 max-md:px-3">
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onHome();
        }}
        className="flex shrink-0 items-center gap-2.5 rounded-[10px]"
        aria-label="Nafkah — kembali ke ringkasan nasional"
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
      </a>
      <span className="hidden h-5 w-px bg-rule-2 xl:block" aria-hidden="true" />
      <p className="hidden items-center gap-2 text-[13px] text-muted xl:flex">
        Peta kecukupan upah
        <Link
          href="/metode#versi"
          className="rounded-full border border-rule px-2 py-0.5 text-[11.5px] font-semibold text-ink-2 hover:border-rule-2 hover:text-ink"
          title="Biaya hidup adalah estimasi model; upah dari SK resmi 2026"
        >
          Data {manifest.datasetVersion} · estimasi
        </Link>
      </p>

      {wide ? (
        <>
          <div className="ml-auto">
            <SearchBar ref={searchRef} onPicked={onPicked} />
          </div>
          <nav aria-label="Utama" className="flex items-center gap-0.5">
            <Link href="/metode" className={navLink}>
              Metode
            </Link>
            <Link href="/tentang" className={navLink}>
              Tentang
            </Link>
            <button
              type="button"
              onClick={() => void share.share()}
              title={share.hint}
              className={`${navLink} gap-1.5`}
            >
              {share.status === "copied" || share.status === "shared" ? (
                <Check size={15} weight="bold" aria-hidden="true" />
              ) : (
                <ShareNetwork size={15} aria-hidden="true" />
              )}
              <span className="max-lg:sr-only" aria-live="polite">
                {share.label}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDarkMode(!dark)}
              aria-label={dark ? "Pakai tema terang" : "Pakai tema gelap"}
              title={dark ? "Tema terang" : "Tema gelap"}
              className="grid h-9 w-9 place-items-center rounded-[10px] text-ink-2 hover:bg-paper-2 hover:text-ink"
            >
              {dark ? (
                <Sun size={17} aria-hidden="true" />
              ) : (
                <Moon size={17} aria-hidden="true" />
              )}
            </button>
          </nav>
        </>
      ) : (
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Cari daerah"
            className="grid h-11 w-11 place-items-center rounded-full text-ink-2 hover:bg-paper-2"
          >
            <MagnifyingGlass size={19} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => void share.share()}
            aria-label={`${share.label}. ${share.hint}`}
            className="grid h-11 w-11 place-items-center rounded-full text-ink-2 hover:bg-paper-2"
          >
            {share.status === "copied" || share.status === "shared" ? (
              <Check size={18} weight="bold" aria-hidden="true" />
            ) : (
              <ShareNetwork size={18} aria-hidden="true" />
            )}
          </button>
          <span className="sr-only" aria-live="polite">
            {share.status !== "idle" ? share.label : ""}
          </span>
          <MobileMenu />
        </div>
      )}
    </header>
  );
}

function MobileMenu() {
  const { state, setDarkMode, setOnboardCard } = useApp();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const item =
    "flex h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left text-[15px] font-medium hover:bg-paper-2";
  return (
    <div ref={wrap} className="relative">
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu"
        aria-controls="masthead-menu"
        aria-expanded={open}
        className="grid h-11 w-11 place-items-center rounded-full text-ink-2 hover:bg-paper-2"
      >
        <DotsThreeVertical size={20} weight="bold" aria-hidden="true" />
      </button>
      {open && (
        <div
          id="masthead-menu"
          className="anim-fade absolute right-0 top-[calc(100%+6px)] z-50 w-60 rounded-[14px] border border-rule bg-paper p-1.5 shadow-[var(--shadow-lg)]"
        >
          <Link href="/metode" className={item}>
            Metode perhitungan
          </Link>
          <Link href="/tentang" className={item}>
            Tentang Nafkah
          </Link>
          <button
            type="button"
            className={item}
            onClick={() => {
              setOnboardCard(true);
              setOpen(false);
            }}
          >
            Panduan singkat
          </button>
          <div className="my-1 h-px bg-rule" aria-hidden="true" />
          <button
            type="button"
            aria-pressed={state.darkMode}
            className={item}
            onClick={() => {
              setDarkMode(!state.darkMode);
              setOpen(false);
            }}
          >
            <Moon size={18} aria-hidden="true" />
            Tema gelap
            {state.darkMode && (
              <Check
                size={16}
                weight="bold"
                className="ml-auto text-accent-ink"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
