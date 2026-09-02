# Nafkah — Roadmap

**Visi:** referensi publik yang kredibel untuk pertanyaan *"apakah UMK daerah
ini cukup untuk hidup layak di sana?"* — dari prototipe peta choropleth berbasis
estimasi menjadi platform berbasis data terverifikasi.

**Prinsip (tidak bisa ditawar):**

1. **Data sebelum fitur** — tak ada fitur visual baru yang mendahului kualitas &
   provenance data di baliknya.
2. **Map-first** — peta tetap kanvas utama; fitur lain mendukung.
3. **Aksesibilitas & offline** — jalan di koneksi lambat, terbaca screen reader.
4. **Setiap angka punya `source`, `asOf`, `confidence`.** Tanpa pengecualian.

Legenda: ✅ selesai · 🟡 sebagian · ❌ belum.

**Urutan investasi:** trust → personalisasi → kontribusi data → analitik. Risiko
terbesar: **angka disalahpahami / dianggap terlalu presisi.** Semua rilis lawan
itu dulu. Owner default: maintainer repo. Effort S/M/L indikatif.

---

## Status v0.1 (per 2 September 2026)

**✅ Sudah jalan**

- Peta choropleth **514 kab/kota**, band keterjangkauan + arsir no-data, palet
  colorblind-aware; basemap Terang/Gelap/Satelit + Offline; dark mode; pencarian;
  legenda numerik + filter per band.
- Panel asumsi lengkap (rumah tangga, gaya hidup, hunian, transport, tabungan,
  basis upah) + **Pendapatan sendiri** & opsi **2 upah**.
- Baki perbandingan (maks 5) + breakdown per kategori; modal detail dengan
  provenance per sel.
- Aksesibilitas keyboard + `aria` + kontras AA.
- Data: 514 upah `official` 2026, 514×10 biaya `estimate`, provenance jujur.
- **Governance:** unit test kalkulasi (vitest) + **gate integritas data (Zod)**,
  CI (typecheck/test/build), dual license, CONTRIBUTING, **Code of Conduct**,
  **issue/PR templates**, SEO (robots/sitemap/OpenGraph).

**❌ Belum**

- Data masih modul TypeScript — belum dipecah ke **JSON fisik berversi**
  (`/data/vYYYY/…`); skema Zod sudah memvalidasinya di CI (lihat **AP-02**).
- Basemap offline masih background polos — belum PMTiles self-hosted.
- Belum ada: share/embed via URL, ekspor CSV/PNG, PWA, time series, drill-down
  kecamatan, form koreksi publik aktif, API publik, E2E Playwright, Lighthouse CI.

---

## Sebelum go public — checklist pre-OSS

Gerbang sebelum repo di-flip publik. Sisi teknis sudah tuntas; sisa aksi manual
maintainer.

| Item | Status |
| --- | --- |
| Dual license (MIT code + CC-BY-4.0 data) | ✅ |
| CONTRIBUTING + CI (typecheck/test/build) | ✅ |
| **Code of Conduct** (Contributor Covenant 2.1) | ✅ |
| **Issue/PR templates + routing Discussions** (`.github/`) | ✅ |
| **Reliability gate:** skema Zod + validasi 514×3 di CI | ✅ (AP-02 sebagian) |
| **Metodologi terlihat + disclaimer "UMK = patokan, bukan gaji nyata"** | ✅ (AP-01) |
| File scratch/PII (screenshot, feedback dump, log) di-`gitignore` | ✅ |
| **Push repo ke GitHub + aktifkan Discussions** | ❌ manual |
| **Buat Airtable form + tempel link** di `config.yml` & situs | ❌ manual (lihat [`docs/feedback-channels.md`](docs/feedback-channels.md)) |
| `SECURITY.md` (opsional — situs static, attack surface nol) | ❌ opsional |

> Setelah publik: item **AP-02 (JSON fisik berversi)** dan **AP-04 (form koreksi)**
> jadi prasyarat menerima koreksi komunitas dengan aman.

---

## Now / Next / Later

**Kanal feedback (keputusan 2 Sep 2026):** koreksi data publik → **Airtable form**
(non-dev, tanpa login); saran fitur/bug teknis → **GitHub Discussions**; **tidak**
self-host (situs tetap static-assets-only). Ingestion lewat agent terjadwal, bukan
endpoint web. Setup: [`docs/feedback-channels.md`](docs/feedback-channels.md).

