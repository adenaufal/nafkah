"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Snap = "peek" | "half" | "full";
const ORDER: Snap[] = ["peek", "half", "full"];

function snapHeights(container: number): Record<Snap, number> {
  return {
    peek: Math.round(Math.max(168, container * 0.3)),
    half: Math.round(container * 0.56),
    full: Math.round(container - 10),
  };
}

/**
 * Phone layout: the map fills the screen and the rail rides in a bottom
 * sheet with three heights. Drag the grabber (or tap / use ↑↓ on it) to
 * change height; content scrolls inside. The live height is published as
 * --sheet-h on the parent so floating map controls ride along.
 */
export function MobileSheet({
  snap,
  onSnap,
  onSettledHeight,
  label,
  scrollRef,
  children,
}: {
  snap: Snap;
  onSnap: (snap: Snap) => void;
  /** Height once a drag/animation settles — for map camera padding. */
  onSettledHeight: (px: number) => void;
  label: string;
  scrollRef?: React.Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  const sheet = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState(0);
  const [drag, setDrag] = useState<number | null>(null);
  const start = useRef<{
    y: number;
    h: number;
    t: number;
    moved: boolean;
  } | null>(null);

  useLayoutEffect(() => {
    const parent = sheet.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(([e]) => setContainer(e.contentRect.height));
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const heights = snapHeights(container || 640);
  const height = drag ?? heights[snap];

  useLayoutEffect(() => {
    sheet.current?.parentElement?.style.setProperty("--sheet-h", `${height}px`);
  }, [height]);

  const settled = heights[snap];
  useEffect(() => {
    if (container) onSettledHeight(settled);
  }, [settled, container]); // eslint-disable-line react-hooks/exhaustive-deps

  const nearest = (h: number, velocity: number): Snap => {
    // A flick wins over distance: move one step in the flick's direction.
    if (Math.abs(velocity) > 0.6) {
      const i = ORDER.indexOf(snap);
      return ORDER[
        Math.max(0, Math.min(ORDER.length - 1, i + (velocity < 0 ? 1 : -1)))
      ];
    }
    return ORDER.reduce((best, s) =>
      Math.abs(heights[s] - h) < Math.abs(heights[best] - h) ? s : best,
    );
  };

  const step = (dir: 1 | -1) => {
    const i = ORDER.indexOf(snap);
    onSnap(ORDER[Math.max(0, Math.min(ORDER.length - 1, i + dir))]);
  };

  return (
    <div
      ref={sheet}
      role="region"
      aria-label={label}
      className={`absolute inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[20px] border-t border-rule bg-paper shadow-[0_-10px_30px_rgb(0_0_0/0.12)] md:left-1/2 md:right-auto md:w-[min(680px,calc(100%-48px))] md:-translate-x-1/2 md:rounded-t-[24px] md:border-x ${drag === null ? "sheet-motion transition-[height] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)]" : ""}`}
      style={{ height }}
    >
      <div
        className="flex h-9 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start.current = {
            y: e.clientY,
            h: height,
            t: e.timeStamp,
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          const s = start.current;
          if (!s) return;
          const dy = e.clientY - s.y;
          if (Math.abs(dy) > 4) s.moved = true;
          if (!s.moved) return;
          setDrag(
            Math.max(heights.peek - 40, Math.min(heights.full, s.h - dy)),
          );
        }}
        onPointerUp={(e) => {
          const s = start.current;
          start.current = null;
          if (!s) return;
          if (!s.moved) {
            onSnap(snap === "full" ? "half" : "full");
            setDrag(null);
            return;
          }
          const dy = e.clientY - s.y;
          const velocity = dy / Math.max(1, e.timeStamp - s.t);
          onSnap(nearest(s.h - dy, velocity));
          setDrag(null);
        }}
        onPointerCancel={() => {
          start.current = null;
          setDrag(null);
        }}
      >
        <button
          type="button"
          aria-label={snap === "full" ? "Perkecil panel" : "Perbesar panel"}
          aria-expanded={snap === "full"}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp") {
              e.preventDefault();
              step(1);
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              step(-1);
            }
          }}
          onClick={(e) => {
            // Pointer taps are handled by the grabber zone; keep Enter/Space.
            if (e.detail === 0) onSnap(snap === "full" ? "half" : "full");
          }}
          className="h-9 w-24 rounded-full"
        >
          <span
            aria-hidden="true"
            className="mx-auto block h-[5px] w-10 rounded-full bg-rule-2"
          />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="thin-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {children}
      </div>
    </div>
  );
}
