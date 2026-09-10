"use client";

import { useEffect, useRef, useState } from "react";
import { useApp } from "@/state/AppContext";
import { buildShareUrl } from "@/state/share";
import { recordUsage } from "@/lib/usage";

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

export function ShareButton() {
  const { state } = useApp();
  const [status, setStatus] = useState<ShareStatus>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    [],
  );

  const showStatus = (next: ShareStatus) => {
    setStatus(next);
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStatus("idle"), 3000);
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
          title: "Perbandingan Nafkah",
          text: "Lihat perbandingan upah dan biaya hidup dengan asumsi ini.",
          url,
        });
        recordUsage("share_completed");
        showStatus("shared");
        return;
      }
      await copyText(url);
      recordUsage("share_completed");
      showStatus("copied");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      showStatus("error");
    }
  };

  const label =
    status === "copied"
      ? "Tautan disalin"
      : status === "shared"
        ? "Dibagikan"
        : status === "error"
          ? "Gagal menyalin"
          : "Bagikan";
  const includesFinancialInputs =
    (state.assumptions.customIncome ?? 0) > 0 ||
    (state.assumptions.installmentMonthly ?? 0) > 0;
  const privacyHint = includesFinancialInputs
    ? " Tautan mencakup angka pendapatan atau cicilan yang sedang aktif."
    : "";

  return (
    <button
      type="button"
      onClick={() => void share()}
      aria-label={`${label} tampilan saat ini.${privacyHint}`}
      title={`Bagikan wilayah dan asumsi aktif.${privacyHint}`}
      className="inline-flex h-9 items-center rounded-[9px] border border-border px-2.5 text-[12.5px] font-medium text-muted transition-colors hover:bg-accent-soft hover:text-ink sm:px-3"
    >
      <span aria-hidden="true" className="sm:mr-1.5">
        {status === "copied" || status === "shared" ? "✓" : "↗"}
      </span>
      <span className="hidden sm:inline" aria-live="polite">
        {label}
      </span>
      <span className="sr-only sm:hidden" aria-live="polite">
        {label}
      </span>
    </button>
  );
}
