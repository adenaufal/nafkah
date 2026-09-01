import type { ProvinceDataPackage } from "./types";

export const kalimantan_utara_data: ProvinceDataPackage = {
  provinceName: "Kalimantan Utara",
  provinceCode: "65",
  regions: [
    {
      code: "65.02",
      name: "Bulungan",
      province: "Kalimantan Utara",
      provinceCode: "65",
      centroid: [117.2964, 2.9834],
      tier: "kabupaten",
    },
    {
      code: "65.71",
      name: "Kota Tarakan",
      province: "Kalimantan Utara",
      provinceCode: "65",
      centroid: [117.6054, 3.3528],
      tier: "kota",
    },
    {
      code: "65.01",
      name: "Malinau",
      province: "Kalimantan Utara",
      provinceCode: "65",
      centroid: [115.659, 2.553],
      tier: "kabupaten",
    },
    {
      code: "65.04",
      name: "Nunukan",
      province: "Kalimantan Utara",
      provinceCode: "65",
      centroid: [116.9134, 3.9761],
      tier: "kabupaten",
    },
    {
      code: "65.03",
      name: "Tana Tidung",
      province: "Kalimantan Utara",
      provinceCode: "65",
      centroid: [117.3477, 3.5687],
      tier: "kabupaten",
    },
  ],
  wages: [
    {
      regionCode: "65.02",
      year: 2026,
      grossMonthly: 3900396,
      estimatedTakeHomeMonthly: Math.round(3900396 * 0.96),
      source:
        "Keputusan Gubernur Kalimantan Utara Tahun 2025 tentang UMK Kabupaten/Kota Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "65.71",
      year: 2026,
      grossMonthly: 4742169,
      estimatedTakeHomeMonthly: Math.round(4742169 * 0.96),
      source:
        "Keputusan Gubernur Kalimantan Utara Tahun 2025 tentang UMK Kabupaten/Kota Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "65.01",
      year: 2026,
      grossMonthly: 4040073,
      estimatedTakeHomeMonthly: Math.round(4040073 * 0.96),
      source:
        "Keputusan Gubernur Kalimantan Utara Tahun 2025 tentang UMK Kabupaten/Kota Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "65.04",
      year: 2026,
      grossMonthly: 3845251,
      estimatedTakeHomeMonthly: Math.round(3845251 * 0.96),
      source:
        "Keputusan Gubernur Kalimantan Utara Tahun 2025 tentang UMK Kabupaten/Kota Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "65.03",
      year: 2026,
      grossMonthly: 3870800,
      estimatedTakeHomeMonthly: Math.round(3870800 * 0.96),
      source:
        "Keputusan Gubernur Kalimantan Utara Tahun 2025 tentang UMK Kabupaten/Kota Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "65.02",
      baseline: {
        housing: {
          amount: 977000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1461000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 370000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 360000,
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
          amount: 267000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 298000,
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
      regionCode: "65.71",
      baseline: {
        housing: {
          amount: 1183000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1543000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 381000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 370000,
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
          amount: 206000,
          source:
            "Standar iuran BPJS Kesehatan Kelas 3/PPU & estimasi biaya kesehatan dasar — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        personalCare: {
          amount: 278000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 340000,
          source:
            "Model estimasi rekreasi, kuliner lokal & hiburan digital — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        education: {
          amount: 123000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 391000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "65.01",
      baseline: {
        housing: {
          amount: 926000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1502000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 381000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 360000,
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
          amount: 267000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 288000,
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
      regionCode: "65.04",
      baseline: {
        housing: {
          amount: 926000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1461000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 370000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 360000,
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
          amount: 267000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 278000,
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
          amount: 350000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "65.03",
      baseline: {
        housing: {
          amount: 874000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1481000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 370000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 350000,
          source:
            "Tarif dasar listrik PLN R-1/TR & tarif air bersih daerah — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        connectivity: {
          amount: 267000,
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
          amount: 103000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 350000,
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
      regionCode: "65.02",
      rentRange: {
        min: 600000,
        max: 2600000,
        note:
          "Kost pegawai ASN dan staf proyek KIPI di Tanjung Selor Hilir, Tanjung Selor Hulu, dan kawasan Tanah Kuning.",
      },
      transportContext:
        "Sepeda motor harian, perahu tambangan Sungai Kayan, mobil travel darat Tanjung Selor-Berau, dan speedboat rute Pelabuhan Kayan II - Tarakan.",
      interpretation:
        "Sebagai pusat administrasi pemerintahan Kalimantan Utara di Tanjung Selor dan lokasi mega-proyek Kawasan Industri Hijau Indonesia (KIPI) Tanah Kuning, Bulungan memiliki stabilitas ekonomi dinamis. UMK Rp3,90 juta sangat memadai untuk memenuhi biaya hidup layak pekerja lajang.",
    },
    {
      regionCode: "65.71",
      rentRange: {
        min: 600000,
        max: 3000000,
        note:
          "Kost pekerja perikanan, migas, dan niaga di Tarakan Barat, Tarakan Tengah, dan Karang Anyar.",
      },
      transportContext:
        "Angkot kota, sepeda motor, ojek online, serta speedboat pelabuhan antarpulau di Tengkayu I & II.",
      interpretation:
        "Tarakan sebagai pusat ekonomi, transit perdagangan maritim, dan sentra migas/perikanan Kaltara menetapkan UMK tertinggi (Rp4,74 juta) guna mengimbangi biaya logistik kepulauan dan perbatasan, memberi perlindungan daya beli yang sangat solid bagi pekerja.",
    },
    {
      regionCode: "65.01",
      rentRange: {
        min: 550000,
        max: 2300000,
        note:
          "Kost pekerja pertambangan batu bara, kehutanan, dan dinas Pemkab di Malinau Kota dan Malinau Barat.",
      },
      transportContext:
        "Sepeda motor harian, mobil travel jalur darat Trans Kaltara (Malinau-Tideng Pale-Tanjung Selor), longboat sungai, dan penerbangan perintis di Bandara Kolonel RA Bessing menuju pedalaman Apau Kayan.",
      interpretation:
        "Malinau memiliki karakter geografis pedalaman yang luas dengan sektor unggulan pertambangan batu bara dan kehutanan adat. Standar UMK Rp4,04 juta memberikan bantalan daya beli yang baik bagi pekerja menghadapi disparitas harga logistik antarkecamatan.",
    },
    {
      regionCode: "65.04",
      rentRange: {
        min: 550000,
        max: 2400000,
        note:
          "Kost pekerja budidaya rumput laut Mamolo, perkebunan sawit, dan niaga perbatasan di Nunukan Timur, Nunukan Selatan, dan Sebatik.",
      },
      transportContext:
        "Sepeda motor pulau, kapal feri penyeberangan ASDP & speedboat rute Nunukan-Sebatik / Nunukan-Tarakan, serta perahu motor di wilayah muara Sebuku-Sembakung.",
      interpretation:
        "Nunukan adalah kawasan perbatasan terdepan dengan sentra produksi rumput laut nasional dan perkebunan sawit. UMK Rp3,85 juta terjaga efektivitasnya karena akses komoditas perdagangan lintas batas (Tawau-Nunukan) yang menjaga ketersediaan barang konsumsi harian.",
    },
    {
      regionCode: "65.03",
      rentRange: {
        min: 500000,
        max: 2100000,
        note:
          "Kost pekerja perkebunan sawit, kehutanan HTI, dan aparatur pemerintah di Tideng Pale, Sesayap Hilir, dan Betayau.",
      },
      transportContext:
        "Sepeda motor harian, speedboat reguler Pelabuhan Tideng Pale menyusuri Sungai Sesayap menuju Tarakan, dan mobil travel poros darat Trans Kaltara.",
      interpretation:
        "Kabupaten Tana Tidung berpusat di tepian Sungai Sesayap dengan fokus pembangunan pusat pemerintahan terpadu dan infrastruktur penghubung antarwilayah. UMK Rp3,87 juta memberikan kepastian daya beli bagi tenaga kerja lokal dan pendatang.",
    },
  ],
};
