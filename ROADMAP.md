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

**❌ Belum (dirinci di Q1–Q4 + Action plan)**

- Data belum berversi JSON + validasi skema (Zod) — masih modul TypeScript.
- Basemap offline masih background polos — belum PMTiles self-hosted.
- Belum ada: halaman metodologi publik, share/embed via URL, ekspor CSV/PNG,
  PWA, time series, drill-down kecamatan.
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
| ❌ Data versioning & Zod schema | Pindah data dari modul TS ke JSON berversi (`/data/vYYYY/…`) + validasi Zod di CI. Prasyarat menerima koreksi komunitas — lihat **AP-02**. | `loadRecords()` baca JSON; skema tervalidasi otomatis |
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
| 🟡 Profil rumah tangga nyata | Preset berbasis data menggantikan multiplier abstrak (jumlah anak, cicilan — lihat **AP-03**) | Multiplier + tipe rumah tangga **✅**; preset tervalidasi Susenas **❌** |
| ❌ Sharing & embed | State di URL (region, pins, asumsi); mode embed `<iframe>` (lihat **AP-07**) | Link share membuka state identik |
| ❌ Ekspor | CSV/PNG dari baki & modal detail | Output menyertakan sumber + asOf + disclaimer |
| ✅ Bahasa Indonesia | UI berbahasa Indonesia (istilah wilayah ID) | Semua string UI berbahasa ID (single-locale; toggle i18n belum diperlukan) |
| ❌ PWA | Installable; cache geometry + data tahun berjalan; shell offline | Lulus Lighthouse PWA |

> **Sudah jalan lebih awal (di luar urutan Q3):** dark mode & filter legenda per
> band — keduanya diminta komunitas dan sudah tersedia di v0.1.

## Q4 (Bulan 10–12): Komunitas & keberlanjutan

Tujuan: data makin baik lewat kontribusi terstruktur; proyek punya tata kelola.

| Deliverable | Detail | Kriteria selesai |
| --- | --- | --- |
| ❌ Koreksi publik | Form "laporkan ketidaksesuaian" per region/kategori + antrean review (lihat **AP-04**) | Moderasi manual; koreksi masuk rilis data berikutnya dengan credit |
| ❌ API publik read-only | Endpoint JSON statis/versioned per region + dokumentasi OpenAPI | Dipakai ≥ 1 pihak eksternal |
| ❌ Rilis data triwulanan | Changelog per versi dataset; halaman metodologi auto dari metadata | 2 rilis terjadwal terbukti jalan |
| 🟡 Tata kelola repo | CONTRIBUTING, CoC, panduan multiplier/provenance; CI penuh | CONTRIBUTING/CI/LICENSE **✅**; Code of Conduct **❌**; PR eksternal pertama **❌** |
| ❌ Evaluasi dampak | Survei singkat + analytics privacy-respecting | Laporan evaluasi + keputusan tahun ke-2 |

---

## Triase usulan fitur (input komunitas)

| Usulan | Klasifikasi | Catatan |
| --- | --- | --- |
| Input pendapatan custom — "apakah gaji saya cukup di daerah X?" | ✅ **Selesai (September 2026)** — kontrol "Pendapatan sendiri" di panel asumsi; rasio, warna peta, modal detail & tabel perbandingan mengikuti; UMK daerah tetap jadi pembanding | Rasio keterjangkauan memang `wageBasisAmount ÷ totalMonthlyCost` — cukup tambah input gaji sebagai pembagi. Biaya rendah, dampak tinggi (kasus relokasi). |
| Indeks kepatuhan UMK pemberi kerja per wilayah | **Nice-to-have — eksplorasi jangka panjang** (kandidat Q4+, lihat **AP-09**) | Data nyaris tidak ada di level kab/kota (inspeksi Kemnaker tidak rutin per wilayah). Bentuk paling jujur: badge kualitatif bersumber (putusan PTUN/media), bukan skor numerik. Divalidasi kuat oleh masukan komunitas. |

---

## Masukan komunitas (gelombang viral Threads, 1 September 2026)

Intisari feedback publik saat rilis viral. **Jangkauan:** ribuan (post
di-like/reshare 6.000+); **dianalisis:** ~300 komentar tekstual (verifikasi
kedua: 277 replies, 1 mention, 35 quotes; setelah menyaring notifikasi tak
terkait ≈ 301 interaksi relevan). Ini sampel audiens Threads yang **directional,
bukan survei representatif**. Diringkas **anonim** — tanpa handle atau kutipan
personal; apresiasi disaring. Sentimen mayoritas positif; akurasi estimasi
divalidasi warga lokal di beberapa daerah (mis. Sleman, Surakarta, Jawa Tengah).

