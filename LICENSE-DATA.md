# Lisensi Data — CC-BY-4.0

Seluruh **data** dalam repositori ini dilisensikan di bawah
[Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/).

Cakupan (semua file data dan turunannya):

- `src/data/**` — records upah, biaya hidup, region, narasi, multiplier
- `public/data/**` — geometri TopoJSON
- `data-prep/**` — output riset & intermediate dataset

## Kamu boleh

Menyalin, mendistribusikan, memodifikasi, dan memakai untuk tujuan apa pun
(termasuk komersial) — **asal memberi atribusi**.

## Atribusi minimum

> Data: Nafkah (nafkah.adenaufal.com), CC-BY-4.0.

## Sumber hulu (wajib dipertahankan atribusinya)

Dataset ini adalah turunan/model dari sumber publik berikut. Atribusi hulu
tidak boleh dihapus:

- **Geometri wilayah**: HDX COD-AB Indonesia adm2 (Humanitarian Data Exchange)
- **Upah minimum (UMP/UMK 2026)**: Kemnaker / Disnaker / Keputusan Gubernur,
  per PP No. 49 Tahun 2025
- **Biaya hidup (model estimasi)**: agregasi BPS (Susenas, IHK) + benchmark
  pasar lokal
- **Basemap**: CARTO (OSM-derived) & Esri World Imagery — tunduk pada syarat
  atribusi masing-masing (lihat UI peta)

## Disclaimer

Angka biaya hidup berlabel `confidence: "estimate"` adalah **model estimasi**,
bukan survei primer. Bukan nasihat finansial. Lihat `README.md` untuk
metodologi lengkap.
