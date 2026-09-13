# Akuisisi data median pengeluaran Susenas (13 September 2026)

Catatan ini memetakan jalur untuk mendapatkan **median pengeluaran per kapita
per kabupaten/kota** dari mikrodata BPS. Statusnya riset jalur akuisisi, bukan
keputusan mengubah dataset. Tidak ada angka `costs.json` yang berubah karena
catatan ini.

Motifnya aturan pengembangan #1 di [ROADMAP](../ROADMAP.md): periksa kualitas
dan asal data sebelum menambah fitur yang memakainya. Seluruh 514×10 nilai
biaya saat ini berlabel `confidence: "estimate"` dan bersumber dari model.
Angka survei bersampel akan menjadi pembanding independen pertama untuk model
itu, sekaligus prasyarat untuk AP-12 (lapisan desil dan analisis kebijakan).

## 1. Yang tidak ada, dan kenapa

Median **pendapatan** rumah tangga per provinsi atau kabupaten tidak ada di
Indonesia, dan tidak akan ada dalam waktu dekat. Bukan karena belum
dipublikasikan, tapi karena tidak dikumpulkan.

- Susenas mengukur pengeluaran, bukan pendapatan. Deputi Bidang Statistik
  Sosial BPS, 25 Agustus 2026: "sampai sekarang kan kita tidak punya data
  pendapatan." Alasan yang disebut: lebih dari 50 persen pekerja di sektor
  informal, dan responden cenderung mengecilkan penghasilan.
- Kepala BPS, 29 Mei 2026: negara berkembang memakai pendekatan pengeluaran
  karena data administrasi pendapatan belum memadai.
- Variabel pendapatan lapor-sendiri di Susenas lama dinilai tidak cukup akurat,
  dan aksesnya tidak dibuka (JEPI 19(2), 2019).

Konsekuensi untuk Nafkah: kalau angka ini nanti tampil di aplikasi, labelnya
**pengeluaran**, tidak boleh ditulis atau diparafrase sebagai pendapatan atau
penghasilan. Keduanya bukan hal yang sama dan selisihnya tidak diketahui.

Dua koreksi metodologis yang perlu ikut dicatat:

1. **Per kapita, bukan per rumah tangga.** Ukuran rumah tangga berbeda antar
   wilayah (rata-rata anggota rumah tangga miskin nasional 4,71 orang per
   Susenas September 2024), jadi median per rumah tangga tidak comparable
   antar kabupaten. Ini juga berarti angkanya tidak bisa langsung diadu dengan
   UMK, yang satuannya per pekerja.
2. **Pengeluaran Susenas adalah konsumsi, termasuk nilai bantuan dan subsidi**,
   bukan uang keluar dari kantong (JEPI 19(2), 2019). Untuk rumah tangga
   penerima banyak bansos, angkanya melebihkan daya beli mandiri.

## 2. Sumber yang tersedia

Harga dan level penyajian di bawah diambil dari katalog Silastik yang diperiksa
13 September 2026. Verifikasi ulang sebelum transaksi; katalog berubah per
gelombang.

| Sumber | Level terendah | Unit | Akses | Biaya |
| --- | --- | --- | --- | ---: |
| World Bank PIP (`pip.worldbank.org`) | Nasional | Median konsumsi per kapita per hari, PPP 2021 | Terbuka | Rp0 |
| Susenas Maret KOR (mikrodata) | **Kabupaten/kota** | Rumah tangga + anggota, blok pengeluaran ringkas | Silastik, SPPD | Rp24.077.601 (edisi Maret 2025, 1,12 GB, `.DBF`) |
| Susenas Modul Konsumsi & Pengeluaran | Provinsi | Rincian item konsumsi | Silastik, SPPD | Rp25.701.740 (edisi September 2022, 1,2 GB) |
| Sakernas (mikrodata) | Cek per gelombang | Upah individu penerima upah | Silastik, SPPD | Cek katalog |
| Tabel agregat BPS | Provinsi | Distribusi golongan pengeluaran, Gini | Terbuka | Rp0 |

Catatan per sumber:

- **PIP** adalah satu-satunya median siap pakai, dan hanya tingkat nasional.
  Dihitung dari Susenas juga, jadi konsisten secara konsep dengan jalur
  mikrodata. Ambil nilainya langsung dari sumber saat dipakai; jangan menyalin
  angka dari catatan ini.
- **Susenas Maret KOR** adalah satu-satunya jalur ke level kabupaten. Modul
  Konsumsi lebih rinci tapi penyajiannya berhenti di provinsi, jadi tidak
  relevan untuk peta 514 wilayah. Jangan tertukar saat membeli.
