import { useCurrentFrame } from "remotion";
import { Logo } from "../../components/ui";
import { POP, ramp, springAt } from "../../motion";
import { C, FONT } from "../../theme";
import { REQUESTS, RequestReceipt } from "../components/RequestReceipt";
import { SCENE, cue } from "../timeline";

/** Rows printed per frame; the header and first request are out on frame 0. */
const PRINT_RATE = 1 / 2.2;

/**
 * "Kemarin kalian minta": the requests print as a receipt, then "sekarang
 * sudah ada" checks every line and stamps it.
 */
export function Hook() {
  const frame = useCurrentFrame();
  const end = SCENE.home.from;
  if (frame > end + 2) return null;
  // Clear the frame before the map and the first request come in.
  const out = ramp(frame, end - 10, end);
  const now = cue("now");
  const checks = Math.max(0, (frame - now) / 3);
  const stamp = springAt(frame, cue("done") + 1, POP);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 214,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: 1 - out,
          transform: `translateY(${out * -30}px)`,
        }}
      >
        <Logo scale={0.82} />
        <div
          style={{
            fontFamily: FONT.sans,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "0.12em",
            color: C.accentInk,
            background: C.accentSoft,
            padding: "14px 24px",
            borderRadius: 999,
          }}
        >
          UPDATE v0.4.0
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 440,
          opacity: 1 - out,
          transform: `translateY(${out * -120}px) scale(${1 - 0.12 * out})`,
          transformOrigin: "50% 0",
        }}
      >
        <RequestReceipt shown={3 + frame * PRINT_RATE} checks={Math.min(REQUESTS.length, checks)} stamp={stamp} />
      </div>
    </>
  );
}
