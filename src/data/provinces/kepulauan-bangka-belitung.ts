import type { ProvinceDataPackage } from "./types";

export const kepulauan_bangka_belitung_data: ProvinceDataPackage = {
  provinceName: "Kepulauan Bangka Belitung",
  provinceCode: "19",
  regions: [
    {
      code: "19.01",
      name: "Bangka",
      province: "Kepulauan Bangka Belitung",
      provinceCode: "19",
      centroid: [105.9093, -1.9332],
      tier: "kabupaten",
    },
    {
      code: "19.02",
      name: "Belitung",
      province: "Kepulauan Bangka Belitung",
      provinceCode: "19",
      centroid: [107.6392, -2.8959],
      tier: "kabupaten",
    },
    {
      code: "19.03",
      name: "Bangka Barat",
      province: "Kepulauan Bangka Belitung",
      provinceCode: "19",
      centroid: [105.51, -1.8801],
      tier: "kabupaten",
    },
    {
      code: "19.04",
      name: "Bangka Tengah",
      province: "Kepulauan Bangka Belitung",
      provinceCode: "19",
      centroid: [106.2448, -2.4544],
      tier: "kabupaten",
    },
    {
      code: "19.05",
      name: "Bangka Selatan",
      province: "Kepulauan Bangka Belitung",
      provinceCode: "19",
      centroid: [106.4826, -2.795],
      tier: "kabupaten",
    },
    {
      code: "19.06",
      name: "Belitung Timur",
      province: "Kepulauan Bangka Belitung",
      provinceCode: "19",
      centroid: [108.0878, -2.929],
      tier: "kabupaten",
    },
    {
      code: "19.71",
      name: "Kota Pangkal Pinang",
      province: "Kepulauan Bangka Belitung",
      provinceCode: "19",
      centroid: [106.1114, -2.1099],
      tier: "kota",
    },
  ],
  wages: [
    {
      regionCode: "19.01",
      year: 2026,
      grossMonthly: 4035000,
      estimatedTakeHomeMonthly: Math.round(4035000 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Bangka Belitung tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "19.02",
      year: 2026,
      grossMonthly: 4035000,
      estimatedTakeHomeMonthly: Math.round(4035000 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Bangka Belitung tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "19.03",
      year: 2026,
      grossMonthly: 4035000,
      estimatedTakeHomeMonthly: Math.round(4035000 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Bangka Belitung tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "19.04",
      year: 2026,
      grossMonthly: 4035000,
      estimatedTakeHomeMonthly: Math.round(4035000 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Bangka Belitung tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "19.05",
      year: 2026,
      grossMonthly: 4035000,
      estimatedTakeHomeMonthly: Math.round(4035000 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Bangka Belitung tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "19.06",
      year: 2026,
      grossMonthly: 4035000,
      estimatedTakeHomeMonthly: Math.round(4035000 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Bangka Belitung tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "19.71",
      year: 2026,
      grossMonthly: 4035000,
      estimatedTakeHomeMonthly: Math.round(4035000 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Bangka Belitung tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "19.01",
      baseline: {
        housing: {
          amount: 772000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1389000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 309000,
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
          amount: 237000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 247000,
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
          amount: 298000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "19.02",
      baseline: {
        housing: {
          amount: 874000,
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
          amount: 329000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 309000,
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
          amount: 247000,
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
          amount: 103000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 319000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "19.03",
      baseline: {
        housing: {
          amount: 669000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1317000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 298000,
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
          amount: 257000,
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
          amount: 226000,
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
          amount: 288000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "19.04",
      baseline: {
        housing: {
          amount: 720000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1358000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 329000,
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
          amount: 237000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 247000,
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
          amount: 298000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "19.05",
      baseline: {
        housing: {
          amount: 617000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1286000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 298000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 267000,
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
          amount: 216000,
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
          amount: 278000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "19.06",
      baseline: {
        housing: {
          amount: 669000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1358000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 309000,
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
          amount: 257000,
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
          amount: 237000,
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
          amount: 288000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "19.71",
      baseline: {
        housing: {
          amount: 977000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1492000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 340000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 329000,
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
          amount: 340000,
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
      regionCode: "19.01",
      rentRange: {
        min: 450000,
        max: 1800000,
        note:
          "Kost mahasiswa terjangkau di Balunijuk dan Merawang dekat UBB; kamar AC pegawai di Sungailiat bertarif menengah.",
      },
      transportContext:
        "Sepeda motor merupakan andalan utama; koridor jalan raya Sungailiat-Pangkalpinang berkondisi sangat baik dengan aspal mulus dan lajur lebar.",
      interpretation:
        "Kabupaten Bangka memadukan pusat akademik (UBB dan Polman Timah) dengan pesisir pariwisata Sungailiat. Biaya hidup moderat dengan limpahan hasil laut segar, di mana UMK Rp4,04 juta memberikan ruang tabungan yang sehat bagi pekerja lajang.",
    },
    {
      regionCode: "19.02",
      rentRange: {
        min: 500000,
        max: 2200000,
        note:
          "Pilihan kost karyawan hotel dan perbankan terpusat di Tanjung Pandan (Lesung Batang, Paal Satu, Air Merbau).",
      },
      transportContext:
        "Didominasi sepeda motor pribadi dan kendaraan sewa pariwisata; infrastruktur jalan aspal di Belitung sangat mulus dan bebas kemacetan.",
      interpretation:
        "Sebagai ikon destinasi Geopark Belitong UNESCO, dinamika pariwisata dan rantai pasok antarpulau membentuk struktur harga barang konsumen yang relatif lebih tinggi, namun UMK Rp4,04 juta mampu mencukupi kebutuhan hidup pekerja sektor pariwisata dan jasa secara layak.",
    },
    {
      regionCode: "19.03",
      rentRange: {
        min: 400000,
        max: 1500000,
        note:
          "Kamar kost sederhana banyak disewa pekerja pelabuhan dan industri peleburan timah di Muntok dan Jebus.",
      },
      transportContext:
        "Sepeda motor menjadi andalan utama mobilitas harian; Pelabuhan Tanjung Kalian menjadi simpul vital penyeberangan kapal feri menuju Tanjung Api-Api (Sumsel).",
      interpretation:
        "Bangka Barat bertindak sebagai gerbang logistik barat pulau Bangka dengan kekuatan industri peleburan timah dan perkebunan lada putih (Muntok White Pepper). Biaya hidup harian terhitung ramah berkat pasokan ikan melimpah dari Selat Bangka, menghasilkan rasio keterjangkauan upah yang sangat baik.",
    },
    {
      regionCode: "19.04",
      rentRange: {
        min: 450000,
        max: 1600000,
        note:
          "Pilihan kost banyak di Pangkalan Baru dekat Bandara Depati Amir dan perbatasan ibukota; area Koba menyediakan opsi kost pekerja.",
      },
      transportContext:
        "Tingginya mobilitas komuter harian antara kawasan Pangkalan Baru dan Kota Pangkalpinang menjadikan sepeda motor sarana transportasi paling praktis.",
      interpretation:
        "Bangka Tengah memiliki posisi strategis sebagai perlintasan antarwilayah pulau Bangka dan penyangga bandara utama. Potensi perikanan pesisir Kurau dan hasil kebun lokal menjaga kestabilan harga pangan, sehingga standar UMK Rp4,04 juta memberikan daya beli yang sangat memadai.",
    },
    {
      regionCode: "19.05",
      rentRange: {
        min: 400000,
        max: 1300000,
        note:
          "Hunian sewa dan kost terpusat di pusat kota Toboali untuk pegawai pemerintah dan pekerja pelabuhan/industri Sadai.",
      },
      transportContext:
        "Sepeda motor menjadi kendaraan utama melintasi jalan lintas selatan Bangka; Kawasan Industri Sadai dan pelabuhan feri menjadi simpul transportasi penting.",
      interpretation:
        "Sebagai lumbung pangan Bangka Belitung dengan hamparan persawahan Desa Rias dan sentra perikanan/terasi Toboali, Bangka Selatan menawarkan pengeluaran pangan pokok yang paling hemat di Pulau Bangka. UMK Rp4,04 juta memberikan surplus tabungan yang sangat kompetitif.",
    },
    {
      regionCode: "19.06",
      rentRange: {
        min: 400000,
        max: 1400000,
        note:
          "Pilihan kost kamar mandi dalam dan rumah sewa terjangkau di Manggar untuk pegawai pemda dan pekerja perkebunan/tambang.",
      },
      transportContext:
        "Kondisi jalan aspal mulus dan lengang antarkecamatan memudahkan mobilitas roda dua; akses ke Bandara Tanjungpandan ditempuh sekitar 1-1,5 jam.",
      interpretation:
        "Dikenal sebagai 'Kota 1001 Warung Kopi' dan latar kisah Laskar Pelangi, Belitung Timur menawarkan kultur sosial yang hangat dengan biaya rekreasi ngopi yang sangat murah meriah. Dengan UMK Rp4,04 juta dan harga hunian yang terjangkau, standar hidup pekerja lajang berada pada taraf yang sangat nyaman.",
    },
    {
      regionCode: "19.71",
      rentRange: {
        min: 500000,
        max: 2500000,
        note:
          "Kost di Gerunggang dan Gabek terjangkau; area perniagaan Pasar Pagi dan Girimaya bertarif sedang.",
      },
      transportContext:
        "Angkot dan sepeda motor pribadi; mobilitas antarkota di Pulau Bangka dilayani travel dan bus antarkota.",
      interpretation:
        "Karakter kepulauan membuat sebagian komoditas pangan olahan didatangkan dari luar pulau, namun UMK Rp4,04 juta cukup proporsional untuk menopang biaya hidup lajang di ibukota provinsi.",
    },
  ],
};
