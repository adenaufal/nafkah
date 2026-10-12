# Observasi biaya bulanan komunitas (AP-08)

Fondasi ini memvalidasi antrean observasi **privat** dan menghasilkan ringkasan
komunitas terpisah. Belum ada formulir publik, penyimpanan server, atau integrasi
ke peta. Tidak ada data responden nyata yang disertakan. Estimasi utama pada
`public/data/v2026.1` tidak dibaca sebagai biaya pembanding atau ditimpa.

## Jalankan lokal

Simpan input di lokasi privat di luar repository dan folder `public`, lalu:

```sh
npm run community:summary -- /lokasi/privat/observations.json
```

CLI hanya membaca input dan daftar kode wilayah yang dikirim bersama aplikasi.
Ringkasan JSON ditulis ke stdout; input tidak diubah, tidak ada file hasil yang
dibuat otomatis, dan tidak ada panggilan jaringan. Kode keluar: `0` untuk input
valid (termasuk antrean kosong atau semua kelompok disembunyikan), `1` untuk
input/berkas tidak valid, `2` untuk argumen penggunaan salah. Diagnostik hanya
memuat pesan tetap, tanpa isi privat atau nama kolom asing.

## Kontrak input dan moderasi

Satu berkas mempunyai `source` berupa label survei publik minimal 8 karakter,
`period: {start, end}`, dan `observations` berupa array. Tanggal menggunakan
`YYYY-MM-DD` yang benar secara kalender; awal periode tidak melewati akhirnya.
Label `source` diterbitkan: jangan masukkan identitas responden atau catatan
moderasi di dalamnya. `observedAt` adalah tanggal observasi berada dalam periode,
bukan jumlah hari yang digunakan untuk menormalisasi biaya. `monthlyAmount`
sudah harus berupa biaya bulanan rupiah, bernilai finite dan tidak negatif.

Setiap observasi mempunyai:

- `id`: ID observasi opak, unik di seluruh berkas.
- `respondentId`: ID pseudonim privat yang stabil dalam periode untuk deduplikasi.
  Kedua ID memakai 1–128 karakter huruf ASCII, angka, garis bawah, atau tanda hubung;
  jangan gunakan nama, email, atau nomor telepon sebagai ID.
- `regionCode`: kode wilayah yang benar-benar ada di dataset wilayah aplikasi.
- `category`: salah satu `housing`, `food`, `transport`, `utilities`,
  `connectivity`, `healthcare`, `personalCare`, `leisure`, `education`, `contingency`.
- `profile`: `householdSize` integer 1–10, `lifestyle` (`budget`, `moderate`,
  `comfortable`), `housing` (`room`, `studio`, `oneBedroom`, `owner`), dan
  `transport` (`motorcycle`, `publicTransport`, `rideHailing`, `none`).
  Sejak v0.4.0, `owner` sama dengan pilihan hunian "Rumah sendiri" di aplikasi,
  dan `none` paling dekat dengan pilihan transportasi "Jalan kaki" (`walk`).
  Pilihan "Mobil" (`car`) di aplikasi belum punya padanan di skema ini.
- `status`: `Pending`, `Accepted`, atau `Rejected`.
- `review`: wajib untuk `Accepted` dan `Rejected`, dilarang untuk `Pending`.
  Berisi `reviewer` dan `reason` yang tidak kosong serta `reviewedAt` berupa
  tanggal valid yang tidak mendahului `observedAt`. Review boleh terjadi setelah
  periode survei berakhir.

Semua objek memakai skema ketat: kolom tambahan ditolak. Duplikasi `id` atau
`respondentId` dalam kelompok wilayah/kategori/seluruh profil menolak **seluruh
berkas**, termasuk duplikasi yang masih Pending atau sudah Rejected. Kebijakan
ini mencegah entri berulang menghindari pemeriksaan melalui status moderasi.
Responden yang sama boleh memberi satu observasi pada kelompok berbeda.
Saat mengganti pengajuan yang ditolak, kurator harus merekonsiliasi antrean
sebelum mengulang proses; riwayat audit tetap disimpan secara privat terpisah.

Hanya `Accepted` dihitung. Kurator harus memeriksa periode, satuan bulanan,
kategori, profil, dan bukti sebelum menerima, serta menghindari memasukkan
informasi pribadi ke label publik. Tool memvalidasi struktur review; tool tidak
dapat memastikan bukti benar atau lima ID mewakili lima orang yang berbeda.
Kontrol identitas, akses, persetujuan, retensi, dan audit privat merupakan pekerjaan
lanjutan sebelum membuka pengumpulan publik.

## Aturan ringkasan

Kelompok selalu dipisahkan menurut wilayah, kategori, seluruh profil, dan periode
berkas. Jangan menggabungkan ulang hasil dari periode yang berbeda. Kelompok
dengan kurang dari **5 responden Accepted berbeda** tidak diterbitkan; jumlah
kelompok yang disembunyikan juga tidak dikeluarkan.

Hasil hanya memuat `regionCode`, `category`, `profile`, `sampleSize`, `median`,
`min`, `max`, `period`, `source`, `asOf` (akhir periode), dan `confidence: "sample"`.
Median jumlah genap adalah titik tengah dua nilai tengah. Nilai nol sah.
Tidak ada ID observasi/responden, review, alasan, atau observasi mentah dalam hasil.

Ambang lima dan moderasi adalah **kebijakan operasional proyek**, bukan bukti
representativitas statistik atau jaminan anonimitas. Rentang min/max masih dapat
mengungkap nilai ekstrem dalam kelompok kecil; penggabungan banyak rilis juga
dapat memperbesar risiko identifikasi. Peninjauan publikasi tetap diperlukan.
Sampel bersifat sukarela dan tidak boleh menggantikan estimasi utama secara
otomatis atau diberi label sumber resmi.

## Contoh sintetis, bukan data produksi

Contoh berikut menunjukkan satu observasi buatan. Jika digunakan sendiri, CLI
menghasilkan `[]` karena belum mencapai ambang publikasi. Untuk latihan lokal
median, buat lima entri sintetis dengan ID observasi dan responden berbeda serta
nilai bulanan 100000, 200000, 300000, 400000, 500000; hasil mediannya 300000.
Jangan kirim contoh sintetis sebagai laporan komunitas nyata.

```json
{
  "source": "Survei sintetis untuk latihan lokal",
  "period": { "start": "2026-09-01", "end": "2026-09-30" },
  "observations": [
    {
      "id": "synthetic-observation-1",
      "respondentId": "synthetic-respondent-1",
      "regionCode": "11.01",
      "category": "food",
      "monthlyAmount": 100000,
      "observedAt": "2026-09-20",
      "profile": {
        "householdSize": 1,
        "lifestyle": "moderate",
        "housing": "studio",
        "transport": "motorcycle"
      },
      "status": "Accepted",
      "review": {
        "reviewer": "Kurator sintetis",
        "reason": "Contoh latihan tanpa bukti atau responden nyata",
        "reviewedAt": "2026-09-21"
      }
    }
  ]
}
```
