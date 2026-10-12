import type { Metadata } from "next";
import Link from "next/link";
import { AboutHeader, ShowGuideButton } from "@/components/doc/AboutClient";
import { CORRECTION_FORM_URL, DISCUSSIONS_URL } from "@/lib/links";
import manifest from "../../../../public/data/v2026.1/manifest.json";
import pkg from "../../../../package.json";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Nafkah adalah peta terbuka yang menyandingkan upah minimum dengan estimasi biaya hidup di 514 kabupaten/kota Indonesia. Untuk siapa, cara pakai, pertanyaan umum, cara dibuat, privasi, dan cara ikut memperbaiki datanya.",
  alternates: { canonical: "/tentang" },
};

const REPO = "https://github.com/adenaufal/nafkah";
const linkCls =
  "font-semibold text-accent-ink underline decoration-rule-2 underline-offset-2 hover:decoration-accent";

function Block({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-20 pt-14">
      <h2
        id={`${id}-h`}
        className="f-display text-[28px] font-[580] leading-tight tracking-[-0.012em]"
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15.5px] leading-[1.7] text-ink-2 [&_b]:font-semibold [&_b]:text-ink">
        {children}
      </div>
    </section>
  );
}

export default function TentangPage() {
  return (
    <div className="doc-page min-h-dvh">
      <AboutHeader />
      <main className="mx-auto max-w-[70ch] px-5 pb-24 pt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Tentang
        </p>
        <h1 className="f-display text-balance mt-3 text-[clamp(34px,4.4vw,48px)] font-[580] leading-[1.06] tracking-[-0.018em]">
          Rupiah yang sama terasa berbeda di tiap kota.
        </h1>
        <p className="text-pretty mt-5 text-[18px] leading-[1.6] text-ink-2">
          <b className="font-semibold text-ink">Nafkah</b> — biaya untuk
          menopang hidup sehari-hari — adalah peta yang menyandingkan upah
          minimum dengan estimasi biaya hidup bulanan di{" "}
          {manifest.counts.regions} kabupaten/kota, dari Aceh sampai wilayah
          perbatasan Papua.
        </p>

        <Block id="kenapa" title="Kenapa dibuat">
          <p>
            Angka gaji saja bisa menyesatkan: rupiah yang sama terasa lapang di
            satu kota dan sulit bernapas di kota lain. Keputusan penting —
            pindah kerja antarwilayah, menawarkan gaji ke kandidat, sampai
            kajian upah daerah — sering diambil hanya dari nominal, tanpa sisi
            biaya hidup pembandingnya. Nafkah menghadirkan sisi itu dalam satu
            peta yang mudah dibandingkan.
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {[
              {
                t: "Pekerja & perantau",
                d: "Cek apakah gajimu cukup di kota tujuan, termasuk dengan UMK kota asalmu.",
              },
              {
                t: "HR & pemberi kerja",
                d: "Bandingkan biaya hidup antardaerah sebelum menawarkan gaji, lalu ekspor CSV.",
              },
              {
                t: "Jurnalis & peneliti",
                d: "Sebaran nasional, sumber per angka, dan metode yang bisa diperiksa ulang.",
              },
            ].map((x) => (
              <li key={x.t} className="rounded-[14px] border border-rule p-4">
                <p className="text-[14px] font-bold text-ink">{x.t}</p>
                <p className="mt-1 text-[14px] leading-[1.55]">{x.d}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="panduan" title="Cara pakai singkat">
          <ol className="space-y-3">
            {[
              [
                "Baca jawabannya.",
                "Judul di panel kiri menyebut berapa daerah yang upah minimumnya belum menutup biaya hidup; warna peta menunjukkan di mana.",
              ],
              [
                "Pilih daerah.",
                "Klik di peta, cari namanya, atau pakai “Daerah di lokasiku” untuk membaca struk bulanannya: pemasukan, sepuluh pos pengeluaran, dan sisanya.",
              ],
              [
                "Pakai angkamu.",
                "Pilih Gajiku dan geser, atau UMK kotaku untuk simulasi pindah kota. Ubah profil rumah tangga kapan saja — peta menghitung ulang seketika.",
              ],
              [
                "Bandingkan & bagikan.",
                "Sematkan sampai 5 daerah untuk dibandingkan berdampingan, ekspor CSV, bagikan struk sebagai gambar, atau salin tautan yang memulihkan tampilan yang sama.",
              ],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft text-[12px] font-bold text-accent-ink"
                >
                  {i + 1}
                </span>
                <span>
                  <b>{t}</b> {d}
                </span>
              </li>
            ))}
          </ol>
          <ShowGuideButton />
        </Block>

        <Block id="tanya" title="Pertanyaan yang sering muncul">
          <dl className="space-y-5">
            {[
              {
                q: "Angkanya dari mana?",
                a: (
                  <>
                    Upah minimum memakai penetapan resmi 2026: UMK dari SK atau
                    Kepgub tiap daerah, atau UMP provinsi bila daerahnya tidak
                    menetapkan UMK. Biaya hidup adalah estimasi model dari
                    agregat Susenas, Indeks Harga Konsumen BPS, dan acuan harga
                    lokal, karena survei biaya hidup BPS hanya ada di kota
                    sampel. Di detail setiap daerah, semua angka membawa sumber,
                    tanggal, dan status keyakinannya.
                  </>
                ),
              },
              {
                q: "Biaya hidupnya untuk siapa?",
                a: (
                  <>
                    Untuk profil yang sedang kamu pilih. Pilihan awalnya lajang,
                    gaya hidup standar, tinggal di rusun/kost, naik motor, dan
                    menyisihkan tabungan sekitar 10%. Ubah profil rumah tangga
                    untuk mengatur pasangan, anak, hunian, transportasi,
                    cicilan, atau tanggungan keluarga.
                  </>
                ),
              },
              {
                q: "Kenapa banyak daerah merah?",
                a: (
                  <>
                    Upah minimum adalah batas bawah resmi, bukan gaji rata-rata,
                    dan biaya hidup di sini sudah termasuk tabungan. Warnanya
                    juga bergantung pada profil: satu pilihan bisa menggeser
                    ratusan daerah. Baca warna sebagai hasil asumsi, bukan sifat
                    tetap sebuah daerah; tabel sensitivitas di{" "}
                    <Link href="/metode#keyakinan" className={linkCls}>
                      Metode
                    </Link>{" "}
                    menunjukkan seberapa jauh pergeserannya.
                  </>
                ),
              },
              {
                q: "Apakah Nafkah dibuat dengan AI?",
                a: (
                  <>
                    Ya. Kode aplikasi dan video promosinya dibuat dengan bantuan
                    AI; prosesnya dijelaskan di{" "}
                    <a href="#cara-dibuat" className={linkCls}>
                      Cara dibuat
                    </a>
                    . Datanya tidak diambil begitu saja: upah mengacu pada
                    dokumen penetapan resmi, sumber yang diduga rekaan ditolak,
                    dan koreksi dari pengguna diperiksa manual.
                  </>
                ),
              },
              {
                q: "Kapan datanya diperbarui?",
                a: (
                  <>
                    Upah mengikuti penetapan UMK tahunan, yang biasanya keluar
                    November–Desember; UMK 2027 direncanakan masuk setelah
                    ditetapkan. Biaya hidup disesuaikan dengan inflasi IHK.
                    Versi dataset dan tanggal setiap angka tercantum di{" "}
                    <Link href="/metode#versi" className={linkCls}>
                      Metode
                    </Link>
                    .
                  </>
                ),
              },
              {
                q: "Angka di daerahku meleset. Bagaimana?",
                a: (
                  <>
                    Kirim lewat{" "}
                    <a
                      href={CORRECTION_FORM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className={linkCls}
                    >
                      form koreksi
                    </a>
                    . Setiap laporan diperiksa manual dan tidak mengubah data
                    secara otomatis.
                  </>
                ),
              },
            ].map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-ink">{q}</dt>
                <dd className="mt-1">{a}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block id="terbuka" title="Terbuka & bisa diperiksa">
          <p>
            Kode sumbernya terbuka (MIT) dan datanya berlisensi CC BY 4.0. Angka
            upah dan biaya hidup tinggal di berkas data berversi yang mudah
            diperiksa; setiap angka membawa sumber, tanggal, dan status
            keyakinannya. Cara menghitungnya dijelaskan lengkap di halaman{" "}
            <Link href="/metode" className={linkCls}>
              Metode
            </Link>
            .
          </p>
          <ul className="grid gap-x-6 gap-y-2 text-[14.5px] sm:grid-cols-2">
            <li>
              <a
                href={CORRECTION_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className={linkCls}
              >
                Laporkan angka yang meleset
              </a>
            </li>
            <li>
              <a
                href={DISCUSSIONS_URL}
                target="_blank"
                rel="noreferrer"
                className={linkCls}
              >
                Saran fitur &amp; bug di Discussions
              </a>
            </li>
            <li>
              <a
                href={REPO}
                target="_blank"
                rel="noreferrer"
                className={linkCls}
              >
                Lihat kode &amp; kirim pull request
              </a>
            </li>
            <li>
              <Link href="/booklet" className={linkCls}>
                Booklet siap cetak (PDF A4)
              </Link>
            </li>
          </ul>
        </Block>

        <Block id="cara-dibuat" title="Cara dibuat">
          <p>
            Nafkah dibuat dan dirawat oleh satu orang dengan bantuan AI. Supaya
            jelas mana yang dikerjakan alat dan mana yang diperiksa:
          </p>
          <ul className="space-y-3">
            {[
              [
                "Kode.",
                "Next.js, TypeScript, Tailwind CSS, dan MapLibre GL untuk peta. Banyak bagian kode ditulis bersama Claude Code, asisten pemrograman AI, lalu harus lolos typecheck, unit test perhitungan, dan build otomatis sebelum dirilis.",
              ],
              [
                "Data.",
                "Upah dicocokkan dengan SK/Kepgub dan rekap UMP Kemnaker; sumber yang diduga memuat angka rekaan ditolak dan dicatat di repo. Skema data dan kecocokan antarberkas diperiksa otomatis setiap ada perubahan, dan koreksi dari pengguna diperiksa manual sebelum masuk dataset.",
              ],
              [
                "Peta.",
                "Batas 514 kabupaten/kota dari HDX COD-AB yang disederhanakan; peta dasar dari CARTO dan Esri.",
              ],
              [
                "Video promosi.",
                "Dibuat dari kode dengan Remotion; suaranya dari ElevenLabs.",
              ],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>
                  <b>{t}</b> {d}
                </span>
              </li>
            ))}
          </ul>
          <p>
            Semua kode, data, dan catatan keputusannya bisa diperiksa di{" "}
            <a href={REPO} target="_blank" rel="noreferrer" className={linkCls}>
              GitHub
            </a>
            .
          </p>
        </Block>

        <Block id="privasi" title="Privasi">
          <ul className="space-y-3">
            {[
              [
                "Tanpa akun, tanpa analitik pihak ketiga.",
                "Aplikasi hanya menyimpan hitungan event agregat di browser ini. URL, kode wilayah, nilai asumsi, dan angka finansial tidak dicatat atau dikirim ke mana pun.",
              ],
              [
                "Gaji, cicilan, dan tanggunganmu tetap di perangkatmu.",
                "Angka itu baru ikut ke tautan kalau kamu sendiri memilih Bagikan.",
              ],
              [
                "Lokasi hanya dipakai sekali.",
                "“Daerah di lokasiku” mencocokkan posisimu dengan batas wilayah di perangkatmu, lalu membuang posisinya.",
              ],
              [
                "Peta dasar dari pihak lain.",
                "Ubin peta dimuat dari CARTO (Esri untuk satelit), seperti peta web pada umumnya. Pilih “Tanpa peta dasar” bila tidak ingin memuatnya.",
              ],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>
                  <b>{t}</b> {d}
                </span>
              </li>
            ))}
          </ul>
          <p>
            <b>Bisa dipakai offline.</b> Setelah kunjungan pertama, aplikasi,
            batas wilayah, dan dataset tersimpan di browser. Pilih peta dasar
            “Tanpa peta dasar” untuk memakai peta tanpa internet.
          </p>
        </Block>

        <dl className="mt-16 grid gap-3 rounded-[16px] border border-rule p-5 text-[14px] sm:grid-cols-2">
          {[
            ["Dibuat & dirawat", "Ade Naufal"],
            [
              "Versi",
              `Aplikasi v${pkg.version} · dataset ${manifest.datasetVersion}`,
            ],
            ["Lisensi", "Kode MIT · Data CC BY 4.0"],
            ["Situs", "nafkah.adenaufal.com"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                {k}
              </dt>
              <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-8 text-[14px] text-muted">
          Semua angka adalah estimasi, bukan nasihat keuangan.{" "}
          <Link
            href="/"
            className="font-semibold text-accent-ink hover:underline"
          >
            Kembali ke peta →
          </Link>
        </p>
      </main>
    </div>
  );
}
