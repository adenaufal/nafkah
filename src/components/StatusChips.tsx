"use client";

import { useApp } from "@/state/AppContext";
import { AppIcon } from "./icons";

/**
 * Permukaan status terpisah untuk pemuatan geometri dan data, sesuai spesifikasi:
 * geometri gagal, data gagal, dan wilayah-tanpa-data adalah tiga pesan berbeda
 * (yang ketiga tampil di tooltip + modal detail).
 */
export function StatusChips() {
  const { state, regionByCode, retryGeometry, retryData, setOrigin } = useApp();

  const chips: React.ReactNode[] = [];

  if (state.geometryStatus === "loading") {
    chips.push(<Chip key="g" tone="muted" text="Memuat batas wilayah…" />);
  }
  if (state.geometryStatus === "error") {
    chips.push(
      <Chip
        key="g"
        tone="error"
        text="Gagal memuat batas wilayah."
        actionLabel="Retry"
        onAction={retryGeometry}
        detail={state.geometryError ?? undefined}
      />,
    );
  }
  if (state.dataStatus === "loading") {
    chips.push(<Chip key="d" tone="muted" text="Memuat data upah & biaya…" />);
  }
  if (state.dataStatus === "error") {
    chips.push(
      <Chip
        key="d"
        tone="error"
        text="Gagal memuat data upah/biaya."
        actionLabel="Retry"
        onAction={retryData}
        detail={state.dataError ?? undefined}
      />,
    );
  }

  if (state.originCode) {
    chips.push(
      <div
        key="origin"
        role="status"
        className="flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3.5 py-1.5 text-xs font-medium text-accent shadow-md backdrop-blur"
      >
        <span>
          Gaji asal: {regionByCode.get(state.originCode)?.name ?? state.originCode}
        </span>
        <button
          type="button"
          onClick={() => setOrigin(null)}
          className="rounded bg-current/10 px-2 py-0.5 font-semibold underline underline-offset-2"
        >
          Hapus
        </button>
      </div>,
    );
  }

  if (chips.length === 0) return null;

  return (
    <div className="absolute left-1/2 top-3 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
      {chips}
    </div>
  );
}

function Chip({
  tone,
  text,
  detail,
  actionLabel,
  onAction,
}: {
  tone: "muted" | "error";
  text: string;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const cls =
    tone === "error"
      ? "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300"
      : "border-border bg-card/95 text-muted";
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-md backdrop-blur ${cls}`}
    >
      {tone === "muted" && (
        <span
          aria-hidden="true"
          className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
        />
      )}
      {tone === "error" && <AppIcon name="warning" size={15} weight="bold" />}
      <span>{text}</span>
      {detail && <span className="text-[10px] opacity-70">({detail})</span>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1 rounded bg-current/10 px-2 py-0.5 font-semibold underline underline-offset-2"
        >
          <AppIcon name="arrowClockwise" size={13} weight="bold" />
          Coba lagi
        </button>
      )}
    </div>
  );
}
