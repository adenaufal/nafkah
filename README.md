# Nafkah: Peta Kecukupan Gaji dan Biaya Hidup Indonesia

[![CI](https://github.com/adenaufal/nafkah/actions/workflows/ci.yml/badge.svg)](https://github.com/adenaufal/nafkah/actions/workflows/ci.yml)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Data: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA.md)

![Peta Nafkah dengan warna tingkat keterjangkauan upah minimum terhadap biaya hidup di 514 kabupaten/kota Indonesia](docs/hero.png)

Apakah upah minimum di daerahmu cukup untuk biaya hidup sebulan? Nafkah
membandingkan UMK/UMP dengan perkiraan pengeluaran di 514 kabupaten/kota
Indonesia. Pilih wilayah di peta, lalu sesuaikan asumsi rumah tangga dengan
kebutuhanmu.

> Biaya hidup dihitung dari model estimasi, bukan survei primer, dan diberi
> label di tampilan aplikasi. Data upah mengacu pada penetapan resmi 2026.
> Angka di sini bukan nasihat keuangan. Baca [catatan data](#integritas--audit-data)
> untuk memahami sumber dan batasannya.

Coba di [nafkah.adenaufal.com](https://nafkah.adenaufal.com).

Rilis publik saat ini adalah `v0.1.0`. Aplikasi sudah dideploy, sedangkan kode
sumber dan dataset tersedia secara terbuka di [repositori GitHub](https://github.com/adenaufal/nafkah).

## Fitur (v0.1.0)

- Peta 514 kabupaten/kota dengan warna untuk kategori Nyaman, Cukup, Ketat,
  dan Tak Cukup. Paletnya mempertimbangkan buta warna; wilayah tanpa data
  juga diberi arsir.
- Panel asumsi untuk mengatur rumah tangga (lajang, pasangan, atau keluarga),
  gaya hidup, hunian, transportasi, tabungan, serta upah kotor atau take-home.
- Kolom "Pendapatan sendiri" untuk mencoba perhitungan dengan gajimu. Ada
  opsi "2 upah" untuk pasangan bekerja, dengan UMK daerah sebagai pembanding.
- Baki perbandingan untuk menyematkan hingga 5 wilayah dan melihat rincian
  biayanya lewat grafik batang bertumpuk.
- Jendela detail berisi grafik dan rincian kategori. Setiap angka dilengkapi
  `source`, `asOf`, dan `confidence`.
- Peta dasar Terang, Gelap, dan Satelit tanpa API key, serta mode Offline
  tanpa tile peta.
- Mode gelap, pencarian wilayah, legenda angka, dan filter tingkat keterjangkauan.
- Navigasi keyboard, label `aria`, dan kontras AA.

## Teknologi

- Next.js 15 (App Router, static export) + TypeScript + Tailwind CSS v4
- MapLibre GL JS, dijalankan di browser lewat `next/dynamic` dengan `ssr: false`
- Peta dasar tanpa API key dari CARTO Positron / Dark Matter (berbasis OSM) dan Esri World Imagery
- Recharts untuk grafik di jendela detail dan baki perbandingan
- Geometri HDX COD-AB Indonesia adm2, disederhanakan menjadi TopoJSON (≈0.6 MB)
- Cloudflare Workers Static Assets untuk deployment

## Menjalankan di lokal

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export ke ./out
npm run typecheck
npm test           # unit test kalkulasi (vitest)
```

## Deployment

Nafkah menghasilkan static export ke `./out` dan dideploy sebagai Cloudflare
Workers Static Assets. Untuk mendeploy instance sendiri, login ke Wrangler lalu
jalankan:

```bash
npx wrangler login
npm run deploy
```

Sesuaikan `name` dan `routes` di `wrangler.jsonc` sebelum memakai konfigurasi
ini untuk fork atau domain lain.

## Model asumsi & formula

Perhitungan awal memakai profil
`single · moderate · studio · motorcycle · savings included`.
Faktor pengali untuk rumah tangga, gaya hidup, hunian, dan transportasi tersimpan
per kategori di `src/data/multipliers.ts` dan bisa disesuaikan.

```text
totalMonthlyCost   = Σ nilai kategori aktif di bawah asumsi saat ini
wageBasisAmount    = earners × (wageBasis === 'gross' ? grossMonthly : estimatedTakeHome)
                       earners = 2 jika pasangan bekerja (default 1)
  dengan pendapatan sendiri (customIncome > 0):
    wageAmount     = customIncome + (earners === 2 ? upah daerah 1 pekerja : 0)
coveragePercent    = wageBasisAmount / totalMonthlyCost × 100
surplusOrDeficit   = wageBasisAmount − totalMonthlyCost
affordabilityRatio = totalMonthlyCost / wageBasisAmount
```

Tingkat keterjangkauan ditentukan oleh konstanta di `src/lib/calculations.ts`.
Batasnya `Nyaman ≥ 120% · Cukup 100-119% · Ketat 80-99% · Tak Cukup < 80%`.

## Data dan sumbernya

Setiap angka dilengkapi `source`, `asOf`, dan `confidence`. Tingkat kepercayaannya
diurutkan sebagai berikut:
`sample` → `estimate` (dimodelkan dari agregat BPS) → `official` (dataset resmi).
Aplikasi menampilkan label "Estimasi sampel" untuk data di bawah `official`.

Untuk memperbarui data, buka file sesuai jenisnya.

- Upah ada di `src/data/provinces/<provinsi>.ts`. Isi `grossMonthly` dengan
  UMK resmi, gunakan `confidence: "official"`, lalu lengkapi `source` (nama dan
  nomor SK) serta `asOf`. Take-home tetap diberi label estimasi.
- Biaya ada di `src/data/costs.ts`. Setiap nilai kategori punya
  `source`, `asOf`, dan `confidence` sendiri. Jadi, upah suatu wilayah bisa
  berstatus `official` sementara sewanya masih `sample`.
- Untuk menambah wilayah, isi `src/data/regions.ts` dengan kode wilayah,
  centroid, dan tier. Tambahkan juga data upah, biaya, serta narasinya di
  `src/data/narratives.ts`.

Kalau ingin mengambil data dari API, ubah fungsi `loadRecords` di
`src/data/loader.ts`. Pertahankan bentuk hasilnya, yaitu `Map<kode, record>`.

Data disambungkan lewat kode wilayah. Contohnya, pcode HDX `ID3173` menjadi
`31.73` (lihat
`pcodeToKodeWilayah` di `src/lib/geometry.ts`).

## Menyiapkan geometri peta

File `public/data/regions.topojson` berukuran sekitar 0.6 MB dan berisi 514
wilayah. Berikut perintah untuk membuatnya dari dataset HDX COD-AB Indonesia.

```bash
# 1. Unduh (zip 436 MB → idn_admin2.geojson 143 MB; adm2 = kabupaten/kota)
curl -L -o idn_admin_boundaries.geojson.zip \
  "https://data.humdata.org/dataset/84a1d98a-790b-4d66-9d14-bbfa48500802/resource/e1421da4-8f48-47d2-ac49-79ff5bfa4d24/download/idn_admin_boundaries.geojson.zip"
unzip idn_admin_boundaries.geojson.zip   # -> idn_admin2.geojson

# 2. Sederhanakan ke TopoJSON < 2 MB (hasil ≈ 0.6 MB)
npx mapshaper idn_admin2.geojson \
  -filter-fields adm2_name,adm2_pcode,adm1_name,adm1_pcode \
  -simplify 2% keep-shapes -clean \
  -o format=topojson quantization=10000 regions.topojson

# 3. Pasang
cp regions.topojson public/data/regions.topojson
```

Kalau memakai sumber lain, ganti filenya dan sesuaikan
`topologyToFeatureCollection` bila nama propertinya berbeda.

## Integritas & audit data

Data mencakup 514 kabupaten/kota definitif (416 kabupaten dan 98 kota) di 38
provinsi, sesuai Kepmendagri No. 100.1.1-6117.

- Geometri HDX awal memuat 8 poligon air dan hutan di luar wilayah
  administratif (`12.88` Danau Toba, `13.88` Singkarak/Maninjau,
  `16.88` Ranau, `18.88` Danau Lampung, `32.88` Waduk Cirata, `33.88`
  Kedungombo, `33.99` Hutan Lindung Jateng, `71.88` Tondano). Semuanya
  disaring oleh modul geometri.
- Seluruh 514 baris upah memakai UMP/UMK 2026, berlaku sejak 1 Januari 2026
  sesuai PP No. 49/2025. Sebanyak 245 daerah memakai UMK sendiri dari SK/Kepgub
  Desember 2025. Sisanya, 269 daerah, mengikuti UMP provinsi dan diberi label
  yang menjelaskan hal itu. Kemnaker merilis daftar UMP 38 provinsi pada 6 Januari 2026.
- Sepuluh kategori biaya hidup dihitung dari agregasi Susenas, IHK BPS, dan
  acuan harga pasar lokal. BPS hanya menggelar Survei Biaya Hidup di kota sampel
  IHK, jadi angka di sini bukan hasil survei primer per kabupaten. Semuanya
  berlabel `confidence: "estimate"`; nilainya disesuaikan dengan inflasi
  IHK tahunan Juli 2026 (+2,88%) dan memakai `asOf` 2026-08-01.
- Deskripsi sumber sudah disesuaikan dengan metode yang dipakai. Nama survei
  fiktif dihapus. Sumber yang diduga memuat informasi rekaan untuk konten SEO
  ditolak dan dicatat di `data-prep/data/wages-2026-research.json`.
- Daerah pedalaman dan kepulauan seperti Keerom, Sarmi, Mamberamo Raya, dan
  Pegunungan Arfak tidak punya SBH primer. Estimasi pengeluarannya memakai
  Susenas perdesaan dan biaya logistik perintis, sementara upahnya mengikuti
  UMP provinsi (misalnya Papua Rp4.436.283 sesuai Kepgub No.
  100.3.3.1/KEP.409/2025).

> Kode wilayah mengikuti skema BPS/HDX (`admin2_pcode`). Sebagian besar sama
> dengan kode Kemendagri, tetapi ada perbedaan pada beberapa kota. Contohnya,
> Kota Medan memakai `12.75` dan Kota Sibolga `12.71` di skema BPS/HDX.
> Data geografis tetap sesuai dengan poligon masing-masing.

## Kontribusi

Menemukan angka yang perlu diperbaiki? Baca [panduan kontribusi](CONTRIBUTING.md).
Koreksi data jadi prioritas, dan setiap angka wajib disertai `source`, `asOf`,
serta `confidence`. Untuk masukan, gunakan [form koreksi data](https://airtable.com/appri285d7CNF5mqc/pagbuVQAdt3s9mEaV/form)
jika kamu menemukan angka yang meleset, atau [GitHub Discussions](https://github.com/adenaufal/nafkah/discussions)
untuk saran fitur, bug, dan diskusi umum. Setiap koreksi tetap diperiksa
secara manual sebelum masuk ke dataset. Rencana pengembangan ada di
[roadmap](ROADMAP.md).

## Lisensi

- Kode (`src/**` dan konfigurasi) memakai lisensi [MIT](LICENSE).
- Data (`src/data/**`, `public/data/**`, `data-prep/**`) memakai
  [CC-BY-4.0](LICENSE-DATA.md). Atribusi wajib dicantumkan, termasuk untuk
  sumber asalnya: HDX, BPS, Kemnaker, dan CARTO/Esri.
