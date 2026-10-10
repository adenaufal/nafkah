import { formatDate } from "./format";

/**
 * The limits of the numbers, as [title, explanation] pairs. Metode and the
 * booklet print the same list, so it is written once.
 */
export function limitations(wageAsOf: string): [string, string][] {
  return [
    [
      "Bukan survei primer.",
      "Biaya hidup dimodelkan dari agregat; belum ada pengukuran langsung di setiap kabupaten/kota.",
    ],
    [
      "Satu angka per daerah.",
      "Biaya di pusat kota dan pinggiran bisa jauh berbeda; angka di sini adalah tipikal daerah.",
    ],
    [
      "UMK bukan gaji aktual.",
      "Banyak pekerja dibayar di atas atau di bawah upah minimum. Pakai Gajiku untuk angkamu sendiri.",
    ],
    [
      "Profil adalah penyederhanaan.",
      "Kebutuhan anak, kesehatan, atau tanggungan lain berbeda di tiap keluarga.",
    ],
    [
      "Data punya tanggal.",
      `Upah berlaku sejak ${formatDate(wageAsOf)}; tanggal tiap nilai biaya tercantum di detail daerah.`,
    ],
    [
      "Sampel komunitas terpisah.",
      "Data yang dikumpulkan dari pengguna belum memengaruhi peta.",
    ],
    [
      "Bukan nasihat keuangan.",
      "Gunakan sebagai pembanding awal, bukan dasar tunggal keputusan.",
    ],
  ];
}
