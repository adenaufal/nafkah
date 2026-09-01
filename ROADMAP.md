# Nafkah — Roadmap 12 Bulan

**Visi:** menjadi referensi publik yang kredibel untuk pertanyaan *"apakah UMK
daerah ini cukup untuk hidup layak di sana?"* — dari prototipe peta choropleth
berbasis data sampel menjadi platform berbasis data terverifikasi.

**Prinsip berkelanjutan:**

1. Data sebelum fitur — tidak ada fitur visual baru yang boleh mendahului
   kualitas & provenance data di baliknya.
2. Map-first — peta tetap kanvas utama; fitur lain mendukung, bukan menggantikan.
3. Aksesibilitas & offline — tool publik harus bekerja di koneksi lambat dan
   bisa dibaca screen reader.
4. Setiap angka punya `source`, `asOf`, `confidence`. Tidak ada pengecualian.

---

## Q1 (Bulan 1–3): Fondasi data, integritas & kredibilitas

Tujuan kuartal: semua angka di UI berasal dari sumber nyata dan model terestimasi valid, bebas halusinasi sitasi dan artefak poligon GIS non-wilayah.

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| Integritas 514 Wilayah Otonom | Validasi kode wilayah terhadap Kepmendagri 100.1.1-6117; pembersihan poligon air/hutan (`.88`, `.99`) | Tepat 514 kab/kota definitif di seluruh modul data dan layer peta |
| Anti-Hallucination & Provenance Honesty | Standardisasi sitasi ke deskripsi metodologis transparan; eliminasi nama survei fiktif; pelabelan `confidence: "estimate"` untuk seluruh data model | 0 sitasi fiktif; 100% data biaya hidup mencerminkan status metodologis yang jujur |
| Pipeline UMK resmi | Scraper/importer surat keputusan gubernur + rekap Disnaker untuk 38 provinsi; normalisasi ke `WageRecord` | 100% (514 kab/kota) punya entri upah resmi (`official`), termasuk daerah ber-fallback UMP |
| Pipeline biaya hidup | Integrasi data BPS (biaya hidup, pengeluaran per kapita) + dataset rental publik untuk kategori `housing` + model estimasi frontier | 100% kab/kota tercakup `costs` & `narratives`; 10 wilayah frontier Papua/Papua Barat terkalibrasi |
| Validasi Daerah Frontier / Non-IHK | Kalibrasi harga komoditas pedalaman & kepulauan (DAS Mamberamo, Pegaf, Wondama, Serui) berbasis laporan logistik perintis & Susenas | Rincian koefisien logistik terdokumentasi di metodologi |
| Data versioning & Zod Schema | Data dipindah dari modul TS ke file JSON berversi (`/data/v2025-01/…`) + schema validation Zod | `loadRecords()` membaca JSON; validasi skema otomatis di CI mencegah poligon non-wilayah & invalid confidence |
| Uji perhitungan | Vitest untuk `calculations.ts`: formula coverage, klasifikasi band, edge case (cost = 0, wage = 0) | 100% fungsi murni tercakup unit test |

Risiko: kelengkapan UMK kab/kota (sebagian daerah hanya mengumumkan UMP) dan ketiadaan SBH di luar kota sampel.
Mitigasi: fallback eksplisit "menggunakan UMP provinsi" dengan label tersendiri dan permodelan IHK berbasis klaster regional.

## Q2 (Bulan 4–6): Cakupan wilayah & kualitas peta

Tujuan kuartal: seluruh Indonesia tercakup; peta tetap cepat dan usable.

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| Cakupan 514 kab/kota | Verifikasi dan penyempurnaan cost profile hasil model (fallback multiplier provinsi & frontier) untuk seluruh wilayah | Semua region terwarna; legend "no data" hanya untuk kegagalan nyata; 0 region kosong |
| Basemap offline (PMTiles) | Self-hosted `.pmtiles` Indonesia sebagai basemap; `pmtiles` protocol di runtime | Mode offline menampilkan basemap asli, bukan hanya background polos; ukuran < 150 MB |
| Geometries kecamatan | Drill-down adm3 untuk 10 kota metro | Zoom > 10 menampilkan batas kecamatan untuk region yang didukung |
| Kinerja | Budget: time-to-interactive < 3 detik di 3G; bundle JS < 500 KB (code-split recharts) | Laporan Lighthouse CI di repo |
| Aksesibilitas penuh | Keyboard: search → buka detail → Escape; label numerik di legend; pola hatch untuk no-data; kontras AA | Audit axe + manual keyboard walkthrough terdokumentasi |
| E2E test | Playwright: path keyboard, pin tray (maks 5, penolakan ke-6), perubahan asumsi mewarnai ulang peta | Suite hijau di CI |

