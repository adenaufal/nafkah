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
- Embed, ekspor PNG, data lintas tahun, detail kecamatan, antrean koreksi
  publik yang operasional, API publik, E2E Playwright, dan Lighthouse CI masih
  dalam rencana.

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
| Selesai | 5 | AP-01, AP-02, AP-03, AP-06, AP-07 |
| Berjalan/sebagian | 2 | AP-04, AP-05 |
| Belum dimulai di fase Now | 2 | AP-15, AP-17 (direncanakan untuk v0.4.0) |
| Fondasi lokal fase Next | 2 | AP-08, AP-10 (belum operasional/publik) |

Risiko terbesar tetap kualitas estimasi wilayah yang diperdebatkan (AP-05)
dan kapasitas moderasi laporan (AP-04). AP-07 sudah memiliki model asal →
tujuan serta kompatibilitas pembacaan v1; AP-06 sengaja hanya menyimpan hitungan
agregat lokal, sehingga belum menyediakan analitik lintas pengguna.

### Now — September–Oktober 2026

| ID | Pekerjaan | Yang perlu dilakukan | Status | Prioritas |
| --- | --- | --- | --- | --- |
| AP-01 | Penjelasan metode dan batasan | Tampilkan metode dekat peta dan di jendela detail. Jelaskan asumsi awal 1 orang, arti tingkat keterjangkauan, serta UMK sebagai acuan resmi, bukan gaji aktual. | ✅ Ringkasan metode tersedia permanen tepat di atas peta (desktop/ponsel, keyboard), dengan profil aktif, rumus cakupan, batas band dari konstanta perhitungan, dan batasan UMK; catatan lengkap di Tentang dan detail. `source`/`asOf`/`confidence` tampil untuk upah, 10 kategori biaya, dan rentang sewa narasi. Tabel sensitivitas dihitung live dan dikunci di CI; keputusan pilihan awal di [catatan kalibrasi](docs/kalibrasi-default-2026-09.md). Hitungan agregat lokal lewat AP-06; telemetry lintas pengguna belum digunakan. | P0 · S |
| AP-02 | Versi dataset dan pemeriksaan data | Gunakan skema Zod dan CI untuk menolak data tidak valid sebelum menerima koreksi komunitas. Setelah itu, pindahkan dataset ke file JSON dengan versi dan catatan perubahan. | ✅ Pemeriksaan Zod + integritas join di CI (`src/data/schema.ts`, `dataset.test.ts`, kini membaca file yang di-ship). Dataset pindah ke JSON berversi `public/data/v2026.1/` dengan `manifest.json` dan catatan perubahan `public/data/CHANGELOG.md`; aplikasi memuatnya lewat fetch runtime (`src/data/loader.ts`). | P0 · M |
| AP-03 | Personalisasi rumah tangga v1.1 | Tambahkan jumlah anak dan isian cicilan/KPR pada kontrol pendapatan dan 2 upah yang sudah ada. Tampilkan profil aktif dan tombol reset. | ✅ Stepper jumlah anak (0–5, berlaku juga untuk single) dan isian cicilan KPR yang menggantikan estimasi hunian; profil aktif tampil di header drawer dan chip perbandingan, tombol reset sudah ada. Unit test mencakup anak dan cicilan, termasuk menjaga angka profil Keluarga v0.1 tetap identik. | P0 · M |
| AP-04 | Form koreksi per wilayah | Buat form Airtable "Laporkan angka ini" dengan wilayah, kategori, nilai lama/usulan, periode, jenis bukti, sumber, dan kontak opsional. Laporan masuk ke antrean pemeriksaan manual (`Status=New`), tanpa mengubah dataset otomatis. | 🟡 Form, CTA kontekstual, skema antrean, serta validator proposal hasil review manual ✅ (`npm run corrections:validate`); validator memeriksa nilai lama, target, keputusan, provenance, dan integritas hasil simulasi, termasuk perubahan benchmark hunian bersama rentang sewa narasi, tanpa menulis dataset. Pemeriksaan laporan nyata serta penerimaan ke rilis masih ❌ (lihat [panduan kanal masukan](docs/feedback-channels.md); template GitHub ✅). | P0 · M |
| AP-05 | Audit wilayah yang diperdebatkan | Periksa Kep. Meranti, Samosir, Bandung, serta biaya transportasi/logistik dan kesehatan. Bandingkan hasil model dengan laporan lokal, lalu catat keputusan tiap kasus. | 🟡 Baseline reproduktif dan pemeriksaan read-only terhadap rujukan pemerintah untuk Meranti, Samosir, dan Bandung sudah dicatat di [audit wilayah September 2026](docs/audit-wilayah-2026-09.md); rentang sewa narasi kini juga berprovenance. Bukti penggunaan lokal yang representatif dan keputusan perubahan data masih ❌. | P0 · S/M |
| AP-06 | Kemudahan menemukan dan memakai fitur | Uji ulang Pendapatan sendiri, filter tingkat keterjangkauan, mode gelap, dan legenda di ponsel serta lewat keyboard. Perjelas tombol tindakan dan catat penggunaan tanpa data pribadi. | ✅ QA manual ponsel 375px + keyboard/focus trap untuk alur utama; CTA, status relokasi, filter, tema, dan legenda diberi label jelas. Hitungan event hanya agregat di localStorage. | P1 · S |
| AP-07 | Perbandingan dan berbagi hasil untuk relokasi | Bagikan wilayah, asumsi, mode warna, dan filter lewat URL berversi; lalu pisahkan gaji asal dari biaya kota tujuan dan tambahkan affordance berbagi di panel hasil. | ✅ URL v2 membawa gaji asal dan tetap membaca v1; model Kota A → Kota B, biaya tujuan, UMK tujuan, provenance, status persisten, dan affordance relokasi sudah tersedia serta diuji round-trip. Embed tetap backlog terpisah. | P0 · M |
| AP-15 | Personalisasi dan kegunaan v1.2 | Tindak lanjut [gelombang TikTok/Instagram Oktober 2026](#masukan-komunitas-gelombang-tiktok--instagram-1112-oktober-2026): opsi hunian tanpa sewa (rumah sendiri atau ikut orang tua, biaya hunian Rp0), isian tanggungan keluarga per bulan (kiriman ke orang tua/generasi sandwich), transportasi mobil pribadi serta jalan kaki/sepeda dengan pengali yang dijelaskan dasarnya, tombol salin struk, petunjuk untuk gaji di atas 25 juta, dan QA ulang tampilan ponsel (360/390/412 px). Isian baru ikut tersimpan di browser, tautan berbagi, dan ekspor CSV. | ❌ Direncanakan untuk v0.4.0 | P0 · M |
| AP-17 | FAQ dan "Cara dibuat" | Jawab pertanyaan yang berulang di komentar (asal angka upah dan biaya, arti estimasi, kenapa banyak daerah merah) dan jelaskan proses pembuatan di halaman Tentang: tools yang dipakai, peran AI, serta cara angka diperiksa. Ini jawaban atas persepsi "dibuat AI" tanpa desain ulang. | ❌ Direncanakan untuk v0.4.0 | P0 · S |

### Next — November–Desember 2026

| ID | Pekerjaan | Rencana dan prasyarat |
| --- | --- | --- |
| AP-08 | Lapisan data komunitas | 🟡 Fondasi lokal tersedia: `npm run community:summary` memvalidasi observasi bulanan yang dimoderasi dan menghasilkan median/rentang terpisah per wilayah, kategori, profil, dan periode, dengan jumlah responden serta provenance `sample`; kelompok kurang dari 5 responden diterima tidak keluar. [Format dan aturan moderasi](docs/community-data.md). Survei nyata, pemeriksaan representativitas, dan tampilan di aplikasi masih ❌. |
| AP-09 | Informasi kepatuhan UMK dan gaji aktual | Mulai dengan label kualitatif bersumber dari putusan atau berita; skor numerik belum dipakai. UMK baru bisa diganti dengan data gaji aktual jika cakupan dan metodenya memadai. Perlu tinjauan hukum dan metodologi. |
| AP-10 | Tindak lanjut laporan sampai rilis | 🟡 [Ledger review privat](docs/correction-ledger.md) dan `npm run corrections:summary` tersedia untuk memvalidasi keputusan, tanggal, wilayah, duplikasi, dan pencatatan rilis; keluaran hanya jumlah per status dan laporan dirilis. Pengambilan `Status=New` lewat PAT Airtable read-only, pemantauan Discussions, penjadwalan, dan pembuatan draft PR masih ❌. Persetujuan serta pembaruan status tetap oleh manusia. |
| AP-16 | Edit struk | Ubah nominal per kategori, matikan kategori yang tidak relevan (misalnya pendidikan & kursus untuk rumah tangga tanpa anak), dan tambah pos rutin sendiri (listrik, air, iuran warga, SPP, UKT, kesehatan non-BPJS, pajak kendaraan, moda transportasi campuran). Setiap isian diberi label "angkamu" agar tidak tertukar dengan estimasi. Dikerjakan setelah AP-15. |

### Later — 2027 dan seterusnya

| ID | Pekerjaan | Rencana |
| --- | --- | --- |
| AP-11 | Perencanaan relokasi | Gabungkan pendapatan, profil rumah tangga, pilihan kota, biaya, dan surplus/defisit. Hasilnya bisa dibagikan lewat tautan. |
| AP-12 | Lapisan desil dan analisis kebijakan | Tambahkan desil BPS, daya beli daerah, dan sektor pekerjaan setelah data dasar bisa diandalkan. Jalur akuisisi median pengeluaran per kapita per kabupaten (mikrodata Susenas KOR, biaya, skema nol rupiah, dan blocker lisensi SPPD terhadap CC-BY-4.0) sudah dipetakan di [catatan akuisisi Susenas](docs/susenas-median-akuisisi-data.md); statusnya `Pending` dan belum ada dataset yang berubah. |
| AP-13 | Akses data terbuka | Sediakan API read-only dengan versi, skema publik, template kontribusi, dan rilis dataset berkala setelah pengelolaan versi serta moderasi berjalan baik. |
| AP-14 | Cakupan lintas negara | Di luar rencana tahun ini. Evaluasi setelah model Indonesia, pencatatan sumber, dan alur koreksi terbukti stabil. |

### Urutan eksekusi untuk satu maintainer

1. Rilis v0.4.0 dengan AP-15 dan AP-17 dari gelombang masukan Oktober, lalu umumkan tindak lanjutnya di kanal tempat masukan itu muncul.
2. Pastikan kanal kontribusi publik tetap berfungsi: pantau form Airtable dan Discussions, lalu operasionalkan antrean pemeriksaan (AP-04).
3. Kumpulkan bukti lokal untuk audit Meranti, Samosir, Bandung, biaya transportasi, dan kesehatan; catat keputusan per kasus (AP-05).
4. Setelah AP-04 berjalan, tindak lanjuti laporan sampai rilis dengan draft PR dan persetujuan manusia (AP-10) — file JSON berversi sudah ✅ (`public/data/v2026.1/` + catatan perubahan).
5. Pertahankan QA aksesibilitas dan kompatibilitas URL v2/v1; pekerjaan lanjutan berikutnya adalah edit struk (AP-16), lapisan komunitas (AP-08), dan kepatuhan/gaji aktual (AP-09).

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
| Median pengeluaran per kapita per kabupaten dari mikrodata Susenas Maret (KOR) sebagai pembanding independen untuk model estimasi | ❌ Jalur akuisisi, biaya, dan blocker lisensi tercatat di [catatan akuisisi Susenas](docs/susenas-median-akuisisi-data.md); verifikasi layout dan ketentuan SPPD belum dikerjakan |
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
| Ekspor CSV/PNG dengan sumber, asOf, dan catatan batasan | 🟡 Ekspor CSV untuk baki perbandingan ✅; ekspor PNG dan embed masih ❌ |
| Profil rumah tangga dengan pilihan awal yang divalidasi lewat Susenas | 🟡 kontrol jumlah anak & cicilan KPR ✅ (AP-03); hunian awal diubah ke rusun/kost dengan tabel sensitivitas ✅ ([catatan kalibrasi](docs/kalibrasi-default-2026-09.md)); validasi pilihan awal lewat Susenas masih ❌ |
| PWA yang bisa dipasang, menyimpan geometri dan data di cache, serta membuka kerangka aplikasi secara offline | ✅ Manifest + service worker menyimpan shell, geometri, dan dataset aktif; basemap eksternal tetap memerlukan jaringan |
| Data upah dan biaya hidup dari 2020 sampai sekarang, dengan penggeser tahun | ❌ |

### Komunitas dan pengelolaan proyek

| Pekerjaan | Status |
| --- | --- |
| Panduan dan pemeriksaan repo (CONTRIBUTING, CoC, template, CI) | ✅ |
| Koreksi publik dan antrean pemeriksaan | 🟡 Form, CTA, dan skema antrean ✅; operasi pemeriksaan masih ❌ (→ AP-04) |
| Tindak lanjut laporan sampai rilis beserta catatan perubahannya | 🟡 Ledger lokal + ringkasan status ✅; pengambilan antrean, draft PR, dan operasi rilis masih ❌ (→ AP-10) |
| Rilis data triwulanan dan halaman metode yang dibuat otomatis dari metadata | ❌ |
| API publik read-only dengan OpenAPI | ❌ (→ AP-13) |
| Evaluasi dampak lewat survei singkat dan analitik yang menjaga privasi | 🟡 Hitungan event agregat lokal ✅; survei dan analitik lintas pengguna ❌ |

### Tindak lanjut usulan komunitas

| Usulan | Klasifikasi |
| --- | --- |
| Isian pendapatan sendiri ("apakah gaji saya cukup di daerah X?") | ✅ Selesai (Sep 2026). Kolom "Pendapatan sendiri" mengubah rasio, warna peta, jendela detail, dan baki perbandingan. UMK tetap tampil sebagai pembanding. |
| Indeks kepatuhan UMK pemberi kerja per wilayah | Ditunda (→ AP-09). Data di tingkat kabupaten/kota nyaris belum ada. Mulai dengan label kualitatif bersumber; skor numerik belum bisa dipertanggungjawabkan. |
| Gaji pasangan yang berbeda | ✅ Selesai (Okt 2026), tampil di rilis berikutnya. Gaji pasangan bisa diisi sendiri saat "Pasangan ikut bekerja" aktif. |
| Opsi hunian tanpa sewa (rumah sendiri atau ikut orang tua) | Direncanakan v0.4.0 (→ AP-15). Biaya hunian Rp0; kontribusi ke orang tua bisa diisi sebagai tanggungan keluarga. |
| Kiriman bulanan ke orang tua / generasi sandwich | Direncanakan v0.4.0 (→ AP-15). |
| Transportasi mobil pribadi, jalan kaki, dan moda campuran | Mobil serta jalan kaki/sepeda di v0.4.0 (→ AP-15); moda campuran lewat edit struk (→ AP-16). |
| Struk yang bisa diubah dan disalin | Salin struk di v0.4.0 (→ AP-15); edit struk menyusul (→ AP-16). |
| Lebih dari dua penghasilan dan penghasilan borongan | Ditunda. Permintaan lebih dari dua penghasilan sebagian besar berupa candaan; kebutuhan seriusnya bisa ditampung kelak lewat isian penghasilan tambahan. |
| Desil | Ditunda (→ AP-12). Yang dimaksud warganet umumnya desil bansos (DTSEN), bukan desil pengeluaran BPS; labelnya harus dibedakan. |

---

## Masukan komunitas (gelombang Threads, 1 September 2026)

Catatan ini merangkum sekitar 300 interaksi tertulis saat rilis: 277 balasan,
1 mention, dan 35 kutipan postingan, dengan sekitar 301 interaksi relevan
setelah notifikasi disaring. Masukan dari audiens Threads dipakai untuk
menentukan arah, bukan sebagai survei yang mewakili seluruh pengguna.
Ringkasannya anonim, tanpa nama akun atau kutipan pribadi. Sebagian besar
tanggapan positif; warga di Sleman, Surakarta, dan Jawa Tengah ikut mengecek
kecocokan angka dengan kondisi setempat.

Dengan asumsi awal v0.1 pada dataset v2026.1, 2 wilayah masuk kategori Nyaman
(Comfortable), 95 Cukup (Manageable), 303 Ketat (Tight), dan 114 Tak Cukup
(Insufficient). Keluhan
"tidak ada yang hijau" muncul berulang. Kalibrasinya mungkin terlalu ketat,
atau kondisi upah dan biaya hidup memang berat. Penjelasan metode perlu lebih
mudah ditemukan (AP-01), bersama filter/urutan tingkat keterjangkauan yang
sudah tersedia (✅).

Pemeriksaan lanjutannya menemukan bahwa yang menggerakkan sebaran band bukan
datanya, melainkan pilihan awal: dengan hunian rusun/kost, sebarannya menjadi
27 Nyaman, 191 Cukup, 250 Ketat, dan 46 Tak Cukup pada dataset yang sama. Sejak
v0.2.0 hunian awal memakai rusun/kost dan panel metode menampilkan tabel
sensitivitasnya; band 120/100/80 tidak digeser. Lihat [catatan
kalibrasi](docs/kalibrasi-default-2026-09.md).

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

## Masukan komunitas (gelombang TikTok & Instagram, 11–12 Oktober 2026)

Video teaser Nafkah diunggah ke TikTok dan Instagram pada 11 Oktober 2026.
Sehari kemudian, video TikTok mendapat sekitar 12 ribu suka, 2,1 ribu
bagikan, dan 129 komentar; postingan Instagram mendapat sekitar 9,3 ribu suka
dan 84 komentar. Catatan ini merangkum 197 dari 213 komentar yang bisa dibaca
(115 komentar utama dan 82 balasan); sisanya disaring platform atau tidak
tampil. Seperti gelombang Threads, masukan ini dipakai untuk menentukan arah,
bukan sebagai survei yang mewakili seluruh pengguna. Ringkasannya anonim, tanpa
nama akun atau kutipan pribadi.

| Jenis komentar utama | Jumlah |
| --- | ---: |
| Pujian, termasuk konfirmasi bahwa hitungannya masuk akal | 28 |
| Permintaan fitur atau koreksi | 26 |
| Reaksi terhadap warna daerahnya ("merah semua", "ijo semua") | 17 |
| Pertanyaan atau kritik soal sumber data dan metode | 5 |
| Pertanyaan soal tools pembuatan (video, suara, library peta) | 5 |
| Kendala tampilan atau kemungkinan bug | 3 |
| Persepsi "dibuat AI" | 3 |
| Meminta pemerintah melihat data ini | 3 |
| Ingin ikut berkontribusi | 1 |
| Lainnya (mention, tautan, candaan) | 24 |

Target gelombang Threads, yaitu pertanyaan berulang soal estimasi, jumlah orang,
serta UMK dan gaji nyata turun 50%, belum bisa dibandingkan karena jumlah per
tema di gelombang Threads tidak dicatat. Di gelombang ini, 5 dari 115 komentar
utama (4%) mempertanyakan sumber data atau metode, tidak ada yang bertanya soal
jumlah orang, dan tidak ada yang mempertanyakan UMK sebagai patokan; dua
komentar setengah bercanda menanyakan penghasilan di bawah 1,5 juta. Angka ini
menjadi baseline gelombang berikutnya. Platform dan audiensnya berbeda, jadi
perbandingannya tetap kasar.

| Tema | Masukan | Tindak lanjut |
| --- | --- | --- |
| Hunian tanpa sewa | 6 komentar meminta opsi rumah sendiri atau tinggal bersama orang tua. Cicilan Rp0 belum bisa diisi, sehingga biaya hunian selalu terhitung. | AP-15: opsi hunian dengan biaya hunian Rp0 |
| Tanggungan keluarga | 3 komentar meminta kiriman bulanan ke orang tua atau kondisi generasi sandwich. Salah satunya permintaan dengan suka terbanyak (sekitar 100). | AP-15: isian tanggungan keluarga per bulan |
| Pengeluaran sendiri | 6 komentar menilai pos pengeluaran perlu bisa diatur: menambah pos rutin (listrik, air, iuran warga, SPP, UKT, kesehatan non-BPJS, pajak kendaraan) dan mematikan pos yang tidak relevan, misalnya baris pendidikan & kursus pada pasangan tanpa anak. Struk juga diminta bisa disalin. | AP-16: edit struk; salin struk di AP-15 |
| Transportasi | 4 komentar meminta mobil pribadi, jalan kaki, atau moda campuran (ojol, KRL/TransJakarta, dan kendaraan pribadi). | AP-15: mobil pribadi serta jalan kaki/sepeda; moda campuran lewat AP-16 |
| Penghasilan | Gaji pasangan yang berbeda, penghasilan borongan, lebih dari dua penghasilan (sebagian besar candaan), dan penghasilan di bawah 1,5 juta. | Gaji pasangan ✅ (rilis berikutnya); sisanya ditunda |
| Data dan metode | Data diminta mengikuti UMK dan inflasi terbaru (sekitar 50 suka). Pengguna menanyakan standar biaya hidup dan cara data dikumpulkan. Sewa dinilai 20–25% dari gaji, sementara satu komentar menilai hasilnya terlalu aman. | Pembaruan UMK 2027 dan IHK saat penetapan November–Desember; FAQ di AP-17; audit sewa kost kabupaten di AP-05 |
| Persepsi "dibuat AI" | Komentar terpopuler di TikTok (sekitar 350 suka) menilai font dan warnanya khas Claude. Sebagian balasan melompat ke keraguan atas validitas data. Kritik ini tidak muncul di Instagram, yang justru memuji tampilannya. | AP-17: bagian "Cara dibuat" di halaman Tentang, tanpa desain ulang |
| Tampilan dan bug | Tampilan ponsel dinilai kurang responsif (tanpa info perangkat), warna peta dilaporkan tidak berubah (perlu repro), dan slider gaji berhenti di 25 juta padahal kolom ketik menerima angka lebih besar. | AP-15: QA ponsel dan petunjuk gaji di atas 25 juta |
| Data lanjutan | Desil, garis kemiskinan Bank Dunia, harga per barang seperti Numbeo, dan pasangan yang tinggal berjauhan (LDM). Desil yang dimaksud umumnya desil bansos (DTSEN), bukan desil pengeluaran BPS. | AP-12 (label desil harus dibedakan), AP-08; LDM ditunda |
| Posisi dan komunitas | Komentar terpopuler di Instagram (sekitar 880 suka) membandingkan Nafkah dengan aplikasi buatan pemerintah. Beberapa komentar menandai Kemnaker dan DPR, dan satu orang ingin fork serta berkontribusi. | Jaga independensi dan provenance; issue `good first issue` menunggu persetujuan maintainer |

Satu komentar bisa masuk lebih dari satu tema.

### Keputusan 12 Oktober 2026

- Persepsi "dibuat AI" dijawab dengan transparansi lewat bagian "Cara dibuat" (AP-17). Desain Atlas tetap dipakai.
- v0.4.0 berfokus pada AP-15 dan AP-17. Edit struk (AP-16) menyusul setelahnya.
- Opsi hunian rumah sendiri atau ikut orang tua memakai biaya hunian Rp0. Kalau ada kontribusi ke orang tua, nilainya bisa diisi sebagai tanggungan keluarga.
- Balasan publik yang menjanjikan tindak lanjut (data terbaru, tanggungan keluarga, salin struk, koreksi sewa, tampilan ponsel, gaji pasangan, dan perbandingan dengan Numbeo) ditutup dengan pengumuman saat rilis.

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
