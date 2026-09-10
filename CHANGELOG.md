# Changelog

Semua perubahan penting pada project ini dicatat di sini.
Nomor versi mengikuti Semantic Versioning: `MAJOR.MINOR.PATCH`.

## [Unreleased]

### Added
- Tautan berbagi berversi untuk memulihkan wilayah perbandingan, profil
  rumah tangga, pendapatan/cicilan, mode warna, dan filter legenda.
- Tombol Bagikan yang memakai share sheet perangkat atau menyalin tautan,
  lengkap dengan penjelasan privasi untuk angka finansial yang ikut dibagikan.

### Changed
- Roadmap disusun ulang menjadi Now/Next/Later dan diselaraskan dengan status
  AP-02, AP-03, serta fondasi AP-07 yang sudah tersedia.

## [0.1.0] - 2026-09-03

Rilis publik open source pertama.

### Added
- Peta choropleth kecukupan UMK/UMP terhadap biaya hidup di 514 kabupaten/kota.
- Panel asumsi rumah tangga, perbandingan wilayah, dan detail per daerah.
- Dataset upah 2026 (UMP/UMK resmi) dan estimasi biaya hidup 10 kategori, berlabel `confidence`.
- Gerbang integritas dataset (Zod) yang diverifikasi di CI.
- Lisensi ganda: kode MIT, data CC BY 4.0.