- **Sakernas** mengukur upah, bukan pengeluaran, dan cakupannya hanya
  buruh/karyawan/pegawai plus pekerja bebas. Wirausaha dan petani tidak masuk.
  BPS hanya menerbitkan rata-rata (Februari 2026: Rp3,29 juta untuk
  buruh/karyawan/pegawai, Rp2,97 juta bila digabung pekerja bebas), bukan
  median. Berguna sebagai pembanding upah, bukan sebagai ukuran kesejahteraan
  penduduk.
- **Jangan pakai "pengeluaran riil per kapita disesuaikan"** dari rilis IPM
  (2025: Rp12.802.000 per tahun, setara Rp1.066.833 per bulan) sebagai
  pengganti median. Itu rata-rata, pada harga konstan 2012, dengan wilayah
  rujukan Jakarta Selatan. Bukan median, dan bukan rupiah nominal daerah.

### Jalur murah tanpa mikrodata

Kalau pembelian belum layak, median bisa didekati dari tabel gratis:

- Interpolasi dari distribusi penduduk menurut golongan pengeluaran (grouped
  data). Paling dekat ke median sebenarnya di antara opsi gratis.
- Asumsi lognormal dari mean dan Gini: `median ≈ mean × exp(−σ²/2)` dengan
  `σ = √2 · Φ⁻¹((G+1)/2)`. Pada Gini 0,38, mediannya sekitar 78 persen dari
  mean. Asumsi lognormalnya kuat dan tidak gratis secara metodologis.

Keduanya hanya layak sebagai orientasi besaran internal, tidak untuk
ditampilkan sebagai angka berprovenance.

## 3. Urutan akuisisi

**Langkah 0 sebelum keluar uang.** Halaman detail mikrodata di Silastik
menyediakan "Contoh Data, Layout, Kuesioner" secara gratis. Buka layout dan
kuesioner Susenas Maret KOR lebih dulu, lalu pastikan:

- ada variabel pengeluaran (blok ringkas) di level rumah tangga;
- ada variabel penimbang (bobot) rumah tangga dan/atau anggota;
- ada jumlah anggota rumah tangga untuk konversi ke per kapita;
- kode wilayah kabupaten tersedia dan bisa dipetakan ke kode 2 digit titik 2
  digit yang dipakai dataset (`"12.75"`).

Kalau salah satu tidak ada, jalur ini gugur sebelum transaksi. Jangan membeli
berdasarkan asumsi isi file.

**Langkah 1: coba skema nol rupiah dulu.** BPS punya tarif Rp0,00 untuk pihak
tertentu (Peraturan BPS No. 2 Tahun 2019), antara lain instansi pemerintah dan
peneliti dengan surat permintaan dari universitas. Selisihnya Rp24 juta, jadi
ini dicoba lebih dulu, bukan belakangan. Kalau tidak memenuhi syarat,
kolaborasi dengan pihak yang memenuhi syarat lebih murah daripada membeli
sendiri.

**Langkah 2: transaksi berbayar** kalau jalur nol rupiah tertutup. Tarifnya
mengacu PP No. 13 Tahun 2024 tentang PNBP BPS. Prasyaratnya: abstraksi
penggunaan data, surat permintaan data, dan tanda tangan Surat Perjanjian
Penggunaan Data (SPPD). Alur di Silastik: Transaksi Baru → Pembelian Data →
katalog Data Mikro → keranjang → e-billing → unggah bukti bayar dan SPPD.

### Draf abstraksi

Siap tempel, sesuaikan sebelum dikirim:

> Penelitian ini menghitung median pengeluaran per kapita per bulan pada
> tingkat kabupaten/kota dari mikrodata Susenas Maret (KOR) menggunakan
> variabel penimbang resmi. Hasilnya dipakai sebagai pembanding independen
> terhadap model estimasi biaya hidup pada proyek Nafkah
> (nafkah.adenaufal.com), sebuah aplikasi peta terbuka yang membandingkan upah
> minimum dengan perkiraan biaya hidup di 514 kabupaten/kota. Keluaran yang
> dipublikasikan berupa satu nilai agregat per kabupaten/kota beserta ukuran
> ketelitiannya; tidak ada record individu, rumah tangga, atau identitas
> responden yang disimpan, ditampilkan, maupun didistribusikan ulang.

## 4. Pipeline setelah data ada

Perhitungannya ringan; yang mahal aksesnya.

1. Baca `.DBF` (Python `simpledbf`/`dbfread`, atau R `foreign`). Ukuran 1,12 GB
   masih muat di memori mesin biasa, tapi baca per blok kalau perlu.
2. Hitung pengeluaran per kapita per rumah tangga: total pengeluaran rumah
   tangga sebulan dibagi jumlah anggota rumah tangga.
3. Hitung **weighted median** per kode kabupaten dengan variabel penimbang.
   Median tak berbobot salah, karena Susenas tidak self-weighting.
