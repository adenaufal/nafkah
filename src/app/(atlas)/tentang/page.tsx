import type { Metadata } from "next";
import Link from "next/link";
import { AboutHeader, ShowGuideButton } from "@/components/doc/AboutClient";
import { CORRECTION_FORM_URL, DISCUSSIONS_URL } from "@/lib/links";
import manifest from "../../../../public/data/v2026.1/manifest.json";
import pkg from "../../../../package.json";

export const metadata: Metadata = {
  title: "Tentang",
  description:
    "Nafkah adalah peta terbuka yang menyandingkan upah minimum dengan estimasi biaya hidup di 514 kabupaten/kota Indonesia. Untuk siapa, cara pakai, privasi, dan cara ikut memperbaiki datanya.",
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
                "Sematkan sampai 5 daerah untuk dibandingkan berdampingan, ekspor CSV, atau salin tautan yang memulihkan tampilan yang sama.",
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

        <Block id="privasi" title="Privasi">
          <ul className="space-y-3">
            {[
              [
                "Tanpa akun, tanpa analitik pihak ketiga.",
                "Aplikasi hanya menyimpan hitungan event agregat di browser ini. URL, kode wilayah, nilai asumsi, dan angka finansial tidak dicatat atau dikirim ke mana pun.",
              ],
              [
                "Gaji dan cicilanmu tetap di perangkatmu.",
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
