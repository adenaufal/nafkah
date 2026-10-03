# Ledger review koreksi lokal (AP-10)

Ledger ini mencatat antrean dan hasil review pada komputer maintainer. Simpan JSON
privat di luar repository; jangan commit berkas antrean, identitas pelapor, kontak,
atau bukti mentah. Tool hanya membaca ledger dan daftar wilayah dataset `2026.1`.
Tidak ada integrasi form, pengiriman pesan, perubahan dataset, atau layanan eksternal.

```sh
npm run corrections:summary -- /path/to/private-ledger.json
# Alternatif langsung: npx tsx scripts/summarize-corrections.ts /path/to/private-ledger.json
```

Exit code: `0` valid, `1` input gagal dibaca/di-parse atau ledger tidak valid, `2`
argumen salah. Jalankan dari root repository. stdout hanya JSON agregat; stderr
menampilkan indeks/kolom dan jenis kesalahan, tanpa mengutip nilai atau path input.

Contoh berikut seluruhnya sintetis:

```json
{
  "datasetVersion": "2026.1",
  "reports": [
    {
      "id": "report_001",
      "regionCode": "11.01",
      "category": "wage",
      "status": "New",
      "receivedAt": "2026-09-01"
    },
    {
      "id": "report_002",
      "regionCode": "11.01",
      "category": "food",
      "status": "Accepted",
      "receivedAt": "2026-09-01",
      "review": {
        "reviewer": "Maintainer contoh",
        "reason": "Sumber diperiksa dan perubahan disetujui.",
        "reviewedAt": "2026-09-02"
      },
      "release": "2026.2"
    }
  ]
}
```

`reports` boleh kosong. ID unik harus berupa token opaque 1–64 karakter: huruf,
angka, underscore atau tanda minus, dimulai huruf/angka. Jangan gunakan identitas
atau kontak sebagai ID. `regionCode` harus ada dalam daftar wilayah yang dikirim.
Kategori: `wage`, `housing`, `food`, `transport`, `utilities`, `connectivity`,
`healthcare`, `personalCare`, `leisure`, `education`, `contingency`, atau `other`.
Kolom tambahan ditolak pada semua objek; ledger tidak menerima kontak, sumber,
atau deskripsi mentah laporan.

Status yang diterima:

| Status | Review | Release |
| --- | --- | --- |
| New | Tidak boleh ada | Tidak boleh ada |
| In review | Opsional untuk catatan review saat ini | Tidak boleh ada |
| Need more info | Opsional untuk alasan permintaan informasi | Tidak boleh ada |
| Accepted | Wajib | Opsional |
| Rejected | Wajib | Tidak boleh ada |

Review berisi `reviewer` (1–200 karakter), `reason` (1–2000 karakter), dan
`reviewedAt`; isi whitespace saja ditolak. Semua tanggal harus tanggal kalender
nyata `YYYY-MM-DD` dengan tahun 0001–9999. Tanggal review tidak boleh mendahului
penerimaan. Tool memvalidasi satu snapshot; transisi status dan riwayat audit belum
divalidasi otomatis.

**Accepted belum berarti released.** Maintainer hanya mengisi `release` setelah
perubahan benar-benar dipublikasikan, dengan versi dataset `YYYY.N` (`N` bilangan
positif), lebih baru dari versi yang dilaporkan `2026.1` (dibandingkan secara numerik
berdasarkan tahun, lalu nomor revisi; misalnya `2026.10` sesudah `2026.2`). Field ini adalah pernyataan
maintainer; tool tidak memverifikasi keberadaan release atau isi perubahannya.
Persetujuan ledger juga tidak menggantikan validasi proposal dan integritas dataset
dengan `npm run corrections:validate`.

Output hanya `countsByStatus` (semua lima status selalu muncul) dan `released`
(jumlah Accepted dengan penanda release). Tidak ada ID, wilayah, kategori,
reviewer, alasan, tanggal, maupun versi release dalam ringkasan. Urutan key stabil.
Satu kesalahan menggagalkan seluruh ringkasan. Agregat antrean kecil masih bisa
mengungkap aktivitas review; maintainer menentukan kapan ringkasan layak diterbitkan.

AP-10 operasional masih memerlukan intake form privat, penanggung jawab/SLA,
penyimpanan antrean dengan kontrol akses, riwayat keputusan, dan penerbitan
ringkasan berkala. Tool ini menyediakan validasi lokal dan output aman sebagai
fondasi, belum mengotomatiskan alur tersebut.
