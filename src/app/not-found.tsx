import Link from "next/link";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

// The root 404 renders outside the (atlas) layout, and the static export
// does not link that layout's font CSS here, so it declares its own
// (same files, not preloaded).
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
  preload: false,
});

export default function NotFound() {
  return (
    <div
      className={`${jakarta.variable} ${fraunces.variable} atlas flex min-h-dvh flex-col items-center justify-center p-6 text-center`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        404
      </p>
      <h1 className="f-display mt-3 text-[36px] font-[580] leading-tight tracking-[-0.015em]">
        Halaman ini tidak ada di peta.
      </h1>
      <p className="mt-3 text-[15px] text-ink-2">
        Mungkin tautannya keliru atau halamannya sudah dipindah.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-[10px] bg-ink px-4 text-[13.5px] font-semibold text-paper hover:opacity-90"
        >
          Kembali ke peta
        </Link>
        <Link
          href="/metode"
          className="inline-flex h-10 items-center rounded-[10px] border border-rule-2 px-4 text-[13.5px] font-semibold text-ink hover:border-ink"
        >
          Baca metode
        </Link>
      </div>
    </div>
  );
}
