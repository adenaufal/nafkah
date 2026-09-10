# Roadmap Nafkah

Nafkah membantu orang membandingkan upah minimum dengan biaya hidup di suatu
daerah. Saat ini, biaya hidupnya masih berupa estimasi. Pengembangan berikutnya
berfokus pada pemeriksaan data agar hasil perbandingan bisa lebih diandalkan.

Aturan pengembangannya tetap:

1. Periksa kualitas dan asal data sebelum menambah fitur visual yang memakainya.
2. Peta tetap menjadi tampilan utama, dengan fitur lain melengkapinya.
3. Aplikasi harus bisa dipakai lewat koneksi lambat, secara offline, dan dengan pembaca layar.
4. Setiap angka wajib punya `source`, `asOf`, dan `confidence`, tanpa pengecualian.

Legenda: ✅ selesai · 🟡 sebagian · ❌ belum.

Prioritasnya dimulai dari kepercayaan terhadap data, lalu personalisasi,
kontribusi data, dan analitik. Angka estimasi mudah disalahpahami sebagai angka
pasti, jadi setiap rilis perlu memperjelas batasannya. Penanggung jawabnya
maintainer repo, kecuali disebutkan lain. S/M/L menunjukkan perkiraan beban
kerja kecil, sedang, dan besar.

---

## Status produk (per 10 September 2026)

### ✅ Sudah tersedia

- Peta 514 kabupaten/kota dengan warna tingkat keterjangkauan, arsir untuk
  wilayah tanpa data, dan palet yang mempertimbangkan buta warna. Pilihan peta
  dasar Terang/Gelap/Satelit dan Offline, mode gelap, pencarian, legenda angka,
  serta filter tingkat keterjangkauan juga sudah tersedia.
- Panel asumsi rumah tangga, gaya hidup, hunian, transportasi, tabungan, dan
  basis upah. Ada kolom "Pendapatan sendiri" serta opsi "2 upah".
- Baki perbandingan hingga 5 wilayah dengan rincian biaya per kategori.
  Jendela detail mencantumkan asal setiap angka.
- Dataset JSON berversi `public/data/v2026.1/` dengan manifest, skema Zod,
  pemeriksaan integritas, dan catatan perubahan data.
- Tautan berbagi v2 yang memulihkan wilayah tersemat/terpilih, asumsi aktif,
  mode warna, filter legenda, dan opsi gaji asal relokasi. Decoder tetap
  membaca tautan v1.
- CTA koreksi yang kontekstual di detail wilayah, dengan antrean manual dan
  tanpa perubahan dataset otomatis; hitungan journey agregat hanya disimpan
  lokal di browser (tanpa URL, kode wilayah, atau nilai finansial).
- Navigasi keyboard, label `aria`, dan kontras AA.
- Data upah 2026 untuk 514 wilayah berlabel `official`, serta 514×10 nilai
  biaya berlabel `estimate`, dengan keterangan sumber sesuai asalnya.
- Unit test perhitungan (vitest), pemeriksaan integritas data (Zod), dan CI
  untuk typecheck/test/build. Repo juga punya dua lisensi, CONTRIBUTING,
  Code of Conduct, template issue/PR, serta robots/sitemap/OpenGraph untuk SEO.

### ❌ Belum tersedia

- Peta dasar offline masih berupa latar polos. PMTiles yang dihosting sendiri
  belum tersedia.
- Embed, ekspor CSV/PNG, PWA, data lintas tahun, detail kecamatan, antrean
  koreksi publik yang operasional, API publik, E2E Playwright, dan Lighthouse
  CI masih dalam rencana.

---

## Status publikasi dan kanal kontribusi

Repositori sudah dibuat publik di GitHub dan aplikasi `v0.1.0`
sudah dideploy. Checklist berikut mencatat kondisi pascapublikasi; item yang
masih ❌ adalah pekerjaan operasional atau keamanan, bukan syarat untuk membuka
repo.