4. Laporkan ukuran sampel dan RSE per kabupaten. Kabupaten dengan sampel kecil
   tidak layak ditampilkan; tentukan ambangnya sebelum melihat hasil, bukan
   sesudah.
5. Keluarkan 514 baris. Join memakai kode wilayah, bukan nama, konsisten dengan
   `src/lib/types.ts`.

### Bentuk record yang diusulkan

Mengikuti `Provenance` yang sudah ada:

```jsonc
{
  "regionCode": "12.75",
  "medianExpenditurePerCapitaMonthly": 0,
  "sampleSize": 0,
  "relativeStandardError": 0,
  "source": "BPS, Susenas Maret <tahun> (KOR), mikrodata, olahan sendiri",
  "asOf": "<tanggal referensi survei>",
  "confidence": "sample"
}
```

`confidence: "sample"` adalah label yang tepat di enum saat ini: hasil survei
bersampel, bukan penetapan resmi (`official`) dan bukan keluaran model
(`estimate`). Ini keputusan yang perlu disetujui maintainer sebelum
implementasi, karena `sample` belum pernah dipakai di dataset yang di-ship.

### Perbandingan antar wilayah

Median nominal antar kabupaten tidak langsung comparable karena harga berbeda.
Untuk perbandingan lintas wilayah, deflasikan dengan garis kemiskinan
kabupaten/kota (BPS menerbitkannya per wilayah) atau indeks harga yang sesuai.
Untuk perbandingan dengan UMK di wilayah yang sama, pakai nominal apa adanya.

## 5. Batasan yang wajib ikut ditampilkan

Kalau angka ini masuk UI, empat kalimat berikut ikut, bukan opsional:

- Ini pengeluaran, bukan pendapatan.
- Ini per kapita, bukan per rumah tangga, dan bukan gaji per pekerja.
- Nilai konsumsi termasuk bantuan dan subsidi yang diterima rumah tangga.
- Blok pengeluaran di KOR lebih ringkas daripada Modul Konsumsi, jadi
  rinciannya lebih kasar daripada angka konsumsi resmi tingkat provinsi.

## 6. Blocker lisensi

Ini yang perlu diselesaikan sebelum satu angka pun di-commit.

Mikrodata BPS didapat dengan menandatangani SPPD. Repo ini melisensikan seluruh
data dengan CC-BY-4.0 ([LICENSE-DATA.md](../LICENSE-DATA.md)), yang mengizinkan
redistribusi dan penggunaan komersial oleh siapa pun. Sebelum menerbitkan
agregat turunan Susenas di bawah lisensi itu, isi SPPD harus dibaca dan
kalau perlu dikonfirmasi ke BPS: apakah agregat per kabupaten hasil olahan
boleh diredistribusi bebas, dan atribusi seperti apa yang diwajibkan.

Ini urusan hukum, bukan teknis, dan tidak bisa diselesaikan dengan menulis kode
lebih dulu. Kalau jawabannya membatasi redistribusi, opsinya menampilkan angka
tanpa memasukkannya ke dataset CC-BY, atau membatalkan jalur ini.

## 7. Keputusan sementara

`Pending`. Tidak ada perubahan dataset. Urutan yang aman untuk satu maintainer:

1. Verifikasi layout dan kuesioner KOR di Silastik (gratis, satu sore).
2. Klarifikasi ketentuan redistribusi SPPD terhadap CC-BY-4.0 (gratis, jalur
   konsultasi Silastik).
3. Cek kelayakan skema nol rupiah.
4. Baru pertimbangkan pembelian.

Langkah 1 dan 2 tidak berbiaya dan bisa menggugurkan seluruh jalur ini. Kerjakan
keduanya sebelum menganggarkan apa pun.

## Rujukan

- Metro TV, 25 Agustus 2026, "BPS Ungkap Penyebab DTSEN Tidak Gunakan Pendapatan
  dan Perubahan Desil".
- CNN Indonesia, 29 Mei 2026, "BPS Ungkap Alasan RI Pakai Data Pengeluaran Buat
  Ukur Kemiskinan".
- Johar, Soewondo, dkk., "Tahukah kamu?: Analisis Set Data Susenas", *Jurnal
  Ekonomi dan Pembangunan Indonesia* 19(2), 2019.
- Kompas.id, 4 Mei 2025, "BPS-Bank Dunia, Dua Cerita Kemiskinan Indonesia"
  (cakupan sampel Susenas dan garis kemiskinan rumah tangga).
- Katalog mikrodata Silastik BPS, `silastik.bps.go.id`, diperiksa 13 September
  2026.
- Leaflet Standar PST BPS dan Leaflet Silastik (skema gratis, berbayar, nol
  rupiah; PP No. 13 Tahun 2024, Peraturan BPS No. 2 Tahun 2019).
- World Bank Poverty and Inequality Platform, `pip.worldbank.org`.
