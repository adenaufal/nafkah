# Audit baseline wilayah diperdebatkan (10 September 2026)

Catatan ini adalah pemeriksaan awal AP-05 terhadap dataset yang sedang di-ship,
bukan keputusan untuk mengubah angka. Tujuannya memisahkan sinyal yang layak
ditindaklanjuti dari data yang belum cukup kuat untuk recalibration.

## Cara membaca audit

Nilai di bawah diambil dari `public/data/v2026.1/` pada 10 September 2026.
`Cakupan` memakai asumsi default aplikasi: satu orang, gaya hidup standar,
rumah KPR, motor, dan tabungan aktif. Semua biaya yang diperiksa berlabel
`confidence: estimate`, `asOf: 2026-08-01`, dan bersumber dari model; upah
berlabel `official`, `asOf: 2026-01-01`.

Rentang sewa pada kartu konteks adalah angka naratif, bukan input tambahan
untuk kalkulasi. Karena tetap ditampilkan, rentang tersebut sekarang membawa
provenance yang sama dengan benchmark hunian pada `costs.json` dan dijaga oleh
gerbang skema dataset.

| Kode | Wilayah | UMK/UMP kotor | Total biaya default | Cakupan | Transport | Kesehatan |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `14.10` | Kepulauan Meranti | Rp3.780.495 | Rp3.734.000 | 101,2% · Cukup | Rp288.000 | Rp165.000 |
| `12.17` | Samosir | Rp3.228.949 | Rp3.373.000 | 95,7% · Ketat | Rp267.000 | Rp165.000 |
| `32.04` | Bandung (kabupaten) | Rp3.972.202 | Rp4.011.000 | 99,0% · Ketat | Rp288.000 | Rp165.000 |
| `32.73` | Kota Bandung | Rp4.737.678 | Rp5.123.000 | 92,5% · Ketat | Rp370.000 | Rp175.000 |

## Pemeriksaan sumber publik (read-only)

Pemeriksaan sumber ini hanya menguji apakah ada bukti yang cukup untuk
menindaklanjuti audit. Satu tarif per penumpang, daftar rute, atau pengumuman
operasional tidak bisa langsung diubah menjadi biaya transportasi bulanan
rumah tangga. Tidak ada angka dataset yang diubah dari pemeriksaan ini.