## Q3 (Bulan 7–9): Analitik & kegunaan lanjutan

Tujuan kuartal: dari "berapa coverage hari ini" menjadi "bagaimana perubahan dari waktu ke waktu dan untuk siapa".

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| Time series | UMK & estimasi biaya 2020–sekarang; slider tahun di map; grafik tren di modal detail | Minimal 5 tahun data untuk ≥ 300 region |
| Profil rumah tangga nyata | Preset berbasis data (mis. "keluarga 2 anak usia sekolah") menggantikan multiplier abstrak | Minimal 4 preset tervalidasi terhadap data BPS SUSENAS |
| Sharing & embed | State di URL (region, pins, asumsi); mode embed `<iframe>` read-only | Link hasil share membuka state identik |
| Ekspor | CSV/PNG dari comparison tray & detail modal | Output menyertakan sumber + asOf + disclaimer |
| Bahasa Indonesia | Toggle locale id-ID untuk UI (istilah wilayah sudah ID) | Semua string lewat kamus i18n |
| PWA | Installable, cache geometry + data tahun berjalan; app shell offline | Pass Lighthouse PWA check |

## Q4 (Bulan 10–12): Komunitas & keberlanjutan

Tujuan kuartal: data makin baik lewat kontribusi terstruktur; proyek punya tata kelola.

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| Koreksi publik | Form "laporkan ketidaksesuaian" per region per kategori; antrean review | Moderasi manual; koreksi masuk release data berikutnya dengan credit |
| API publik read-only | Endpoint JSON statis/versioned per region; dokumentasi OpenAPI | Digunakan minimal 1 pihak eksternal (riset/media) |
| Rilis data triwulanan | Changelog per versi dataset; halaman metodologi diperbarui otomatis dari metadata | 2 rilis terjadwal terbukti jalan |
| Tata kelola repo | CONTRIBUTING, code of conduct, panduan multiplier & provenance; CI penuh (typecheck, lint, test, lighthouse) | PR eksternal pertama ter-review & merged |
| Evaluasi dampak | Ukur pertanyaan pengguna inti terjawab: survei singkat + analytics (self-hosted, privacy-respecting) | Laporan evaluasi + keputusan tahun ke-2 didokumentasikan |

---

## Triase usulan fitur (input komunitas, September 2026)

Hasil triase dua usulan pengguna — untuk menentukan urutan kerja tanpa
mendahului fondasi data Q1.

