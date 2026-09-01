import type { ProvinceDataPackage } from "./types";

export const papua_data: ProvinceDataPackage = {
  provinceName: "Papua",
  provinceCode: "91",
  regions: [
    {
      code: "94.71",
      name: "Kota Jayapura",
      province: "Papua",
      provinceCode: "91",
      centroid: [140.7561, -2.6228],
      tier: "kota",
    },
    {
      code: "94.03",
      name: "Jayapura",
      province: "Papua",
      provinceCode: "91",
      centroid: [140.0541, -3.0989],
      tier: "kabupaten",
    },
    {
      code: "94.20",
      name: "Keerom",
      province: "Papua",
      provinceCode: "91",
      centroid: [140.5497, -3.4833],
      tier: "kabupaten",
    },
    {
      code: "94.19",
      name: "Sarmi",
      province: "Papua",
      provinceCode: "91",
      centroid: [139.0142, -2.6011],
      tier: "kabupaten",
    },
    {
      code: "94.28",
      name: "Mamberamo Raya",
      province: "Papua",
      provinceCode: "91",
      centroid: [137.8158, -2.4215],
      tier: "kabupaten",
    },
    {
      code: "94.09",
      name: "Biak Numfor",
      province: "Papua",
      provinceCode: "91",
      centroid: [135.8936, -1.0609],
      tier: "kabupaten",
    },
    {
      code: "94.27",
      name: "Supiori",
      province: "Papua",
      provinceCode: "91",
      centroid: [135.5485, -0.7396],
      tier: "kabupaten",
    },
    {
      code: "94.08",
      name: "Kepulauan Yapen",
      province: "Papua",
      provinceCode: "91",
      centroid: [135.9894, -1.7196],
      tier: "kabupaten",
    },
    {
      code: "94.26",
      name: "Waropen",
      province: "Papua",
      provinceCode: "91",
      centroid: [136.7122, -2.7126],
      tier: "kabupaten",
    },
  ],
  wages: [
    {
      regionCode: "94.71",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.03",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.20",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.19",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.28",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.09",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.27",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.08",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.26",
      year: 2026,
      grossMonthly: 4436283,
      estimatedTakeHomeMonthly: Math.round(4436283 * 0.96),
      source:
        "Keputusan Gubernur Papua No. 100.3.3.1/KEP.409/2025 tentang Upah Minimum Provinsi Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "94.71",
      baseline: {
        housing: {
          amount: 1389000,
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
          amount: 412000,
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
          amount: 298000,
          source:
            "Estimasi komponen perawatan pribadi & rumah tangga — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        leisure: {
          amount: 350000,
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
          amount: 432000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "94.03",
      baseline: {
        housing: {
          amount: 1029000,
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
          amount: 360000,
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
          amount: 123000,
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
      regionCode: "94.20",
      baseline: {
        housing: {
          amount: 874000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1646000,
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
          amount: 350000,
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
          amount: 123000,
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
      regionCode: "94.19",
      baseline: {
        housing: {
          amount: 823000,
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
          amount: 350000,
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
          amount: 267000,
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
          amount: 123000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 370000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "94.28",
      baseline: {
        housing: {
          amount: 977000,
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
          amount: 463000,
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
          amount: 288000,
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
          amount: 123000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 432000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "94.09",
      baseline: {
        housing: {
          amount: 977000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1646000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 350000,
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
          amount: 257000,
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
          amount: 123000,
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
      regionCode: "94.27",
      baseline: {
        housing: {
          amount: 772000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1646000,
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
          amount: 340000,
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
          amount: 123000,
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
      regionCode: "94.08",
      baseline: {
        housing: {
          amount: 926000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1646000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 360000,
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
          amount: 123000,
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
      regionCode: "94.26",
      baseline: {
        housing: {
          amount: 823000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1749000,
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
          amount: 350000,
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
          amount: 267000,
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
          amount: 123000,
          source:
            "Alokasi pengembangan diri, kursus & materi edukasi — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        contingency: {
          amount: 370000,
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
      regionCode: "94.71",
      rentRange: {
        min: 750000,
        max: 3500000,
        note:
          "Kost mahasiswa UNCEN di Abepura/Waena terjangkau; Jayapura Utara dan pusat kota bertarif lebih tinggi.",
      },
      transportContext:
        "Trans Jayapura, angkot trayek Abepura-Kota, dan Jembatan Youtefa.",
      interpretation:
        "Jayapura sebagai kota terbesar di Pulau Papua memiliki biaya hidup relatif tinggi karena faktor transportasi logistik. UMK Rp4,44 juta memberikan perlindungan upah yang signifikan bagi pekerja formal.",
    },
    {
      regionCode: "94.03",
      rentRange: {
        min: 600000,
        max: 2500000,
        note:
          "Area Sentani dan jalan poros Abepura-Sentani memiliki variasi sewa rumah dan kost cukup luas.",
      },
      transportContext:
        "Akses bandara internasional Sentani, trayek angkot Sentani-Jayapura.",
      interpretation:
        "Kabupaten Jayapura menjadi penyangga utama ibu kota provinsi dengan biaya sewa hunian yang lebih bersahabat dibanding Kota Jayapura.",
    },
    {
      regionCode: "94.09",
      rentRange: {
        min: 500000,
        max: 2200000,
        note:
          "Kost pekerja dan pelaut di area Samofa dan Biak Kota relatif stabil.",
      },
      transportContext:
        "Angkutan kota Biak, akses bandara Frans Kaisiepo dan pelabuhan laut internasional Biak.",
      interpretation:
        "Biak Numfor sebagai pusat maritim kawasan Teluk Cenderawasih memiliki stabilitas pasokan pangan laut dengan biaya hidup moderat.",
    },
    {
      regionCode: "94.20",
      rentRange: {
        min: 500000,
        max: 2000000,
        note:
          "Hunian sewa terkonsentrasi di Arso dan jalan poros utama perkebunan sawit Keerom.",
      },
      transportContext:
        "Jalur darat poros Jayapura-Arso (1-2 jam) dan akses Pos Lintas Batas Negara (PLBN) Skouw.",
      interpretation:
        "Keerom merupakan lumbung pangan hortikultura dan perkebunan di tapal batas timur Papua. Kedekatan akses darat dengan Jayapura menjaga pasokan barang manufaktur tetap lancar dengan standar UMP Rp4,44 juta.",
    },
    {
      regionCode: "94.19",
      rentRange: {
        min: 450000,
        max: 1900000,
        note:
          "Rumah dinas dan sewa warga tersedia di seputaran Sarmi Kota dan Mararena.",
      },
      transportContext:
        "Jalan Trans-Papua poros Jayapura-Sarmi (6-8 jam) dan Pelabuhan Laut Sarmi.",
      interpretation:
        "Dikenal sebagai Kota Ombak, Sarmi kaya akan potensi kelapa dan perikanan laut segar. UMP Rp4,44 juta mencukupi kebutuhan dasar berkat harga pangan laut lokal yang sangat terjangkau.",
    },
    {
      regionCode: "94.28",
      rentRange: {
        min: 600000,
        max: 2200000,
        note:
          "Struktur rumah panggung kayu khas tepi sungai di Burmeso dan Kasonaweja.",
      },
      transportContext:
        "Transportasi air perahu motor/longboat menyusuri Sungai Mamberamo dan penerbangan perintis di Lapangan Terbang Kasonaweja.",
      interpretation:
        "Mamberamo Raya memiliki tantangan konektivitas pedalaman DAS terbesar di Papua. Kebutuhan sembako olahan dipengaruhi ongkos angkut perintis dan sungai, diimbangi melimpahnya ikan tawar dan sagu lokal di bawah proteksi UMP Rp4,44 juta.",
    },
    {
      regionCode: "94.27",
      rentRange: {
        min: 450000,
        max: 1800000,
        note:
          "Akomodasi sederhana di Sorendiweri menyatu dengan perkampungan pesisir dan instansi pemda.",
      },
      transportContext:
        "Jembatan penghubung darat Biak-Supiori dan jalan lingkar pulau pesisir utara.",
      interpretation:
        "Supiori memiliki integrasi ekonomi dan logistik yang sangat erat dengan Biak Numfor. Pasokan hasil laut harian sangat melimpah dengan UMP Rp4,44 juta yang menjaga stabilitas daya beli masyarakat pekerja.",
    },
    {
      regionCode: "94.08",
      rentRange: {
        min: 550000,
        max: 2300000,
        note:
          "Kost pelajar dan pekerja di Serui Kota tergolong dinamis dengan ketersediaan fasilitas perkotaan yang lengkap.",
      },
      transportContext:
        "Pelabuhan Nusantara Serui, Bandara Stevanus Rumbewas Kepi/Serui, serta angkutan kota Serui.",
      interpretation:
        "Kepulauan Yapen berpusat di Kota Serui sebagai simpul pendidikan dan perdagangan Teluk Cenderawasih. Komoditas kopi Ambaidiru dan kakao melengkapi ekonomi bahari lokal dengan perlindungan UMP Rp4,44 juta.",
    },
    {
      regionCode: "94.26",
      rentRange: {
        min: 450000,
        max: 1900000,
        note:
          "Hunian panggung kayu pesisir bakau di Waren dan kawasan perkantoran Botawa.",
      },
      transportContext:
        "Speedboat penyeberangan Selat Yapen ke Serui, kapal perintis, dan sepeda motor komuter pesisir.",
      interpretation:
        "Waropen yang berjuluk Negeri Sejuta Bakau memiliki keunggulan kepiting bakau dan perikanan pantai. Rantai pasokan barang pabrikan yang menginduk ke Serui diimbangi oleh standar upah UMP Rp4,44 juta.",
    },
  ],
};
