# Kontribusi ke Nafkah

Terima kasih sudah mau membantu Nafkah. Setiap angka yang kamu kirim wajib
disertai `source`, `asOf`, dan `confidence`, tanpa pengecualian.

Koreksi dan perbaikan kualitas data lebih diprioritaskan daripada fitur visual.
Rencana pengembangannya bisa kamu baca di [roadmap](ROADMAP.md).

## Menyiapkan proyek

```bash
npm install
npm run hooks:install  # aktifkan validasi commit lokal (sekali per clone)
npm run dev        # http://localhost:3000
npm run typecheck  # wajib lulus sebelum PR
npm test           # wajib lulus sebelum PR
npm run build      # wajib lulus sebelum PR
```

CI juga menjalankan `typecheck`, `test`, dan `build` secara otomatis pada setiap PR.

## Versioning dan changelog

PR tetap boleh di-merge satu per satu. Perubahan yang sudah di-merge akan
dikumpulkan sampai jadwal versioning mingguan atau sampai ada alasan penting
untuk membuat versi lebih awal. Versioning ini hanya memperbarui nomor versi
dan `CHANGELOG.md`; tidak membuat executable atau GitHub Release.

Gunakan Conventional Commits pada judul PR atau commit hasil squash agar jenis
perubahan bisa dihitung otomatis:

- `fix(...)` atau `perf(...)` → `PATCH`
- `feat(...)` → `MINOR`
- `feat!:` atau `feat(scope)!:` atau footer `BREAKING CHANGE:` → `MAJOR`
- `docs`, `chore`, `test`, dan `ci` → tidak menaikkan versi otomatis

Hook `commit-msg` akan memeriksa format commit saat bekerja lokal dan
menampilkan dampak versinya. Hook ini perlu diaktifkan sekali pada setiap clone
dengan `npm run hooks:install`. Commit dari editor GitHub tidak menjalankan hook
lokal, jadi judul PR tetap harus mengikuti format yang sama.

Sebelum versioning, lihat dulu kumpulan perubahan dan rekomendasinya:

```bash
npm run version:preview
```

Project ini belum memiliki tag versi awal. Setelah setup versioning sudah
di-commit, tandai kondisi tersebut sebagai baseline satu kali:

```bash
npm run version:baseline
```

Saat siap membuat versi, gunakan level yang ditampilkan oleh preview:

```bash
npm run version:patch
npm run version:minor
npm run version:major
```

Perintah versioning menjalankan `typecheck`, test, dan build terlebih dahulu,
lalu memperbarui `package.json`, `package-lock.json`, dan `CHANGELOG.md`.
`npm version` juga membuat commit serta Git tag seperti `v0.1.1`; tag tersebut
hanya penanda versi di repository, bukan GitHub Release.

## Memperbaiki data

### Data upah

Edit file provinsi di `src/data/provinces/<provinsi>.ts`.

- Ganti `grossMonthly` dengan angka UMP/UMK resmi.
- Gunakan `confidence: "official"` hanya jika ada SK, Kepgub, atau rilis Disnaker.
- Isi `source` dengan nama dan nomor keputusan, misalnya `"Kepgub Jabar No. 561.7/Kep.862-Kesra/2025"`.
- Isi `asOf` dengan tanggal mulai berlakunya data.
- Jangan menaikkan `confidence` tanpa sumber yang bisa diperiksa.

### Biaya hidup

Edit `src/data/costs.ts`. Setiap kategori punya `source`, `asOf`, dan `confidence`
sendiri. Hasil model tetap memakai `confidence: "estimate"`. Label `official`
hanya boleh dipakai untuk data dari survei primer per kabupaten.

### Wilayah

Tambahkan atau perbaiki baris di `src/data/regions.ts`, termasuk kode wilayah,
centroid, dan tier. Lengkapi data upah dan biayanya, lalu isi narasi di
`src/data/narratives.ts`. Perubahan ini cukup dilakukan di file data.

## Aturan Pull Request

1. Sertakan sumber di deskripsi setiap PR yang mengubah data, berupa tautan atau nomor SK.
2. `npm run typecheck`, `npm test`, dan `npm run build` harus lulus.
3. Batasi satu topik per PR, misalnya "koreksi UMK Jawa Timur 2026".
4. Kalau perlu menambah dependency, jelaskan alasan yang kuat di deskripsi PR.
5. Kalau menambah atau mengubah logika di `src/lib/calculations.ts`, tambahkan
   test di `src/lib/calculations.test.ts` (vitest).

## Yang ditolak

- Angka tanpa sumber yang bisa dicek.
- Rujukan ke survei atau dataset fiktif. Audit sumber sebelumnya dicatat di [README](README.md#integritas--audit-data).
- Menaikkan `confidence` tanpa bukti yang sesuai.

## Lisensi kontribusi

Kode yang kamu kirim memakai lisensi [MIT](LICENSE), sedangkan data memakai
[CC-BY-4.0](LICENSE-DATA.md). Mengirim PR berarti menyetujui lisensi tersebut.