**Angka yang paling dibahas** — distribusi band pada asumsi default:
Comfortable **0** · Manageable **69** · Tight **302** · Insufficient **143**.
"Tidak ada yang hijau" jadi keluhan berulang → sinyal ganda: kalibrasi
band/asumsi mungkin terlalu ketat, atau kondisi memang suram. Keduanya menuntut
halaman metodologi yang terlihat + fitur filter/urut band.

| Tema | Sinyal dari komunitas | Ditindaklanjuti |
| --- | --- | --- |
| Realisme upah (UMK vs upah riil) | Kritik metodologis terkuat: UMKM menyerap ~90% tenaga kerja tapi banyak menggaji **di bawah** UMK; toko/kafe/warkop mentok ~3jt. "UMK bukan patokan nyata." | AP-01 (disclaimer), AP-09 (sinyal kepatuhan/gaji aktual) |
| Koreksi data (crowdsource) | "Angka nggak masuk akal" puluhan kali; "boleh submit data?". Contoh: Kep. Meranti, Samosir dinilai warga meleset. | AP-04 (form koreksi), AP-05 (audit wilayah) |
| Transparansi metodologi | Berulang: "estimasi dari mana?", "per kapita / untuk berapa orang?", "asumsi *leisure* beda tiap daerah?". Transport dinilai kurang tepat. | AP-01 (metodologi publik), AP-05 (audit transport) |
| Personalisasi | Minta jumlah anak, override cicilan/KPR (pendapatan sendiri **sudah ada** — isu *discoverability*). | AP-03 (personalisasi v1.1), AP-06 (discoverability) |
| Integrasi & use-case | "desil" berkali-kali (overlay BPS/DTKS); use-case relokasi kerja, riset daya beli, skripsi. | AP-07 (compare/relokasi), AP-12 (layer desil) |
| UX & jangkauan | Filter "tampilkan comfortable", dark mode, export/share, ekspansi negara lain. | Filter band & dark mode **✅ sudah ada**; AP-06, AP-07; ekspansi → AP-14 |

---

## Action plan berbasis feedback (Now / Next / Later)

**Keputusan produk:** pertahankan map-first, lalu urutkan investasi sebagai
**trust → personalisasi → kontribusi data → analitik lanjutan**. Feedback
memvalidasi kuat ide produk; risiko terbesar kini adalah **angka disalahpahami
atau dianggap terlalu presisi**. Owner default: maintainer repo. Effort S/M/L
indikatif, sesuaikan dengan kapasitas.

### Now — komitmen berikutnya

| ID | Inisiatif | Action konkret | Output / selesai | Prioritas |
| --- | --- | --- | --- | --- |
| AP-01 | Lapisan metodologi publik | Panel/tombol metodologi dekat map & modal detail. Jelaskan baseline 1 orang, komponen asumsi, arti band, dan bahwa **UMK = benchmark resmi, bukan gaji aktual**. | Tiap region tampil `source`/`asOf`/`confidence` + ringkasan asumsi; tidak ada label band tanpa penjelasan; disclaimer terlihat sebelum pengguna menyimpulkan. | P0 · S |
| AP-02 | Data versioning sebagai reliability gate | Pindahkan dataset ke JSON berversi + validasi skema **sebelum** menerima koreksi komunitas. Simpan jejak versi + changelog. (= item **Zod/versioning Q1** yang masih ❌.) | `loadRecords()` baca dataset terversi; CI menolak skema invalid; tiap perubahan tertelusur ke sumber, tanggal, alasan. | P0 · M |
| AP-03 | Personalisasi rumah tangga v1.1 | Perluas kontrol pendapatan sendiri/2-upah yang **sudah ada** dengan jumlah anak + override cicilan/KPR. Tampilkan profil aktif + reset ke baseline. | Perhitungan/peta/modal/baki mengikuti profil sama; unit test mencakup anak, cicilan, kombinasi pendapatan; UI tak menyamarkan hasil sebagai angka pasti. | P0 · M |
| AP-04 | Form koreksi publik per region | "Laporkan angka ini" per region/kategori. Minta nilai, periode, konteks, sumber → antrean review manual berlabel `community report`. | Laporan **tidak** mengubah dataset otomatis; ada status review, keputusan, provenance, credit pada rilis bila diterima. | P0 · M |
| AP-05 | Audit wilayah yang diperdebatkan | Audit terfokus: Kep. Meranti, Samosir, Bandung + komponen transport/logistik & kesehatan. Bandingkan sumber model vs laporan lokal. | Tiap kasus punya keputusan terdokumentasi: pertahankan / ubah / beri rentang / turunkan `confidence`. Satu komentar tak cukup mengubah angka. | P0 · S/M |
| AP-06 | Discoverability & regression UX | Uji ulang fitur yang sudah ada (Pendapatan sendiri, filter band, dark mode, legenda, link) di mobile & keyboard. Perjelas CTA + kontras/teks status. | Pengguna menemukan Pendapatan sendiri & paham legenda tanpa bantuan; tak ada regression a11y; event penggunaan utama tercatat tanpa data pribadi. | P1 · S |

