# Changelog

Semua perubahan penting pada project ini dicatat di sini.
Nomor versi mengikuti Semantic Versioning: `MAJOR.MINOR.PATCH`.

## [Unreleased]

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
- Tombol Bagikan yang memakai share sheet perangkat atau menyalin tautan,
  lengkap dengan penjelasan privasi untuk angka finansial yang ikut dibagikan.

### Changed
- Roadmap disusun ulang menjadi Now/Next/Later dan diselaraskan dengan status
  AP-02, AP-03, AP-06, dan AP-07 yang sudah tersedia; audit baseline AP-05
  dicatat di `docs/audit-wilayah-2026-09.md`.
- Format share URL naik ke v2 untuk membawa asal relokasi, sementara decoder
  tetap kompatibel dengan URL v1.
- Preferensi tampilan dan wilayah aktif dinormalisasi sebelum dibaca dari
  localStorage agar state lama atau input yang diedit manual gagal dengan aman.

## [0.1.0] - 2026-09-03

Rilis publik open source pertama.

### Added
- Peta choropleth kecukupan UMK/UMP terhadap biaya hidup di 514 kabupaten/kota.
- Panel asumsi rumah tangga, perbandingan wilayah, dan detail per daerah.
- Dataset upah 2026 (UMP/UMK resmi) dan estimasi biaya hidup 10 kategori, berlabel `confidence`.
- Gerbang integritas dataset (Zod) yang diverifikasi di CI.
- Lisensi ganda: kode MIT, data CC BY 4.0.
