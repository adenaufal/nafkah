/**
 * Fingertip: a soft disc where the "user" touches the screen. `press` 0→1
 * fades/scales it in; a ripple ring expands on contact.
 */
export function Touch({ x, y, press, ripple = 0 }: { x: number; y: number; press: number; ripple?: number }) {
  if (press <= 0.001 && ripple <= 0.001) return null;
  const size = 92;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, pointerEvents: "none" }}>
      {ripple > 0 && ripple < 1 && (
        <div
          style={{
            position: "absolute",
            left: -size * (0.5 + ripple),
            top: -size * (0.5 + ripple),
            width: size * (1 + ripple * 2),
            height: size * (1 + ripple * 2),
            borderRadius: 999,
            border: "4px solid rgb(30 27 24 / 0.35)",
            opacity: 1 - ripple,
            boxSizing: "border-box",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: -size / 2,
          top: -size / 2,
          width: size,
          height: size,
          borderRadius: 999,
          background: "rgb(30 27 24 / 0.22)",
          border: "4px solid rgb(255 255 255 / 0.9)",
          boxShadow: "0 6px 18px rgb(30 27 24 / 0.25)",
          transform: `scale(${0.6 + 0.4 * press})`,
          opacity: press,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
