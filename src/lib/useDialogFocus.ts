"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE_SELECTOR = [
  "button:not([disabled]):not([tabindex='-1'])",
  "a[href]",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function focusableWithin(dialog: HTMLElement): HTMLElement[] {
  return Array.from(
    dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0,
  );
}

/**
 * Give a modal a predictable keyboard lifecycle: focus enters the dialog,
 * Tab stays inside it, Escape closes it, and focus returns to its opener.
 */
export function useDialogFocus<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement | null>,
  focusKey?: unknown,
) {
  const dialogRef = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const opener = document.activeElement;
    const focusInitial = () => {
      const target = initialFocusRef?.current ?? focusableWithin(dialog)[0];
      target?.focus({ preventScroll: true });
    };
    const frame = requestAnimationFrame(focusInitial);

    const onKeyDown = (event: KeyboardEvent) => {
      const current = document.activeElement;
      const eventInsideDialog =
        current instanceof Node && dialog.contains(current);
      if (event.key === "Escape") {
        if (!eventInsideDialog) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !eventInsideDialog) return;

      const focusable = focusableWithin(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      const active = document.activeElement;
      const focusInsideDialog =
        active instanceof Node && dialog.contains(active);
      if (
        opener instanceof HTMLElement &&
        opener.isConnected &&
        !dialog.contains(opener) &&
        (focusInsideDialog || active === document.body)
      ) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open, initialFocusRef, focusKey]);

  return dialogRef;
}
