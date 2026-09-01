import type { ProvinceDataPackage } from "./types";

export const dki_jakarta_data: ProvinceDataPackage = {
  provinceName: "DKI Jakarta",
  provinceCode: "31",
  regions: [
    {
      code: "31.01",
      name: "Kepulauan Seribu",
      province: "DKI Jakarta",
      provinceCode: "31",
      centroid: [106.496, -5.797],
      tier: "kabupaten",
    },
    {
      code: "31.74",
      name: "Kota Jakarta Barat",
      province: "DKI Jakarta",
      provinceCode: "31",
      centroid: [106.7566, -6.1637],
      tier: "kota",
    },
    {
      code: "31.73",
      name: "Kota Jakarta Pusat",
      province: "DKI Jakarta",
      provinceCode: "31",
      centroid: [106.8277, -6.1796],
      tier: "kota",
    },
    {
      code: "31.71",
      name: "Kota Jakarta Selatan",
      province: "DKI Jakarta",
      provinceCode: "31",
      centroid: [106.8063, -6.2774],
      tier: "kota",
    },
    {
      code: "31.72",
      name: "Kota Jakarta Timur",
      province: "DKI Jakarta",
      provinceCode: "31",
      centroid: [106.899, -6.2549],
      tier: "kota",
    },
    {
      code: "31.75",
      name: "Kota Jakarta Utara",
      province: "DKI Jakarta",
      provinceCode: "31",
      centroid: [106.8412, -6.127],
      tier: "kota",
    },
  ],
  wages: [
    {
      regionCode: "31.01",
      year: 2026,
      grossMonthly: 5729876,
      estimatedTakeHomeMonthly: Math.round(5729876 * 0.96),
      source:
        "Keputusan Gubernur DKI Jakarta No. 1142 Tahun 2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "31.74",
      year: 2026,
      grossMonthly: 5729876,
      estimatedTakeHomeMonthly: Math.round(5729876 * 0.96),
      source:
        "Keputusan Gubernur DKI Jakarta No. 1142 Tahun 2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "31.73",
      year: 2026,
      grossMonthly: 5729876,
      estimatedTakeHomeMonthly: Math.round(5729876 * 0.96),
      source:
        "Keputusan Gubernur DKI Jakarta No. 1142 Tahun 2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "31.71",
      year: 2026,
      grossMonthly: 5729876,
      estimatedTakeHomeMonthly: Math.round(5729876 * 0.96),
      source:
        "Keputusan Gubernur DKI Jakarta No. 1142 Tahun 2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "31.72",
      year: 2026,
      grossMonthly: 5729876,
      estimatedTakeHomeMonthly: Math.round(5729876 * 0.96),
      source:
        "Keputusan Gubernur DKI Jakarta No. 1142 Tahun 2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "31.75",
      year: 2026,
      grossMonthly: 5729876,
      estimatedTakeHomeMonthly: Math.round(5729876 * 0.96),
      source:
        "Keputusan Gubernur DKI Jakarta No. 1142 Tahun 2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "31.01",
      baseline: {
        housing: {
          amount: 977000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1698000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 391000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 391000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 278000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 195000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 257000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 267000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 113000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 360000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "31.74",
      baseline: {
        housing: {
          amount: 1903000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1852000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 494000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 442000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 298000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 216000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 309000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 391000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 144000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 473000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "31.73",
      baseline: {
        housing: {
          amount: 2263000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 2006000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 535000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 473000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 309000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 226000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 329000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 412000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 154000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 514000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "31.71",
      baseline: {
        housing: {
          amount: 2160000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1955000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 514000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 463000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 309000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 226000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 329000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 432000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 154000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 504000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "31.72",
      baseline: {
        housing: {
          amount: 1698000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1800000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 473000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 432000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 288000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 216000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 298000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 360000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 134000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 453000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "31.75",
      baseline: {
        housing: {
          amount: 1800000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1852000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 494000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 453000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 298000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 216000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 309000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 381000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 144000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 463000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
  ],
  narratives: [
    {
      regionCode: "31.01",
      rentRange: {
        min: 500000,
        max: 2500000,
        note:
          "Sewa kamar atau homestay untuk pekerja/ASN dan pemandu wisata di Pulau Pramuka, Pulau Panggang, Pulau Kelapa, dan Pulau Tidung.",
      },
      transportContext:
        "Kapal Dishub DKI Jakarta (dermaga Muara Angke/Marina Ancol), kapal cepat (speed boat), ojek perahu antarpulau, serta sepeda dan motor listrik untuk mobilitas darat pulau.",
      interpretation:
        "Kabupaten Kepulauan Seribu memiliki dinamika kepulauan pesisir di mana biaya sewa hunian lebih terjangkau, namun mobilitas ke daratan utama Jakarta bergantung pada jadwal transportasi laut. UMK Rp5,73 juta menghasilkan daya beli yang sangat memadai bagi pekerja dan ASN kepulauan.",
    },
    {
      regionCode: "31.74",
      rentRange: {
        min: 900000,
        max: 4500000,
        note:
          "Kost mahasiswa dan pekerja padat di Grogol, Tanjung Duren, Palmerah, dan Kebon Jeruk; hunian Puri Indah bertarif menengah-atas.",
      },
      transportContext:
        "KRL Commuter Line (Duri-Tangerang & Manggarai-Kampung Bandan), TransJakarta Koridor 3 dan 8, JakLingko, serta akses Tol Dalam Kota.",
      interpretation:
        "Jakarta Barat memiliki basis komersial, pergudangan, dan kuliner yang sangat dinamis dengan suplai kost padat di sekitar kampus Trisakti/UNTAR/BINUS, memberikan fleksibilitas hunian yang relatif kompetitif bagi pekerja bergaji UMK.",
    },
    {
      regionCode: "31.73",
      rentRange: {
        min: 1200000,
        max: 5500000,
        note:
          "Kost non-AC gang perkampungan (Johar Baru/Kemayoran) hingga studio apartemen di koridor Sudirman-Thamrin dan Bendungan Hilir.",
      },
      transportContext:
        "Jaringan multimodal terlengkap: MRT Jakarta, LRT Jabodebek, KRL Commuter Line, TransJakarta BRT koridor utama, dan Mikrotrans (JakLingko gratis).",
      interpretation:
        "Sebagai jantung administrasi dan bisnis nasional, Jakarta Pusat memiliki tekanan biaya sewa hunian dan pangan tertinggi. Upah UMK Rp5,73 juta berada pada level ketat bagi pekerja lajang mandiri tanpa strategi berbagi sewa (room sharing) atau mencari kost di wilayah satelit penyangga.",
    },
    {
      regionCode: "31.71",
      rentRange: {
        min: 1100000,
        max: 6000000,
        note:
          "Kost pekerja di Tebet, Kuningan, Mampang, dan Pasar Minggu sangat variatif; kawasan SCBD, Senopati, dan Gandaria menerapkan tarif sewa dan gaya hidup premium.",
      },
      transportContext:
        "MRT Jakarta Jalur Utara-Selatan, KRL Commuter Line (Lintas Bogor), TransJakarta, LRT Jabodebek, dan jaringan Mikrotrans.",
      interpretation:
        "Jakarta Selatan merupakan episentrum korporasi multinasional dan sentra gaya hidup urban dengan variasi harga sewa hunian yang lebar. Pekerja UMK Rp5,73 juta membutuhkan manajemen anggaran yang cermat pada pos makan di luar dan hiburan akhir pekan.",
    },
    {
      regionCode: "31.72",
      rentRange: {
        min: 800000,
        max: 3800000,
        note:
          "Kost di Rawamangun, Jatinegara, Pulogadung, dan Ciracas relatif lebih ramah anggaran dibanding Jakarta Pusat/Selatan.",
      },
      transportContext:
        "LRT Jabodebek, LRT Jakarta (Velodrome), KRL Commuter Line (Cikarang Loop), TransJakarta Koridor 7, 9, 11, Mikrotrans, dan Stasiun KCIC Halim.",
      interpretation:
        "Jakarta Timur menawarkan harga hunian dan kebutuhan pokok paling ekonomis di daratan DKI Jakarta. Dengan UMK Rp5,73 juta dan konektivitas transportasi umum terintegrasi yang luas, ruang tabungan pekerja lajang di wilayah ini relatif lebih longgar.",
    },
    {
      regionCode: "31.75",
      rentRange: {
        min: 850000,
        max: 4800000,
        note:
          "Kost buruh/karyawan logistik di Tanjung Priok, Koja, dan Pademangan sangat terjangkau; kawasan Kelapa Gading, Pluit, dan PIK bertarif kelas atas.",
      },
      transportContext:
        "KRL Tanjung Priok-Kota, TransJakarta Koridor 12 dan 5, akses Tol Pelabuhan/Lingkar Luar, dan Mikrotrans JakLingko.",
      interpretation:
        "Jakarta Utara mencakup kontras antara kawasan industri logistik maritim Tanjung Priok dan pusat komersial elite Kelapa Gading/PIK. Pekerja UMK di sektor logistik dan manufaktur terbantu oleh pasokan hunian sewa yang sangat luas di lingkar permukiman komunal Tanjung Priok dan Cilincing.",
    },
  ],
};
