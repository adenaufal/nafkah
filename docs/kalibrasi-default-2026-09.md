# Keputusan kalibrasi pilihan awal (13 September 2026)

Catatan ini mencatat satu keputusan: **pilihan awal hunian diubah dari
"Rumah KPR" menjadi "Rusun / kost"**, dan alasan kenapa band keterjangkauan
serta angka dataset tidak ikut diubah. Semua angka di bawah dihitung ulang dari
`public/data/v2026.1/` lewat `src/lib/calibration.ts`, dan dikunci di CI oleh
`src/lib/calibration.test.ts` — bukan angka hafalan.

## Masalah yang memicu

Gelombang masukan Threads 1 September 2026 (±300 interaksi) berulang kali
menyebut hal yang sama: "kok nggak ada yang hijau". Di bawah pilihan awal v0.1,
hanya 2 dari 514 kabupaten/kota masuk band Nyaman, dan 114 masuk Tak Cukup.

Dua dugaan yang sama-sama masuk akal:

1. Kalibrasinya terlalu ketat.
2. Kondisi upah dan biaya hidup memang seberat itu.

Keduanya bisa benar sebagian, dan tidak ada satupun yang bisa dibuktikan dengan
menggeser angka sampai petanya terlihat enak. Jadi pemeriksaannya dipisah: mana
yang soal *data*, dan mana yang soal *pilihan awal yang kita sodorkan*.

## Temuan: yang bergerak bukan datanya

Sebaran band di bawah beberapa profil lajang, dataset yang sama persis:

| Profil (lajang, upah kotor) | Nyaman | Cukup | Ketat | Tak Cukup | Median cakupan |
| --- | ---: | ---: | ---: | ---: | ---: |
| Rusun/kost · standar · +tabungan **(pilihan awal baru)** | 27 | 191 | 250 | 46 | 97% |
| Rumah KPR · standar · +tabungan *(pilihan awal v0.1)* | 2 | 95 | 303 | 114 | 89% |
| Rusun/kost · hemat · tanpa tabungan | 361 | 135 | 17 | 1 | 129% |
| Rusun/kost · standar · take-home | 11 | 136 | 298 | 69 | 93% |

Dua hal keluar dari tabel ini.

**Pertama, pilihan awal v0.1 memang tidak mewakili pembanding utamanya.**
Peta ini membandingkan upah minimum dengan biaya hidup, jadi orang yang
diwakilinya adalah penerima UMK lajang. Menyodorkan "Rumah KPR" sebagai titik
awal berarti mengandaikan satu orang berupah minimum sedang membayar angsuran
rumah. Itu bukan kondisi mayoritas, dan bukan asumsi netral — itu asumsi yang
memberatkan satu sisi perbandingan tanpa alasan.

**Kedua, dan ini yang lebih penting: satu dropdown bisa menggeser ratusan
wilayah.** Pindah ke "hemat + tanpa tabungan" melempar band Nyaman dari 27 ke
361. Penyebabnya struktural: pengali gaya hidup `budget` menekan tujuh kategori
sekaligus, dan mematikan tabungan menghapus kategori kontingensi sepenuhnya.
Model seperti ini wajar untuk alat eksplorasi, tapi berbahaya kalau warnanya
dibaca sebagai fakta tetap tentang sebuah daerah.

## Keputusan

1. **Pilihan awal hunian: `studio` → `room`.** Hanya `DEFAULT_ASSUMPTIONS` di
   `src/lib/calculations.ts` yang berubah.
2. **Baseline dataset tidak berubah.** `HOUSING_MULTIPLIERS.studio` tetap ×1.0
   sebagai titik kalibrasi biaya; `room` tetap ×0.55 seperti sebelumnya. Tidak
   ada nilai di `costs.json` atau `wages.json` yang disentuh.
3. **Band tidak digeser.** Ambang 120/100/80 tetap. Menggeser ambang akan
   mengubah arti kata "Cukup" tanpa mengubah apapun tentang kondisi yang
   diwakilinya — itu kosmetik, dan ditolak.
4. **Tabel sensitivitas tampil di panel metode**, dihitung langsung dari
   dataset yang sedang dimuat, lengkap dengan catatan bahwa jarak antar baris
   adalah ukuran ketidakpastian model.
5. **Angkanya dikunci di CI.** Perubahan pengali, band, atau data yang
   menggeser gambaran nasional akan menggagalkan `calibration.test.ts`, jadi
   pergeseran seperti ini harus diputuskan secara sadar.

## Yang perlu diakui

Perubahan ini membuat petanya terlihat lebih hijau: Nyaman 2 → 27, Tak Cukup
114 → 46. Efeknya nyata dan tidak disembunyikan. Pembelaannya bukan bahwa angka
barunya lebih optimistis, melainkan bahwa profil awalnya lebih mendekati orang
yang sedang diwakili peta ini — dan siapapun yang mau melihat versi lamanya
bisa mengubah satu dropdown, dengan angka pembandingnya tercetak di panel
metode.

Yang belum terjawab dan tetap terbuka:

- Pilihan awal lain (gaya hidup standar, tabungan aktif, transportasi motor)
  belum divalidasi terhadap Susenas. Tercatat di backlog ROADMAP sebagai
  "Profil rumah tangga dengan pilihan awal yang divalidasi lewat Susenas".
- Sensitivitas pengali `budget` yang menumpuk di tujuh kategori belum
  dievaluasi ulang. Tabel di atas menampilkan gejalanya; penyebabnya masih
  perlu ditinjau terpisah.
- Semua biaya tetap berlabel `estimate`. Keputusan ini tidak menaikkan
  confidence apapun.
