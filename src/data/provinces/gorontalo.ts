import type { ProvinceDataPackage } from "./types";

export const gorontalo_data: ProvinceDataPackage = {
  provinceName: "Gorontalo",
  provinceCode: "75",
  regions: [
    {
      code: "75.01",
      name: "Boalemo",
      province: "Gorontalo",
      provinceCode: "75",
      centroid: [122.3657, 0.6573],
      tier: "kabupaten",
    },
    {
      code: "75.02",
      name: "Gorontalo",
      province: "Gorontalo",
      provinceCode: "75",
      centroid: [122.6972, 0.7074],
      tier: "kabupaten",
    },
    {
      code: "75.03",
      name: "Pohuwato",
      province: "Gorontalo",
      provinceCode: "75",
      centroid: [121.6431, 0.6707],
      tier: "kabupaten",
    },
    {
      code: "75.04",
      name: "Bone Bolango",
      province: "Gorontalo",
      provinceCode: "75",
      centroid: [123.2782, 0.5551],
      tier: "kabupaten",
    },
    {
      code: "75.05",
      name: "Gorontalo Utara",
      province: "Gorontalo",
      provinceCode: "75",
      centroid: [122.6625, 0.8917],
      tier: "kabupaten",
    },
    {
      code: "75.71",
      name: "Kota Gorontalo",
      province: "Gorontalo",
      provinceCode: "75",
      centroid: [123.0548, 0.5337],
      tier: "kota",
    },
  ],
  wages: [
    {
      regionCode: "75.01",
      year: 2026,
      grossMonthly: 3405144,
      estimatedTakeHomeMonthly: Math.round(3405144 * 0.96),
      source:
        "Keputusan Gubernur Gorontalo tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "75.02",
      year: 2026,
      grossMonthly: 3405144,
      estimatedTakeHomeMonthly: Math.round(3405144 * 0.96),
      source:
        "Keputusan Gubernur Gorontalo tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "75.03",
      year: 2026,
      grossMonthly: 3405144,
      estimatedTakeHomeMonthly: Math.round(3405144 * 0.96),
      source:
        "Keputusan Gubernur Gorontalo tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "75.04",
      year: 2026,
      grossMonthly: 3405144,
      estimatedTakeHomeMonthly: Math.round(3405144 * 0.96),
      source:
        "Keputusan Gubernur Gorontalo tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "75.05",
      year: 2026,
      grossMonthly: 3405144,
      estimatedTakeHomeMonthly: Math.round(3405144 * 0.96),
      source:
        "Keputusan Gubernur Gorontalo tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "75.71",
      year: 2026,
      grossMonthly: 3405144,
      estimatedTakeHomeMonthly: Math.round(3405144 * 0.96),
      source:
        "Keputusan Gubernur Gorontalo tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "75.01",
      baseline: {
        housing: {
          amount: 514000,
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
      regionCode: "75.02",
      baseline: {
        housing: {
          amount: 669000,
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
          amount: 288000,
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
          amount: 257000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "75.03",
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
          amount: 257000,
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
          amount: 87000,
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
      regionCode: "75.04",
      baseline: {
        housing: {
          amount: 772000,
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
          amount: 103000,
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
      regionCode: "75.05",
      baseline: {
        housing: {
          amount: 566000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1132000,
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
          amount: 195000,
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
      regionCode: "75.71",
      baseline: {
        housing: {
          amount: 874000,
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
          amount: 309000,
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
      regionCode: "75.01",
      rentRange: {
        min: 350000,
        max: 1100000,
        note:
          "Kamar kos standar di Tilamuta sangat terjangkau; penginapan/mess berfasilitas AC tersedia di pusat pemerintahan.",
      },
      transportContext:
        "Mobilitas harian mengandalkan sepeda motor pribadi dan bentor di area pusat perkotaan Tilamuta; akses antarkecamatan melalui Jalan Trans Sulawesi.",
      interpretation:
        "Boalemo menawarkan biaya hidup yang sangat terjangkau berkat limpahan pasokan ikan segar Teluk Tomini dan produksi jagung lokal. UMP Rp3,41 juta memberikan daya beli yang sangat sehat untuk pekerja lajang.",
    },
    {
      regionCode: "75.02",
      rentRange: {
        min: 300000,
        max: 1300000,
        note:
          "Pilihan kost di Limboto dan Telaga berkisar ekonomis; hunian dekat fasilitas Bandara Isimu dan RSUD MM Dunda menawarkan fasilitas kamar mandi dalam dan AC.",
      },
      transportContext:
        "Didominasi sepeda motor komuter ke arah perbatasan Kota Gorontalo dan bentor untuk perjalanan jarak pendek di seputar Menara Keagungan Limboto.",
      interpretation:
        "Kabupaten Gorontalo sebagai lumbung pangan dan pusat demografi terbesar memiliki pasar pangan yang sangat murah. UMP Rp3,41 juta memberikan ruang tabungan yang sangat memadai bagi pekerja lajang di kawasan penyangga ini.",
    },
    {
      regionCode: "75.03",
      rentRange: {
        min: 400000,
        max: 1500000,
        note:
          "Pilihan sewa kamar di Marisa bervariasi dari kos sederhana warga hingga kamar ber-AC lengkap untuk kontraktor proyek tambang emas Pani.",
      },
      transportContext:
        "Sepeda motor menjadi moda utama pekerja di Marisa dan kawasan perkebunan/tambang; bentor tersedia untuk rute dalam kota Marisa.",
      interpretation:
        "Ekonomi Pohuwato didorong oleh agribisnis kelapa sawit dan proyek tambang emas Pani di Buntulia. Harga pangan lokal tetap relatif murah, sehingga UMP Rp3,41 juta sangat kompetitif.",
    },
    {
      regionCode: "75.04",
      rentRange: {
        min: 450000,
        max: 1400000,
        note:
          "Pasar kost berkembang pesat di sekitar Kampus Baru UNG Bone Bolango dan koridor Kabila-Suwawa dengan berbagai pilihan fasilitas.",
      },
      transportContext:
        "Komutasi harian sangat terintegrasi dengan Kota Gorontalo menggunakan sepeda motor pribadi dan bentor lokal.",
      interpretation:
        "Bone Bolango menjadi kawasan penyangga strategis dengan keberadaan Kampus 4 UNG dan destinasi wisata bahari Botubarani. Biaya hidup sangat moderat dan UMP Rp3,41 juta mencukupi gaya hidup pekerja lajang.",
    },
    {
      regionCode: "75.05",
      rentRange: {
        min: 300000,
        max: 1100000,
        note:
          "Sewa kamar kos di Kwandang berpusat di dekat kompleks perkantoran bupati dan area Pelabuhan Anggrek dengan tarif bersahabat.",
      },
      transportContext:
        "Sepeda motor merupakan moda transportasi andalan melewati rute pesisir Laut Sulawesi; angkutan antar-kabupaten menghubungkan Kwandang ke Kota Gorontalo.",
      interpretation:
        "Gorontalo Utara memiliki keunggulan pasokan perikanan laut dalam dan Pelabuhan Anggrek sebagai simpul logistik. Biaya hidup yang rendah membuat standar UMP Rp3,41 juta memberikan surplus finansial yang baik.",
    },
    {
      regionCode: "75.71",
      rentRange: {
        min: 450000,
        max: 2200000,
        note:
          "Kost mahasiswa UNG dan pekerja di Kota Tengah, Dulomo, dan Kota Selatan sangat terjangkau; kost eksklusif ber-AC tersedia di pusat perdagangan.",
      },
      transportContext:
        "Bentor (becak motor) khas Gorontalo menjadi moda transportasi harian utama di samping sepeda motor pribadi untuk mobilitas dalam kota.",
      interpretation:
        "Sebagai pusat pemerintahan, perdagangan, dan pendidikan tinggi di Gorontalo, Kota Gorontalo menyajikan fasilitas terlengkap dengan biaya pangan relatif murah berkat pasokan dari daerah sekitar. UMP Rp3,41 juta cukup seimbang untuk kebutuhan hidup pekerja lajang.",
    },
  ],
};
