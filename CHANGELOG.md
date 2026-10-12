# Changelog

Semua perubahan penting pada project ini dicatat di sini.
Nomor versi mengikuti Semantic Versioning: `MAJOR.MINOR.PATCH`.

## [Unreleased]

### Added
- Gaji pasangan bisa diisi sendiri saat "Pasangan ikut bekerja" aktif, di
  kontrol "Hitung dengan" maupun profil rumah tangga. Bila kosong, pasangan
  tetap memakai UMK/UMP daerah yang sama (atau kota asal saat simulasi pindah
  kota) seperti sebelumnya. Angkanya ikut tersimpan di browser, tautan berbagi,
  label pendapatan, dan ekspor CSV.
- Pilihan hunian "Rumah sendiri" untuk rumah yang sudah lunas atau tinggal
  bersama orang tua: biaya hunian dihitung Rp0 (PBB dan perawatan rumah belum
  dihitung). Bila cicilan rumah diisi, cicilan itu tetap menggantikan biaya
  hunian. Pilihan ini ikut tersimpan di browser, tautan berbagi, dan ekspor CSV.
- Isian "Tanggungan keluarga" di profil rumah tangga untuk kiriman rutin ke
  orang tua atau keluarga lain (generasi sandwich). Nominalnya ditambahkan ke
  pengeluaran semua daerah sebagai baris "angkamu" di struk bulanan, baki
  perbandingan, dan ekspor CSV, terpisah dari 10 kategori estimasi. Angkanya
  ikut tersimpan di browser dan tautan berbagi.
- Pilihan transportasi "Mobil" (×3,5 biaya motor; belum termasuk cicilan,
  asuransi, dan tol) dan "Jalan kaki" untuk jalan kaki atau sepeda (×0,25).
  Dasar kedua pengali dicatat di `docs/pengali-transport-2026-10.md`. Setiap
  pilihan transportasi kini menampilkan keterangan singkat di profil.
- Tombol "Bagikan struk" di cerita daerah membuat gambar PNG 1080×1350 dari
  struk bulanan, lengkap dengan profil, sumber upah, tanggal data biaya, dan
  catatan bahwa angkanya estimasi. Di ponsel gambar bisa langsung dibagikan
  ke aplikasi lain; di desktop diunduh. Nominal rupiah tampil secara default
  dan bisa disembunyikan sehingga hanya persentase yang terlihat. Struk juga
  bisa disalin sebagai teks biasa untuk referensi anggaran.
- Saat slider gaji mentok di Rp25 jt atau Rp1 jt, petunjuknya mengingatkan
  bahwa angka yang lebih besar atau lebih kecil bisa diketik langsung.
- Halaman Tentang mendapat bagian "Pertanyaan yang sering muncul" (asal angka,
  profil yang dihitung, kenapa banyak daerah merah, peran AI, jadwal
  pembaruan, dan cara melapor angka yang meleset) serta "Cara dibuat" yang
  menjelaskan alat yang dipakai, termasuk AI, dan cara angka diperiksa.

### Changed
- Booklet `/booklet` disusun ulang menjadi 12 halaman A4 bergaya Atlas:
  sampul dengan peta Indonesia, ringkasan nasional, peta per wilayah, cara
  menghitung, profil rumah tangga, semua provinsi, peringkat, kota besar
  (dengan gaji yang bisa diubah di layar), panduan aplikasi, serta sumber dan
  batasan data. Semua angka, peta, dan grafik dihitung dari dataset aktif saat
  situs dibangun, lewat rumus yang sama dengan peta.

### Fixed
- Cetak booklet kini menghasilkan tepat satu halaman A4 per lembar.
  Sebelumnya mode "Halaman demi Halaman" hanya mencetak halaman yang sedang
  dibuka, dan mode "Dokumen Gulir Penuh" membelah setiap lembar menjadi dua
  halaman.
- Contoh angka di booklet lama tidak cocok dengan dataset, misalnya Kota
  Jakarta Pusat tertulis 115% (Cukup) padahal datanya 92% (Ketat).
- Ekspor CSV tidak lagi mencantumkan "UMK pasangan dari kota asal" sebagai
  sumber pendapatan saat gajimu diisi dalam mode pindah kota tanpa pasangan
  yang ikut bekerja.
- Catatan pembanding di struk bulanan kini bertuliskan "Dua UMK daerah ini"
  saat pasangan ikut bekerja. Sebelumnya jumlah dua upah minimum ditulis
  sebagai "UMK daerah ini".
- Label pemasukan di struk kini menaruh tahun tepat setelah jenis upah
  ("UMP 2026 × 2", "UMK 2026 setelah potongan (est.)"). Sebelumnya tahun
  menempel di ujung label, misalnya "UMP × 2 2026".

### Removed
- Salinan statis `public/booklet.html`. Berkas itu tidak pernah tersaji,
  karena rute `/booklet` menimpanya saat ekspor.

## [0.3.0] - 2026-10-03

### Added
- Ekspor CSV dari baki perbandingan dengan rincian kategori, hasil hitung,
  asumsi aktif, dan provenance source/asOf/confidence pada setiap baris angka.
- Manifest PWA dan service worker yang menyimpan shell aplikasi, geometri, dan
  dataset aktif untuk kunjungan offline setelah aplikasi dibuka online.

### Fixed
- Pengunjung lama yang asumsinya masih sama dengan pilihan awal v0.1
  (Rumah KPR) kini ikut pindah ke pilihan awal baru (Rusun/kost). Sebelumnya
  asumsi tersimpan di browser menimpa pilihan awal, sehingga legenda peta
  menampilkan 2/95/303/114 alih-alih angka di tabel sensitivitas.

### Perbaikan

- fix(build): jalankan validasi versi lewat npm CLI (8914ea5)
- fix(state): migrasi asumsi tersimpan dari pilihan awal v0.1 (#7) (b2d706b)

### Fitur

- feat(data): tambah validasi koreksi dan ringkasan komunitas (62d9a98)
- feat(ui): tampilkan ringkasan metode di peta (610538b)
- feat(app): add CSV export and offline PWA support (be39d1b)

### Pemeliharaan

- chore(ai): tambah skill keputusan TypeSafe (eb1bca9)

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
