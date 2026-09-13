# Changelog

Semua perubahan penting pada project ini dicatat di sini.
Nomor versi mengikuti Semantic Versioning: `MAJOR.MINOR.PATCH`.

## [Unreleased]

### Fixed
- Pengunjung lama yang asumsinya masih sama dengan pilihan awal v0.1
  (Rumah KPR) kini ikut pindah ke pilihan awal baru (Rusun/kost). Sebelumnya
  asumsi tersimpan di browser menimpa pilihan awal, sehingga legenda peta
  menampilkan 2/95/303/114 alih-alih angka di tabel sensitivitas.

## [0.2.0] - 2026-09-13

Rilis kedua: mode relokasi, berbagi hasil lewat tautan, personalisasi
rumah tangga, dan pilihan awal yang dikalibrasi ulang.

### Added
- Tautan berbagi berversi untuk memulihkan wilayah perbandingan, profil
  rumah tangga, pendapatan/cicilan, mode warna, dan filter legenda.
- Mode relokasi yang memisahkan gaji asal dari biaya kota tujuan, termasuk
  status asal yang persisten, provenance UMK asal, dan perbandingan beberapa
  kota tujuan.
- CTA koreksi per wilayah menuju form Airtable yang menjelaskan antrean manual
  dan tidak mengubah dataset secara otomatis.
- Hitungan penggunaan agregat yang hanya disimpan lokal di browser; tidak ada
  URL, kode wilayah, nilai asumsi, atau angka finansial yang dikirim.
- Provenance untuk rentang sewa narasi yang ditampilkan di detail wilayah;
  skema dataset kini ikut menolak rentang tanpa `source`, `asOf`, atau
  `confidence`.
- Catatan audit AP-05 yang memisahkan rujukan transportasi pemerintah dari
  bukti biaya bulanan yang masih belum cukup untuk mengubah dataset.
- Tombol Bagikan yang memakai share sheet perangkat atau menyalin tautan,
  lengkap dengan penjelasan privasi untuk angka finansial yang ikut dibagikan.
- Tabel sensitivitas band di panel Tentang: sebaran Nyaman/Cukup/Ketat/Tak
  Cukup untuk empat profil pembanding, dihitung langsung dari dataset yang
  dimuat dan dikunci di CI lewat `src/lib/calibration.test.ts`.

### Changed
- Roadmap disusun ulang menjadi Now/Next/Later dan diselaraskan dengan status
  AP-02, AP-03, AP-06, dan AP-07 yang sudah tersedia; audit baseline AP-05
  dicatat di `docs/audit-wilayah-2026-09.md`.
- Format share URL naik ke v2 untuk membawa asal relokasi, sementara decoder
  tetap kompatibel dengan URL v1.
- Preferensi tampilan dan wilayah aktif dinormalisasi sebelum dibaca dari
  localStorage agar state lama atau input yang diedit manual gagal dengan aman;
  counter penggunaan juga dijaga agar tidak melampaui safe integer.
- Pilihan awal hunian berubah dari "Rumah KPR" ke "Rusun / kost" agar profil
  awal mendekati penerima upah minimum lajang. Warna awal peta ikut berubah
  (Nyaman 2 → 27, Tak Cukup 114 → 46 pada dataset v2026.1). Baseline dataset,
  nilai `costs.json`/`wages.json`, dan ambang band 120/100/80 tidak diubah;
  alasan lengkapnya di `docs/kalibrasi-default-2026-09.md`.

## [0.1.0] - 2026-09-03

Rilis publik open source pertama.

### Added
- Peta choropleth kecukupan UMK/UMP terhadap biaya hidup di 514 kabupaten/kota.
- Panel asumsi rumah tangga, perbandingan wilayah, dan detail per daerah.
- Dataset upah 2026 (UMP/UMK resmi) dan estimasi biaya hidup 10 kategori, berlabel `confidence`.
- Gerbang integritas dataset (Zod) yang diverifikasi di CI.
- Lisensi ganda: kode MIT, data CC BY 4.0.