### Now — komitmen berikutnya

| ID | Inisiatif | Action konkret | Status | Prioritas |
| --- | --- | --- | --- | --- |
| AP-01 | Metodologi publik + disclaimer | Panel metodologi dekat map & modal detail; baseline 1 orang, arti band, **UMK = benchmark resmi bukan gaji aktual**. | 🟡 core ✅ (disclaimer di panel Tentang + modal; provenance `source`/`asOf`/`confidence` tampil). Sisa: analytics event (→ AP-06). | P0 · S |
| AP-02 | Data versioning sbg reliability gate | Skema Zod + CI menolak data invalid **sebelum** menerima koreksi komunitas. Lalu pecah dataset ke JSON fisik berversi + changelog. | 🟡 gate Zod ✅ (`src/data/schema.ts` + `dataset.test.ts`, `DATASET_VERSION`). ❌ migrasi TS→JSON fisik `/data/vYYYY/`. | P0 · M |
| AP-03 | Personalisasi rumah tangga v1.1 | Perluas kontrol pendapatan/2-upah yang **sudah ada** dengan jumlah anak + override cicilan/KPR; tampilkan profil aktif + reset. | ❌ (multiplier + tipe rumah tangga ✅). Unit test wajib mencakup anak/cicilan. | P0 · M |
| AP-04 | Form koreksi publik per region | Airtable form → base ("Laporkan angka ini"): wilayah, kategori, nilai lama/usulan, periode, jenis bukti, sumber, kontak opsional → antrean review manual (`Status=New`). **Tidak** auto-ubah dataset. | ❌ (skema di [`docs/feedback-channels.md`](docs/feedback-channels.md); templates GitHub ✅). | P0 · M |
| AP-05 | Audit wilayah yang diperdebatkan | Audit terfokus: Kep. Meranti, Samosir, Bandung + transport/logistik & kesehatan. Bandingkan model vs laporan lokal. Keputusan terdokumentasi per kasus. | ❌ | P0 · S/M |
| AP-06 | Discoverability & regression UX | Uji ulang fitur (Pendapatan sendiri, filter band, dark mode, legenda) di mobile & keyboard; perjelas CTA; event penggunaan tanpa PII. | ❌ | P1 · S |

### Next — setelah fondasi stabil

| ID | Inisiatif | Arah & dependensi |
| --- | --- | --- |
| AP-07 | Compare & share untuk relokasi | Gaji di Kota A vs biaya hidup di Kota B (gaji custom, multi-region, state di URL). Dahulukan sebelum embed penuh; butuh AP-02 agar link lama tetap terbaca. |
| AP-08 | Community data layer | Survei ringan per kategori; tampilkan median/rentang komunitas **terpisah** dari estimasi utama (ukuran sampel, periode, confidence, aturan moderasi). |
| AP-09 | Sinyal kepatuhan UMK / gaji aktual | Mulai dari badge kualitatif bersumber (putusan/berita), **bukan** skor numerik. Jangan ganti UMK dengan "gaji nyata" tanpa coverage & metodologi kuat. Butuh review hukum/metodologi. |
| AP-10 | Feedback-to-release loop | Setelah AP-04 jalan: changelog laporan diterima/ditolak/ditinjau. Ingestion = scheduled agent tarik `Status=New` (Airtable read-only PAT) + Discussions baru; cadence harian-noop saat viral → mingguan; agent **draft PR** saja, manusia approve. |

### Later — taruhan strategis

| ID | Inisiatif | Arah |
| --- | --- | --- |
| AP-11 | Relocation planner | Gabung pendapatan, profil rumah tangga, pilihan kota, biaya, surplus/defisit, link hasil. |
| AP-12 | Layer desil & analitik kebijakan | Overlay desil BPS, daya beli regional, sektor pekerjaan — setelah data dasar kuat. |
| AP-13 | Ekosistem open data | API read-only versioned, schema publik, template kontribusi, rilis dataset berkala — setelah versioning & moderasi matang. |
| AP-14 | Ekspansi lintas negara | Di luar cakupan tahun ini; evaluasi hanya setelah model Indonesia, provenance & workflow koreksi terbukti stabil. |

