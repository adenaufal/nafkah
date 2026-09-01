import type { ProvinceDataPackage } from "./types";

export const kepulauan_riau_data: ProvinceDataPackage = {
  provinceName: "Kepulauan Riau",
  provinceCode: "21",
  regions: [
    {
      code: "21.02",
      name: "Bintan",
      province: "Kepulauan Riau",
      provinceCode: "21",
      centroid: [105.2099, 0.9257],
      tier: "kabupaten",
    },
    {
      code: "21.01",
      name: "Karimun",
      province: "Kepulauan Riau",
      provinceCode: "21",
      centroid: [103.5595, 0.8312],
      tier: "kabupaten",
    },
    {
      code: "21.05",
      name: "Kepulauan Anambas",
      province: "Kepulauan Riau",
      provinceCode: "21",
      centroid: [106.1068, 3.0983],
      tier: "kabupaten",
    },
    {
      code: "21.71",
      name: "Kota Batam",
      province: "Kepulauan Riau",
      provinceCode: "21",
      centroid: [104.0752, 0.9343],
      tier: "kota",
    },
    {
      code: "21.72",
      name: "Kota Tanjung Pinang",
      province: "Kepulauan Riau",
      provinceCode: "21",
      centroid: [104.4733, 0.9121],
      tier: "kota",
    },
    {
      code: "21.04",
      name: "Lingga",
      province: "Kepulauan Riau",
      provinceCode: "21",
      centroid: [104.5154, -0.0878],
      tier: "kabupaten",
    },
    {
      code: "21.03",
      name: "Natuna",
      province: "Kepulauan Riau",
      provinceCode: "21",
      centroid: [108.3333, 3.5692],
      tier: "kabupaten",
    },
  ],
  wages: [
    {
      regionCode: "21.02",
      year: 2026,
      grossMonthly: 4583221,
      estimatedTakeHomeMonthly: Math.round(4583221 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Riau No. 1333 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Kepulauan Riau Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "21.01",
      year: 2026,
      grossMonthly: 3879520,
      estimatedTakeHomeMonthly: Math.round(3879520 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Riau tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "21.05",
      year: 2026,
      grossMonthly: 3879520,
      estimatedTakeHomeMonthly: Math.round(3879520 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Riau tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "21.71",
      year: 2026,
      grossMonthly: 5357982,
      estimatedTakeHomeMonthly: Math.round(5357982 * 0.96),
      source:
        "Surat Walikota Batam No. 1134/500.15.14.1/XII/2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Kepulauan Riau Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "21.72",
      year: 2026,
      grossMonthly: 3879520,
      estimatedTakeHomeMonthly: Math.round(3879520 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Riau No. 1332 Tahun 2025 tentang Upah Minimum Kabupaten/Kota di Provinsi Kepulauan Riau Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "21.04",
      year: 2026,
      grossMonthly: 3879520,
      estimatedTakeHomeMonthly: Math.round(3879520 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Riau tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "21.03",
      year: 2026,
      grossMonthly: 3879520,
      estimatedTakeHomeMonthly: Math.round(3879520 * 0.96),
      source:
        "Keputusan Gubernur Kepulauan Riau tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "21.02",
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
          amount: 381000,
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
          amount: 340000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "21.01",
      baseline: {
        housing: {
          amount: 874000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1420000,
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
          amount: 319000,
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
          amount: 247000,
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
          amount: 319000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "21.05",
      baseline: {
        housing: {
          amount: 1132000,
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
          amount: 350000,
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
          amount: 216000,
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
          amount: 381000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "21.71",
      baseline: {
        housing: {
          amount: 1440000,
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
          amount: 401000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "21.72",
      baseline: {
        housing: {
          amount: 926000,
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
          amount: 329000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "21.04",
      baseline: {
        housing: {
          amount: 617000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1337000,
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
          amount: 298000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "21.03",
      baseline: {
        housing: {
          amount: 772000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1523000,
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
          amount: 319000,
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
      regionCode: "21.02",
      rentRange: {
        min: 600000,
        max: 2500000,
        note:
          "Kost pekerja pabrik di Seri Kuala Lobam (Bintan Industrial Estate) dan pariwisata Teluk Sebong relatif terjangkau; perumahan di Tanjung Uban dan Kijang menawarkan opsi keluarga.",
      },
      transportContext:
        "Sepeda motor mendominasi mobilitas harian; jarak antar-sentra industri (Lobam, Lagoi, Kijang) cukup jauh sehingga pengeluaran BBM relatif lebih tinggi.",
      interpretation:
        "Dengan UMK Rp4,58 juta (tertinggi kedua di Kepri setelah Batam), Bintan didorong oleh klaster industri manufaktur Lobam dan resort internasional Lagoi. Biaya hidup moderat-tinggi, namun ketersediaan fasilitas mes karyawan atau dormitori industri sangat membantu menekan biaya sewa bagi pekerja lajang.",
    },
    {
      regionCode: "21.01",
      rentRange: {
        min: 550000,
        max: 2000000,
        note:
          "Kamar kost pekerja tersebar di Meral dan Tebing dekat galangan kapal; unit AC tengah kota Tanjung Balai Karimun berkisar Rp1,2 - 2 juta.",
      },
      transportContext:
        "Sepeda motor merupakan transportasi utama di Pulau Karimun Besar; angkutan kota (angkot) dan boat pompong menghubungkan pulau-pulau kecil seperti Kundur dan Buru.",
      interpretation:
        "Aktivitas industri maritim, galangan kapal (shipyard), dan pertambangan granit menopang UMK Karimun sebesar Rp3,88 juta. Mengingat sebagian besar bahan pangan pokok dipasok melalui jalur laut dari Riau daratan dan Sumatera, pengelolaan anggaran belanja konsumsi harian menjadi kunci kesejahteraan finansial pekerja.",
    },
    {
      regionCode: "21.05",
      rentRange: {
        min: 700000,
        max: 2800000,
        note:
          "Kontur perbukitan dan keterbatasan lahan di Kota Tarempa membuat sewa kamar/rumah relatif mahal; di Palmatak sewa banyak dipengaruhi sektor penunjang migas lepas pantai.",
      },
      transportContext:
        "Sepeda motor di jalanan sempit bertingkat Tarempa dan Matak; mobilitas antarpulau pulau Siantan, Jemaja, dan Matak bergantung sepenuhnya pada boat pancung, speedboat, dan kapal Pelni/perintis.",
      interpretation:
        "Anambas memiliki UMK tinggi (Rp3,88 juta) sebagai kompensasi atas letak geografis terpencil dan biaya logistik maritim yang signifikan. Harga barang konsumsi impor antarpulau cukup tinggi, namun hasil laut segar melimpah dan murah, sehingga efisiensi hidup bertumpu pada adaptasi pola konsumsi pangan lokal.",
    },
    {
      regionCode: "21.71",
      rentRange: {
        min: 750000,
        max: 3500000,
        note:
          "Ketersediaan dormitori dan kamar kost buruh di Mukakuning/Batu Aji melimpah; Batam Kota dan Nagoya berstandar lebih tinggi dengan fasilitas modern.",
      },
      transportContext:
        "Bus Trans Batam melayani rute antardistrik utama; bus jemputan karyawan kawasan industri dan sepeda motor mendominasi mobilitas pekerja.",
      interpretation:
        "Karakter Batam sebagai kawasan perdagangan bebas (FTZ) mendorong UMK tertinggi di Kepri (Rp5,36 juta) guna mengimbangi ketergantungan logistik antarpulau dan gaya hidup urban. Pekerja lajang berpenghasilan UMK dapat menikmati tabungan memadai jika bijak memilih hunian di sekitar koridor industri.",
    },
    {
      regionCode: "21.72",
      rentRange: {
        min: 500000,
        max: 2400000,
        note:
          "Kost mahasiswa dan pegawai di Tanjungpinang Timur, KM 5-9, dan Senggarang terjangkau; area perkantoran Dompak dan Tepi Laut lebih premium.",
      },
      transportContext:
        "Angkutan kota (angkot) dan sepeda motor; koneksi antarpulau ke Batam atau Pulau Penyengat dilayani pompong dan kapal ferry cepat dari Pelabuhan Sri Bintan Pura.",
      interpretation:
        "Sebagai ibu kota provinsi Kepulauan Riau, Tanjungpinang berkarakter kota administrasi dan pendidikan dengan UMK Rp3,88 juta. Biaya hidup secara umum lebih moderat dibanding Batam, memberikan ruang pernapasan finansial yang cukup sehat bagi pekerja lajang.",
    },
    {
      regionCode: "21.04",
      rentRange: {
        min: 400000,
        max: 1500000,
        note:
          "Tarif sewa kamar di Dabo Singkep dan Daik Lingga sangat ramah kantong, mayoritas berupa kamar non-AC atau rumah sewa semi-permanen.",
      },
      transportContext:
        "Sepeda motor di daratan Singkep dan Lingga; perjalanan antarpulau utama (Dabo Singkep - Daik Lingga - Jagoh) menggunakan kapal cepat (speedboat) atau kapal roro.",
      interpretation:
        "Kabupaten Lingga menerapkan upah minimum berbasis UMP Kepri (Rp3,88 juta). Struktur biaya hidup di Lingga relatif lebih tenang dengan kekayaan sumber daya perikanan dan pertanian lokal, menjadikannya salah satu daerah dengan tekanan pengeluaran gaya hidup paling terkendali di Kepri.",
    },
    {
      regionCode: "21.03",
      rentRange: {
        min: 500000,
        max: 1800000,
        note:
          "Kamar sewa di Ranai Kota dan Bunguran Timur tergolong terjangkau; ketersediaan hunian bertipe paviliun/kontrakan terbatas dan banyak diisi pegawai instansi serta personel pertahanan.",
      },
      transportContext:
        "Mobilitas di Pulau Bunguran mengandalkan sepeda motor melintasi jalan lingkar pulau yang mulus; koneksi antarpulau seperti Midai dan Serasan bertumpu pada kapal perintis dan pompong nelayan.",
      interpretation:
        "Sebagai beranda terdepan NKRI di Laut Natuna Utara, Natuna memiliki UMK Rp3,88 juta. Ketergantungan tinggi pada pasokan barang manufaktur dan komoditas sayur/telur via kapal kargo Tol Laut membuat harga pangan non-ikan fluktuatif mengikuti musim ombak laut (musim utara).",
    },
  ],
};
