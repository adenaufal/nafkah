"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useApp } from "@/state/AppContext";
import { buildShareUrl } from "@/state/share";
import { recordUsage } from "@/lib/usage";

/** Live media query (client-only shell, so the first read is real). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** The value, once it has stopped changing for `ms`. */
export function useSettled<T>(value: T, ms: number): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return settled;
}

type ShareStatus = "idle" | "copied" | "shared" | "error";

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  if (!copied) throw new Error("Browser tidak mengizinkan penyalinan tautan.");
}

/**
 * Copy (or natively share, on touch devices) the versioned link that restores
 * this exact view. Financial inputs only travel when the user shares.
 */
export function useShareLink() {
  const { state } = useApp();
  const [status, setStatus] = useState<ShareStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const flash = (next: ShareStatus) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2800);
  };

  const share = async () => {
    recordUsage("share_requested");
    const url = buildShareUrl(window.location.href, {
      assumptions: state.assumptions,
      pinned: state.pinned,
      selectedCode: state.selectedCode,
      originCode: state.originCode,
      colorMode: state.colorMode,
      legendFilter: state.legendFilter,
    });
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({
          title: "Nafkah",
          text: "Lihat perbandingan upah dan biaya hidup dengan asumsi ini.",
          url,
        });
        recordUsage("share_completed");
        flash("shared");
        return;
      }
      await copyText(url);
      recordUsage("share_completed");
      flash("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      flash("error");
    }
  };

  const includesMoney =
    (state.assumptions.customIncome ?? 0) > 0 ||
    (state.assumptions.installmentMonthly ?? 0) > 0;
  const label =
    status === "copied"
      ? "Tautan disalin"
      : status === "shared"
        ? "Dibagikan"
        : status === "error"
          ? "Gagal menyalin"
          : "Bagikan";
  const hint = includesMoney
    ? "Tautan ikut membawa angka gaji/cicilan yang sedang kamu isi."
    : "Salin tautan yang memulihkan tampilan ini.";
  return { status, share, label, hint, includesMoney };
}

/** "/" or Ctrl/⌘+K opens search; Escape steps back. */
export function useGlobalKeys(handlers: {
  onSearch?: () => void;
  onEscape?: () => void;
}) {
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.tagName === "SELECT" ||
          t.isContentEditable);
      if (
        (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) ||
        (e.key === "/" && !typing)
      ) {
        e.preventDefault();
        ref.current.onSearch?.();
      } else if (e.key === "Escape" && !e.defaultPrevented && !typing) {
        // Escape inside a field belongs to the field (clear, close a list),
        // never to "close this whole view".
        ref.current.onEscape?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
