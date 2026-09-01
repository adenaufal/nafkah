# Nafkah — Roadmap

**Visi:** menjadi referensi publik yang kredibel untuk pertanyaan *"apakah UMK
daerah ini cukup untuk hidup layak di sana?"* — dari prototipe peta choropleth
berbasis data estimasi menjadi platform berbasis data terverifikasi.

**Prinsip berkelanjutan:**

1. **Data sebelum fitur** — tidak ada fitur visual baru yang mendahului kualitas
   & provenance data di baliknya.
2. **Map-first** — peta tetap kanvas utama; fitur lain mendukung.
3. **Aksesibilitas & offline** — bekerja di koneksi lambat, terbaca screen reader.
4. **Setiap angka punya `source`, `asOf`, `confidence`.** Tanpa pengecualian.

Legenda status: ✅ selesai · 🟡 sebagian · ❌ belum.

---

## Status saat ini (v0.1 — per 2 September 2026)

**✅ Sudah jalan**

- Peta choropleth **514 kab/kota**, band keterjangkauan + arsir (hatch) untuk
  no-data, palet colorblind-aware.
- Panel asumsi lengkap: rumah tangga, gaya hidup, hunian, transport, tabungan,
  basis upah (kotor / take-home).
- **Pendapatan sendiri** + opsi **2 upah** (pasangan bekerja).
- Baki perbandingan (maks 5 wilayah) + breakdown grafik per kategori.
- Modal detail dengan provenance per sel kategori.
- Basemap Terang/Gelap/Satelit + Offline (tanpa tile), dark mode, pencarian,
  legenda numerik + filter per band.
- Aksesibilitas keyboard + `aria` + kontras AA.
- Data: 514 upah `official` 2026, 514×10 biaya `estimate`, provenance jujur.
- Unit test kalkulasi (vitest), CI (typecheck/test/build), dual license,
  CONTRIBUTING, SEO (robots/sitemap/OpenGraph).

**❌ Belum (dirinci di Q1–Q4)**

- Data belum berversi JSON + validasi skema (Zod) — masih modul TypeScript.
- Basemap offline masih background polos — belum PMTiles self-hosted.
- Belum ada: share/embed via URL, ekspor CSV/PNG, PWA, time series, drill-down
  kecamatan.
- Belum ada: form koreksi publik, API publik read-only, E2E Playwright,
  Lighthouse CI, Code of Conduct.

---

## Q1 (Bulan 1–3): Fondasi data, integritas & kredibilitas

Tujuan: semua angka di UI berasal dari sumber nyata dan model estimasi valid,
bebas halusinasi sitasi dan artefak poligon GIS non-wilayah.

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| ✅ Integritas 514 wilayah otonom | Validasi kode wilayah vs Kepmendagri 100.1.1-6117; pembersihan 8 poligon air/hutan (`.88`, `.99`) | Tepat 514 kab/kota di seluruh modul data & layer peta |
| ✅ Anti-halusinasi & provenance honesty | Standardisasi sitasi ke metodologi transparan; eliminasi survei fiktif; label `confidence: "estimate"` untuk data model | 0 sitasi fiktif; biaya hidup jujur berstatus estimate |
| ✅ Pipeline UMK resmi | UMP/UMK 2026 dari SK/Kepgub + rekap Disnaker 38 provinsi | 514 baris upah `official` (termasuk fallback UMP) |
| 🟡 Pipeline biaya hidup | Model estimasi dari Susenas + IHK BPS + benchmark lokal | Cakupan 514 & frontier terkalibrasi **✅**; naik ke sumber primer/`official` **❌** (BPS SBH hanya di kota sampel) |
| ✅ Validasi frontier / non-IHK | Kalibrasi komoditas pedalaman & kepulauan (Papua, Pegaf, Mamberamo) via logistik perintis + Susenas | Koefisien logistik terdokumentasi di metodologi |
| ❌ Data versioning & Zod schema | Pindah data dari modul TS ke JSON berversi (`/data/vYYYY/…`) + validasi Zod di CI | `loadRecords()` baca JSON; skema tervalidasi otomatis |
| ✅ Uji perhitungan | Vitest untuk `calculations.ts`: formula, band, edge case (cost=0, wage=0, custom/dual income) | Fungsi murni tercakup unit test (11 test hijau) |

## Q2 (Bulan 4–6): Cakupan wilayah & kualitas peta