### Urutan eksekusi untuk satu maintainer

1. **Publish** — tuntaskan checklist pre-OSS manual (push, Discussions, Airtable form).
2. **Trust** — metodologi/disclaimer (AP-01 ✅ core) + audit Meranti/Samosir/Bandung/transport/kesehatan (AP-05).
3. **Kontribusi** — form koreksi + antrean review + changelog (AP-04, AP-10), lalu JSON fisik berversi (sisa AP-02).
4. **Personalisasi** — jumlah anak/cicilan (AP-03) + regression test, lalu mulai compare/share (AP-07).

---

## Backlog tematik

Deliverable jangka menengah, dikelompokkan per track (bukan kuartal kalender —
ini proyek eksperimen satu maintainer). Referensi ke AP-xx bila sudah tercakup.

### Data & integritas

| Deliverable | Status |
| --- | --- |
| Integritas 514 wilayah otonom (validasi kode vs Kepmendagri 100.1.1-6117; buang 8 poligon air/hutan `.88`/`.99`) | ✅ |
| Anti-halusinasi & provenance honesty (eliminasi survei fiktif; label `estimate` untuk model) | ✅ |
| Pipeline UMK resmi (UMP/UMK 2026 dari SK/Kepgub + rekap 38 provinsi) | ✅ |
| Validasi frontier/non-IHK (kalibrasi Papua/kepulauan via Susenas + logistik perintis) | ✅ |
| Uji perhitungan + **gate integritas data (Zod di CI)** | ✅ |
| Pipeline biaya hidup naik ke sumber primer/`official` (BPS SBH hanya di kota sampel) | 🟡 |
| **Data versioning JSON fisik** `/data/vYYYY/` + changelog | ❌ (→ AP-02) |

### Peta & cakupan

| Deliverable | Status |
| --- | --- |
| Cakupan 514 kab/kota terwarna (fallback multiplier provinsi & frontier) | ✅ |
| Aksesibilitas (keyboard, legenda numerik, hatch no-data, kontras AA) | 🟡 audit axe terdokumentasi ❌ |
| Kinerja (bundle JS **104 KB** ✅; laporan Lighthouse CI di repo ❌) | 🟡 |
| Basemap offline PMTiles self-hosted (< 150 MB) | ❌ |
| Geometri kecamatan (adm3) drill-down 10 kota metro | ❌ |
| E2E Playwright (keyboard, baki pin maks 5, recolor asumsi) | ❌ |

### Analitik & kegunaan

| Deliverable | Status |
| --- | --- |
| Bahasa Indonesia (single-locale; toggle i18n belum perlu) | ✅ |
| Dark mode & filter legenda per band (diminta komunitas, sudah ada di v0.1) | ✅ |
| Sharing & embed (state di URL; mode `<iframe>`) | ❌ (→ AP-07) |
| Ekspor CSV/PNG (sertakan sumber + asOf + disclaimer) | ❌ |
| Profil rumah tangga nyata (preset tervalidasi Susenas) | 🟡 (→ AP-03) |
| PWA (installable, cache geometry+data, shell offline) | ❌ |
| Time series UMK & biaya 2020–kini (slider tahun) | ❌ |

### Komunitas & keberlanjutan

| Deliverable | Status |
| --- | --- |
| Tata kelola repo (CONTRIBUTING, CoC, templates, CI) | ✅ |
| Koreksi publik + antrean review | ❌ (→ AP-04) |
| Feedback-to-release loop + changelog | ❌ (→ AP-10) |
| Rilis data triwulanan + halaman metodologi auto dari metadata | ❌ |
| API publik read-only + OpenAPI | ❌ (→ AP-13) |
| Evaluasi dampak (survei singkat + analytics privacy-respecting) | ❌ |

### Triase usulan komunitas

| Usulan | Klasifikasi |
| --- | --- |
| Input pendapatan custom ("apakah gaji saya cukup di daerah X?") | ✅ **Selesai (Sep 2026)** — kontrol "Pendapatan sendiri"; rasio, warna peta, modal & baki mengikuti; UMK tetap jadi pembanding. |
| Indeks kepatuhan UMK pemberi kerja per wilayah | **Later** (→ AP-09). Data nyaris nihil di level kab/kota; bentuk paling jujur = badge kualitatif bersumber, bukan skor numerik. |

