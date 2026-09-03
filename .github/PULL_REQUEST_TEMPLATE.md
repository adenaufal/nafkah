<!-- Jelaskan perubahanmu secara ringkas. Hapus bagian yang tidak relevan. -->

## Apa yang diubah

<!-- Satu topik per PR (mis. "koreksi UMK Jawa Timur 2026"). -->

## Dampak versi

<!-- Judul PR yang di-squash wajib mengikuti Conventional Commits:
     fix(...): ..., feat(...): ..., atau feat! / BREAKING CHANGE. -->

- [ ] `patch` — perbaikan bug/data tanpa fitur baru
- [ ] `minor` — fitur baru yang tetap kompatibel
- [ ] `major` — perubahan yang memutus kompatibilitas
- [ ] Tidak mengubah versi — hanya dokumentasi, test, chore, atau CI

## Jika mengubah data

Wilayah dan kategori:

Sumber (tautan SK, Kepgub, rilis BPS, atau berita):

- [ ] `confidence` sesuai bukti (`official` hanya jika ada penetapan resmi)
- [ ] `source` dan `asOf` terisi

## Sebelum mengirim PR

- [ ] `npm run typecheck` lulus
- [ ] `npm test` lulus, termasuk pemeriksaan integritas data
- [ ] `npm run build` lulus
- [ ] Kalau mengubah logika di `src/lib/calculations.ts`, sudah menambah test
- [ ] Tidak menambah dependency baru tanpa alasan di deskripsi ini