Tujuan: seluruh Indonesia tercakup; peta tetap cepat dan usable.

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| ✅ Cakupan 514 kab/kota terwarna | Semua wilayah punya cost profile (fallback multiplier provinsi & frontier) | 0 region kosong; "no data" hanya untuk kegagalan nyata |
| ❌ Basemap offline (PMTiles) | Self-hosted `.pmtiles` Indonesia + protokol `pmtiles` di runtime | Mode offline tampilkan basemap asli (kini masih background polos); < 150 MB |
| ❌ Geometri kecamatan (adm3) | Drill-down adm3 untuk 10 kota metro | Zoom > 10 menampilkan batas kecamatan |
| 🟡 Kinerja | Budget: TTI < 3 dtk di 3G; bundle JS < 500 KB | Bundle **104 KB ✅**; laporan Lighthouse CI di repo **❌** |
| 🟡 Aksesibilitas penuh | Keyboard, legenda numerik, pola hatch no-data, kontras AA | Keyboard/hatch/legenda numerik/kontras **✅**; audit axe terdokumentasi **❌** |
| ❌ E2E test | Playwright: path keyboard, baki pin (maks 5, tolak ke-6), recolor asumsi | Suite hijau di CI |

## Q3 (Bulan 7–9): Analitik & kegunaan lanjutan

Tujuan: dari "berapa coverage hari ini" menjadi "bagaimana perubahannya dan
untuk siapa".

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| ❌ Time series | UMK & estimasi biaya 2020–kini; slider tahun + grafik tren | ≥ 5 tahun data untuk ≥ 300 region |
| 🟡 Profil rumah tangga nyata | Preset berbasis data menggantikan multiplier abstrak | Multiplier + tipe rumah tangga **✅**; preset tervalidasi Susenas **❌** |
| ❌ Sharing & embed | State di URL (region, pins, asumsi); mode embed `<iframe>` | Link share membuka state identik |
| ❌ Ekspor | CSV/PNG dari baki & modal detail | Output menyertakan sumber + asOf + disclaimer |
| ✅ Bahasa Indonesia | UI berbahasa Indonesia (istilah wilayah ID) | Semua string UI berbahasa ID (single-locale; toggle i18n belum diperlukan) |
| ❌ PWA | Installable; cache geometry + data tahun berjalan; shell offline | Lulus Lighthouse PWA |

> **Sudah jalan lebih awal (di luar urutan Q3):** dark mode & filter legenda per
> band — keduanya diminta komunitas dan sudah tersedia di v0.1.

## Q4 (Bulan 10–12): Komunitas & keberlanjutan

Tujuan: data makin baik lewat kontribusi terstruktur; proyek punya tata kelola.

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| ❌ Koreksi publik | Form "laporkan ketidaksesuaian" per region/kategori + antrean review | Moderasi manual; koreksi masuk rilis data berikutnya dengan credit |
| ❌ API publik read-only | Endpoint JSON statis/versioned per region + dokumentasi OpenAPI | Dipakai ≥ 1 pihak eksternal |
| ❌ Rilis data triwulanan | Changelog per versi dataset; halaman metodologi auto dari metadata | 2 rilis terjadwal terbukti jalan |
| 🟡 Tata kelola repo | CONTRIBUTING, CoC, panduan multiplier/provenance; CI penuh | CONTRIBUTING/CI/LICENSE **✅**; Code of Conduct **❌**; PR eksternal pertama **❌** |
| ❌ Evaluasi dampak | Survei singkat + analytics privacy-respecting | Laporan evaluasi + keputusan tahun ke-2 |

---

## Triase usulan fitur (input komunitas)

| Usulan | Klasifikasi | Catatan |
| --- | --- | --- |
| Input pendapatan custom — "apakah gaji saya cukup di daerah X?" | ✅ **Selesai (September 2026)** — kontrol "Pendapatan sendiri" di panel asumsi; rasio, warna peta, modal detail & tabel perbandingan mengikuti; UMK daerah tetap jadi pembanding | Rasio keterjangkauan memang `wageBasisAmount ÷ totalMonthlyCost` — cukup tambah input gaji sebagai pembagi. Biaya rendah, dampak tinggi (kasus relokasi). |
| Indeks kepatuhan UMK pemberi kerja per wilayah | **Nice-to-have — eksplorasi jangka panjang** (kandidat Q4+) | Data nyaris tidak ada di level kab/kota (inspeksi Kemnaker tidak rutin per wilayah). Bentuk paling jujur: badge kualitatif bersumber (putusan PTUN/media), bukan skor numerik. Lihat masukan komunitas di bawah — validasi kuat untuk menaikkan prioritas. |

---

## Masukan komunitas (gelombang viral Threads, 1 September 2026)

Intisari dari ~ribuan interaksi publik (mentions, replies, quotes) saat rilis
viral. Diringkas **anonim** — tanpa handle atau kutipan personal; apresiasi
disaring, hanya masukan actionable yang dicatat. Sentimen mayoritas positif;
akurasi estimasi divalidasi warga lokal di beberapa daerah (mis. Sleman,
Surakarta, Jawa Tengah).

