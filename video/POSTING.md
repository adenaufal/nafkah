# Kit posting Nafkah

- [Update v0.4.0](#update-v040-12-oktober-2026): "kemarin kalian minta, sekarang sudah ada".
- [Teaser](#teaser-11-oktober-2026): video pertama, "gajimu cukup buat hidup di mana?".

## Update v0.4.0 (12 Oktober 2026)

Pengumuman untuk gelombang komentar TikTok & Instagram 11–12 Oktober: enam
permintaan yang paling sering muncul sekarang ada di aplikasi. Permintaannya
ditulis sebagai tema dari ringkasan anonim di `ROADMAP.md`, tanpa nama akun
atau kutipan komentar.

File di `video/out/`:

- `nafkah-v040.mp4`: 1080×1920, ±31 detik, VO + efek + musik, untuk TikTok
  dan Instagram Reels.
- `nafkah-v040-tanpa-musik.mp4`: VO + efek saja, untuk dipasangkan dengan
  sound trending (volume sound 5–10% supaya VO tetap jelas). Level VO dan
  efeknya sama dengan versi bermusik.
- `nafkah-v040-cover.png`: cover. Judul dan daftar permintaannya ada di area
  tengah 1080×1350, jadi tetap utuh di grid profil Instagram.
- `nafkah-v040-x-1-utama.png`, `-x-2-rumah-sendiri.png`,
  `-x-3-tanggungan.png`, `-x-4-struk.png`: gambar 16:9 untuk X dan Threads.

Angka di video dan gambar memakai profil awal aplikasi (lajang, gaya hidup
standar, motor, +tabungan, UMK/UMP 2026) pada dataset v2026.1, dihitung
dengan `npm run data`:

| Profil | Daerah cukup atau nyaman (dari 514) |
| --- | ---: |
| Rusun/kost (pilihan awal) | 218 |
| Rumah sendiri | 383 |
| Rumah sendiri + tanggungan keluarga Rp1 jt/bulan | 53 |

Contoh struk dan gambar PNG-nya: Kota Yogyakarta dengan profil terakhir,
tertutup 68% (kurang Rp1.351.000 per bulan).

### TikTok

```text
Kemarin kalian minta, sekarang sudah ada ✅ Rumah sendiri/ikut ortu, tanggungan keluarga, mobil & jalan kaki, gaji pasangan, struk jadi gambar. Cek di nafkah.adenaufal.com (biaya hidup = estimasi model, bukan survei) #UMK2026 #biayahidup #generasisandwich #gajian #fyp
```

Sematkan komentar pertama:

```text
Link: nafkah.adenaufal.com 🔗 Gratis, tanpa login. Biaya hidup = estimasi model, bukan survei; cara hitungnya ada di halaman Metode. Apa lagi yang kurang? Tulis di sini 👇
```

### Instagram Reels

```text
Kemarin kalian minta, sekarang sudah ada ✅

Update Nafkah v0.4.0:
• Hunian "Rumah sendiri" (sudah lunas atau ikut orang tua): biaya hunian Rp0
• Tanggungan keluarga: kiriman rutin ke orang tua ikut dihitung di 514 daerah
• Transportasi mobil dan jalan kaki/sepeda
• Gaji pasangan bisa diisi sendiri
• Struk bulanan bisa dibagikan jadi gambar (nominal bisa disembunyikan) atau disalin jadi teks
• Halaman Tentang: asal angka dan cara aplikasi ini dibuat

Gratis, tanpa login: nafkah.adenaufal.com (link di bio)
Biaya hidup = estimasi model, bukan survei.

Apa lagi yang kurang? Tulis di komen 👇

#UMK2026 #biayahidup #generasisandwich #gaji #literasikeuangan
```

Unggah `nafkah-v040-cover.png` sebagai cover. Tautan tetap di bio.

### X

Thread tiga post, masing-masing di bawah 280 karakter. Gambar per post:

1. `nafkah-v040-x-1-utama.png`
2. `nafkah-v040-x-2-rumah-sendiri.png` dan `nafkah-v040-x-3-tanggungan.png`
3. `nafkah-v040-x-4-struk.png`

```text
Kemarin kalian minta, sekarang sudah ada ✅

Update Nafkah v0.4.0: rumah sendiri/ikut ortu, tanggungan keluarga, mobil & jalan kaki, gaji pasangan, struk jadi gambar.

Cek gratis: nafkah.adenaufal.com
Biaya hidup = estimasi model, bukan survei.
```

```text
Contoh, profil awal (lajang, standar, motor, +tabungan, UMK/UMP 2026). Daerah yang cukup atau nyaman, dari 514:

Rusun/kost: 218
Rumah sendiri (hunian Rp0): 383
+ kirim Rp1 jt/bulan ke orang tua: 53

Biaya hidup = estimasi model, bukan survei. nafkah.adenaufal.com
```

```text
Struk bulanan juga bisa dibagikan jadi gambar PNG (nominal bisa disembunyikan) atau disalin jadi teks.

Asal angka dan cara aplikasi ini dibuat ada di nafkah.adenaufal.com/tentang

Biaya hidup = estimasi model, bukan survei. Apa lagi yang kurang? 👇
```

### Threads

*Quote* postingan teaser sebelumnya supaya orang yang dulu berkomentar
langsung nyambung, lalu lampirkan keempat gambar 16:9 sesuai urutan di atas.

```text
Kemarin kalian minta, sekarang sudah ada ✅

Update Nafkah v0.4.0:
• Rumah sendiri/ikut ortu: biaya hunian Rp0
• Tanggungan keluarga (kiriman ke orang tua)
• Mobil dan jalan kaki/sepeda
• Gaji pasangan diisi sendiri
• Struk jadi gambar (nominal bisa disembunyikan) atau teks
• Halaman Tentang: asal angka dan cara dibuat

nafkah.adenaufal.com, gratis tanpa login.
Biaya hidup = estimasi model, bukan survei.

Apa lagi yang kurang? 👇
```

### Menutup janji di kolom komentar

- Balas komentar yang dulu dijanjikan tindak lanjut dan sekarang sudah ada
  dengan tautan video ini: rumah sendiri atau ikut orang tua, tanggungan
  keluarga, mobil dan jalan kaki/sepeda, gaji pasangan, serta struk yang bisa
  disalin.
- Jangan klaim yang belum ada: data UMK 2027 dan inflasi terbaru (menunggu
  penetapan November–Desember), koreksi sewa kost (AP-05), perbandingan
  dengan Numbeo, dan edit struk (AP-16). Laporan tampilan ponsel yang kurang
  responsif belum bisa direproduksi; minta info perangkat.
- Pertanyaan "bikinan AI?" dijawab dengan tautan ke bagian Cara dibuat di
  halaman Tentang (`nafkah.adenaufal.com/tentang#cara-dibuat`), tanpa
  memperdebatkan desain.
- Video ini ditutup dengan "Apa lagi yang kurang?". Komentar yang masuk bisa
  dirangkum sebagai gelombang masukan berikutnya.

## Teaser (11 Oktober 2026)

File di `video/out/`:

- `nafkah-teaser.mp4`: versi utama (VO + efek + musik), 1080×1920, ±33 detik.
- `nafkah-teaser-tanpa-musik.mp4`: VO + efek saja, untuk dipasangkan dengan
  sound trending di TikTok/Reels (volume sound 5–10% supaya VO tetap jelas).
- `nafkah-teaser-cover.png`: cover. Teks pentingnya ada di area tengah
  1080×1350, jadi tetap utuh di grid profil Instagram.
- `nafkah-teaser-16x9.mp4`: versi 16:9 (1920×1080) untuk YouTube, X,
  LinkedIn, atau disematkan di situs. Isi dan suaranya sama.
- `nafkah-teaser-16x9-cover.png`: thumbnail 16:9 untuk YouTube.

### Threads

Paling kuat jika di-*quote* dari thread pertama, supaya orang yang dulu
berkomentar "mana yang ijo?" langsung nyambung.

```text
Update Nafkah 👀

Kemarin banyak yang nanya "mana yang ijo?". Sekarang bisa dicek pakai gajimu sendiri.

Yang baru:
• Geser gajimu, 514 daerah langsung dihitung ulang
• Profil rumah tangga: nikah, jumlah anak, KPR, pasangan ikut kerja
• Struk bulanan tiap daerah
• "Upah kotaku" buat yang mau merantau

Gratis, tanpa login, open source → nafkah.adenaufal.com

Biaya hidup masih estimasi model (bukan survei), cara hitungnya terbuka di halaman Metode.

Daerahmu warna apa? 👇
```

### Instagram Reels

```text
Gajimu cukup buat hidup di mana? 🗺️

Peta Nafkah sekarang bisa pakai gajimu sendiri: geser, 514 kabupaten/kota langsung dihitung ulang. Ada struk bulanan tiap daerah dan simulasi pindah kota.

Gratis & tanpa login, link di bio.
Biaya hidup = estimasi model, metodenya terbuka.

Komen daerahmu warna apa 👇

#UMK2026 #biayahidup #gaji #merantau #literasikeuangan
```

Pasang `nafkah.adenaufal.com` di bio, dan unggah `nafkah-teaser-cover.png`
sebagai cover.

### TikTok

```text
Gajimu cukup buat hidup di daerah mana? 514 kab/kota, cek sendiri 👇 #UMK2026 #biayahidup #gajian #merantau #fyp
```

Sematkan komentar pertama berisi `nafkah.adenaufal.com`.

### YouTube (versi 16:9)

Untuk YouTube Shorts tetap pakai versi 9:16; versi 16:9 untuk video biasa.
Unggah `nafkah-teaser-16x9-cover.png` sebagai thumbnail.

```text
Judul: Gajimu cukup buat hidup di mana? Cek 514 kabupaten/kota

Peta Nafkah sekarang bisa pakai gajimu sendiri: geser, 514 kabupaten/kota langsung dihitung ulang. Ada profil rumah tangga (nikah, jumlah anak, pasangan ikut kerja), struk bulanan tiap daerah, dan "Upah kotaku" untuk simulasi merantau.

Gratis, tanpa login, open source: https://nafkah.adenaufal.com

Biaya hidup adalah estimasi model (bukan survei); cara hitungnya terbuka di halaman Metode.

Daerahmu warna apa? Tulis di komentar.
```

### X (versi 16:9)

```text
Update Nafkah 👀

Kemarin banyak yang nanya "mana yang ijo?". Sekarang bisa pakai gajimu sendiri: geser, 514 kab/kota langsung dihitung ulang.

Gratis, tanpa login → nafkah.adenaufal.com

Daerahmu warna apa?
```

### Supaya jangkauannya naik

- Balas komentar "daerahku merah/kuning" dengan angka daerah mereka. Video
  sengaja ditutup dengan pertanyaan agar komentar mengalir, dan balasan
  cepat di jam pertama paling berpengaruh.
- Waktu paling relevan: menjelang gajian (tanggal 25 sampai awal bulan),
  malam hari pukul 19.00–21.00 WIB.
- Komentar yang minta fitur (misalnya "bisa pakai UMR kota lain?") bisa
  dijawab dengan potongan video ini, karena hampir semua permintaan di
  thread pertama sekarang sudah ada.
