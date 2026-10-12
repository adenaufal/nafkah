# Pengali transportasi: mobil pribadi dan jalan kaki/sepeda (Oktober 2026)

Catatan ini mencatat dasar dua pengali baru di `TRANSPORT_MULTIPLIERS`
(`src/data/multipliers.ts`): **mobil pribadi ×3,5** dan **jalan kaki/sepeda
×0,25**. Keduanya diminta di gelombang masukan TikTok/Instagram Oktober 2026
(AP-15). Seperti pengali profil lainnya, angka ini estimasi model, bukan hasil
survei.

## Titik acuan

Kategori transportasi di `costs.json` adalah estimasi biaya komuter bermotor
(tarif angkutan lokal dan konsumsi BBM) untuk profil acuan, yaitu motor (×1).
Di dataset v2026.1, untuk profil lajang, nilainya Rp257 rb (p10), Rp298 rb
(median), dan Rp381 rb (p90) per bulan. Pengali baru dihitung relatif terhadap
titik ini, per komponen biaya.

## Mobil pribadi ×3,5

Asumsi porsi biaya motor per komponen, dan perbandingan mobil kota dengan motor
untuk komponen yang sama:

| Komponen | Porsi biaya motor | Mobil ÷ motor | Kontribusi |
| --- | ---: | ---: | ---: |
| BBM (±40–50 km/L dibanding ±10–14 km/L) | 50% | 3,5–4× | 1,75–2,0 |
| Servis dan suku cadang | 20% | 2,5–3× | 0,5–0,6 |
| Parkir | 20% | 2–2,5× | 0,4–0,5 |
| Pajak kendaraan (PKB dan SWDKLLJ) | 10% | 8–10× | 0,8–1,0 |
| **Jumlah** | | | **3,45–4,1** |

Yang dipakai adalah ×3,5, batas bawah rentang tersebut, karena banyak daerah di
luar kota besar punya parkir murah atau gratis dan jarak tempuh yang lebih
pendek. Untuk profil lajang, hasilnya median Rp1,04 jt per bulan (p90 Rp1,33 jt).

Belum termasuk cicilan atau sewa kendaraan, asuransi, tol, dan penyusutan.
Pengguna yang masih mencicil mobil perlu menambahkan angsurannya sendiri setelah
edit struk (AP-16) tersedia.

## Jalan kaki/sepeda ×0,25

Tidak ada BBM, pajak, dan parkir. Yang tersisa adalah sesekali angkot atau ojek
untuk perjalanan jauh, serta perawatan sepeda dan alas kaki. Rentang yang masuk
akal 0,15–0,35; yang dipakai ×0,25, atau median Rp75 rb per bulan untuk profil
lajang. Di [data komunitas](community-data.md), profil transportasi `none`
paling dekat dengan pilihan ini.

## Batasan

- Rasio per komponen adalah pendekatan dari spesifikasi kendaraan dan tarif
  yang lazim, bukan pengukuran per daerah. Biaya parkir dan jarak tempuh
  sangat beragam antardaerah.
- Pengali dikalikan ke nilai transportasi tiap daerah, sehingga daerah dengan
  biaya transportasi tinggi juga lebih mahal untuk mobil.
- Kalau data pengeluaran transportasi per jenis kendaraan tersedia (misalnya
  dari mikrodata Susenas), kedua pengali ini perlu dikalibrasi ulang.