**Angka yang paling dibahas** — distribusi band pada asumsi default:
Comfortable **0** · Manageable **69** · Tight **302** · Insufficient **143**.
"Tidak ada yang hijau" jadi keluhan berulang → sinyal ganda: kalibrasi
band/asumsi mungkin terlalu ketat, atau kondisi memang suram. Keduanya menuntut
halaman metodologi yang terlihat + fitur filter/urut band.

| Tema | Sinyal dari komunitas | Klasifikasi & tindakan |
| --- | --- | --- |
| Realisme upah (UMK vs upah riil) | Kritik metodologis terkuat: UMKM menyerap ~90% tenaga kerja tapi banyak menggaji **di bawah** UMK; toko/kafe/warkop mentok ~3jt. "UMK bukan patokan nyata." | **Prioritas naik.** Pertegas disclaimer "UMK = batas legal, bukan upah riil"; eksplor indikator *realized wage*. Memvalidasi kuat item **Indeks kepatuhan UMK** (dari Q4 nice-to-have → pertimbangkan lebih awal, tetap badge kualitatif bersumber). |
| Koreksi data (crowdsource) | "Angka nggak masuk akal" muncul puluhan kali; permintaan "boleh submit data?". Contoh: Kab. Kepulauan Meranti dapat band tinggi, warga menilai harusnya lebih rendah (pulau, petani karet ± 2jt/rumah tangga, logistik & BBM mahal). | **Tarik maju.** Percepat **form koreksi publik** (semula Q4); seed antrean review dengan daerah yang sudah dilaporkan. |
| Transparansi metodologi | Pertanyaan berulang: "estimasi dari mana?", "per kapita / untuk berapa orang?", "asumsi *leisure* tiap daerah beda tidak?". Transport dinilai kurang tepat. | Halaman **metodologi publik** yang mudah ditemukan + bongkar asumsi per kategori di modal detail. Review model transport. Menguatkan provenance Q1. |
| Personalisasi | Minta: jumlah anak, override cicilan/KPR, input pendapatan sendiri (**sudah ada** — isu *discoverability*). | Perjelas kontrol "Pendapatan sendiri"; tambah komposisi rumah tangga (jumlah anak) + override cicilan. |
| Integrasi & use-case | "desil" disebut berkali-kali — minta overlay/perbandingan desil BPS/DTKS. Use-case nyata: relokasi kerja, riset daya beli buka usaha, bahan skripsi. | Kandidat layer perbandingan **desil BPS** (Q3). Angkat use-case relokasi & riset di positioning. |
| UX & jangkauan | Filter/urutkan "tampilkan yang comfortable"; dark mode; export/share; ekspansi negara lain. | Filter band **sudah ada ✅**; dark mode **sudah ada ✅**. Export/share → Q3. Ekspansi lintas negara → di luar cakupan tahun ini. |

**Konsekuensi ke prioritas (usulan, belum mengubah komitmen Q1):**

1. **Kepatuhan UMK** & **form koreksi publik** naik daun — keduanya paling diminta; pertimbangkan menariknya lebih awal tanpa mendahului fondasi data Q1.
2. **Halaman metodologi publik** jadi mendesak (banyak salah paham per kapita & sumber estimasi) — lekatkan ke provenance Q1.
3. **Review kalibrasi band + model transport** masuk audit data Q1 (distribusi "0 comfortable" perlu dipastikan benar, bukan artefak asumsi).

---

## Matriks prioritas (jika sumber daya menyempit)

Urutan potong jika terpaksa: PWA → embed → koreksi publik → kecamatan drill-down.
Yang **tidak boleh** dipotong: pipeline data resmi (Q1), unit test kalkulasi
(✅ sudah), aksesibilitas keyboard & legenda numerik (✅ sudah), disclaimer
berbasis provenance.

## Dependensi eksternal & risiko

- Rilis UMK tahunan (Nov–Des) → jadwalkan rilis data Q4/Q1 mengikuti.
- Ketersediaan data biaya: BPS merilis dengan jeda 6–18 bulan → `asOf` wajib
  jujur, jangan dipaksakan "terbaru".
- Geometri: HDX COD-AB diperbarui periodik; pin versi topology per rilis dataset
  agar join kode wilayah stabil.
- Hukum & atribusi: OSM/CARTO/Esri/Protomaps punya syarat atribusi masing-masing;
  audit lisensi sebelum mode embed dibuka publik.

## Metrik keberhasilan tahunan

1. ≥ 90% region ber-`confidence` official/estimate untuk wage AND cost.
2. Koreksi publik terverifikasi < 5% dari total field (proxy keakuratan).
3. NPS/kepuasan ≥ 40 dari survei pengguna akhir.
4. 0 isu aksesibilitas level A/AA terbuka > 30 hari.
