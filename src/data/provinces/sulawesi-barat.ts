import type { ProvinceDataPackage } from "./types";

export const sulawesi_barat_data: ProvinceDataPackage = {
  provinceName: "Sulawesi Barat",
  provinceCode: "76",
  regions: [
    {
      code: "76.01",
      name: "Majene",
      province: "Sulawesi Barat",
      provinceCode: "76",
      centroid: [118.9212, -3.2228],
      tier: "kabupaten",
    },
    {
      code: "76.03",
      name: "Mamasa",
      province: "Sulawesi Barat",
      provinceCode: "76",
      centroid: [119.3239, -2.9797],
      tier: "kabupaten",
    },
    {
      code: "76.04",
      name: "Mamuju",
      province: "Sulawesi Barat",
      provinceCode: "76",
      centroid: [118.9723, -2.5074],
      tier: "kabupaten",
    },
    {
      code: "76.06",
      name: "Mamuju Tengah",
      province: "Sulawesi Barat",
      provinceCode: "76",
      centroid: [119.4966, -2.0239],
      tier: "kabupaten",
    },
    {
      code: "76.05",
      name: "Mamuju Utara",
      province: "Sulawesi Barat",
      provinceCode: "76",
      centroid: [119.5301, -1.4253],
      tier: "kabupaten",
    },
    {
      code: "76.02",
      name: "Polewali Mandar",
      province: "Sulawesi Barat",
      provinceCode: "76",
      centroid: [119.1879, -3.3282],
      tier: "kabupaten",
    },
  ],
  wages: [
    {
      regionCode: "76.01",
      year: 2026,
      grossMonthly: 3315934,
      estimatedTakeHomeMonthly: Math.round(3315934 * 0.96),
      source:
        "Keputusan Gubernur Sulawesi Barat tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "76.03",
      year: 2026,
      grossMonthly: 3315934,
      estimatedTakeHomeMonthly: Math.round(3315934 * 0.96),
      source:
        "Keputusan Gubernur Sulawesi Barat tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "76.04",
      year: 2026,
      grossMonthly: 3363847,
      estimatedTakeHomeMonthly: Math.round(3363847 * 0.96),
      source:
        "Keputusan Gubernur Sulawesi Barat No. 858 Tahun 2025 (Mamuju Utara = Pasangkayu) tentang Upah Minimum Kabupaten/Kota di Provinsi Sulawesi Barat Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "76.06",
      year: 2026,
      grossMonthly: 3315934,
      estimatedTakeHomeMonthly: Math.round(3315934 * 0.96),
      source:
        "Keputusan Gubernur Sulawesi Barat tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; https://tirto.id/daftar-lengkap-ump-2026-di-38-provinsi-hoMz)",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "76.05",
      year: 2026,
      grossMonthly: 3564798,
      estimatedTakeHomeMonthly: Math.round(3564798 * 0.96),
      source:
        "Keputusan Gubernur Sulawesi Barat No. 858 Tahun 2025 (Mamuju Utara = Pasangkayu) tentang Upah Minimum Kabupaten/Kota di Provinsi Sulawesi Barat Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
    {
      regionCode: "76.02",
      year: 2026,
      grossMonthly: 3327886,
      estimatedTakeHomeMonthly: Math.round(3327886 * 0.96),
      source:
        "Keputusan Gubernur Sulawesi Barat No. 858 Tahun 2025 (Mamuju Utara = Pasangkayu) tentang Upah Minimum Kabupaten/Kota di Provinsi Sulawesi Barat Tahun 2026",
      asOf: "2026-01-01",
      confidence: "official",
    },
  ],
  costs: [
    {
      regionCode: "76.01",
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
          amount: 216000,
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
          amount: 103000,
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
      regionCode: "76.03",
      baseline: {
        housing: {
          amount: 617000,
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
          amount: 288000,
          source:
            "Estimasi tarif angkutan lokal & konsumsi BBM komuter — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        utilities: {
          amount: 226000,
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
          amount: 195000,
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
          amount: 237000,
          source:
            "Alokasi cadangan dana darurat bulanan (~8-10%) — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
    },
    {
      regionCode: "76.04",
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
    {
      regionCode: "76.06",
      baseline: {
        housing: {
          amount: 720000,
          source:
            "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
        food: {
          amount: 1255000,
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
          amount: 257000,
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
          amount: 170000,
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
          amount: 98000,
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
      regionCode: "76.05",
      baseline: {
        housing: {
          amount: 772000,
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
          amount: 309000,
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
          amount: 237000,
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
      regionCode: "76.02",
      baseline: {
        housing: {
          amount: 720000,
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
          amount: 257000,
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
          amount: 237000,
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
          amount: 257000,
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
      regionCode: "76.01",
      rentRange: {
        min: 350000,
        max: 1500000,
        note:
          "Kost mahasiswa dan umum banyak tersebar di Banggae, Banggae Timur, sekitar kampus UNSULBAR (Lembang & Lutang), serta kawasan pesisir Totoli.",
      },
      transportContext:
        "Angkutan kota/pedesaan (pete-pete), ojek pangkalan lokal, sepeda motor pribadi, dan jalur poros Trans-Sulawesi pesisir barat penghubung Mamuju-Polman.",
      interpretation:
        "Dikenal sebagai Kota Pendidikan di Sulawesi Barat dan pusat kebudayaan Mandar, Majene menawarkan suasana kota pesisir yang tenang dan biaya hidup sangat terjangkau. Pasokan ikan terbang (tuing-tuing) segar dan hasil laut melimpah menjaga harga pangan tetap murah, sehingga standar UMP Rp3,32 juta memberikan daya beli yang sangat leluasa bagi pekerja lajang maupun perantau.",
    },
    {
      regionCode: "76.03",
      rentRange: {
        min: 300000,
        max: 1400000,
        note:
          "Kost dan kamar sewa sederhana terpusat di Kota Mamasa, Sumarorong, Messawa, dan Balla; hunian tidak memerlukan pendingin udara berkat hawa sejuk pegunungan.",
      },
      transportContext:
        "Jalur darat lintas pegunungan Polewali-Mamasa dan Mamasa-Toraja yang berliku dengan tanjakan curam, angkutan minibus pedesaan perintis, dan sepeda motor pribadi.",
      interpretation:
        "Berada di kawasan dataran tinggi pegunungan ('Negeri di Atas Awan') yang kaya tradisi adat dan agrowisata kopi Mamasa, daerah ini memiliki iklim dingin yang meniadakan biaya listrik pendingin ruangan. Ketersediaan beras sawah lokal, sayuran dataran tinggi, dan komoditas perkebunan yang terjangkau membuat UMP Rp3,32 juta sangat memadai untuk kebutuhan hidup mandiri.",
    },
    {
      regionCode: "76.04",
      rentRange: {
        min: 450000,
        max: 2200000,
        note:
          "Kost AC dan kamar mandi dalam untuk pekerja kantor/ASN terkonsentrasi di Simboro, Rimuku, Karema, dan sekitar pusat perkantoran Gubernur Sulbar.",
      },
      transportContext:
        "Angkutan kota pete-pete, ojek pangkalan dan daring lokal, sepeda motor komuter, serta akses transportasi antarkota via Bandara Tampa Padang dan Pelabuhan Simboro.",
      interpretation:
        "Sebagai ibu kota Provinsi Sulawesi Barat, Mamuju menjadi pusat aktivitas birokrasi pemerintahan, perdagangan, dan jasa perhotelan. Penerapan UMK mandiri sebesar Rp3,36 juta memberikan kemampuan belanja yang solid di tengah gaya hidup perkotaan pesisir yang dinamis namun tetap berbiaya wajar.",
    },
    {
      regionCode: "76.06",
      rentRange: {
        min: 400000,
        max: 1600000,
        note:
          "Kost pekerja perkebunan dan karyawan swasta banyak tersedia di pusat niaga Topoyo, kawasan ibukota Tobadak, serta sepanjang poros Pangale dan Budong-Budong.",
      },
      transportContext:
        "Jalur utama Trans-Sulawesi rute Mamuju-Topoyo-Palu, jalan koridor perkebunan kelapa sawit, mobil travel antarkota, dan sepeda motor pribadi.",
      interpretation:
        "Mamuju Tengah merupakan pusat perkebunan kelapa sawit dan industri pengolahan CPO terbesar di Sulawesi Barat dengan aktivitas perniagaan yang berpusat di Topoyo. Perputaran uang dari komoditas sawit dan jagung tinggi, didukung ketersediaan bahan pangan terjangkau dari pesisir Budong-Budong, menjadikan UMP Rp3,32 juta sangat protektif bagi pekerja.",
    },
    {
      regionCode: "76.05",
      rentRange: {
        min: 450000,
        max: 1800000,
        note:
          "Kost karyawan korporasi agribisnis dan staf tambak terkonsentrasi di Pasangkayu Kota, Bambalamotu (Randomayang), Baras, Sarudu, dan Ako.",
      },
      transportContext:
        "Poros logistik utama Trans-Sulawesi perbatasan Sulbar-Sulteng menuju Kota Palu, kendaraan operasional industri, dan sepeda motor komuter harian.",
      interpretation:
        "Mamuju Utara (dikenal secara administratif luas sebagai Pasangkayu) ditopang oleh mega industri perkebunan kelapa sawit terpadu dan tambak udang vaname modern skala ekspor. Interaksi ekonomi yang intensif dengan Kota Palu dan koridor industri membuat daya beli tinggi, sementara UMP Rp3,56 juta menjamin stabilitas finansial pekerja sektor formal maupun perkebunan.",
    },
    {
      regionCode: "76.02",
      rentRange: {
        min: 400000,
        max: 1700000,
        note:
          "Kost di pusat kota Polewali (Pekkabata, Madatte), kawasan sentra niaga Wonomulyo, serta kecamatan pesisir Tinambung dan Campalagian.",
      },
      transportContext:
        "Poros Trans-Sulawesi penghubung Sulbar-Sulsel (ruas Polman-Pinrang-Parepare), angkutan pedesaan, becak motor (bentor), dan sepeda motor pribadi.",
      interpretation:
        "Sebagai kabupaten dengan populasi terbanyak dan lumbung pangan utama Sulawesi Barat (penghasil beras irigasi Wonomulyo dan kakao), Polewali Mandar menikmati pasokan pangan berlimpah dengan harga sangat stabil. Kombinasi biaya sewa yang kompetitif dan pangan murah menjadikan upah minimum UMP Rp3,33 juta memberikan tingkat kesejahteraan yang sangat sehat.",
    },
  ],
};
