import type { ProvinceDataPackage } from "./types";

export const daerah_istimewa_yogyakarta_data: ProvinceDataPackage = {
  provinceName: "Daerah Istimewa Yogyakarta",
  provinceCode: "34",
  regions: [
    {
      code: "34.01",
      name: "Kulon Progo",
      province: "Daerah Istimewa Yogyakarta",
      provinceCode: "34",
      centroid: [110.1717, -7.7938],
      tier: "kabupaten",
    },
    {
      code: "34.02",
      name: "Bantul",
      province: "Daerah Istimewa Yogyakarta",
      provinceCode: "34",
      centroid: [110.3655, -7.8755],
      tier: "kabupaten",
    },
    {
      code: "34.03",
      name: "Gunung Kidul",
      province: "Daerah Istimewa Yogyakarta",
      provinceCode: "34",
      centroid: [110.6033, -7.986],
      tier: "kabupaten",
    },
    {
      code: "34.04",
      name: "Sleman",
      province: "Daerah Istimewa Yogyakarta",
      provinceCode: "34",
      centroid: [110.3761, -7.7506],
      tier: "kabupaten",
    },
    {
      code: "34.71",
      name: "Kota Yogyakarta",
      province: "Daerah Istimewa Yogyakarta",
      provinceCode: "34",
      centroid: [110.3795, -7.8037],
      tier: "kota",
    },
  ],
  wages: [
    {
      regionCode: "34.01",
      year: 2026,
      grossMonthly: 2504520,
      estimatedTakeHomeMonthly: Math.round(2504520 * 0.96),
      source:
        "Keputusan Gubernur DIY No. 443 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Daerah Istimewa Yogyakarta Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "34.02",
      year: 2026,
      grossMonthly: 2509001,
      estimatedTakeHomeMonthly: Math.round(2509001 * 0.96),
      source:
        "Keputusan Gubernur DIY No. 443 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Daerah Istimewa Yogyakarta Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "34.03",
      year: 2026,
      grossMonthly: 2468378,
      estimatedTakeHomeMonthly: Math.round(2468378 * 0.96),
      source:
        "Keputusan Gubernur DIY No. 443 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Daerah Istimewa Yogyakarta Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "34.04",
      year: 2026,
      grossMonthly: 2624387,
      estimatedTakeHomeMonthly: Math.round(2624387 * 0.96),
      source:
        "Keputusan Gubernur DIY No. 443 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Daerah Istimewa Yogyakarta Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "34.71",
      year: 2026,
      grossMonthly: 2827593,
      estimatedTakeHomeMonthly: Math.round(2827593 * 0.96),
      source:
        "Keputusan Gubernur DIY No. 443 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Daerah Istimewa Yogyakarta Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "34.01",
      baseline: {
        housing: {
          amount: 617000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1029000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 267000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 237000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 226000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 154000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 185000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 185000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 82000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 237000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "34.02",
      baseline: {
        housing: {
          amount: 669000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1080000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 267000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 247000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 237000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 165000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 195000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 206000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 93000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 247000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "34.03",
      baseline: {
        housing: {
          amount: 566000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 977000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 288000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 247000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 226000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 154000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 185000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 175000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 82000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 226000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "34.04",
      baseline: {
        housing: {
          amount: 823000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1214000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 278000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 278000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 247000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 175000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 226000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 257000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 103000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 288000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "34.71",
      baseline: {
        housing: {
          amount: 874000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1235000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 288000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 288000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 257000,
          source:
            "Paket data seluler & konektivitas digital 40-50GB — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        healthcare: {
          amount: 185000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 237000,
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
          amount: 309000,
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
      regionCode: "34.01",
      rentRange: {
        min: 350000,
        max: 1700000,
        note:
          "Pilihan kost tumbuh pesat di koridor Temon sekitar Bandara Internasional Yogyakarta (YIA) dan pusat kota Wates.",
      },
      transportContext:
        "Didukung KA Bandara YIA dan Commuter Line Prameks di Stasiun Wates ke pusat Jogja, jalan nasional Jl. Wates, serta JJLS.",
      interpretation:
        "Perkembangan kawasan aerotropolis YIA mendorong pertumbuhan ekonomi baru di Kulon Progo. Dengan UMK 2026 sebesar Rp2,50 juta dan harga komoditas pangan lokal yang murah, daya beli pekerja tetap relatif stabil.",
    },
    {
      regionCode: "34.02",
      rentRange: {
        min: 350000,
        max: 1800000,
        note:
          "Kost mahasiswa di Kasihan (UMY) dan Sewon (ISI) sangat ramah kantong; kawasan Banguntapan dekat perbatasan kota lebih variatif.",
      },
      transportContext:
        "Mobilitas utama mengandalkan sepeda motor melalui Jl. Bantul, Jl. Parangtritis, dan Ring Road Selatan; dilayani bus Trans Jogja di koridor perbatasan kota.",
      interpretation:
        "Bantul menawarkan biaya hidup yang relatif bersahabat dengan sentra pangan agraris dan seni kerajinan lokal. Dengan UMK Rp2,51 juta, pengeluaran hidup lajang hemat dapat seimbang dengan upah yang diterima.",
    },
    {
      regionCode: "34.03",
      rentRange: {
        min: 300000,
        max: 1500000,
        note:
          "Paling terjangkau di kawasan agraris/pedesaan Playen dan Wonosari; sewa kamar dekat RSUD/kantor dinas sedikit lebih tinggi.",
      },
      transportContext:
        "Dominan menggunakan sepeda motor pribadi melintasi jalur berbukit; bus AKDP menghubungkan Terminal Dhaksinarga Wonosari ke Terminal Giwangan Jogja.",
      interpretation:
        "Gunungkidul memiliki UMK 2026 terendah di DIY (Rp2,47 juta), namun diimbangi dengan biaya pangan dan hunian yang paling ekonomis. Tantangan utama terletak pada jarak komuter ke pusat provinsi serta biaya air pada musim kemarau di beberapa zona.",
    },
    {
      regionCode: "34.04",
      rentRange: {
        min: 400000,
        max: 2600000,
        note:
          "Ribuan kamar kost mahasiswa UGM/UNY di Depok/Mlati; kawasan Kaliurang atas lebih sejuk dan bervariasi.",
      },
      transportContext:
        "Trans Jogja Koridor 1-3, KRL Commuter Line (Stasiun Maguwo), dan ojek daring di area kampus.",
      interpretation:
        "Sleman memuat sebagian besar kampus ternama DIY dengan ekosistem kost dan warung makan mahasiswa yang super kompetitif, menolong pekerja berupah UMK Rp2,62 juta menghemat anggaran hidup.",
    },
    {
      regionCode: "34.71",
      rentRange: {
        min: 450000,
        max: 2500000,
        note:
          "Kost sederhana non-AC di Umbulharjo/Kraton sangat ekonomis; kawasan Kotabaru dan ring kampus premium lebih tinggi.",
      },
      transportContext:
        "Trans Jogja menjangkau jalan-jalan protokol kota; radius kota yang kompak membuat sepeda motor dan sepeda sangat hemat biaya.",
      interpretation:
        "Yogyakarta memiliki harga pangan harian yang terjangkau, namun UMK 2026 (Rp2,83 juta) terendah di antara kota besar. Biaya hidup lajang moderat melampaui upah minimum, menuntut gaya hidup ekstra hemat (budget) agar tidak defisit.",
    },
  ],
};