| Item | Status |
| --- | --- |
| Repositori GitHub publik | ✅ |
| Aplikasi produksi di [nafkah.adenaufal.com](https://nafkah.adenaufal.com) | ✅ |
| Dua lisensi: MIT untuk kode, CC-BY-4.0 untuk data | ✅ |
| CONTRIBUTING + CI (typecheck/test/build) | ✅ |
| Code of Conduct (Contributor Covenant 2.1) | ✅ |
| Template issue/PR dan arahan ke Discussions (`.github/`) | ✅ |
| Pemeriksaan data dengan skema Zod, validasi 514×3, dan JSON berversi | ✅ (AP-02) |
| Penjelasan metode dan catatan bahwa UMK adalah patokan, bukan gaji nyata | ✅ (AP-01) |
| File sementara dan data pribadi (screenshot, salinan masukan, log) masuk `.gitignore` | ✅ |
| Form Airtable dan tautannya di `config.yml` | 🟡 Tautan sudah terpasang; pemeriksaan laporan masih manual (lihat [panduan kanal masukan](docs/feedback-channels.md)) |
| GitHub Discussions | 🟡 Tautan sudah tersedia; aktivasi dan kategorinya perlu dipelihara maintainer |
| `SECURITY.md` untuk situs statis | ❌ opsional |

> Repo sudah publik dan AP-02 selesai. Alur pemeriksaan AP-04 tetap menjadi
> prasyarat untuk menerima serta menggabungkan koreksi komunitas dengan aman.

---

## Roadmap Now / Next / Later

Repositori dan aplikasi sudah publik. Form Airtable untuk koreksi data sudah
ditautkan dari konfigurasi GitHub dan README; laporan yang masuk tetap diperiksa
manual. Saran fitur dan bug diarahkan ke GitHub Discussions. Situs tetap
menyajikan aset statis, tanpa layanan form yang dihosting sendiri. Pengumpulan
laporan nantinya memakai agent terjadwal di luar situs. Keputusan 2 September
2026 dan langkah pengelolaannya ada di [panduan kanal masukan](docs/feedback-channels.md).

### Ringkasan status

| Status | Jumlah | Item |
| --- | ---: | --- |
| Selesai | 4 | AP-02, AP-03, AP-06, AP-07 |
| Berjalan/sebagian | 3 | AP-01, AP-04, AP-05 |
| Belum dimulai di fase Now | 0 | — |

Risiko terbesar tetap kualitas estimasi wilayah yang diperdebatkan (AP-05)
dan kapasitas moderasi laporan (AP-04). AP-07 sudah memiliki model asal →
tujuan serta kompatibilitas pembacaan v1; AP-06 sengaja hanya menyimpan hitungan
agregat lokal, sehingga belum menyediakan analitik lintas pengguna.

### Now — September–Oktober 2026

| ID | Pekerjaan | Yang perlu dilakukan | Status | Prioritas |
| --- | --- | --- | --- | --- |
| AP-01 | Penjelasan metode dan batasan | Tampilkan metode dekat peta dan di jendela detail. Jelaskan asumsi awal 1 orang, arti tingkat keterjangkauan, serta UMK sebagai acuan resmi, bukan gaji aktual. | 🟡 Bagian utama ✅: catatan di panel Tentang dan jendela detail; `source`/`asOf`/`confidence` tampil untuk upah, 10 kategori biaya, dan rentang sewa narasi. Hitungan penggunaan agregat lokal tersedia lewat AP-06; telemetry lintas pengguna belum digunakan. | P0 · S |
| AP-02 | Versi dataset dan pemeriksaan data | Gunakan skema Zod dan CI untuk menolak data tidak valid sebelum menerima koreksi komunitas. Setelah itu, pindahkan dataset ke file JSON dengan versi dan catatan perubahan. | ✅ Pemeriksaan Zod + integritas join di CI (`src/data/schema.ts`, `dataset.test.ts`, kini membaca file yang di-ship). Dataset pindah ke JSON berversi `public/data/v2026.1/` dengan `manifest.json` dan catatan perubahan `public/data/CHANGELOG.md`; aplikasi memuatnya lewat fetch runtime (`src/data/loader.ts`). | P0 · M |
| AP-03 | Personalisasi rumah tangga v1.1 | Tambahkan jumlah anak dan isian cicilan/KPR pada kontrol pendapatan dan 2 upah yang sudah ada. Tampilkan profil aktif dan tombol reset. | ✅ Stepper jumlah anak (0–5, berlaku juga untuk single) dan isian cicilan KPR yang menggantikan estimasi hunian; profil aktif tampil di header drawer dan chip perbandingan, tombol reset sudah ada. Unit test mencakup anak dan cicilan, termasuk menjaga angka profil Keluarga v0.1 tetap identik. | P0 · M |
| AP-04 | Form koreksi per wilayah | Buat form Airtable "Laporkan angka ini" dengan wilayah, kategori, nilai lama/usulan, periode, jenis bukti, sumber, dan kontak opsional. Laporan masuk ke antrean pemeriksaan manual (`Status=New`), tanpa mengubah dataset otomatis. | 🟡 Form, CTA kontekstual, dan skema antrean manual ✅; pemeriksaan laporan nyata serta proses penerimaan dataset masih ❌ (lihat [panduan kanal masukan](docs/feedback-channels.md); template GitHub ✅). | P0 · M |
| AP-05 | Audit wilayah yang diperdebatkan | Periksa Kep. Meranti, Samosir, Bandung, serta biaya transportasi/logistik dan kesehatan. Bandingkan hasil model dengan laporan lokal, lalu catat keputusan tiap kasus. | 🟡 Baseline reproduktif dan pemeriksaan read-only terhadap rujukan pemerintah untuk Meranti, Samosir, dan Bandung sudah dicatat di [audit wilayah September 2026](docs/audit-wilayah-2026-09.md); rentang sewa narasi kini juga berprovenance. Bukti penggunaan lokal yang representatif dan keputusan perubahan data masih ❌. | P0 · S/M |
| AP-06 | Kemudahan menemukan dan memakai fitur | Uji ulang Pendapatan sendiri, filter tingkat keterjangkauan, mode gelap, dan legenda di ponsel serta lewat keyboard. Perjelas tombol tindakan dan catat penggunaan tanpa data pribadi. | ✅ QA manual ponsel 375px + keyboard/focus trap untuk alur utama; CTA, status relokasi, filter, tema, dan legenda diberi label jelas. Hitungan event hanya agregat di localStorage. | P1 · S |
| AP-07 | Perbandingan dan berbagi hasil untuk relokasi | Bagikan wilayah, asumsi, mode warna, dan filter lewat URL berversi; lalu pisahkan gaji asal dari biaya kota tujuan dan tambahkan affordance berbagi di panel hasil. | ✅ URL v2 membawa gaji asal dan tetap membaca v1; model Kota A → Kota B, biaya tujuan, UMK tujuan, provenance, status persisten, dan affordance relokasi sudah tersedia serta diuji round-trip. Embed tetap backlog terpisah. | P0 · M |

### Next — November–Desember 2026

| ID | Pekerjaan | Rencana dan prasyarat |
| --- | --- | --- |
| AP-08 | Lapisan data komunitas | Buat survei singkat per kategori. Tampilkan median atau rentangnya terpisah dari estimasi utama, lengkap dengan ukuran sampel, periode, confidence, dan aturan moderasi. |
| AP-09 | Informasi kepatuhan UMK dan gaji aktual | Mulai dengan label kualitatif bersumber dari putusan atau berita; skor numerik belum dipakai. UMK baru bisa diganti dengan data gaji aktual jika cakupan dan metodenya memadai. Perlu tinjauan hukum dan metodologi. |
| AP-10 | Tindak lanjut laporan sampai rilis | Setelah AP-04 berjalan, catat laporan yang diterima, ditolak, atau masih ditinjau. Agent terjadwal mengambil `Status=New` lewat PAT Airtable read-only dan Discussions baru. Jalankan harian saat ramai, berhenti bila kosong, lalu mingguan setelah reda. Agent hanya membuat draft PR; persetujuan tetap oleh manusia. |

### Later — 2027 dan seterusnya

| ID | Pekerjaan | Rencana |
| --- | --- | --- |
| AP-11 | Perencanaan relokasi | Gabungkan pendapatan, profil rumah tangga, pilihan kota, biaya, dan surplus/defisit. Hasilnya bisa dibagikan lewat tautan. |
| AP-12 | Lapisan desil dan analisis kebijakan | Tambahkan desil BPS, daya beli daerah, dan sektor pekerjaan setelah data dasar bisa diandalkan. |
| AP-13 | Akses data terbuka | Sediakan API read-only dengan versi, skema publik, template kontribusi, dan rilis dataset berkala setelah pengelolaan versi serta moderasi berjalan baik. |
| AP-14 | Cakupan lintas negara | Di luar rencana tahun ini. Evaluasi setelah model Indonesia, pencatatan sumber, dan alur koreksi terbukti stabil. |

### Urutan eksekusi untuk satu maintainer

1. Pastikan kanal kontribusi publik tetap berfungsi: pantau form Airtable dan Discussions, lalu operasionalkan antrean pemeriksaan (AP-04).
2. Kumpulkan bukti lokal untuk audit Meranti, Samosir, Bandung, biaya transportasi, dan kesehatan; catat keputusan per kasus (AP-05).
3. Setelah AP-04 berjalan, tindak lanjuti laporan sampai rilis dengan draft PR dan persetujuan manusia (AP-10) — file JSON berversi sudah ✅ (`public/data/v2026.1/` + catatan perubahan).
4. Pertahankan QA aksesibilitas dan kompatibilitas URL v2/v1; pekerjaan lanjutan berikutnya adalah lapisan komunitas (AP-08) dan kepatuhan/gaji aktual (AP-09).

---

## Backlog tematik

Pekerjaan jangka menengah dikelompokkan berdasarkan topik. Jadwalnya belum
dibagi per kuartal karena proyek eksperimen ini dikelola satu maintainer.
Nomor AP-xx merujuk ke rencana di atas.

### Data & integritas

| Pekerjaan | Status |
| --- | --- |
| Pemeriksaan 514 wilayah otonom (kode sesuai Kepmendagri 100.1.1-6117; hapus 8 poligon air/hutan `.88`/`.99`) | ✅ |
| Pemeriksaan sumber (hapus survei fiktif; beri label `estimate` pada hasil model) | ✅ |
| Pengolahan upah resmi (UMP/UMK 2026 dari SK/Kepgub dan rekap 38 provinsi) | ✅ |
| Pemeriksaan wilayah pedalaman dan non-IHK (kalibrasi Papua/kepulauan lewat Susenas dan logistik perintis) | ✅ |
| Uji perhitungan dan pemeriksaan integritas data dengan Zod di CI | ✅ |
| Penggantian estimasi biaya hidup dengan sumber primer/`official` (SBH BPS hanya mencakup kota sampel) | 🟡 |
| File JSON dengan versi di `/data/vYYYY/` dan catatan perubahan | ✅ `public/data/v2026.1/` + `public/data/CHANGELOG.md` (AP-02) |

### Peta & cakupan

| Pekerjaan | Status |
| --- | --- |
| Warna peta untuk 514 kabupaten/kota (memakai faktor pengali provinsi dan pedalaman saat diperlukan) | ✅ |
| Aksesibilitas lewat keyboard, legenda angka, arsir wilayah tanpa data, dan kontras AA | 🟡 dokumentasi audit axe masih ❌ |
| Kinerja: bundle JS 104 KB ✅; laporan Lighthouse CI di repo ❌ | 🟡 |
| Peta dasar offline dengan PMTiles yang dihosting sendiri (< 150 MB) | ❌ |
| Detail geometri kecamatan (adm3) untuk 10 kota metropolitan | ❌ |
| E2E Playwright untuk keyboard, batas sematan 5 wilayah, dan perubahan warna setelah asumsi diubah | ❌ |

### Analitik & kegunaan

| Pekerjaan | Status |
| --- | --- |
| Bahasa Indonesia sebagai satu-satunya bahasa (pilihan i18n belum diperlukan) | ✅ |
| Mode gelap dan filter legenda per tingkat keterjangkauan (diminta komunitas, tersedia sejak v0.1) | ✅ |
| Berbagi dan menyematkan peta (pengaturan di URL; mode `<iframe>`) | 🟡 URL relokasi berversi + tombol Bagikan ✅; embed ❌ |
| Ekspor CSV/PNG dengan sumber, `asOf`, dan catatan batasan | ❌ |
| Profil rumah tangga dengan pilihan awal yang divalidasi lewat Susenas | 🟡 kontrol jumlah anak & cicilan KPR ✅ (AP-03); validasi pilihan awal lewat Susenas masih ❌ |
| PWA yang bisa dipasang, menyimpan geometri dan data di cache, serta membuka kerangka aplikasi secara offline | ❌ |
| Data upah dan biaya hidup dari 2020 sampai sekarang, dengan penggeser tahun | ❌ |

### Komunitas dan pengelolaan proyek

| Pekerjaan | Status |
| --- | --- |
| Panduan dan pemeriksaan repo (CONTRIBUTING, CoC, template, CI) | ✅ |
| Koreksi publik dan antrean pemeriksaan | 🟡 Form, CTA, dan skema antrean ✅; operasi pemeriksaan masih ❌ (→ AP-04) |
| Tindak lanjut laporan sampai rilis beserta catatan perubahannya | ❌ (→ AP-10) |
| Rilis data triwulanan dan halaman metode yang dibuat otomatis dari metadata | ❌ |
| API publik read-only dengan OpenAPI | ❌ (→ AP-13) |
| Evaluasi dampak lewat survei singkat dan analitik yang menjaga privasi | 🟡 Hitungan event agregat lokal ✅; survei dan analitik lintas pengguna ❌ |

### Tindak lanjut usulan komunitas

| Usulan | Klasifikasi |
| --- | --- |
| Isian pendapatan sendiri ("apakah gaji saya cukup di daerah X?") | ✅ Selesai (Sep 2026). Kolom "Pendapatan sendiri" mengubah rasio, warna peta, jendela detail, dan baki perbandingan. UMK tetap tampil sebagai pembanding. |
| Indeks kepatuhan UMK pemberi kerja per wilayah | Ditunda (→ AP-09). Data di tingkat kabupaten/kota nyaris belum ada. Mulai dengan label kualitatif bersumber; skor numerik belum bisa dipertanggungjawabkan. |

---

## Masukan komunitas (gelombang Threads, 1 September 2026)

Catatan ini merangkum sekitar 300 interaksi tertulis saat rilis: 277 balasan,
1 mention, dan 35 kutipan postingan, dengan sekitar 301 interaksi relevan
setelah notifikasi disaring. Masukan dari audiens Threads dipakai untuk
menentukan arah, bukan sebagai survei yang mewakili seluruh pengguna.
Ringkasannya anonim, tanpa nama akun atau kutipan pribadi. Sebagian besar
tanggapan positif; warga di Sleman, Surakarta, dan Jawa Tengah ikut mengecek
kecocokan angka dengan kondisi setempat.

Dengan asumsi awal pada dataset v2026.1, 2 wilayah masuk kategori Nyaman
(Comfortable), 95 Cukup (Manageable), 303 Ketat (Tight), dan 114 Tak Cukup
(Insufficient). Keluhan
"tidak ada yang hijau" muncul berulang. Kalibrasinya mungkin terlalu ketat,
atau kondisi upah dan biaya hidup memang berat. Penjelasan metode perlu lebih
mudah ditemukan (AP-01), bersama filter/urutan tingkat keterjangkauan yang
sudah tersedia (✅).

| Tema | Masukan | Tindak lanjut |
| --- | --- | --- |
| Upah minimum dan gaji aktual | Kritik utama menyinggung UMKM yang disebut menyerap sekitar 90% tenaga kerja, sementara banyak gaji masih di bawah UMK. Pengguna mempertanyakan UMK sebagai patokan gaji nyata. | AP-01 (catatan batasan ✅), AP-09 |
| Koreksi data dari pengguna | Pengguna berulang kali mempertanyakan angka dan meminta cara mengirim koreksi, antara lain untuk Kep. Meranti dan Samosir. | AP-04, AP-05 |
| Kejelasan metode | Pengguna menanyakan sumber estimasi dan jumlah orang dalam perhitungan. Biaya transportasi juga dinilai kurang tepat. | AP-01, AP-05 |
| Personalisasi | Ada permintaan jumlah anak dan isian cicilan/KPR. Pendapatan sendiri sudah tersedia, tetapi belum mudah ditemukan. | AP-03, AP-06 |
| Kebutuhan penggunaan | Lapisan desil BPS/DTKS, relokasi kerja, riset daya beli, dan skripsi. | AP-07, AP-12 |
| Tampilan dan cakupan | Filter kategori Nyaman, mode gelap, ekspor/berbagi hasil, dan penambahan negara. | Filter dan mode gelap ✅; AP-06, AP-07; penambahan negara → AP-14 |

### Ukuran perbaikan dari masukan pengguna

- Semua jendela detail wilayah (100%) menampilkan sumber, periode, confidence, dan asumsi.
- Pertanyaan berulang tentang estimasi, jumlah orang, serta UMK dan gaji nyata ditargetkan turun 50% pada gelombang masukan berikutnya.
- Ukur alur penggunaan `open region → ubah asumsi → compare/share → laporkan angka`.
- Tinjau laporan komunitas paling lambat 7 hari kerja. Ukur proporsi laporan yang bisa ditindaklanjuti, bukan sekadar jumlahnya.

### Pertimbangan yang disepakati

- Form koreksi membantu memperbaiki data, tetapi menambah pekerjaan moderasi. Mulai dengan antrean manual dan kategori utama.
- Personalisasi membuat perhitungan lebih sesuai kebutuhan pengguna, tetapi bisa memberi kesan hasilnya terlalu pasti. Tampilkan asumsi dan gunakan rentang jika nilainya belum pasti.
- Data gaji aktual berguna, tetapi kebutuhan data dan metodenya paling berat. Penjelasan metode, koreksi data, dan personalisasi tetap bisa dikerjakan lebih dulu.

---

## Prioritas, dependensi & metrik

Kalau waktu atau tenaga terbatas, tunda pekerjaan dalam urutan ini: PWA,
embed, koreksi publik, lalu detail kecamatan. Pengolahan data resmi, unit test
dan pemeriksaan integritas (✅), akses keyboard dan legenda angka (✅), serta
catatan batasan berdasarkan sumber data (AP-01 ✅) tetap wajib dikerjakan.

Jadwal dan sumber di luar proyek yang perlu diperhatikan:

- Sesuaikan jadwal rilis data dengan penetapan UMK tahunan pada November sampai Desember.
- Data biaya BPS terbit dengan jeda 6 sampai 18 bulan. Isi `asOf` sesuai periode sebenarnya.
- Geometri HDX COD-AB diperbarui berkala. Tetapkan versi topologi untuk setiap rilis dataset.
- Syarat atribusi OSM/CARTO/Esri/Protomaps berbeda. Periksa sebelum membuka mode embed.

Target tahunan:

1. Sedikitnya 90% wilayah punya data upah dan biaya dengan `confidence` berupa `official` atau `estimate`.
2. Koreksi publik terverifikasi kurang dari 5% total field, sebagai ukuran pendekatan untuk keakuratan.
3. NPS/kepuasan pengguna mencapai setidaknya 40 dari survei pengguna akhir.
4. Tidak ada masalah aksesibilitas tingkat A/AA yang belum ditangani lebih dari 30 hari.
