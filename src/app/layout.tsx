import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nafkah.adenaufal.com"),
  applicationName: "Nafkah",
  title: {
    default:
      "Nafkah — Peta Kecukupan Gaji vs Biaya Hidup 514 Kabupaten/Kota Indonesia",
    template: "%s — Nafkah",
  },
  description:
    "Peta interaktif membandingkan UMK 2026 dengan estimasi biaya hidup bulanan di 514 kabupaten/kota, 38 provinsi Indonesia. Lihat cakupan gaji, surplus/defisit bulanan, dan bandingkan wilayah — data estimasi sampel.",
  keywords: [
    "UMK 2026",
    "biaya hidup Indonesia",
    "keterjangkauan gaji",
    "upah minimum kabupaten kota",
    "perbandingan biaya hidup antar kota",
    "gaji cukup hidup",
    "peta biaya hidup",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Nafkah",
    title: "Nafkah — Seberapa cukup gajimu untuk hidup di kota ini?",
    description:
      "Bandingkan UMK dengan estimasi biaya hidup bulanan di seluruh 514 kabupaten/kota Indonesia — dari Aceh sampai Papua. Data estimasi sampel, bukan nasihat keuangan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nafkah — Seberapa cukup gajimu untuk hidup di kota ini?",
    description:
      "Bandingkan UMK dengan estimasi biaya hidup bulanan di 514 kabupaten/kota Indonesia.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c2452d",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        {/* Konten statis untuk mesin pencari (shell aplikasi dirender klien). */}
        <div className="sr-only">
          <h1>Nafkah — Peta Kecukupan Gaji vs Biaya Hidup Indonesia</h1>
          <p>
            Nafkah adalah peta interaktif yang membandingkan upah minimum
            kabupaten/kota (UMK) dengan estimasi biaya hidup bulanan di 514
            kabupaten/kota, 38 provinsi: dari Aceh sampai wilayah perbatasan
            Papua. Setiap wilayah dikelompokkan ke band Nyaman, Cukup, Ketat,
            atau Tak Cukup berdasarkan rasio upah terhadap estimasi biaya hidup
            — lengkap dengan sumber, tanggal data, dan label keterpercayaan.
          </p>
        </div>
        {children}
      </body>
    </html>
  );
}
