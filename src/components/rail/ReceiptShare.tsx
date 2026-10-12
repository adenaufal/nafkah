"use client";

import { useEffect, useRef, useState } from "react";
import {
  Copy,
  DownloadSimple,
  ShareNetwork,
  X,
} from "@phosphor-icons/react";
import { receiptCard, receiptText, type ReceiptCardInput } from "@/lib/receipt";
import { recordUsage } from "@/lib/usage";
import { useDialogFocus } from "@/lib/useDialogFocus";
import { useCopy } from "@/components/hooks";
import { Toggle } from "@/components/ui";

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Share the monthly receipt as a feed-sized PNG, or copy it as text. Amounts
 * show by default; one switch swaps every rupiah figure for its share of the
 * month, for people who would rather not post their salary.
 */
export function ReceiptShareDialog({
  input,
  personal,
  onClose,
}: {
  input: ReceiptCardInput;
  /** The receipt carries numbers the user typed (salary, instalment…). */
  personal: boolean;
  onClose: () => void;
}) {
  const [showAmounts, setShowAmounts] = useState(true);
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const copy = useCopy();
  const heading = useRef<HTMLHeadingElement>(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(true, onClose, heading);
  const latest = useRef(input);
  latest.current = input;
  const inputKey = JSON.stringify(input);

  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    setFailed(false);
    import("@/lib/receiptImage")
      .then(({ renderReceiptPng }) =>
        renderReceiptPng(receiptCard(latest.current, showAmounts)),
      )
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setImage({ blob, url });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [inputKey, showAmounts]);

  const fileName = `nafkah-struk-${slug(input.region)}.png`;
  const file = image
    ? new File([image.blob], fileName, { type: "image/png" })
    : null;
  const canShare =
    file != null &&
    typeof navigator !== "undefined" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] });

  const download = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image.url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    recordUsage("receipt_shared");
  };

  const share = async () => {
    if (!file) return;
    try {
      await navigator.share({
        files: [file],
        title: `Struk bulanan Nafkah — ${input.region}`,
        text: "Cek daerahmu di nafkah.adenaufal.com",
      });
      recordUsage("receipt_shared");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      download();
    }
  };

  const button =
    "inline-flex h-10 items-center gap-1.5 rounded-[10px] px-3.5 text-[13.5px] font-semibold transition-colors disabled:opacity-50 pointer-coarse:h-11";

  return (
    <div
      className="anim-fade fixed inset-0 z-[70] flex items-end justify-center bg-ink/45 sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="receipt-share-title"
        className="flex max-h-[min(92dvh,860px)] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[18px] bg-paper shadow-[var(--shadow-lg)] sm:rounded-[18px]"
      >
        <header className="flex items-center justify-between gap-3 border-b border-rule px-5 py-3">
          <h2
            id="receipt-share-title"
            ref={heading}
            tabIndex={-1}
            className="text-[15px] font-bold outline-none"
          >
            Bagikan struk
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-paper-2 hover:text-ink pointer-coarse:h-11 pointer-coarse:w-11"
          >
            <X size={16} weight="bold" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-[12px] border border-rule bg-paper-2">
            {image && !failed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.url}
                alt={`Pratinjau gambar struk bulanan ${input.region}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <p className="grid h-full place-items-center px-6 text-center text-[13px] text-muted">
                {failed
                  ? "Gambar gagal dibuat di browser ini. Salin teksnya saja."
                  : "Menyiapkan gambar…"}
              </p>
            )}
          </div>

          <label className="mt-4 flex items-center justify-between gap-3 text-[13.5px] font-semibold text-ink-2">
            Tampilkan nominal rupiah
            <Toggle checked={showAmounts} onChange={setShowAmounts} />
          </label>
          <p className="mt-1 text-[12px] leading-[1.5] text-muted">
            {!showAmounts
              ? "Hanya persentase yang tampil; nominal rupiah tidak terlihat."
              : personal
                ? "Gambar ikut memuat gaji, cicilan, atau tanggungan yang kamu isi."
                : "Semua nominal berasal dari data daerah ini dan profil yang kamu pilih."}
          </p>
        </div>

        <footer className="flex flex-wrap gap-2 border-t border-rule px-5 py-3">
          {canShare && (
            <button
              type="button"
              onClick={share}
              className={`${button} bg-ink text-paper hover:opacity-90`}
            >
              <ShareNetwork size={15} weight="bold" aria-hidden="true" />
              Bagikan gambar
            </button>
          )}
          <button
            type="button"
            onClick={download}
            disabled={!image || failed}
            className={`${button} ${canShare ? "border border-field text-ink-2 hover:border-ink-2" : "bg-ink text-paper hover:opacity-90"}`}
          >
            <DownloadSimple size={15} weight="bold" aria-hidden="true" />
            Unduh PNG
          </button>
          <button
            type="button"
            onClick={() => copy.copy(receiptText(input))}
            className={`${button} border border-field text-ink-2 hover:border-ink-2`}
          >
            <Copy size={15} weight="bold" aria-hidden="true" />
            <span aria-live="polite">
              {copy.status === "copied"
                ? "Teks disalin"
                : copy.status === "error"
                  ? "Gagal menyalin"
                  : "Salin teks"}
            </span>
          </button>
        </footer>
      </div>
    </div>
  );
}
