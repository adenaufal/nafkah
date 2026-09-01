# Kontribusi ke Nafkah

Makasih mau bantu. Project ini punya satu prinsip yang gak bisa ditawar:

> **Setiap angka punya `source`, `asOf`, dan `confidence`. Tidak ada pengecualian.**

Kontribusi paling berharga di sini adalah **koreksi & peningkatan kualitas
data**, bukan fitur visual. Baca `ROADMAP.md` buat arah project.

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # wajib lulus sebelum PR
npm test           # wajib lulus sebelum PR
npm run build      # wajib lulus sebelum PR
```

Ketiganya (`typecheck`, `test`, `build`) juga dijalankan otomatis di CI tiap PR.

## Cara paling umum berkontribusi

### 1. Koreksi / perbarui data upah

Edit province file di `src/data/provinces/<provinsi>.ts`.

- Ganti `grossMonthly` dengan angka UMP/UMK resmi.
- Set `confidence: "official"` **hanya** kalau ada SK/Kepgub/rilis Disnaker.
- Isi `source` = nama + nomor keputusan (mis. `"Kepgub Jabar No. 561.7/Kep.862-Kesra/2025"`).
- Set `asOf` = tanggal berlaku data.
- **Jangan** naikin `confidence` tanpa sumber yang bisa diverifikasi.

### 2. Koreksi biaya hidup

Edit `src/data/costs.ts`. Tiap kategori punya `source`/`asOf`/`confidence`
sendiri. Data model tetap dilabeli `confidence: "estimate"` — jangan diklaim
`official` kecuali beneran dari survei primer per-kabupaten.

### 3. Tambah / perbaiki region

Tambah baris di `src/data/regions.ts` (kode wilayah, centroid, tier) + baris
wage/cost + narasi di `src/data/narratives.ts`. Gak perlu ubah kode.

## Aturan Pull Request

1. **Setiap perubahan data wajib sertakan sumber** di deskripsi PR (link/nomor SK).
2. `npm run typecheck`, `npm test`, dan `npm run build` harus lulus.
3. Satu topik per PR (mis. "koreksi UMK Jawa Timur 2026"), jangan gabung.
4. Jangan tambah dependency baru tanpa alasan kuat di deskripsi PR.
5. Kalau nambah/ubah logika perhitungan di `src/lib/calculations.ts`, tambahin
   test di `src/lib/calculations.test.ts` (vitest).

## Yang ditolak

- Angka tanpa sumber yang bisa dicek.
- Sitasi survei/dataset fiktif (project ini pernah audit anti-halusinasi — lihat README).
- Menaikkan `confidence` biar keliatan kredibel tanpa dasar.

## Lisensi kontribusi

Code kamu masuk di bawah **MIT** (`LICENSE`); data di bawah **CC-BY-4.0**
(`LICENSE-DATA.md`). Dengan submit PR kamu setuju ke lisensi tersebut.
