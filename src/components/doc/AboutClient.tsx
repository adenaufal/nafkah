"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { savePersisted } from "@/state/persist";
import { useDocTheme } from "@/state/theme";
import { DocHeader } from "./DocHeader";

export function AboutHeader() {
  const [dark, setDark] = useDocTheme();
  return (
    <DocHeader
      current="tentang"
      dark={dark}
      onToggleTheme={() => setDark(!dark)}
    />
  );
}

/** Re-open the first-visit guide card, then go to the map. */
export function ShowGuideButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        savePersisted({ onboardCardDismissed: false });
        router.push("/");
      }}
      className="inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-ink px-4 text-[13.5px] font-semibold text-paper hover:opacity-90"
    >
      Tampilkan panduan di peta
      <ArrowRight size={14} weight="bold" aria-hidden="true" />
    </button>
  );
}
