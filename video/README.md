# Video promosi Nafkah (Remotion)

Teaser ±33 detik (30 fps) dalam dua bentuk dengan suara dan timing yang sama:

- 9:16 (1080×1920, komposisi `Teaser`) untuk Threads, Instagram Reels, dan
  TikTok;
- 16:9 (1920×1080, komposisi `Teaser16x9`) untuk YouTube, X, dan LinkedIn.
  Layout-nya mengikuti tampilan desktop aplikasi: kartu di kolom kiri, peta
  di kanan.

Fokusnya tampilan Atlas yang baru: slider Gajiku, profil rumah tangga, struk
bulanan, dan "Upah kotaku".

Update v0.4.0 (komposisi `Update`, 9:16, ±31 detik) untuk TikTok dan Reels:
"kemarin kalian minta, sekarang sudah ada". Enam permintaan dari gelombang
komentar 11–12 Oktober dicentang satu per satu, masing-masing dengan potongan
UI asli dari build produksi: hunian "Rumah sendiri", tanggungan keluarga,
mobil dan jalan kaki/sepeda, gaji pasangan, struk sebagai gambar PNG, serta
asal angka dan "Cara dibuat" di halaman Tentang. Ada juga cover 9:16
(`UpdateCover`) dan empat gambar 16:9 untuk X dan Threads (`Update16x9`,
`UpdateHome16x9`, `UpdateSupport16x9`, `UpdateShare16x9`).

Proyek ini terpisah dari build aplikasi; folder `video/` dikecualikan dari
`tsconfig.json` di root.

Semua angka di video dihitung dari `public/data/v2026.1` dengan
`src/lib/calculations.ts`, jadi sama dengan yang tampil di aplikasi.

## Alur

```bash
cd video
npm install

npm run data      # peta SVG + angka per adegan -> src/data/{map,numbers,update}.json
npm run shots -- ../out            # screenshot UI asli dari hasil `npm run build` di root (+ docs/hero.png)
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

Update v0.4.0:

```bash
npm run shots -- ../out --set=update   # potongan UI + PNG struk asli -> public/shots/v040/
npm run voice -- --video update --voice plgKUYgnlZ1DCNh54DwJ --check
npm run render:update              # out/nafkah-v040.mp4
npm run render:update:nomusic      # out/nafkah-v040-tanpa-musik.mp4, level sama dengan versi bermusik
npm run stills:update              # out/nafkah-v040-cover.png + empat gambar 16:9
```

`render:update:nomusic` memakai gain master dari `out/nafkah-v040-raw.mp4`,
jadi jalankan `render:update` lebih dulu. `shots --set=update` juga menulis
`src/data/shots-v040.json`: ukuran tiap potongan dan posisi tombol yang
diketuk, supaya sentuhan di video jatuh di tombol aslinya. Teks yang disalin
tombol "Salin teks" disimpan di `public/shots/v040/struk.txt` sebagai
pembanding angka struk.

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
dengan tempo take teaser (±17 karakter per detik) agar video tetap bisa
dipratinjau. Naskah update ada di `src/update/script.ts`, dengan take dan
timing sendiri (`assets/update/`, `src/data/update-vo.json`). Selama update
belum punya VO, musiknya diputar di level normal, bukan sebagai latar suara.

## Struktur

- `src/timeline.ts`: adegan dan cue dalam frame, dari timing VO.
- `src/story.ts`: warna 514 daerah per frame (gaji, profil, kota asal) dan kamera peta per format.
- `src/format.ts`: `useFormat()` membaca bentuk komposisi (portrait/landscape);
  tiap adegan menyimpan posisi untuk kedua bentuk di dekat kodenya.
- `src/scenes/`: Hook, Calc (Gajiku + profil), Region (struk + kota asal), AppMontage, EndCard.
- `src/components/`: replika kontrol Atlas pada skala video (`UI = 2.4×`).
- `src/sound.ts`: penempatan efek suara pada cue yang sama dengan gambar.
- `src/update/`: update v0.4.0. `story.ts` mewarnai peta dari rusun/kost ke
  rumah sendiri lalu ditambah tanggungan keluarga; `components/UiShot.tsx`
  menampilkan potongan UI asli dari `public/shots/v040/`; `Stills.tsx` berisi
  cover dan gambar 16:9.