### Next — setelah fondasi stabil

| ID | Inisiatif | Action konkret | Rekomendasi & dependensi |
| --- | --- | --- | --- |
| AP-07 | Compare & share untuk relokasi | Bandingkan gaji di Kota A dengan biaya hidup di Kota B (gaji custom, multi-region, state di URL). | Dahulukan sebelum embed penuh. Bergantung pada state kalkulasi stabil + AP-02 agar link lama tetap terbaca. |
| AP-08 | Community data layer | Survei ringan per kategori biaya; tampilkan median/rentang komunitas **terpisah** dari estimasi utama. | Jangan campur opini/anekdot dengan data resmi; tampilkan ukuran sampel, periode, confidence, aturan moderasi. |
| AP-09 | Sinyal kepatuhan UMK / gaji aktual | Kumpulkan sumber yang dapat dipertanggungjawabkan; mulai dari badge kualitatif bersumber, bukan skor numerik. | Jangan ganti UMK dengan "gaji nyata" tanpa coverage & metodologi kuat. Butuh sumber eksternal + review hukum/metodologi. |
| AP-10 | Feedback-to-release loop | Setelah AP-04 jalan, terbitkan changelog: laporan diterima/ditolak/ditinjau; bagikan transparan di Threads. | Tujuan: bangun kepercayaan & dorong laporan berkualitas, bukan kejar volume komentar. |

### Later — taruhan strategis

| ID | Inisiatif | Arah |
| --- | --- | --- |
| AP-11 | Relocation planner | Gabungkan pendapatan, profil rumah tangga, pilihan kota, biaya, surplus/defisit, dan link hasil yang dapat dibagikan. |
| AP-12 | Layer desil & analitik kebijakan | Overlay desil BPS, daya beli regional, sektor pekerjaan, indikator kebijakan — setelah data dasar cukup kuat. |
| AP-13 | Ekosistem open data | API read-only, schema publik, template kontribusi, rilis dataset berkala — setelah pipeline versioning & moderasi matang. |
| AP-14 | Ekspansi lintas negara | Di luar cakupan tahun ini; evaluasi hanya setelah model Indonesia, provenance, & workflow koreksi terbukti stabil. |

### Urutan eksekusi untuk satu maintainer

1. **Sprint 1** — metodologi terlihat (AP-01), copy/disclaimer, audit discoverability (AP-06).
2. **Sprint 2** — data versioning/schema gate (AP-02) + audit kasus Meranti/Samosir/Bandung/transport/kesehatan (AP-05).
3. **Sprint 3** — form koreksi publik + antrean review + changelog (AP-04, AP-10).
4. **Sprint 4** — jumlah anak/cicilan (AP-03), regression test kalkulasi, lalu mulai compare/share (AP-07).

### Metrik validasi feedback

- 100% region-detail menampilkan sumber, periode, confidence, dan asumsi yang terlihat.
- Target: pertanyaan berulang soal "estimasi", "per orang", "UMK vs gaji nyata" turun 50% pada gelombang feedback berikutnya.
- Ukur funnel `open region → ubah asumsi → compare/share → laporkan angka` untuk tahu fitur yang benar-benar dipakai.
- Review laporan komunitas maks 7 hari kerja; ukur rasio laporan actionable, bukan sekadar jumlah.
- Tidak ada isu kontras/keyboard kritis baru setelah perubahan UX.

### Trade-off yang disepakati

- Form koreksi memperbaiki kualitas data tapi menambah beban moderasi → mulai dengan antrean manual + beberapa kategori utama.
- Personalisasi menaikkan relevansi tapi berisiko *false precision* → selalu tampilkan asumsi, gunakan rentang bila data tidak pasti.
- Data gaji aktual sangat bernilai tapi dependensinya paling berat → jangan jadikan blocker untuk metodologi, koreksi data, dan personalisasi.

---

## Matriks prioritas (jika sumber daya menyempit)

Urutan potong jika terpaksa: PWA → embed → koreksi publik → kecamatan drill-down.
Yang **tidak boleh** dipotong: pipeline data resmi (Q1), unit test kalkulasi
(✅ sudah), aksesibilitas keyboard & legenda numerik (✅ sudah), disclaimer
berbasis provenance (AP-01).

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
