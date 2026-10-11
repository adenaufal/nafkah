# Video teaser Nafkah (Remotion)

Teaser ±33 detik (30 fps) dalam dua bentuk dengan suara dan timing yang sama:

- 9:16 (1080×1920, komposisi `Teaser`) untuk Threads, Instagram Reels, dan
  TikTok;
- 16:9 (1920×1080, komposisi `Teaser16x9`) untuk YouTube, X, dan LinkedIn.
  Layout-nya mengikuti tampilan desktop aplikasi: kartu di kolom kiri, peta
  di kanan.

Fokusnya tampilan Atlas yang baru: slider Gajiku, profil rumah tangga, struk
bulanan, dan "Upah kotaku". Proyek ini terpisah dari build aplikasi; folder
`video/` dikecualikan dari `tsconfig.json` di root.

Semua angka di video dihitung dari `public/data/v2026.1` dengan
`src/lib/calculations.ts`, jadi sama dengan yang tampil di aplikasi.

## Alur

```bash
cd video
npm install

npm run data      # peta SVG + angka per adegan -> src/data/{map,numbers}.json
npm run shots -- ../out            # screenshot UI asli dari hasil `npm run build` di root
npm run voice -- --voice plgKUYgnlZ1DCNh54DwJ --check   # VO ElevenLabs (Dakocan) + timing per kata
npm run voice -- --finalize        # pasang ulang jeda antaradegan dari take yang tersimpan
npm run sfx -- --music             # efek suara (+ musik latar) ElevenLabs
npm run render                     # out/nafkah-teaser.mp4 (master -14 LUFS)
npm run render:nomusic             # versi tanpa musik (untuk pakai sound trending)
npm run cover                      # out/nafkah-teaser-cover.png
npm run render:16x9                # out/nafkah-teaser-16x9.mp4
npm run cover:16x9                 # out/nafkah-teaser-16x9-cover.png (thumbnail)
npm run studio                     # pratinjau interaktif
```

Take mentah ElevenLabs disimpan di `assets/` (`vo-take.mp3`, `vo-take.json`,
`sfx/*.mp3`) supaya jeda, mix, dan normalisasi bisa diulang tanpa memakai
kredit lagi. Teks caption untuk tiap platform ada di `POSTING.md`.

API key ElevenLabs disimpan di `video/.env` (sudah di-ignore Git):

```text
ELEVENLABS_API_KEY=sk_...
```

`npm run voice -- --list` menampilkan suara di akunmu, dan
`npm run voice -- --search` mencari suara berbahasa Indonesia di Voice Library.

## Mengubah naskah

Naskah VO dan caption ada di satu tempat: `src/script.ts`. `show` adalah teks
caption, `say` adalah teks yang dibaca ElevenLabs (angka dan URL ditulis
sebagai kata). `cue` menandai kata yang dipakai sebagai patokan gerak visual.
Setelah naskah berubah, jalankan `npm run voice` lagi; semua adegan,
caption, dan efek suara ikut menyesuaikan timing baru.

Tanpa VO (`src/data/vo.json` kosong), timing diperkirakan dari panjang teks
agar video tetap bisa dipratinjau.

## Struktur

- `src/timeline.ts`: adegan dan cue dalam frame, dari timing VO.
- `src/story.ts`: warna 514 daerah per frame (gaji, profil, kota asal) dan kamera peta per format.
- `src/format.ts`: `useFormat()` membaca bentuk komposisi (portrait/landscape);
  tiap adegan menyimpan posisi untuk kedua bentuk di dekat kodenya.
- `src/scenes/`: Hook, Calc (Gajiku + profil), Region (struk + kota asal), AppMontage, EndCard.
- `src/components/`: replika kontrol Atlas pada skala video (`UI = 2.4×`).
- `src/sound.ts`: penempatan efek suara pada cue yang sama dengan gambar.
