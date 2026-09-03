# Lisensi Data (CC-BY-4.0)

Seluruh data dalam repositori ini memakai lisensi
[Creative Commons Attribution 4.0 International (CC-BY-4.0)](https://creativecommons.org/licenses/by/4.0/).

Lisensi ini mencakup semua file data berikut beserta turunannya:

- `src/data/**` berisi upah, biaya hidup, wilayah, narasi, dan faktor pengali.
- `public/data/**` berisi geometri TopoJSON.
- `data-prep/**` berisi hasil riset dan dataset dalam proses pengolahan.

## Kamu boleh

Kamu boleh menyalin, membagikan, mengubah, dan menggunakan data untuk tujuan
apa pun, termasuk komersial, selama mencantumkan atribusi.

## Atribusi minimum

> Data: Nafkah (nafkah.adenaufal.com), CC-BY-4.0.

## Atribusi sumber asal

Dataset ini diolah atau dimodelkan dari sumber publik berikut. Atribusi untuk
sumber-sumber ini wajib dipertahankan.

- Geometri wilayah berasal dari HDX COD-AB Indonesia adm2 (Humanitarian Data Exchange).
- Upah minimum (UMP/UMK 2026) mengacu pada Kemnaker, Disnaker, dan Keputusan
  Gubernur, sesuai PP No. 49 Tahun 2025.
- Estimasi biaya hidup memakai agregasi BPS (Susenas, IHK) dan acuan harga
  pasar lokal.
- Peta dasar memakai CARTO (berbasis OSM) dan Esri World Imagery. Syarat
  atribusi masing-masing tetap berlaku dan tercantum di tampilan peta.

## Catatan penggunaan

Biaya hidup berlabel `confidence: "estimate"` dihitung dari model estimasi,
bukan survei primer. Angka ini bukan nasihat keuangan. Penjelasan metodenya
ada di [README](README.md#integritas--audit-data).
