# Catatan perubahan dataset Nafkah

Setiap versi dataset tinggal di folder `public/data/v<versi>/`; aplikasi
membaca folder yang dirujuk `DATASET_BASE` di `src/data/loader.ts`. Perubahan
isi data dicantumkan di sini, dan setiap perubahan diverifikasi skema Zod
(`src/data/schema.ts`) serta pemeriksaan integritas di CI
(`src/data/dataset.test.ts`) sebelum digabung.

Lisensi data: CC-BY-4.0 (lihat `LICENSE-DATA.md`).

## 2026.1 — 7 September 2026

- Rilis pertama dalam format JSON berversi (migrasi dari modul TypeScript;
  isi angka tidak berubah).
- Isi: 514 kabupaten/kota (kode wilayah sesuai Kepmendagri 100.1.1-6117),
  upah UMP/UMK 2026 resmi (`official`), 514 × 10 nilai biaya baseline
  (`estimate`), serta narasi lokal untuk seluruh wilayah. Rentang sewa yang
  ditampilkan dari narasi memakai provenance yang sama dengan benchmark hunian
  per wilayah (`estimate`, per 2026-08-01); rentang ini hanya konteks dan tidak
  ikut menghitung cakupan.
- Struktur berkas: `regions.json`, `wages.json`, `costs.json`,
  `narratives.json`, `manifest.json`.
