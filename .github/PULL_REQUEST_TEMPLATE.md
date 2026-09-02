<!-- Makasih mau kontribusi. Isi ringkas — hapus bagian yang tak relevan. -->

## Apa yang diubah

<!-- Satu topik per PR (mis. "koreksi UMK Jawa Timur 2026"). -->

## Kalau ini perubahan data

- **Wilayah / kategori:**
- **Sumber** (link SK / Kepgub / rilis BPS / berita):
- [ ] `confidence` di-set sesuai bukti (`official` hanya kalau ada penetapan resmi)
- [ ] `source` dan `asOf` terisi

## Checklist

- [ ] `npm run typecheck` lulus
- [ ] `npm test` lulus (termasuk gate integritas data)
- [ ] `npm run build` lulus
- [ ] Kalau mengubah logika di `src/lib/calculations.ts`, sudah menambah test
- [ ] Tidak menambah dependency baru tanpa alasan di deskripsi ini
