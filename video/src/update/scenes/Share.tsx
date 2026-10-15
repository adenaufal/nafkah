import { Img, staticFile, useCurrentFrame } from "remotion";
import { POP, SMOOTH, SNAPPY, lerp, ramp, springAt } from "../../motion";
import { C, FONT } from "../../theme";
import { ShotSlice, UiShot, tapAt } from "../components/UiShot";
import { shot } from "../data";
import { SCENE, cue } from "../timeline";

/** The receipt from "PENGELUARAN · ESTIMASI" down to "Bagikan struk". */
const RECEIPT = { top: 128, scale: 1.8, x: 207, y: 318 };
const PNG = { w: 600, x: 240, y: 318 };
const SLOT_Y = 1094;

/** Moments in the share beat, on the spoken words. */
export const SHARE = {
  get tap() {
    return cue("share") + 6;
  },
  get png() {
    return cue("png") - 2;
  },
  get hide() {
    return cue("hide") + 4;
  },
  get copy() {
    return cue("copy") + 3;
  },
};

/**
 * "Bagikan struk": the real receipt, the PNG the app makes from it (with
 * amounts, then hidden), the dialog's switch and its "Salin teks" button.
 */
export function Share() {
  const frame = useCurrentFrame();
  const from = SCENE.share.from;
  const to = SCENE.about.from;
  if (frame < from - 2 || frame > to + 16) return null;

  const receipt = shot("receipt");
  const enter = springAt(frame, from + 2, SNAPPY);
  const leave = springAt(frame, to - 4, SMOOTH, 14);
  const receiptOut = springAt(frame, SHARE.png - 2, SMOOTH, 12);

  // The image grows out of the "Bagikan struk" button.
  const share = receipt.targets.share;
  const sx = RECEIPT.x + share.x * RECEIPT.scale;
  const sy = RECEIPT.y + (share.y - RECEIPT.top) * RECEIPT.scale;
  const pngH = PNG.w * 1.25;
  const grow = springAt(frame, SHARE.png, SNAPPY);
  const cx = lerp(sx, PNG.x + PNG.w / 2, grow);
  const cy = lerp(sy, PNG.y + pngH / 2, grow);
  const flip = ramp(frame, SHARE.hide + 2, SHARE.hide + 14);
  const hidden = flip >= 0.5;
  const angle = hidden ? (flip - 1) * 180 : flip * 180;

  const slotIn = springAt(frame, SHARE.png + 8, SNAPPY);
  const toFooter = springAt(frame, cue("copy") - 10, SNAPPY);
  const chip = springAt(frame, SHARE.png + 10, POP);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - leave }}>
      <div
        style={{
          position: "absolute",
          left: RECEIPT.x,
          top: RECEIPT.y,
          opacity: Math.min(1, enter * 1.6) * (1 - receiptOut),
          transform: `translateY(${(1 - enter) * 220 + receiptOut * 180}px) scale(${1 - 0.06 * receiptOut})`,
        }}
      >
        <ShotSlice
          name="receipt"
          top={RECEIPT.top}
          height={receipt.h - RECEIPT.top}
          scale={RECEIPT.scale}
          tap={tapAt(frame, SHARE.tap, "share")}
        />
      </div>

      {grow > 0.001 && (
        <div
          style={{
            position: "absolute",
            left: cx - PNG.w / 2,
            top: cy - pngH / 2,
            width: PNG.w,
            height: pngH,
            perspective: 1800,
            transform: `scale(${0.12 + 0.88 * grow}) rotate(${-2 * grow}deg)`,
            opacity: Math.min(1, grow * 3),
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              transform: `rotateY(${angle}deg)`,
              borderRadius: 18,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgb(30 27 24 / 0.16), 0 40px 90px rgb(30 27 24 / 0.28)",
            }}
          >
            <Img
              src={staticFile(shot(hidden ? "struk-off" : "struk-on").file)}
              style={{ width: "100%", height: "100%", display: "block" }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              right: -26,
              top: -16,
              transform: `rotate(4deg) scale(${chip})`,
              background: C.ink,
              color: C.white,
              fontFamily: FONT.mono,
              fontSize: 27,
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: 12,
              whiteSpace: "nowrap",
            }}
          >
            PNG 1080×1350
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 177,
          top: SLOT_Y,
          opacity: Math.min(1, slotIn * 1.6) * (1 - toFooter),
          transform: `translateY(${(1 - slotIn) * 160}px) translateX(${-toFooter * 260}px)`,
        }}
      >
        <UiShot
          states={["toggle-on", "toggle-off"]}
          at={ramp(frame, SHARE.hide, SHARE.hide + 4)}
          scale={2.2}
          tap={tapAt(frame, SHARE.hide, "toggle")}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: (1080 - shot("footer").w * 1.9) / 2,
          top: SLOT_Y - 6,
          opacity: Math.min(1, toFooter * 1.6),
          transform: `translateX(${(1 - toFooter) * 260}px)`,
        }}
      >
        <UiShot
          states={["footer", "footer-copied"]}
          at={ramp(frame, SHARE.copy, SHARE.copy + 4)}
          scale={1.9}
          tap={tapAt(frame, SHARE.copy, "copy")}
        />
      </div>
    </div>
  );
}