| Usulan | Klasifikasi | Catatan |
| --- | --- | --- |
| Input pendapatan custom — "apakah gaji saya cukup di daerah X?" (pengganti/melengkapi basis UMK, untuk pertimbangan relokasi) | ✅ **Diimplementasikan (September 2026)** — kontrol "Pendapatan sendiri" di panel asumsi; rasio, warna peta, modal detail, dan tabel perbandingan mengikuti; UMK daerah tetap tampil sebagai pembanding | Bukan "urgent" (tidak ada yang rusak), tapi rasio keterjangkauan sudah dihitung sebagai `wageBasisAmount ÷ totalMonthlyCost` — cukup tambahkan input gaji sebagai sumber pembagi. Biaya implementasi rendah, dampak tinggi: menjawab kasus pemakaian paling personal (relokasi). |
| Indeks kepatuhan UMK pemberi kerja per wilayah (patuh tidaknya pengusaha menggaji sesuai UMK, dan efek berantainya ke daya beli) | **Nice-to-have — eksplorasi jangka panjang** (kandidat Q4+) | Setuju dengan pengusul: datanya nyaris tidak ada di level kab/kota — inspeksi Kemnaker tidak dirilis rutin per wilayah, sehingga harus triangulasi berita/manual dan rawan basi. Bertentangan dengan prinsip "setiap angka punya sumber" bila dipaksakan jadi angka. Bentuk paling jujur: badge kualitatif per wilayah dengan kutipan sumber (putusan PTUN/media/kasus ternormalisasi), bukan skor numerik. |

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
| Realisme upah (UMK vs upah riil) | Kritik metodologis terkuat: UMKM menyerap ~90% tenaga kerja tapi banyak menggaji **di bawah** UMK; toko/kafe/warkop mentok ~3jt. "UMK bukan patokan nyata." | **Prioritas naik.** Pertegas disclaimer "UMK = batas legal, bukan upah riil"; eksplor indikator *realized wage*. Memvalidasi kuat item **Indeks kepatuhan UMK** (dari Q4 nice-to-have → pertimbangkan lebih awal, tetap sebagai badge kualitatif bersumber, bukan skor numerik). |
| Koreksi data (crowdsource) | "Angka nggak masuk akal" muncul puluhan kali; permintaan "boleh submit data?". Contoh konkret: Kab. Kepulauan Meranti dapat band tinggi, warga menilai harusnya lebih rendah (pulau, petani karet ± 2jt/rumah tangga, logistik & BBM mahal). | **Tarik maju.** Percepat **form koreksi publik** (semula Q4) — seed antrean review dengan daerah yang sudah dilaporkan. Konsisten dengan prinsip "setiap angka punya sumber". |
| Transparansi metodologi | Pertanyaan berulang: "estimasi dari mana?", "per kapita / untuk berapa orang?", "asumsi *leisure* tiap daerah beda tidak?". Estimasi transport dinilai kurang tepat. | Halaman **metodologi publik** yang mudah ditemukan + bongkar asumsi per kategori di modal detail. Review model biaya transport. Menguatkan deliverable provenance Q1. |
| Personalisasi | Minta: jumlah anak, override cicilan/KPR, input pendapatan sendiri (**sudah ada** — ini isu *discoverability*, bukan fitur baru). | Perjelas kontrol "Pendapatan sendiri" (jadikan lebih menonjol); tambah komposisi rumah tangga (jumlah anak) + override cicilan sebagai kategori. |
| Integrasi & use-case | "desil" disebut berkali-kali — minta overlay/perbandingan dengan desil BPS/DTKS sebagai faktor. Use-case nyata yang muncul: pertimbangan relokasi kerja, riset daya beli untuk buka usaha, bahan skripsi. | Kandidat layer perbandingan **desil BPS** (Q3 analitik). Angkat use-case relokasi & riset di positioning produk. |
| UX & jangkauan | Filter/urutkan "tampilkan yang comfortable" (agar hijau ketemu); dark mode; export/share; ekspansi ke negara lain (untuk yang mau pindah luar negeri). | Filter by band → dekat dengan aksesibilitas legend Q2. Dark mode & export → Q3 (sharing/ekspor). Ekspansi lintas negara → jangka sangat panjang, di luar cakupan tahun ini. |

**Konsekuensi ke prioritas (usulan, belum mengubah komitmen Q1):**

1. Item **kepatuhan UMK** dan **form koreksi publik** naik daun — keduanya paling diminta; pertimbangkan menariknya lebih awal tanpa mendahului fondasi data Q1.
2. **Halaman metodologi publik** jadi kebutuhan mendesak (banyak salah paham soal per kapita & sumber estimasi) — lekatkan ke pekerjaan provenance Q1.
3. **Review kalibrasi band + model transport** masuk daftar audit data Q1 (distribusi "0 comfortable" perlu dipastikan benar, bukan artefak asumsi).

---

## Matriks prioritas (jika sumber daya menyempit)

Urutan potong jika terpaksa: PWA → embed → Koreksi publik → kecamatan drill-down.
Yang **tidak boleh** dipotong: pipeline data resmi (Q1), unit test kalkulasi (Q1),
aksesibilitas keyboard & legend numerik (Q2), disclaimer berbasis provenance.

## Dependensi eksternal & risiko

- Rilis UMK tahunan (Nov–Des) → jadwalkan release data Q4/Q1 mengikuti.
- Ketersediaan data biaya: BPS merilis dengan jeda 6–18 bulan → `asOf` wajib
  jujur, jangan dipaksakan "terbaru".
- Geometri: HDX COD-AB diperbarui periodik; pin versi topology per release
  dataset agar join kode wilayah stabil.
- Hukum & atribusi: OSM/CARTO/Esri/Protomaps masing-masing punya syarat
  atribusi; audit lisensi sebelum mode embed dibuka publik.

## Metrik keberhasilan tahunan

1. ≥ 90% region ber-`confidence` official/estimate untuk wage AND cost.
2. Koreksi publik yang terverifikasi < 5% dari total field (proxy keakuratan).
3. NPS/kepuasan ≥ 40 dari survei pengguna akhir.
4. 0 isu aksesibilitas level A/AA terbuka > 30 hari.