| Kasus | Rujukan resmi | Yang didukung sumber | Yang belum didukung | Keputusan |
| --- | --- | --- | --- | --- |
| Samosir (`12.17`) | [Pemkab Samosir — jadwal & tarif kapal](https://samosirkab.go.id/potensi-unggulan-kabupaten-samosir-perhubungan/) | Halaman pemerintah mencantumkan jadwal lintasan Tomok–Ajibata/Lopo Parindo–Tigaraja serta tarif penumpang dan sepeda motor. | Komposisi rute harian, frekuensi komuter, dan periode berlaku untuk membentuk biaya bulanan `Rp267.000`. | `Pending` |
| Kepulauan Meranti (`14.10`) | [Pemkab Meranti — jadwal kapal roro perintis Lebaran 2026](https://pkm-telukbelitung.merantikab.go.id/berita/bupati-meranti-dukung-penambahan-jadwal-kapal-roro-perintis-saat-mudik-lebaran-2026) | Sumber pemerintah mengonfirmasi ketergantungan pada konektivitas laut dan perubahan frekuensi roro pada periode khusus. | Tarif normal, rute rumah–kerja, frekuensi nonmusiman, dan biaya logistik barang untuk membentuk biaya bulanan `Rp288.000`. | `Pending` |
| Bandung (`32.04`, `32.73`) | [Dishub Jabar — rute Metro Jabar Trans](https://dishub.jabarprov.go.id/postingan/menjelajahi-rute-metro-jabar-trans-6a43738041defbe2d943a4cd) | Sumber Dishub mengonfirmasi enam koridor Metro Jabar Trans dan ketersediaan kanal informasi rute, jadwal, serta tarif. | Tarif penuh yang berlaku, jarak perjalanan tipikal, moda campuran, dan frekuensi rumah tangga untuk membentuk `Rp288.000`/`Rp370.000`. | `Pending` |
| Kesehatan (semua kasus) | — | — | Belum ada tagihan, survei primer, atau seri pengeluaran kesehatan lokal yang menguji baseline `Rp165.000`/`Rp175.000`. | `Pending` |

Rujukan di atas memperkuat konteks narasi, bukan confidence angka biaya. Untuk
menaikkan confidence atau mengubah baseline, maintainer masih perlu bukti
bertanggal yang dapat dipetakan ke kode wilayah, kategori, dan pola pemakaian.

## Temuan dan keputusan sementara

### Kepulauan Meranti (`14.10`)

- Ada satu laporan contoh di `docs/airtable-koreksi-data.csv` yang menyebut
  pendapatan rumah tangga sekitar Rp2 juta dan mahalnya logistik/BBM antarpulau.
- Narasi dataset menyebut biaya logistik laut, sementara konteks transportasi
  menyebut becak motor, sepeda motor, dan penyeberangan antarpulau.
- Sinyalnya relevan untuk audit transport/logistik, tetapi pengalaman satu
  rumah tangga bukan dasar untuk mengganti baseline seluruh rumah tangga.

**Keputusan:** tetap `Pending`. Minta tarif/rute dan periode yang bisa dicek,
lalu bandingkan dengan biaya transport `Rp288.000` sebelum mengusulkan PR.

### Samosir (`12.17`)

- Narasi menyebut pangan lokal dan perikanan air tawar sebagai penyeimbang
  biaya, serta ferry Danau Toba dan motor sebagai konteks mobilitas.
- Baseline transport `Rp267.000` dan kesehatan `Rp165.000` tetap berasal dari
  model umum; belum ada bukti lokal yang terhubung ke record kategori tersebut.

**Keputusan:** tetap `Pending`. Perlu tarif ferry/angkutan yang bertanggal dan
bukti biaya kesehatan lokal atau cakupan BPJS yang relevan.

### Bandung

Roadmap menyebut “Bandung”, sehingga audit memisahkan Kabupaten Bandung
(`32.04`) dan Kota Bandung (`32.73`). Keduanya memiliki konteks berbeda:

- Kabupaten Bandung: transport `Rp288.000`, kesehatan `Rp165.000`, dan narasi
  menyebut angkot Soreang–Banjaran–Baleendah serta feeder Trans Metro Pasundan.
- Kota Bandung: transport `Rp370.000`, kesehatan `Rp175.000`, dan narasi
  menyebut TMB, Trans Metro Pasundan, kereta feeder, angkot, serta ojol.

**Keputusan:** tetap `Pending`. Jangan menyamakan dua wilayah atau mengganti
baseline dari narasi saja; kumpulkan tarif rute dan sumber biaya kesehatan
yang sesuai dengan masing-masing kode.

## Gap lintas kasus

- Empat record biaya transport memakai pola sumber model yang sama; perbedaan
  nilainya belum disertai rincian input lokal yang dapat diaudit dari aplikasi.
- Empat record kesehatan memakai estimasi BPJS/biaya dasar, bukan tagihan atau
  survei primer per kabupaten/kota. Ini cukup untuk label `estimate`, belum
  cukup untuk menaikkan confidence atau mengklaim biaya aktual.
- CSV form masih berisi contoh antrean (`Status=New`), bukan laporan yang
  sudah diverifikasi. Tidak ada perubahan dataset yang diterapkan dari audit
  ini.

## Tindak lanjut yang aman

1. Maintainer memeriksa laporan Airtable nyata dan menghapus/menandai data
   contoh sebelum dipakai sebagai antrean produksi.
2. Untuk tiap kasus, minta bukti bertanggal dan pisahkan biaya transport,
   logistik barang, serta kesehatan—jangan memasukkan semuanya ke satu angka.
3. Jika bukti cukup, buat PR data kecil yang mempertahankan `source`, `asOf`,
   dan `confidence`, lalu jalankan gerbang Zod/CI. Persetujuan tetap manual.
