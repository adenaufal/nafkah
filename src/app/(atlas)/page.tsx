import ClientShell from "./ClientShell";

export default function Page() {
  return (
    <>
      {/* Konten statis untuk mesin pencari (shell aplikasi dirender klien). */}
      <div className="sr-only">
        {/* A paragraph, not an h1: each view renders its own heading. */}
        <p>Nafkah — Peta Kecukupan Gaji vs Biaya Hidup Indonesia</p>
        <p>
          Nafkah adalah peta interaktif yang membandingkan upah minimum
          kabupaten/kota (UMK) dengan estimasi biaya hidup bulanan di 514
          kabupaten/kota, 38 provinsi: dari Aceh sampai wilayah perbatasan
          Papua. Setiap wilayah dikelompokkan ke band Nyaman, Cukup, Ketat, atau
          Tak Cukup berdasarkan rasio upah terhadap estimasi biaya hidup —
          lengkap dengan sumber, tanggal data, dan label keterpercayaan.
        </p>
        <p>
          {/* Crawlable, but not tab stops: they are invisible. */}
          <a href="/metode" tabIndex={-1}>
            Metode perhitungan
          </a>{" "}
          ·{" "}
          <a href="/tentang" tabIndex={-1}>
            Tentang Nafkah
          </a>
        </p>
      </div>
      <ClientShell />
    </>
  );
}
