/**
 * The booklet in print order. The contents page, the contents rail on
 * screen and every page footer take their page numbers from this list, so
 * moving a page cannot leave a stale number behind. Keep the count a
 * multiple of four: the PDF can then be imposed as a folded, stapled book.
 */
export const BOOKLET_PAGES = [
  {
    id: "sampul",
    label: "Sampul",
    blurb: "Hasil utama dan peta Indonesia.",
  },
  {
    id: "isi",
    label: "Isi & cara membaca",
    blurb: "Tentang booklet ini dan tiga hal sebelum membaca.",
  },
  {
    id: "ringkasan",
    label: "Ringkasan nasional",
    blurb: "Sebaran semua daerah dan temuan utamanya.",
  },
  {
    id: "peta",
    label: "Peta per wilayah",
    blurb: "Indonesia bagian barat dan timur, per kabupaten/kota.",
  },
  {
    id: "rumus",
    label: "Cara menghitung",
    blurb: "Rumus, empat band, dan satu contoh lengkap.",
  },
  {
    id: "profil",
    label: "Profil rumah tangga",
    blurb: "Lajang, pasangan, keluarga: peta yang berbeda.",
  },
  {
    id: "provinsi",
    label: "Provinsi",
    blurb: "Semua provinsi, dari yang paling berat.",
  },
  {
    id: "peringkat",
    label: "Paling lega & paling berat",
    blurb: "Daerah di kedua ujung urutan.",
  },
  {
    id: "kota",
    label: "Gaji yang sama, kota berbeda",
    blurb: "Satu angka gaji di kota-kota besar.",
  },
  {
    id: "aplikasi",
    label: "Memakai peta Nafkah",
    blurb: "Hitung dengan angkamu sendiri.",
  },
  {
    id: "data",
    label: "Data, sumber & batasan",
    blurb: "Dari mana angkanya dan seberapa jauh bisa dipegang.",
  },
  {
    id: "penutup",
    label: "Sampul belakang",
    blurb: "Tautan, cara mengutip, lisensi.",
  },
] as const;

export type BookletPageId = (typeof BOOKLET_PAGES)[number]["id"];

export function pageNumber(id: BookletPageId): number {
  return BOOKLET_PAGES.findIndex((p) => p.id === id) + 1;
}

export function pageLabel(id: BookletPageId): string {
  return BOOKLET_PAGES[pageNumber(id) - 1].label;
}
