import type { ProvinceDataPackage } from "./types";

export const banten_data: ProvinceDataPackage = {
  provinceName: "Banten",
  provinceCode: "36",
  regions: [
    {
      code: "36.72",
      name: "Kota Cilegon",
      province: "Banten",
      provinceCode: "36",
      centroid: [106.012, -6.001],
      tier: "kota",
    },
    {
      code: "36.73",
      name: "Kota Serang",
      province: "Banten",
      provinceCode: "36",
      centroid: [106.1698, -6.1239],
      tier: "kota",
    },
    {
      code: "36.71",
      name: "Kota Tangerang",
      province: "Banten",
      provinceCode: "36",
      centroid: [106.6589, -6.1792],
      tier: "kota",
    },
    {
      code: "36.74",
      name: "Kota Tangerang Selatan",
      province: "Banten",
      provinceCode: "36",
      centroid: [106.6949, -6.2907],
      tier: "kota",
    },
    {
      code: "36.02",
      name: "Lebak",
      province: "Banten",
      provinceCode: "36",
      centroid: [106.2158, -6.6394],
      tier: "kabupaten",
    },
    {
      code: "36.01",
      name: "Pandeglang",
      province: "Banten",
      provinceCode: "36",
      centroid: [105.6273, -6.6028],
      tier: "kabupaten",
    },
    {
      code: "36.04",
      name: "Serang",
      province: "Banten",
      provinceCode: "36",
      centroid: [106.1297, -6.1141],
      tier: "kabupaten",
    },
    {
      code: "36.03",
      name: "Tangerang",
      province: "Banten",
      provinceCode: "36",
      centroid: [106.5353, -6.185],
      tier: "kabupaten",
    },
  ],
  wages: [
    {
      regionCode: "36.72",
      year: 2026,
      grossMonthly: 5469923,
      estimatedTakeHomeMonthly: Math.round(5469923 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "36.73",
      year: 2026,
      grossMonthly: 4665928,
      estimatedTakeHomeMonthly: Math.round(4665928 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "36.71",
      year: 2026,
      grossMonthly: 5399406,
      estimatedTakeHomeMonthly: Math.round(5399406 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "36.74",
      year: 2026,
      grossMonthly: 5247870,
      estimatedTakeHomeMonthly: Math.round(5247870 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "36.02",
      year: 2026,
      grossMonthly: 3330011,
      estimatedTakeHomeMonthly: Math.round(3330011 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "36.01",
      year: 2026,
      grossMonthly: 3360078,
      estimatedTakeHomeMonthly: Math.round(3360078 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "36.04",
      year: 2026,
      grossMonthly: 5178521,
      estimatedTakeHomeMonthly: Math.round(5178521 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "36.03",
      year: 2026,
      grossMonthly: 5210377,
      estimatedTakeHomeMonthly: Math.round(5210377 * 0.96),
      source:
        "Keputusan Gubernur Banten No. 703 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Banten Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "36.72",
      baseline: {
        housing: {
          amount: 1389000,
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
          amount: 432000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 401000,
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
          amount: 422000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "36.73",
      baseline: {
        housing: {
          amount: 1080000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1440000,
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
          amount: 340000,
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
      regionCode: "36.71",
      baseline: {
        housing: {
          amount: 1543000,
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
          amount: 453000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 412000,
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
          amount: 288000,
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
      regionCode: "36.74",
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
          amount: 453000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "36.02",
      baseline: {
        housing: {
          amount: 700000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1152000,
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
          amount: 267000,
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
          amount: 206000,
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
          amount: 257000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "36.01",
      baseline: {
        housing: {
          amount: 720000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1183000,
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
          amount: 216000,
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
          amount: 267000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "36.04",
      baseline: {
        housing: {
          amount: 1183000,
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
          amount: 267000,
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
          amount: 381000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "36.03",
      baseline: {
        housing: {
          amount: 1286000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1595000,
          source:
            "Model estimasi keranjang konsumsi pangan berbasis Susenas & IHK — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        transport: {
          amount: 422000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 381000,
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
          amount: 319000,
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
          amount: 401000,
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
      regionCode: "36.72",
      rentRange: {
        min: 650000,
        max: 3200000,
        note:
          "Kost pekerja industri petrokimia dan baja di Ciwandan, Citangkil, dan Grogol melimpah; fasilitas lengkap AC di pusat kota bertarif standar.",
      },
      transportContext:
        "KA Lokal Merak-Rangkasbitung, angkot perkotaan, dan bus jemputan industri lintas pabrik.",
      interpretation:
        "Sebagai kota industri berat 'Kota Baja', Cilegon menetapkan UMK tertinggi di Banten (Rp5,47 juta) dengan biaya hidup lokal yang relatif moderat, menghasilkan tingkat surplus yang menguntungkan pekerja industri.",
    },
    {
      regionCode: "36.73",
      rentRange: {
        min: 500000,
        max: 2500000,
        note:
          "Kost mahasiswa UNTIRTA/UIN dan pegawai Pemprov di Cipocok Jaya, Ciceri, dan Serang Barat sangat terjangkau.",
      },
      transportContext:
        "KA Lokal Merak, angkot perkotaan Serang, dan bus antarkota di Terminal Pakupatan.",
      interpretation:
        "Ibu kota Banten ini memiliki ritme administrasi dan perdagangan regional dengan biaya hidup lebih bersahabat dibanding zona industri Cilegon/Tangerang. UMK Rp4,67 juta memberikan ruang tabungan yang sehat.",
    },
    {
      regionCode: "36.71",
      rentRange: {
        min: 700000,
        max: 3500000,
        note:
          "Kost buruh dan karyawan di Batuceper, Cikokol, Cipondoh, dan Karawaci berlimpah dengan variasi harga bersahabat.",
      },
      transportContext:
        "KRL Commuter Line Tangerang-Duri, Kereta Bandara Soekarno-Hatta, Trans Tangerang Ayo (Tayo), dan TransJakarta koridor penghubung.",
      interpretation:
        "Kota Tangerang memadukan pusat industri manufaktur dan kawasan penyangga Jabodetabek dengan UMK Rp5,40 juta. Biaya hidup sedikit di bawah Jakarta membuat keterjangkauan upah pekerja berada pada kategori yang cukup baik.",
    },
    {
      regionCode: "36.74",
      rentRange: {
        min: 800000,
        max: 4500000,
        note:
          "Kost mahasiswa UIN/Pamulang sangat terjangkau; kawasan terencana BSD City, Bintaro, dan Alam Sutera bertarif premium.",
      },
      transportContext:
        "KRL Rangkasbitung-Tanah Abang (Stasiun Jurangmangu, Sudimara, Rawa Buntu), bus Trans BSD, dan feeder TransJakarta.",
      interpretation:
        "Tangsel memiliki karakteristik permukiman kelas menengah-atas dengan sentra komersial modern. UMK Rp5,25 juta mencukupi bagi pekerja yang memilih hunian di kawasan penyangga seperti Pamulang dan Ciputat.",
    },
    {
      regionCode: "36.02",
      rentRange: {
        min: 350000,
        max: 1500000,
        note:
          "Kost di sekitar Stasiun Rangkasbitung dan area perkotaan tergolong murah; didominasi rumah kontrakan sederhana dan kost kamar mandi luar/dalam standar.",
      },
      transportContext:
        "KRL Commuter Line Rangkasbitung-Tanah Abang sebagai urat nadi komuter murah ke Jabodetabek, angkot pedesaan, dan sepeda motor.",
      interpretation:
        "Kabupaten Lebak memiliki UMK terendah di Banten (Rp3,33 juta) yang diimbangi oleh biaya pangan dan sewa hunian yang sangat terjangkau, didukung konektivitas KRL murah ke kawasan metropolitan.",
    },
    {
      regionCode: "36.01",
      rentRange: {
        min: 350000,
        max: 1500000,
        note:
          "Kost sederhana di area kota Pandeglang, Labuan, dan Menes berkisar ratusan ribu rupiah; pasokan didominasi sewa kamar non-AC.",
      },
      transportContext:
        "Minibus antarkota (Elf) Labuan-Pandeglang-Serang, angkot lokal, dan sepeda motor harian.",
      interpretation:
        "Didominasi sektor agraris dan pesisir, Pandeglang memiliki struktur biaya hidup pangan dan sewa rumah yang sangat rendah. UMK Rp3,36 juta memberikan daya beli yang stabil bagi pekerja lokal.",
    },
    {
      regionCode: "36.04",
      rentRange: {
        min: 500000,
        max: 2600000,
        note:
          "Kost buruh industri terkonsentrasi di kawasan Cikande, Kibin, Ciruas, dan Bojonegara; pilihan kamar petak kontrakan sangat melimpah.",
      },
      transportContext:
        "Jalur arteri Jl. Raya Serang-Jakarta, akses Tol Tangerang-Merak, KA Lokal Merak (Stasiun Catang/Cikeusal), dan angkot/bus karyawan.",
      interpretation:
        "Sebagai salah satu pusat industri manufaktur terbesar di Banten, Kabupaten Serang memiliki UMK tinggi (Rp5,18 juta) dengan biaya hidup sewa buruh yang kompetitif di Cikande dan Ciruas, menghasilkan ketahanan finansial pekerja yang solid.",
    },
    {
      regionCode: "36.03",
      rentRange: {
        min: 550000,
        max: 3000000,
        note:
          "Kost buruh pabrik di Cikupa, Balaraja, dan Pasar Kemis sangat kompetitif; kawasan permukiman terencana di Curug dan Kelapa Dua bertarif menengah.",
      },
      transportContext:
        "KRL Commuter Line (Stasiun Tigaraksa, Cikoya, Daru), bus antarwilayah Balaraja-Kalideres, jalan tol Jakarta-Tangerang-Merak, dan sepeda motor harian.",
      interpretation:
        "Kombinasi sentra manufaktur raksasa dan perluasan hunian suburban menghasilkan aktivitas ekonomi yang dinamis. UMK Rp5,21 juta seimbang dengan ragam pilihan biaya hidup hemat di kantong-kantong permukiman buruh.",
    },
  ],
};
