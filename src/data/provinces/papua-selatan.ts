import type { ProvinceDataPackage } from "./types";

export const papua_selatan_data: ProvinceDataPackage = {
  provinceName: "Papua Selatan",
  provinceCode: "93",
  regions: [
    {
      code: "94.01",
      name: "Merauke",
      province: "Papua Selatan",
      provinceCode: "93",
      centroid: [139.1017, -8.0046],
      tier: "kabupaten",
    },
    {
      code: "94.13",
      name: "Boven Digoel",
      province: "Papua Selatan",
      provinceCode: "93",
      centroid: [140.566, -6.238],
      tier: "kabupaten",
    },
    {
      code: "94.14",
      name: "Mappi",
      province: "Papua Selatan",
      provinceCode: "93",
      centroid: [139.021, -6.6881],
      tier: "kabupaten",
    },
    {
      code: "94.15",
      name: "Asmat",
      province: "Papua Selatan",
      provinceCode: "93",
      centroid: [138.1883, -5.5749],
      tier: "kabupaten",
    },
  ],
  wages: [
    {
      regionCode: "94.01",
      year: 2026,
      grossMonthly: 4508100,
      estimatedTakeHomeMonthly: Math.round(4508100 * 0.96),
      source:
        "Keputusan Gubernur Papua Selatan tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.13",
      year: 2026,
      grossMonthly: 4508100,
      estimatedTakeHomeMonthly: Math.round(4508100 * 0.96),
      source:
        "Keputusan Gubernur Papua Selatan tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.14",
      year: 2026,
      grossMonthly: 4508100,
      estimatedTakeHomeMonthly: Math.round(4508100 * 0.96),
      source:
        "Keputusan Gubernur Papua Selatan tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "94.15",
      year: 2026,
      grossMonthly: 4508100,
      estimatedTakeHomeMonthly: Math.round(4508100 * 0.96),
      source:
        "Keputusan Gubernur Papua Selatan tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "94.01",
      baseline: {
        housing: {
          amount: 1080000,
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
          amount: 309000,
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
      regionCode: "94.13",
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
          amount: 360000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "94.14",
      baseline: {
        housing: {
          amount: 1029000,
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
          amount: 453000,
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
          amount: 278000,
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
          amount: 391000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "94.15",
      baseline: {
        housing: {
          amount: 1235000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1903000,
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
          amount: 288000,
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
      regionCode: "94.01",
      rentRange: {
        min: 600000,
        max: 2600000,
        note:
          "Area perkotaan Merauke dan sekitar Universitas Musamus memiliki ketersediaan kost yang memadai bagi aparatur dan pekerja swasta.",
      },
      transportContext:
        "Jalan Trans-Papua Merauke-Boven Digoel, angkutan kota, serta operasional sepeda motor komuter harian.",
      interpretation:
        "Sebagai sentra lumbung pangan dan pusat pemerintahan Papua Selatan, Merauke memiliki stabilitas harga komoditas beras dan hasil bumi lokal yang relatif lebih terjangkau. Standar UMP Rp4,51 juta memberikan perlindungan daya beli yang solid bagi pekerja lajang di kawasan perkotaan timur ini.",
    },
    {
      regionCode: "94.13",
      rentRange: {
        min: 500000,
        max: 2200000,
        note:
          "Tanah Merah sebagai pusat kabupaten menyediakan hunian sewa bagi pekerja industri kelapa sawit, kehutanan, dan instansi pemda.",
      },
      transportContext:
        "Akses jalan poros darat Trans-Papua Merauke-Tanah Merah dan jalur transportasi sungai di Sungai Digoel.",
      interpretation:
        "Boven Digoel merupakan wilayah perbatasan timur dengan sektor perkebunan kelapa sawit dan kehutanan yang aktif menggerakkan ekonomi riil. Dengan standar upah Rp4,51 juta, pekerja dapat mencukupi kebutuhan dasar dengan alokasi transportasi dan logistik pedalaman yang proporsional.",
    },
    {
      regionCode: "94.14",
      rentRange: {
        min: 600000,
        max: 2400000,
        note:
          "Pusat hunian terkonsentrasi di Kepi dengan struktur rumah panggung kayu di atas kawasan rawa dan bantaran sungai.",
      },
      transportContext:
        "Transportasi darat roda dua di Kepi serta moda transportasi air (speedboat, longboat, perahu ketinting) menyusuri jejaring Sungai Digoel, Obaa, dan Mappi.",
      interpretation:
        "Dikenal sebagai Kota Sejuta Rawa, Mappi menghadapi tantangan geografis berbasis perairan tawar. Ketersediaan protein ikan dan sagu melimpah dengan harga terjangkau, sementara bahan pokok olahan dari luar pulau diseimbangkan oleh upah minimum Rp4,51 juta.",
    },
    {
      regionCode: "94.15",
      rentRange: {
        min: 750000,
        max: 3000000,
        note:
          "Agats didominasi oleh konstruksi jalan jembatan layang kayu dan beton bertulang (boardwalk), menuntut struktur hunian panggung khusus.",
      },
      transportContext:
        "Transportasi perkotaan Agats khusus menggunakan sepeda motor listrik di atas jalan papan/beton, serta kapal motor/speedboat antardistrik pesisir.",
      interpretation:
        "Asmat memiliki tata ruang unik dunia di atas tanah rawa lumpur pasang surut. Ketiadaan kendaraan berbahan bakar fosil di Agats menggeser pengeluaran transport ke motor listrik dan armada perairan, di mana UMP Rp4,51 juta menjadi penopang utama kesejahteraan pekerja menghadapi biaya logistik laut.",
    },
  ],
};
