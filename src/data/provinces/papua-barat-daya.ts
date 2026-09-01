import type { ProvinceDataPackage } from "./types";

export const papua_barat_daya_data: ProvinceDataPackage = {
  provinceName: "Papua Barat Daya",
  provinceCode: "96",
  regions: [
    {
      code: "91.71",
      name: "Kota Sorong",
      province: "Papua Barat Daya",
      provinceCode: "96",
      centroid: [131.3238, -0.8661],
      tier: "kota",
    },
    {
      code: "91.07",
      name: "Sorong",
      province: "Papua Barat Daya",
      provinceCode: "96",
      centroid: [131.3697, -1.1532],
      tier: "kabupaten",
    },
    {
      code: "91.06",
      name: "Sorong Selatan",
      province: "Papua Barat Daya",
      provinceCode: "96",
      centroid: [132.0391, -1.6702],
      tier: "kabupaten",
    },
    {
      code: "91.08",
      name: "Raja Ampat",
      province: "Papua Barat Daya",
      provinceCode: "96",
      centroid: [130.506, -0.7783],
      tier: "kabupaten",
    },
    {
      code: "91.09",
      name: "Tambrauw",
      province: "Papua Barat Daya",
      provinceCode: "96",
      centroid: [132.7651, -0.7609],
      tier: "kabupaten",
    },
    {
      code: "91.10",
      name: "Maybrat",
      province: "Papua Barat Daya",
      provinceCode: "96",
      centroid: [132.3396, -1.3291],
      tier: "kabupaten",
    },
  ],
  wages: [
    {
      regionCode: "91.71",
      year: 2026,
      grossMonthly: 3766000,
      estimatedTakeHomeMonthly: Math.round(3766000 * 0.96),
      source:
        "Keputusan Gubernur Papua Barat Daya tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "91.07",
      year: 2026,
      grossMonthly: 3766000,
      estimatedTakeHomeMonthly: Math.round(3766000 * 0.96),
      source:
        "Keputusan Gubernur Papua Barat Daya tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "91.06",
      year: 2026,
      grossMonthly: 3766000,
      estimatedTakeHomeMonthly: Math.round(3766000 * 0.96),
      source:
        "Keputusan Gubernur Papua Barat Daya tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "91.08",
      year: 2026,
      grossMonthly: 3766000,
      estimatedTakeHomeMonthly: Math.round(3766000 * 0.96),
      source:
        "Keputusan Gubernur Papua Barat Daya tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "91.09",
      year: 2026,
      grossMonthly: 3766000,
      estimatedTakeHomeMonthly: Math.round(3766000 * 0.96),
      source:
        "Keputusan Gubernur Papua Barat Daya tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "91.10",
      year: 2026,
      grossMonthly: 3766000,
      estimatedTakeHomeMonthly: Math.round(3766000 * 0.96),
      source:
        "Keputusan Gubernur Papua Barat Daya tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "91.71",
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
      regionCode: "91.07",
      baseline: {
        housing: {
          amount: 926000,
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
          amount: 340000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "91.06",
      baseline: {
        housing: {
          amount: 823000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1564000,
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
    {
      regionCode: "91.08",
      baseline: {
        housing: {
          amount: 1183000,
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
          amount: 381000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "91.09",
      baseline: {
        housing: {
          amount: 823000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1667000,
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
          amount: 329000,
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
          amount: 98000,
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
      regionCode: "91.10",
      baseline: {
        housing: {
          amount: 772000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1605000,
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
          amount: 319000,
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
          amount: 247000,
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
          amount: 98000,
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
      regionCode: "91.71",
      rentRange: {
        min: 650000,
        max: 2800000,
        note:
          "Pilihan kost pekerja pelabuhan, migas, dan mahasiswa di Sorong Timur dan Sorong Kota cukup variatif; kamar ber-AC dan fasilitas lengkap tersedia di area Kampung Baru dan Remu.",
      },
      transportContext:
        "Angkutan kota 'taksi kuning' melayani rute utama dalam kota Sorong, didukung ojek daring/pangkalan dan akses penyeberangan feri menuju Raja Ampat.",
      interpretation:
        "Sebagai pusat ekonomi utama Papua Barat Daya dan simpul transportasi maritim serta udara terbesar, Kota Sorong menerapkan UMP Rp3,77 juta yang memberikan daya beli berimbang bagi pekerja lajang.",
    },
    {
      regionCode: "91.07",
      rentRange: {
        min: 500000,
        max: 2200000,
        note:
          "Pusat pemerintahan di Aimas serta kawasan transmigrasi SP menyediakan hunian sewa dan rumah tapak yang ramah bagi keluarga dan karyawan KEK Sorong.",
      },
      transportContext:
        "Mobilitas bertumpu pada jalur darat poros Sorong-Klamono dan angkot trayek Aimas-Kota Sorong serta sepeda motor komuter harian.",
      interpretation:
        "Kabupaten Sorong bertindak sebagai sentra agribisnis pangan hortikultura dan kawasan industri pengolahan KEK Sorong, dengan biaya hidup lebih bersahabat dibanding kota tetangganya.",
    },
    {
      regionCode: "91.06",
      rentRange: {
        min: 450000,
        max: 1800000,
        note:
          "Hunian kos di Teminabuan terkonsentrasi di sekitar kawasan Sesna, Kaibus, dan perkantoran bupati dengan tarif terjangkau.",
      },
      transportContext:
        "Akses darat poros Teminabuan-Sorong via Moswaren dan transportasi perahu longboat/speedboat untuk rute perairan sungai ke distrik pesisir seperti Inanwatan.",
      interpretation:
        "Dikenal sebagai 'Kota 1001 Sungai' dan sentra sagu alam terluas, Sorong Selatan memiliki keunggulan pangan lokal murah seperti sagu, kepiting, dan udang dengan UMP Rp3,77 juta.",
    },
    {
      regionCode: "91.08",
      rentRange: {
        min: 650000,
        max: 3000000,
        note:
          "Sewa hunian di ibu kota Waisai dipengaruhi oleh sektor pariwisata bahari dan tingginya biaya material bangunan yang dikapalkan dari Sorong.",
      },
      transportContext:
        "Kapal cepat reguler (Bahari Express) dan feri ASDP rute Sorong-Waisai menjadi urat nadi logistik utama, dengan transportasi antarpulau mengandalkan speedboat/longboat.",
      interpretation:
        "Sebagai destinasi wisata bahari berkelas dunia, Raja Ampat memiliki surplus pasokan hasil laut segar bermutu tinggi, meski produk sembako pabrikan memerlukan alokasi biaya pengapalan antarpulau.",
    },
    {
      regionCode: "91.09",
      rentRange: {
        min: 450000,
        max: 1800000,
        note:
          "Pemondokan dan kos di Sausapor dan Fef melayani kebutuhan tempat tinggal ASN, tenaga medis, dan pekerja infrastruktur jalan konservasi.",
      },
      transportContext:
        "Didominasi kendaraan roda dua komuter dan angkutan kabin ganda 4x4 untuk melintasi jalan pegunungan Tamrau serta kapal perintis pesisir utara Samudra Pasifik.",
      interpretation:
        "Sebagai 'Kabupaten Konservasi', Tambrauw memadukan keasrian hutan tropis dan kawasan peneluran penyu belimbing Jeen Syuab, dengan pasokan pangan organik lokal yang menopang standar hidup layak.",
    },
    {
      regionCode: "91.10",
      rentRange: {
        min: 400000,
        max: 1700000,
        note:
          "Sewa kamar dan rumah tinggal di Kumurkek dan Ayamaru menyediakan fasilitas dasar yang memadai bagi aparatur sipil negara dan pendidik.",
      },
      transportContext:
        "Jalur poros darat Trans Papua Barat Daya menghubungkan Ayamaru-Kumurkek ke Sorong dan Teminabuan menggunakan sepeda motor dan angkutan minibus pedesaan.",
      interpretation:
        "Maybrat memiliki kekayaan alam danau karst Ayamaru yang eksotis dan sentra budidaya kacang tanah serta keladi lokal, menghadirkan kemandirian pangan pokok yang stabil dengan UMP Rp3,77 juta.",
    },
  ],
};
