# Instruksi untuk AI agent

## Versioning

Gunakan Conventional Commits agar perubahan bisa dikumpulkan dan diberi versi
secara otomatis:

```text
fix(data): koreksi nilai UMK       -> PATCH
feat(ui): tambah fitur perbandingan -> MINOR
feat(data)!: ubah skema data       -> MAJOR
```

- `docs`, `chore`, `test`, `ci`, `build`, `style`, dan `refactor` tidak
  menaikkan versi otomatis kecuali perubahan tersebut memang breaking atau
  commit memakai `!`.
- Jangan menentukan level versi berdasarkan jumlah baris atau ukuran PR.
  Gunakan dampak terhadap pengguna dan kompatibilitas lama.
- Satu PR sebaiknya satu topik dan judul PR yang di-squash harus mengikuti
  format commit di atas.
- Jangan menjalankan version bump di tengah pengerjaan fitur. Versioning
  dilakukan pada jadwal mingguan atau saat batch perubahan sudah siap.
- Sebelum versioning, jalankan `npm run version:preview`, lalu pilih perintah
  `npm run version:patch`, `npm run version:minor`, atau `npm run version:major`
  sesuai rekomendasi.
- Jangan memakai `git commit --no-verify` hanya untuk melewati validasi pesan;
  perbaiki format commit-nya agar batch versioning tetap akurat.
- `npm run version:baseline` hanya dijalankan satu kali setelah setup ini
  sudah di-commit untuk menandai versi awal project.

Hook commit lokal memeriksa format pesan dan menampilkan dampak versi. Aktifkan
sekali di setiap clone dengan:

```bash
npm run hooks:install
```

Hook ini membantu, tetapi aturan tetap harus dipatuhi jika commit dibuat dari
GitHub atau jika hook sengaja dilewati.
