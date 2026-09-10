/**
 * Guided-tour data and the pure geometry that places the tooltip near a
 * highlighted target. Kept framework-free so the placement math is unit-tested
 * without a DOM.
 */

export type TourKey =
  | "map"
  | "search"
  | "pins"
  | "compare"
  | "legend"
  | "asumsi"
  | "tab-search"
  | "tab-legend";

export interface TourStep {
  key: TourKey;
  title: string;
  body: string;
  tip?: string;
}

export const TOUR_BROAD: TourStep[] = [
  {
    key: "map",
    title: "Warna peta adalah jawabannya",
    body: "Tiap kabupaten/kota diwarnai dari cakupan: upah minimum dibagi estimasi biaya hidup bulanan. Makin hijau makin lapang, makin merah makin kurang.",
    tip: "Klik satu wilayah untuk melihat rincian 10 kategori biayanya.",
  },
  {
    key: "search",
    title: "Mulai dari wilayahmu",
    body: "Cari nama kota atau kabupaten di kolom ini — atau klik langsung areanya di peta.",
  },
  {
    key: "pins",
    title: "Sematkan sampai 5 wilayah",
    body: "Setiap wilayah yang disematkan langsung menampilkan cakupan dan sisa (atau kekurangan) rupiah tiap bulan.",
    tip: "Dua wilayah sudah cukup untuk mulai membandingkan.",
  },
  {
    key: "compare",
    title: "Bandingkan rinciannya",
    body: "Panel bawah memecah biaya jadi 10 kategori — sewa, makan, transport, sampai tabungan — supaya jelas apa yang bikin angkanya berat.",
  },
  {
    key: "legend",
    title: "Ganti dasar warna, atau saring",
    body: "Warnai peta menurut cakupan, biaya, atau upah. Klik satu tingkat di legenda untuk menyisakan wilayah pada tingkat itu saja.",
  },
  {
    key: "asumsi",
    title: "Sesuaikan dengan hidupmu",
    body: "Single atau keluarga, kost atau KPR, motor atau ojol — bahkan gaji kamu sendiri. Untuk relokasi, jadikan upah satu wilayah sebagai gaji asal. Peta mewarnai ulang seketika.",
    tip: "Gaji yang kamu isi hanya tersimpan di browsermu.",
  },
];

export const TOUR_NARROW: TourStep[] = [
  {
    key: "map",
    title: "Warna peta adalah jawabannya",
    body: "Tiap kabupaten/kota diwarnai dari cakupan: upah minimum dibagi estimasi biaya hidup bulanan. Makin hijau makin lapang, makin merah makin kurang.",
    tip: "Ketuk satu wilayah untuk melihat rinciannya.",
  },
  {
    key: "tab-search",
    title: "Panel Cari: cari, sematkan, bandingkan",
    body: "Ketuk Cari untuk mencari kota, menyematkan sampai 5 wilayah, lalu membaca kartu perbandingannya.",
    tip: "Ketuk tab yang sama sekali lagi untuk menutup panel.",
  },
  {
    key: "tab-legend",
    title: "Panel Legenda: arti warna",
    body: "Berisi makna tiap tingkat, jumlah wilayah di dalamnya, dan filter untuk menyisakan satu tingkat saja.",
  },
  {
    key: "asumsi",
    title: "Sesuaikan dengan hidupmu",
    body: "Single atau keluarga, kost atau KPR, motor atau ojol — bahkan gaji kamu sendiri. Untuk relokasi, jadikan upah satu wilayah sebagai gaji asal.",
    tip: "Gaji yang kamu isi hanya tersimpan di browsermu.",
  },
];

export interface SpotRect {
  key: TourKey;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Vertical space the tooltip may occupy; drives the below/above decision. */
const TOOLTIP_BUDGET = 252;
const EDGE = 14;

/**
 * Where to anchor the tooltip. With no target it floats top-center (the intro
 * position); with a target it prefers below, then above, then pins to the
 * bottom edge — always clamped inside the frame and supplied safe insets.
 */
export function placeTooltip(
  spot: SpotRect | null,
  tooltipWidth: number,
  frameWidth: number,
  frameHeight: number,
  bottomInset = 0,
  leftInset = 0,
  rightInset = 0,
): { left: number; top?: number; bottom?: number } {
  if (!spot) {
    return {
      left: Math.round((frameWidth - tooltipWidth) / 2),
      top: Math.round(frameHeight * 0.1),
    };
  }
  const safeLeft = Math.max(EDGE, leftInset);
  const safeRight = Math.max(EDGE, rightInset);
  const left = Math.round(
    Math.min(
      Math.max(spot.x + spot.w / 2 - tooltipWidth / 2, safeLeft),
      frameWidth - tooltipWidth - safeRight,
    ),
  );
  const safeBottom = bottomInset + 12;
  const fitsBelow =
    spot.y + spot.h + TOOLTIP_BUDGET <= frameHeight - safeBottom;
  const fitsAbove =
    spot.y - TOOLTIP_BUDGET >= 12 && frameHeight - spot.y + EDGE >= safeBottom;
  if (fitsBelow) return { left, top: Math.round(spot.y + spot.h + EDGE) };
  if (fitsAbove)
    return { left, bottom: Math.round(frameHeight - spot.y + EDGE) };
  return { left, bottom: bottomInset + EDGE };
}