---

## Masukan komunitas (gelombang Threads, 1 September 2026)

Intisari feedback publik saat rilis. **Dianalisis:** ~300 interaksi tekstual
(277 replies, 1 mention, 35 quotes; ≈301 relevan setelah menyaring notifikasi).
Sampel audiens Threads yang **directional, bukan survei representatif.** Diringkas
**anonim** (tanpa handle/kutipan personal). Sentimen mayoritas positif; akurasi
divalidasi warga lokal di beberapa daerah (Sleman, Surakarta, Jateng).

**Distribusi band pada asumsi default:** Comfortable **0** · Manageable **69** ·
Tight **302** · Insufficient **143**. "Tidak ada yang hijau" jadi keluhan berulang
→ sinyal ganda: kalibrasi mungkin terlalu ketat, atau kondisi memang suram.
Keduanya menuntut metodologi terlihat (AP-01) + filter/urut band (✅ ada).

| Tema | Sinyal | Ditindaklanjuti |
| --- | --- | --- |
| Realisme upah (UMK vs riil) | Kritik terkuat: UMKM serap ~90% tenaga kerja tapi banyak gaji **di bawah** UMK; "UMK bukan patokan nyata". | AP-01 (disclaimer ✅), AP-09 |
| Koreksi data (crowdsource) | "Angka nggak masuk akal" berulang; "boleh submit data?". Contoh: Kep. Meranti, Samosir. | AP-04, AP-05 |
| Transparansi metodologi | "Estimasi dari mana?", "per kapita / berapa orang?". Transport dinilai kurang tepat. | AP-01, AP-05 |
| Personalisasi | Minta jumlah anak, override cicilan/KPR (pendapatan sendiri **sudah ada** — isu discoverability). | AP-03, AP-06 |
| Integrasi & use-case | "desil" (overlay BPS/DTKS); relokasi kerja, riset daya beli, skripsi. | AP-07, AP-12 |
| UX & jangkauan | Filter "tampilkan comfortable", dark mode, export/share, ekspansi negara. | Filter & dark mode ✅; AP-06, AP-07; ekspansi → AP-14 |

### Metrik validasi feedback

- 100% region-detail menampilkan sumber, periode, confidence, asumsi terlihat.
- Target: pertanyaan berulang "estimasi/per orang/UMK vs gaji nyata" turun 50% di gelombang berikutnya.
- Ukur funnel `open region → ubah asumsi → compare/share → laporkan angka`.
- Review laporan komunitas maks 7 hari kerja; ukur rasio actionable, bukan volume.

### Trade-off yang disepakati

- Form koreksi menaikkan kualitas data tapi menambah beban moderasi → mulai antrean manual + kategori utama.
- Personalisasi menaikkan relevansi tapi berisiko *false precision* → selalu tampilkan asumsi, pakai rentang bila tak pasti.
- Gaji aktual sangat bernilai tapi dependensinya paling berat → jangan jadikan blocker untuk metodologi/koreksi/personalisasi.

---

## Prioritas, dependensi & metrik

**Urutan potong (jika sumber daya menyempit):** PWA → embed → koreksi publik →
kecamatan drill-down. **Tidak boleh dipotong:** pipeline data resmi, unit test +
gate integritas (✅), aksesibilitas keyboard & legenda numerik (✅), disclaimer
berbasis provenance (AP-01 ✅).

**Dependensi eksternal & risiko:**

- Rilis UMK tahunan (Nov–Des) → jadwalkan rilis data mengikuti.
- Data biaya BPS rilis dengan jeda 6–18 bulan → `asOf` wajib jujur, jangan dipaksa "terbaru".
- Geometri HDX COD-AB diperbarui periodik → pin versi topology per rilis dataset.
- Lisensi atribusi OSM/CARTO/Esri/Protomaps berbeda → audit sebelum mode embed dibuka.

**Metrik keberhasilan tahunan:**

1. ≥ 90% region ber-`confidence` official/estimate untuk wage **dan** cost.
2. Koreksi publik terverifikasi < 5% dari total field (proxy keakuratan).
3. NPS/kepuasan ≥ 40 dari survei pengguna akhir.
4. 0 isu aksesibilitas level A/AA terbuka > 30 hari.
