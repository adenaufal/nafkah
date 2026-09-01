# Nafkah — Peta Kecukupan Gaji vs Biaya Hidup Indonesia

[![CI](https://github.com/adenaufal/nafkah/actions/workflows/ci.yml/badge.svg)](https://github.com/adenaufal/nafkah/actions/workflows/ci.yml)
[![Code: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Data: CC BY 4.0](https://img.shields.io/badge/data-CC%20BY%204.0-lightgrey.svg)](LICENSE-DATA.md)

Map-first web app comparing local minimum wage (UMK) against estimated monthly
living costs across Indonesian kabupaten/kota. All displayed figures are
**sample estimates** — clearly labeled in the UI — until verified sources are
connected (see "Data replacement" below).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- MapLibre GL JS (client-side only via `next/dynamic` with `ssr: false`)
- Keyless basemaps: CARTO Positron / Dark Matter (OSM-derived, attribution
  shown) + Esri World Imagery raster
- Recharts — only in the detail modal and pinned comparison panel
- Geometry: HDX COD-AB Indonesia adm2 boundaries, simplified to TopoJSON

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Geometry preparation (exact commands)

The shipped asset `public/data/regions.topojson` (≈0.6 MB, 522 regions) was
produced from the HDX COD-AB Indonesia dataset:

```bash
# 1. Download (436 MB zip, unzips to six GeoJSON files; adm2 = kabupaten/kota)
curl -L -o idn_admin_boundaries.geojson.zip \
  "https://data.humdata.org/dataset/84a1d98a-790b-4d66-9d14-bbfa48500802/resource/e1421da4-8f48-47d2-ac49-79ff5bfa4d24/download/idn_admin_boundaries.geojson.zip"
unzip idn_admin_boundaries.geojson.zip   # -> idn_admin2.geojson (143 MB)

# 2. Simplify to TopoJSON under 2 MB (exact command used, result ≈ 0.6 MB)
npx mapshaper idn_admin2.geojson \
  -filter-fields adm2_name,adm2_pcode,adm1_name,adm1_pcode \
  -simplify 2% keep-shapes -clean \
  -o format=topojson quantization=10000 regions.topojson

# 3. Ship it
cp regions.topojson public/data/regions.topojson
```

Join key: HDX pcode `ID3173` → kode wilayah `31.73` (see `pcodeToKodeWilayah`
in `src/lib/geometry.ts`). To swap in a different source, replace the file and
adjust `topologyToFeatureCollection` if the property names differ.

## Data replacement

- Wages: edit `src/data/wages.ts`. Replace `grossMonthly` with the official UMK
  announcement (surat keputusan gubernur / disnaker), set
  `confidence: "official"`, update `source` (name + decree number) and `asOf`.
  Recompute or source `estimatedTakeHomeMonthly`, keeping the field labeled as
  an estimate.
- Costs: edit `src/data/costs.ts`. Each category cell carries its own
  `source`/`asOf`/`confidence` — so a region can have an official wage and a
  sampled rent, and the provenance table in the detail modal will say exactly
  that. Confidence ladder: `sample` → `estimate` (e.g. modeled from BPS
  aggregates) → `official` (published dataset). The UI shows a persistent
  "Sample estimate" badge for anything below `official`.
- Regions: add a row to `src/data/regions.ts` (kode wilayah, centroid, tier)
  plus matching wage/cost rows and a narrative in `src/data/narratives.ts`.
  No code changes needed.
- Loading: `src/data/loader.ts` fetches geometry over the network and returns
  the local records with simulated latency. To go live, replace `loadRecords`
  with an API call keeping the same `Map<kode, record>` return shape.

## Assumption model

Baseline profile: single · moderate · studio · motorcycle · savings included.
Household / lifestyle / housing / transport scale per-category multipliers in
`src/data/multipliers.ts` (documented, editable data). Formulas:

```text
totalMonthlyCost   = Σ active category values under current assumptions
wageBasisAmount    = gross | estimatedTakeHome
coveragePercent    = wageBasisAmount / totalMonthlyCost × 100
surplusOrDeficit   = wageBasisAmount − totalMonthlyCost
affordabilityRatio = totalMonthlyCost / wageBasisAmount

Bands (constants in src/lib/calculations.ts):
Comfortable ≥ 120% · Manageable 100–119% · Tight 80–99% · Insufficient < 80%
```

## Data Coverage & Regional Integrity

Dataset mencakup tepat **514 kabupaten/kota definitif** (416 Kabupaten dan 98 Kota) di 38 provinsi di Indonesia sesuai Kepmendagri No. 100.1.1-6117.

> **Catatan skema kode wilayah**: kode wilayah pada dataset mengikuti skema BPS/HDX (`admin2_pcode`), yang identik dengan kode Kemendagri untuk mayoritas daerah, namun berbeda untuk sebagian kecil kota (contoh terdokumentasi: di skema BPS/HDX, Kota Medan = `12.75` dan Kota Sibolga = `12.71`; di skema Kemendagri sebaliknya). Nilai geografis tetap konsisten dengan poligon masing-masing kota; penamaan tidak terpengaruh.

### Audit & Transparansi Data (Cek Fakta)

Berdasarkan hasil audit data dan cek fakta menyeluruh:

1. **Pembersihan 8 Artefak Poligon Geografis Non-Administratif**:
   Dataset geometri awal (HDX COD-AB adm2) memiliki 8 poligon badan air/hutan (`12.88` Danau Toba, `13.88` Danau Singkarak/Maninjau, `16.88` Danau Ranau Sumsel, `18.88` Danau Lampung, `32.88` Waduk Cirata, `33.88` Waduk Kedungombo, `33.99` Hutan Lindung Jateng, dan `71.88` Danau Tondano). Seluruh entitas non-wilayah ini telah dibersihkan dari dataset dan difilter dalam modul geometri sehingga data akurat merefleksikan 514 daerah otonom resmi.
2. **Akurasi Upah Minimum (UMP/UMK 2026)**:
   Angka UMP/UMK 2026 bersumber dari penetapan resmi Gubernur berdasarkan PP No. 49 Tahun 2025 (formula Inflasi + PDRB × alfa 0,5–0,9, berlaku efektif 1 Januari 2026; daftar UMP 38 provinsi dirilis resmi Kemnaker 6 Januari 2026). Untuk daerah yang tidak menetapkan UMK mandiri, data mengacu secara legal pada Upah Minimum Provinsi (UMP).
3. **Status Data Biaya Hidup (Cost of Living)**:
   - Angka rincian biaya hidup (10 kategori) merupakan **model estimasi berbasis agregasi Susenas, data IHK BPS, dan benchmark pasar lokal**, bukan survei primer langsung per-kabupaten (karena BPS hanya menggelar Survei Biaya Hidup di kota sampel IHK).
   - Seluruh kategori biaya hidup secara jujur dilabeli `confidence: "estimate"`, dan deskripsi sitasi telah dinormalisasi untuk mencerminkan metodologi permodelan tanpa mencatut nama survei fiktif.

### Pembaruan Data 2026 (per 1 September 2026)

Seluruh 514 baris upah diperbarui ke UMP/UMK 2026 resmi (berlaku 1 Januari
2026): 245 kabupaten/kota memakai UMK mandiri dari SK/Keputusan Gubernur
Desember 2025 (contoh: Kepgub Jabar No. 561.7/Kep.862-Kesra/2025, Kepgub
Jateng No. 100.3.3.1/505/2025, Kepgub Jatim No. 100.3.3.1/937/013/2025,
Kepgub Banten No. 703/2025), 269 daerah lainnya menginduk UMP 2026
provinsinya. Riset lapangan dilakukan via web research (Exa, Brave, Tavily)
terhadap rilis resmi Kemnaker/Disnaker dan media tepercaya; sumber yang
terindikasi konten halusinasi SEO ditolak dan didokumentasikan di
`data-prep/wages-2026-research.json`. Estimasi biaya hidup disesuaikan dengan
inflasi nasional (IHK yoy Juli 2026 +2,88%, BPS) dan `asOf` biaya di-set ke
2026-08-01; label `confidence: "estimate"` tetap dipertahankan.

### Wilayah Khusus (Papua & Daerah Non-IHK)

Pada daerah pedalaman/hinterland di Papua & Papua Barat (*Keerom, Sarmi, Mamberamo Raya, Pegunungan Arfak, dll.*):

- **Bukan Kota IHK BPS**: Tidak ada data SBH primer mandiri; pengeluaran dimodelkan dari data Susenas perdesaan dan biaya logistik perintis.
- **Regulasi Upah**: Menginduk pada Keputusan Gubernur tentang **Upah
  Minimum Provinsi (UMP)** 2026 (Papua: Rp4.436.283 per Kepgub Papua No.
  100.3.3.1/KEP.409/2025; Papua Barat: Rp3.841.000 per Kepgub Papua Barat No.
  563/220/2025; Papua Barat Daya: Rp3.766.000).

### Verifikasi Data Lapangan (Audit 2025 & Pembaruan 2026)

Seluruh 514 baris upah dan 514 baris biaya hidup diaudit konsistensi internal (duplikasi, cakupan, formula, rentang sewa vs estimasi hunian, centroid). Verifikasi lapangan terhadap sumber resmi (Kepgub/Disnaker/media tepercaya) dilakukan untuk 148 + 168 klaim upah via Exa Agent (`agent_run`):

- **316 klaim upah terverifikasi**: 97% cocok dengan SK resmi; koreksi yang diterapkan: 8 daerah di Provinsi Papua yang masih memakai UMP 2024 (Rp4.024.270) dinaikkan ke UMP 2025 (Rp4.285.850, Kepgub No. 188.4/444/2024); Papua Barat (5 daerah + Manokwari) disesuaikan ke UMP 2025 Rp3.615.000 (Kepgub No. 314/2024) karena nilai lama berada di bawah UMP; 7 koreksi presisi ±1 rupiah (Denpasar, Yogyakarta, Balikpapan, Bontang, Pekanbaru, Kab. Bandung, Cianjur).
- **Tier 31.01 Kepulauan Seribu & 63.02 Kota Baru** dikoreksi menjadi `kabupaten` (sebelumnya salah label `kota`), sehingga hitungan 416/98 konsisten.
- **Benchmark biaya hidup 12 kota besar** (rentang sewa kost/pekerja vs `housing` repo): estimasi sewa repo berada dalam rentang lapangan pada mayoritas kota ases; total anggaran repo memang profil "moderat-hemat pekerja UMK" — lebih rendah dari standar gaya hidup Numbeo (eksat/urban modern) dan di atas baseline Susenas per kapita, sesuai label `confidence: "estimate"`.

Disclaimer shown throughout: these are estimates, not financial advice.

## Kontribusi

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md). Prinsip inti: setiap angka wajib
punya `source`, `asOf`, dan `confidence`. Kontribusi paling berharga adalah
koreksi & peningkatan kualitas data.

## Lisensi

Dual-license:

- **Code** (`src/**`, config) — [MIT](LICENSE)
- **Data** (`src/data/**`, `public/data/**`, `data-prep/**`) —
  [CC-BY-4.0](LICENSE-DATA.md), atribusi wajib; atribusi sumber hulu
  (HDX, BPS, Kemnaker, CARTO/Esri) dipertahankan.
