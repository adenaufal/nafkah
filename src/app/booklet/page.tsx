"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppIcon } from "@/components/icons";
import type { AppIconName } from "@/components/icons";

interface FeatureItem {
  id: string;
  category: "peta" | "simulasi" | "komparasi" | "data" | "aksesibilitas";
  title: string;
  badge: string;
  description: string;
  tags: string[];
}

const FEATURES: FeatureItem[] = [
  {
    id: "choropleth-514",
    category: "peta",
    title: "Peta Choropleth 514 Kabupaten/Kota",
    badge: "Peta Interaktif",
    description:
      "Visualisasi spasial 514 daerah di 38 provinsi Indonesia menggunakan MapLibre GL dan TopoJSON adm2 teroptimasi (<0.6 MB). Dilengkapi pewarnaan cerdas berdasarkan tingkat keterjangkauan upah.",
    tags: ["peta", "choropleth", "maplibre", "514", "kabupaten", "kota"],
  },
  {
    id: "color-modes",
    category: "peta",
    title: "3 Mode Pewarnaan Peta (Choropleth)",
    badge: "Peta Interaktif",
    description:
      "Ubah perspektif peta dengan 3 mode: Cakupan (persentase upah terhadap biaya), Biaya Hidup (nominal rupiah pengeluaran), atau Upah (nominal rupiah UMK/UMP resmi).",
    tags: ["mode", "warna", "cakupan", "biaya", "upah"],
  },
  {
    id: "basemaps",
    category: "peta",
    title: "4 Pilihan Peta Dasar (Basemaps)",
    badge: "Peta Interaktif",
    description:
      "Pilihan peta dasar Terang (Positron), Gelap (Dark Matter), Citra Satelit (Esri World Imagery), serta mode Offline khusus yang bekerja tanpa unduhan tile peta.",
    tags: ["basemap", "satelit", "gelap", "terang", "offline"],
  },
  {
    id: "household-simulator",
    category: "simulasi",
    title: "Simulator Profil Rumah Tangga & Asumsi",
    badge: "Simulasi Finansial",
    description:
      "Atur konfigurasi keluarga: Lajang (1 orang), Pasangan (1 upah atau opsi 2 upah), atau Keluarga dengan anak. Biaya hidup otomatis diskalakan berdasarkan model Susenas.",
    tags: ["asumsi", "rumah tangga", "keluarga", "single", "pasangan", "2 upah"],
  },
  {
    id: "custom-income",
    category: "simulasi",
    title: "Fitur 'Pendapatan Sendiri' (Custom Income)",
    badge: "Privasi 100%",
    description:
      "Uji daya beli dengan memasukkan gaji pribadi Anda untuk melihat kelayakan hidup di kota mana pun. Angka gaji dihitung 100% di browser tanpa pernah dikirim ke server.",
    tags: ["gaji sendiri", "pendapatan", "custom", "privasi"],
  },
  {
    id: "lifestyle-housing-transport",
    category: "simulasi",
    title: "Variabel Gaya Hidup, Hunian & Transportasi",
    badge: "Simulasi Finansial",
    description:
      "Sesuaikan pilihan hidup: Gaya hidup (Hemat, Standar, Nyaman), Hunian (Kost/Rusun 55%, Rumah KPR 100%, Apartemen 145%), dan Transportasi (Motor, Angkutan Umum, Ojol).",
    tags: ["hunian", "kost", "kpr", "apartemen", "transportasi", "ojol", "gaya hidup"],
  },
  {
    id: "savings-wage-basis",
    category: "simulasi",
    title: "Simulasi Tabungan Darurat & Basis Upah",
    badge: "Simulasi Finansial",
    description:
      "Opsi menyisihkan ±10% dana cadangan darurat di atas pengeluaran bulanan, serta opsi memilih basis upah kotor (gross) atau estimasi gaji bersih (take-home pay).",
    tags: ["tabungan", "dana darurat", "take-home", "gross"],
  },
  {
    id: "instant-search",
    category: "komparasi",
    title: "Pencarian Instan & Navigasi Cepat",
    badge: "Navigasi",
    description:
      "Cari nama kabupaten, kota, atau provinsi secara instan dengan auto-focus kamera peta langsung ke centroid wilayah terpilih.",
    tags: ["cari", "search", "kabupaten", "kota"],
  },
  {
    id: "pinned-tray",
    category: "komparasi",
    title: "Baki Sematan (Pinned Tray)",
    badge: "Komparasi",
    description:
      "Sematkan hingga 5 wilayah sekaligus untuk memantau ringkasan persentase cakupan dan surplus/defisit rupiah tiap bulan secara bersamaan.",
    tags: ["sematkan", "pin", "tray", "pantau"],
  },
  {
    id: "comparison-panel",
    category: "komparasi",
    title: "Panel Komparasi Multilateral & Grafik Batang",
    badge: "Komparasi",
    description:
      "Bandingkan komposisi pengeluaran antar wilayah sematan lewat grafik batang bertumpuk (stacked bar chart) 10 kategori biaya secara transparan.",
    tags: ["grafik", "recharts", "komparasi", "batang bertumpuk"],
  },
  {
    id: "detail-modal",
    category: "komparasi",
    title: "Modal Detail Wilayah & Narasi Lokal",
    badge: "Eksplorasi Data",
    description:
      "Rincian rupiah per 10 kategori pengeluaran, perbandingan rasio upah, narasi sosio-ekonomi spesifik daerah, dan tren inflasi IHK tahunan.",
    tags: ["detail", "modal", "narasi", "inflasi", "ihk"],
  },
  {
    id: "data-provenance",
    category: "data",
    title: "Integritas Data & Jejak Audit (Provenance)",
    badge: "Open Data",
    description:
      "Setiap data upah dan pengeluaran mencantumkan sumber resmi (SK Gubernur/Kemnaker/BPS), tanggal penetapan (asOf), serta tingkat kepercayaan (official, estimate, sample).",
    tags: ["data", "provenance", "audit", "sumber", "bps", "sk gubernur"],
  },
  {
    id: "accessibility-a11y",
    category: "aksesibilitas",
    title: "Aksesibilitas Tinggi, Kontras AA & Dark Mode",
    badge: "Inklusivitas",
    description:
      "Palet warna aman buta warna, navigasi keyboard penuh, label pembaca layar (ARIA), kontras WCAG AA, serta peralihan mode gelap/terang mulus.",
    tags: ["a11y", "dark mode", "buta warna", "wcag", "keyboard"],
  },
  {
    id: "onboarding-tour",
    category: "aksesibilitas",
    title: "Tur Terpandu Interaktif & Kartu 3 Langkah",
    badge: "Panduan",
    description:
      "Tur terpandu visual langkah demi langkah untuk mengenalkan fungsi peta dan asumsi bagi pengguna baru, serta kartu panduan kilat.",
    tags: ["tur", "guide", "onboarding", "3 langkah"],
  },
];

const PAGES = [
  { id: "cover", title: "Cover & Profil Proyek" },
  { id: "urgency", title: "1. Latar Belakang & Urgensi" },
  { id: "methodology", title: "2. Metodologi & Konsep" },
  { id: "map-features", title: "3. Fitur Utama Maps Ekonomi" },
  { id: "simulator", title: "4. Simulator Asumsi & Gaji" },
  { id: "comparison", title: "5. Eksplorasi & Komparasi" },
  { id: "provenance", title: "6. Integritas Data & Audit" },
  { id: "guide-faq", title: "7. Panduan & Tanya Jawab" },
];

const EXPENSE_GUIDE_ITEMS: { label: string; icon: AppIconName }[] = [
  { label: "Hunian (Sewa/KPR)", icon: "house" },
  { label: "Pangan & Makan", icon: "forkKnife" },
  { label: "Transportasi", icon: "train" },
  { label: "Listrik & Air", icon: "drop" },
  { label: "Pendidikan", icon: "student" },
  { label: "Kesehatan & BPJS", icon: "heartbeat" },
  { label: "Sandang / Pakaian", icon: "tote" },
  { label: "Internet & Pulsa", icon: "globe" },
  { label: "Rekreasi & Sosial", icon: "coffee" },
  { label: "Dana Cadangan", icon: "shieldCheck" },
];

export default function BookletPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<"booklet" | "scroll">("booklet");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Mini Simulator State
  const [sampleRegion, setSampleRegion] = useState("31.71"); // Jakarta Pusat
  const [customIncomeInput, setCustomIncomeInput] = useState<number>(6000000);
  const [householdType, setHouseholdType] = useState<"single" | "couple" | "family">("single");

  // Sample data for mini-calc
  const sampleRegions = [
    { code: "31.71", name: "Jakarta Pusat", umk: 5396761, costSingle: 4680000 },
    { code: "32.73", name: "Kota Bandung", umk: 4478615, costSingle: 3620000 },
    { code: "33.72", name: "Kota Surakarta (Solo)", umk: 2364274, costSingle: 2180000 },
    { code: "34.71", name: "Kota Yogyakarta", umk: 2655041, costSingle: 2420000 },
    { code: "35.78", name: "Kota Surabaya", umk: 4962451, costSingle: 3890000 },
    { code: "64.71", name: "Kota Balikpapan", umk: 3685000, costSingle: 3510000 },
    { code: "91.71", name: "Kota Jayapura", umk: 4436283, costSingle: 4520000 },
  ];

  const activeSample = sampleRegions.find((r) => r.code === sampleRegion) || sampleRegions[0];
  const householdMultiplier = householdType === "single" ? 1.0 : householdType === "couple" ? 1.65 : 2.3;
  const estimatedCost = Math.round(activeSample.costSingle * householdMultiplier);
  const incomeToUse = customIncomeInput > 0 ? customIncomeInput : activeSample.umk;
  const coverageRatio = Math.round((incomeToUse / estimatedCost) * 100);
  const surplusDeficit = incomeToUse - estimatedCost;

  const bandInfo = useMemo(() => {
    if (coverageRatio >= 120) {
      return { label: "Nyaman", color: "#0b7a4b", bg: "#eaf6ed", desc: "Upah menutup kebutuhan dasar dan memiliki ruang tabungan lapang." };
    }
    if (coverageRatio >= 100) {
      return { label: "Cukup", color: "#1d6fa5", bg: "#e9f2f8", desc: "Upah menutup kebutuhan standar bulanan secara pas." };
    }
    if (coverageRatio >= 80) {
      return { label: "Ketat", color: "#b26b00", bg: "#fef6e7", desc: "Anggaran ketat, perlu memangkas pengeluaran atau tanpa tabungan." };
    }
    return { label: "Tak Cukup", color: "#a5271f", bg: "#fbeae8", desc: "Defisit bulanan; upah belum mencukupi standar biaya hidup layak." };
  }, [coverageRatio]);

  // Set html class for scrollable body
  useEffect(() => {
    document.documentElement.classList.add("scrollable");
    return () => {
      document.documentElement.classList.remove("scrollable");
    };
  }, []);

  const filteredFeatures = useMemo(() => {
    return FEATURES.filter((f) => {
      const matchCat = categoryFilter === "all" || f.category === categoryFilter;
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.tags.some((t) => t.includes(q));
      return matchCat && matchQuery;
    });
  }, [categoryFilter, searchQuery]);

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f3f1ec] text-[#1c1917] font-sans antialiased selection:bg-[#c2452d] selection:text-white">
      {/* Top Floating Action Bar (Screen Only) */}
      <header className="no-print sticky top-0 z-50 border-b border-stone-300 bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <AppIcon name="arrowLeft" size={14} weight="bold" />
              <span>Buka Peta Utama</span>
            </Link>
            <div className="hidden sm:block h-4 w-px bg-stone-300" />
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#c2452d] text-xs font-bold text-white">
                N
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                Booklet Resmi Nafkah
              </span>
              <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700">
                Edisi 2026
              </span>
            </div>
          </div>

          {/* Interactive Mode & Print Controls */}
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-stone-300 bg-stone-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("booklet")}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  viewMode === "booklet"
                    ? "bg-white font-bold text-stone-900 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Halaman demi Halaman
              </button>
              <button
                type="button"
                onClick={() => setViewMode("scroll")}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                  viewMode === "scroll"
                    ? "bg-white font-bold text-stone-900 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Dokumen Gulir Penuh
              </button>
            </div>

            <button
              type="button"
              onClick={triggerPrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#c2452d] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#a83624] transition-colors"
              title="Cetak booklet ke format A4 atau Simpan sebagai PDF"
            >
              <AppIcon name="printer" size={15} weight="bold" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Page selector bar in booklet mode */}
        {viewMode === "booklet" && (
          <div className="mx-auto mt-2.5 flex max-w-6xl items-center justify-between border-t border-stone-200 pt-2 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {PAGES.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCurrentPage(idx)}
                  className={`shrink-0 rounded-full px-2.5 py-1 transition-colors ${
                    currentPage === idx
                      ? "bg-[#c2452d] font-bold text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {idx === 0 ? "Cover" : `Hal ${idx}`}
                </button>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2 pl-3">
              <span className="font-semibold text-stone-600">
                Hal {currentPage + 1} dari {PAGES.length}
              </span>
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                className="rounded border border-stone-300 px-2 py-1 disabled:opacity-35 hover:bg-stone-100"
                aria-label="Halaman sebelumnya"
              >
                <AppIcon name="caretLeft" size={15} weight="bold" />
              </button>
              <button
                type="button"
                disabled={currentPage === PAGES.length - 1}
                onClick={() => setCurrentPage((p) => Math.min(PAGES.length - 1, p + 1))}
                className="rounded border border-stone-300 px-2 py-1 disabled:opacity-35 hover:bg-stone-100"
                aria-label="Halaman selanjutnya"
              >
                <AppIcon name="caretRight" size={15} weight="bold" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Booklet Content Container */}
      <main className="mx-auto my-6 max-w-[210mm] px-4 sm:px-0">
        {/* ============================================================ */}
        {/* PAGE 1: COVER                                                */}
        {/* ============================================================ */}
        <div
          id="page-1"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[297mm] ${
            viewMode === "booklet" && currentPage !== 0 ? "hidden no-print" : "mb-10"
          }`}
        >
          {/* Decorative Corner Ribbon */}
          <div className="absolute -right-14 -top-14 h-40 w-40 rotate-45 bg-[#c2452d]/10 pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-stone-100 pointer-events-none" />

          {/* Header Cover */}
          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-stone-200 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c2452d] text-2xl font-black text-white shadow-md">
                  N
                </span>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-stone-900">NAFKAH</h2>
                  <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">
                    Living Cost & Wage Index
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-bold text-stone-800">
                  Edisi Resmi 2026
                </span>
                <p className="mt-1 text-[11px] text-stone-500">PP No. 49/2025 & Susenas BPS</p>
              </div>
            </div>

            {/* Title Section */}
            <div className="mt-12">
              <span className="inline-block rounded bg-[#c2452d]/10 px-2.5 py-1 text-xs font-extrabold uppercase tracking-widest text-[#c2452d]">
                Buku Panduan & Profil Proyek
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-stone-950 leading-[1.15]">
                PETA KECUKUPAN GAJI & BIAYA HIDUP INDONESIA
              </h1>
              <p className="mt-3 text-lg font-medium text-stone-600 leading-relaxed">
                Eksplorasi spasial daya beli riil, analisis biaya hidup 10 kategori, dan perbandingan
                lantai upah minimum di 514 kabupaten/kota dari Sabang sampai Merauke.
              </p>
            </div>

            {/* Central Graphic Mockup Card */}
            <div className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Pertanyaan Pengguna
                  </p>
                  <p className="mt-1 text-sm italic text-stone-800">
                    &ldquo;Boleh tahu lebih lanjut mengenai project maps ekonomi ini? Fitur apa saja
                    yang terdapat di dalamnya?&rdquo;
                  </p>
                </div>
                <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                  Jawaban Lengkap
                </span>
              </div>

              {/* 4 Pillars Grid */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-lg border border-stone-200 bg-white p-3">
                  <p className="text-2xl font-black text-[#c2452d]">514</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-stone-600">Kabupaten / Kota</p>
                  <p className="text-[10px] text-stone-400">38 Provinsi Definitif</p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-3">
                  <p className="text-2xl font-black text-blue-700">10</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-stone-600">Kategori Pengeluaran</p>
                  <p className="text-[10px] text-stone-400">Pangan s/d Tabungan</p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-3">
                  <p className="text-2xl font-black text-amber-700">4</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-stone-600">Band Keterjangkauan</p>
                  <p className="text-[10px] text-stone-400">Nyaman s/d Tak Cukup</p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-white p-3">
                  <p className="text-2xl font-black text-emerald-700">100%</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-stone-600">Privasi di Browser</p>
                  <p className="text-[10px] text-stone-400">Client-Side Calculation</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="relative z-10 border-t border-stone-200 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
              <div>
                <p className="font-bold text-stone-900">Nafkah Open Data Initiative</p>
                <p className="text-[11px] text-stone-500">Web App: nafkah.adenaufal.com</p>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span>Kode: <strong>Lisensi MIT</strong></span>
                <span>•</span>
                <span>Data: <strong>CC-BY-4.0</strong></span>
                <span>•</span>
                <span>MapLibre GL & Next.js 15</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 2: LATAR BELAKANG & URGENSI                             */}
        {/* ============================================================ */}
        <div
          id="page-2"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative min-h-[297mm] flex flex-col justify-between ${
            viewMode === "booklet" && currentPage !== 1 ? "hidden no-print" : "mb-10"
          }`}
        >
          <div>
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[11px] font-semibold text-stone-500">
              <span>NAFKAH • BUKU PANDUAN RESMI</span>
              <span>1. LATAR BELAKANG & URGENSI</span>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2452d]">
                Pengantar Proyek
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                Mengapa &ldquo;Maps Ekonomi&rdquo; Ini Dibangun?
              </h2>
            </div>

            {/* Content Body */}
            <div className="mt-5 space-y-4 text-stone-700 leading-relaxed text-sm">
              <p>
                <strong>Nafkah</strong> lahir dari pertanyaan yang dihadapi jutaan pekerja dan keluarga
                di Indonesia setiap hari: <em>&ldquo;Seberapa cukup upah di suatu daerah untuk menopang
                kehidupan nyata sehari-hari?&rdquo;</em>
              </p>

              <div className="rounded-xl border-l-4 border-[#c2452d] bg-stone-50 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Paradoks Upah Nominal vs. Daya Beli Riil
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-stone-600">
                  Angka gaji nominal sering kali menipu. Gaji <strong>Rp 5.000.000</strong> di DKI Jakarta
                  bisa terasa sangat ketat karena biaya hunian kost/kontrakan dan konsumsi yang tinggi.
                  Namun angka yang sama di Kota Solo, Klaten, atau Yogyakarta memberikan ruang bernapas yang
                  jauh lebih lapang. Mengambil keputusan karir, relokasi tempat tinggal, atau penentuan
                  standar kompensasi hanya berdasarkan nominal rupiah tanpa melihat sisi biaya hidup adalah
                  kekeliruan mendasar.
                </p>
              </div>

              <h3 className="font-bold text-stone-900 pt-2">Siapa yang Membutuhkan Booklet & Maps Ini?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg border border-stone-200 p-3.5 bg-white">
                  <div className="flex items-center gap-2 text-[#c2452d] font-bold text-xs">
                    <AppIcon name="briefcase" size={17} />
                    <span>Pencari Kerja & Pekerja Relokasi</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600">
                    Menilai tawaran pekerjaan di luar daerah secara objektif: apakah kenaikan gaji
                    sebanding dengan lonjakan biaya hidup setempat?
                  </p>
                </div>

                <div className="rounded-lg border border-stone-200 p-3.5 bg-white">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs">
                    <AppIcon name="buildings" size={17} />
                    <span>HRD, Recruiter & Tim Kompensasi</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600">
                    Menyusun paket remunerasi yang adil dan kompetitif di berbagai cabang operasional
                    di seluruh provinsi Indonesia.
                  </p>
                </div>

                <div className="rounded-lg border border-stone-200 p-3.5 bg-white">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <AppIcon name="chartBar" size={17} />
                    <span>Jurnalis Data & Peneliti Kebijakan</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600">
                    Menganalisis disparitas spasial ekonomi, kelayakan upah minimum regional, dan
                    dampak inflasi terhadap kesejahteraan buruh.
                  </p>
                </div>

                <div className="rounded-lg border border-stone-200 p-3.5 bg-white">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                    <AppIcon name="house" size={17} />
                    <span>Keluarga & Perencana Anggaran</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600">
                    Merencanakan perpindahan domisili, estimasi anggaran hunian dan pendidikan anak,
                    serta simulasi pendapatan pasangan bekerja.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-amber-300/80 bg-amber-50/70 p-3 text-xs text-amber-900 mt-2">
                <strong>Prinsip Kejujuran Data:</strong> Angka biaya hidup di Nafkah dihitung melalui model estimasi ekonometrik dari Susenas dan IHK BPS, bukan survei primer per orang. Upah minimum mengacu pada ketetapan resmi 2026. Ini adalah indikator pembanding, bukan nasihat finansial.
              </div>
            </div>
          </div>

          {/* Running Footer */}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>nafkah.adenaufal.com</span>
            <span>Halaman 2 dari 8</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 3: METODOLOGI & KONSEP                                  */}
        {/* ============================================================ */}
        <div
          id="page-3"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative min-h-[297mm] flex flex-col justify-between ${
            viewMode === "booklet" && currentPage !== 2 ? "hidden no-print" : "mb-10"
          }`}
        >
          <div>
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[11px] font-semibold text-stone-500">
              <span>NAFKAH • BUKU PANDUAN RESMI</span>
              <span>2. METODOLOGI & CARA MEMBACA PETA</span>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2452d]">
                Rumus & Klasifikasi
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                Formula Perhitungan & 4 Band Keterjangkauan
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm text-stone-700">
              <p>
                Peta ekonomi Nafkah menghubungkan upah dan biaya hidup melalui <strong>Rasio Cakupan (Coverage Ratio)</strong>. Rasio ini menyatakan berapa persen pengeluaran hidup bulanan yang mampu ditutup oleh lantai upah:
              </p>

              {/* Formula Card */}
              <div className="rounded-xl border border-stone-300 bg-stone-900 text-stone-100 p-4 font-mono text-xs shadow-inner">
                <p className="text-stone-400 font-sans font-semibold mb-1 text-[11px]">FORMULA INTI NAFKAH:</p>
                <p className="text-amber-300 font-bold">
                  Cakupan (%) = (Basis Upah / Total Estimasi Biaya Hidup) × 100%
                </p>
                <div className="mt-2 text-stone-300 text-[11px] leading-relaxed font-sans">
                  • <strong>Basis Upah:</strong> UMK/UMP resmi daerah ATAU Pendapatan Sendiri jika diisi.<br />
                  • <strong>Total Biaya:</strong> Penjumlahan 10 kategori biaya setelah dikalikan bobot asumsi profil rumah tangga.
                </div>
              </div>

              {/* 4 Affordability Bands */}
              <h3 className="font-bold text-stone-900 pt-1">Empat Tingkat Keterjangkauan (Color Bands)</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-[#0b7a4b] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0b7a4b]">Nyaman (≥ 120%)</span>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">Surplus Lapang</span>
                    </div>
                    <p className="mt-0.5 text-xs text-stone-600">
                      Upah menutup seluruh biaya pokok, kebutuhan sekunder, dan menyisakan ruang tabungan signifikan (surplus &gt; 20%).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/60 p-3">
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-[#1d6fa5] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#1d6fa5]">Cukup (100% – 119%)</span>
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-800">Menutup Kebutuhan</span>
                    </div>
                    <p className="mt-0.5 text-xs text-stone-600">
                      Upah mampu menutup seluruh biaya bulanan standar tanpa defisit, dengan porsi tabungan moderat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-[#b26b00] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#b26b00]">Ketat (80% – 99%)</span>
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">Rentan / Pas-pasan</span>
                    </div>
                    <p className="mt-0.5 text-xs text-stone-600">
                      Upah berada di bawah kebutuhan standar. Pekerja harus memangkas pengeluaran atau mengorbankan alokasi tabungan darurat.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50/60 p-3">
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-[#a5271f] shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#a5271f]">Tak Cukup (&lt; 80%)</span>
                      <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-800">Defisit Signifikan</span>
                    </div>
                    <p className="mt-0.5 text-xs text-stone-600">
                      Defisit bulanan besar. Upah minimum daerah tidak mampu menutupi kebutuhan biaya hidup dasar tanpa sokongan pendapatan lain.
                    </p>
                  </div>
                </div>
              </div>

              {/* 10 Categories List */}
              <h3 className="font-bold text-stone-900 pt-2">10 Kategori Biaya yang Dihitung</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {EXPENSE_GUIDE_ITEMS.map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1.5 rounded-md border border-stone-200 bg-stone-50 p-2 font-medium text-stone-700">
                    <AppIcon name={item.icon} size={18} className="text-[#c2452d]" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Running Footer */}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>nafkah.adenaufal.com</span>
            <span>Halaman 3 dari 8</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 4: FITUR UTAMA MAPS EKONOMI                             */}
        {/* ============================================================ */}
        <div
          id="page-4"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative min-h-[297mm] flex flex-col justify-between ${
            viewMode === "booklet" && currentPage !== 3 ? "hidden no-print" : "mb-10"
          }`}
        >
          <div>
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[11px] font-semibold text-stone-500">
              <span>NAFKAH • BUKU PANDUAN RESMI</span>
              <span>3. FITUR UTAMA MAPS EKONOMI</span>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2452d]">
                Fitur Spasial
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                Fitur Unggulan Peta Interaktif
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm text-stone-700">
              <p>
                Maps ekonomi pada Nafkah dibangun dengan standar GIS modern, performa tinggi tanpa lag,
                dan didesain untuk kenyamanan eksplorasi publik:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c2452d] text-white text-xs font-bold">1</span>
                    <h3 className="font-bold text-stone-900 text-sm">Choropleth 514 Daerah Definitif</h3>
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    Setiap kabupaten dan kota diwarnai sesuai tingkat keterjangkauannya. Menggunakan TopoJSON
                    ringan (&lt;0.6 MB) yang memuat batas administratif adm2 resmi HDX / Kemendagri tanpa
                    membebani kuota data pengguna.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-700 text-white text-xs font-bold">2</span>
                    <h3 className="font-bold text-stone-900 text-sm">3 Mode Pewarnaan Fleksibel</h3>
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    Pilih perspektif data: Mode <strong>Cakupan</strong> (rasio keterjangkauan %), Mode <strong>Biaya</strong> (gradien rupiah pengeluaran bulanan), atau Mode <strong>Upah</strong> (gradien rupiah UMK daerah).
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700 text-white text-xs font-bold">3</span>
                    <h3 className="font-bold text-stone-900 text-sm">4 Pilihan Peta Dasar (Basemaps)</h3>
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    Tersedia peta dasar <strong>Terang</strong> (CARTO Positron), <strong>Gelap</strong> (CARTO Dark Matter), <strong>Satelit</strong> (Citra Satelit Beresolusi Tinggi Esri), dan <strong>Mode Offline</strong> tanpa tile peta untuk hemat daya.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-700 text-white text-xs font-bold">4</span>
                    <h3 className="font-bold text-stone-900 text-sm">Inklusif & Ramah Buta Warna</h3>
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    Gradien warna dirancang dengan standar kontras WCAG AA dan diuji untuk berbagai kondisi buta warna (deuteranopia, protanopia). Wilayah hutan dan danau diberi tekstur arsir khusus.
                  </p>
                </div>
              </div>

              {/* Feature highlight banner */}
              <div className="mt-2 rounded-xl border border-stone-200 bg-gradient-to-r from-stone-900 to-stone-800 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
                      Teknologi Tanpa Ketergantungan API Key
                    </h4>
                    <p className="mt-1 text-xs text-stone-300">
                      MapLibre GL JS berjalan murni di sisi browser pengguna (client-side dynamic rendering). Tidak ada ketergantungan pada layanan berbayar pihak ketiga sehingga aplikasi selalu dapat diakses secara gratis dan stabil.
                    </p>
                  </div>
                  <AppIcon
                    name="map"
                    size={34}
                    className="ml-4 hidden shrink-0 text-amber-400 sm:block"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Running Footer */}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>nafkah.adenaufal.com</span>
            <span>Halaman 4 dari 8</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 5: SIMULATOR ASUMSI & PENDAPATAN SENDIRI                */}
        {/* ============================================================ */}
        <div
          id="page-5"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative min-h-[297mm] flex flex-col justify-between ${
            viewMode === "booklet" && currentPage !== 4 ? "hidden no-print" : "mb-10"
          }`}
        >
          <div>
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[11px] font-semibold text-stone-500">
              <span>NAFKAH • BUKU PANDUAN RESMI</span>
              <span>4. SIMULATOR ASUMSI & GAJI PRIBADI</span>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2452d]">
                Simulasi Kustom
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                Ubah Asumsi Hidup & Coba Gaji Anda Sendiri
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm text-stone-700">
              <p>
                Setiap orang memiliki profil pengeluaran yang unik. Nafkah menyediakan panel asumsi interaktif yang seketika <strong>menghitung ulang seluruh 514 poligon peta secara instan</strong> saat opsi diubah:
              </p>

              {/* Assumptions Table */}
              <div className="overflow-hidden rounded-xl border border-stone-200 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-100 font-bold text-stone-800 border-b border-stone-200">
                    <tr>
                      <th className="p-2.5">Parameter</th>
                      <th className="p-2.5">Pilihan Tersedia</th>
                      <th className="p-2.5">Pengaruh ke Model</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Tipe Rumah Tangga</td>
                      <td className="p-2.5 text-stone-600">Lajang (Single), Pasangan, atau Keluarga (Anak)</td>
                      <td className="p-2.5 text-stone-600">Menyesuaikan kebutuhan pangan, listrik, air, dan biaya sekolah</td>
                    </tr>
                    <tr className="bg-stone-50/50">
                      <td className="p-2.5 font-semibold text-stone-900">Opsi 2 Upah (Dual Earner)</td>
                      <td className="p-2.5 text-stone-600">Aktifkan saat pasangan juga bekerja</td>
                      <td className="p-2.5 text-stone-600">Menambahkan 1 UMK daerah setempat ke total pemasukan rumah tangga</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Gaya Hidup</td>
                      <td className="p-2.5 text-stone-600">Hemat, Standar (Baseline), atau Nyaman</td>
                      <td className="p-2.5 text-stone-600">Memperketat atau melonggarkan konsumsi pangan dan rekreasi</td>
                    </tr>
                    <tr className="bg-stone-50/50">
                      <td className="p-2.5 font-semibold text-stone-900">Tipe Hunian</td>
                      <td className="p-2.5 text-stone-600">Rusun/Kost (55%), Rumah KPR (100%), Apartemen (145%)</td>
                      <td className="p-2.5 text-stone-600">Dihitung dari benchmark harga sewa pasar lokal setempat</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-stone-900">Moda Transportasi</td>
                      <td className="p-2.5 text-stone-600">Sepeda Motor, Angkutan Umum, atau Ojek Online (Ojol)</td>
                      <td className="p-2.5 text-stone-600">Bensin & servis berkala vs tarif perjalanan harian</td>
                    </tr>
                    <tr className="bg-stone-50/50">
                      <td className="p-2.5 font-semibold text-stone-900">Basis Upah</td>
                      <td className="p-2.5 text-stone-600">UMK Kotor (Gross) atau Estimasi Take-Home Pay</td>
                      <td className="p-2.5 text-stone-600">Mengurangi ±4% untuk iuran BPJS & estimasi PPh</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Custom Income Highlight Box */}
              <div className="rounded-xl border border-emerald-300 bg-emerald-50/70 p-4">
                <div className="flex items-start gap-3">
                  <AppIcon name="lock" size={24} className="mt-0.5 shrink-0 text-emerald-700" />
                  <div>
                    <h3 className="font-bold text-emerald-950 text-sm">
                      Fitur &ldquo;Pendapatan Sendiri&rdquo; & Jaminan Privasi
                    </h3>
                    <p className="mt-1 text-xs text-emerald-900 leading-relaxed">
                      Anda tidak harus terpatok pada angka UMK. Cukup masukkan nominal gaji bulanan Anda ke kolom
                      <strong>&ldquo;Pendapatan sendiri&rdquo;</strong>. Peta akan langsung memperlihatkan di kota mana saja
                      gaji Anda masuk kategori <em>Nyaman</em> atau <em>Ketat</em>.
                    </p>
                    <p className="mt-2 inline-flex items-start gap-1.5 rounded border border-emerald-200 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
                      <AppIcon name="checkCircle" size={15} weight="bold" className="mt-0.5 shrink-0" />
                      <span>Privasi 100%: Angka gaji yang Anda masukkan HANYA diolah di browser Anda. Tidak ada data yang dikirim ke server.</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Running Footer */}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>nafkah.adenaufal.com</span>
            <span>Halaman 5 dari 8</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 6: EKSPLORASI, PENCARIAN & KOMPARASI                    */}
        {/* ============================================================ */}
        <div
          id="page-6"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative min-h-[297mm] flex flex-col justify-between ${
            viewMode === "booklet" && currentPage !== 5 ? "hidden no-print" : "mb-10"
          }`}
        >
          <div>
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[11px] font-semibold text-stone-500">
              <span>NAFKAH • BUKU PANDUAN RESMI</span>
              <span>5. EKSPLORASI, PENCARIAN & KOMPARASI</span>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2452d]">
                Analisis Antar Wilayah
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                Pencarian, Baki Sematan, & Grafik Perbandingan
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm text-stone-700">
              <p>
                Menilai satu kota saja belum cukup. Nafkah dirancang agar Anda dapat membandingkan beberapa wilayah tujuan secara langsung:
              </p>

              <div className="space-y-3">
                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center justify-between">
                    <h3 className="inline-flex items-center gap-1.5 font-bold text-stone-900 text-sm"><AppIcon name="magnifyingGlass" size={16} /> Pencarian Instan 514 Daerah</h3>
                    <span className="text-[10px] font-bold rounded bg-stone-200 px-2 py-0.5 text-stone-700">Fuzzy Search</span>
                  </div>
                  <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                    Ketik nama kota, kabupaten, atau provinsi. Hasil pencarian langsung menyorot wilayah dan mengarahkan tampilan peta ke lokasi target.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center justify-between">
                    <h3 className="inline-flex items-center gap-1.5 font-bold text-stone-900 text-sm"><AppIcon name="pushPin" size={16} /> Baki Sematan (Pin Tray) Hingga 5 Wilayah</h3>
                    <span className="text-[10px] font-bold rounded bg-stone-200 px-2 py-0.5 text-stone-700">Side-by-Side</span>
                  </div>
                  <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                    Sematkan beberapa kota (contoh: Jakarta Selatan, Bandung, Yogyakarta, Surabaya, Balikpapan) untuk melihat perbandingan cepat surplus/defisit rupiah tiap bulan.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center justify-between">
                    <h3 className="inline-flex items-center gap-1.5 font-bold text-stone-900 text-sm"><AppIcon name="chartBar" size={16} /> Grafik Batang Bertumpuk (Stacked Bar Chart)</h3>
                    <span className="text-[10px] font-bold rounded bg-stone-200 px-2 py-0.5 text-stone-700">10 Kategori Biaya</span>
                  </div>
                  <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                    Panel perbandingan membedah total pengeluaran menjadi 10 komponen warna. Anda bisa langsung melihat apakah tingginya biaya di suatu kota diakibatkan oleh sewa hunian, pangan, atau transportasi.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
                  <div className="flex items-center justify-between">
                    <h3 className="inline-flex items-center gap-1.5 font-bold text-stone-900 text-sm"><AppIcon name="list" size={16} /> Jendela Detail Wilayah & Profil Sosio-Ekonomi</h3>
                    <span className="text-[10px] font-bold rounded bg-stone-200 px-2 py-0.5 text-stone-700">Deep Dive</span>
                  </div>
                  <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                    Klik pada daerah mana pun untuk membuka modal komprehensif: narasi lokal, profil biaya hidup spesifik, serta tabel provenance data yang mencatat tanggal perolehan data dan dasar hukum SK Gubernur.
                  </p>
                </div>
              </div>

              {/* Comparison Preview Visual Simulation */}
              <div className="rounded-xl border border-stone-300 p-4 bg-white mt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Contoh Perbandingan Cepat (Profil Lajang - Asumsi Standar 2026):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="rounded border border-stone-200 p-2.5 bg-stone-50">
                    <p className="font-bold text-stone-900">DKI Jakarta</p>
                    <p className="text-[11px] text-stone-500">UMK: Rp 5.396.761</p>
                    <p className="text-[11px] text-stone-500">Biaya: Rp 4.680.000</p>
                    <p className="mt-1 text-xs font-extrabold text-blue-700">Cakupan: 115% (Cukup)</p>
                  </div>
                  <div className="rounded border border-stone-200 p-2.5 bg-stone-50">
                    <p className="font-bold text-stone-900">Kota Yogyakarta</p>
                    <p className="text-[11px] text-stone-500">UMK: Rp 2.655.041</p>
                    <p className="text-[11px] text-stone-500">Biaya: Rp 2.420.000</p>
                    <p className="mt-1 text-xs font-extrabold text-blue-700">Cakupan: 109% (Cukup)</p>
                  </div>
                  <div className="rounded border border-stone-200 p-2.5 bg-stone-50">
                    <p className="font-bold text-stone-900">Kota Jayapura</p>
                    <p className="text-[11px] text-stone-500">UMK: Rp 4.436.283</p>
                    <p className="text-[11px] text-stone-500">Biaya: Rp 4.520.000</p>
                    <p className="mt-1 text-xs font-extrabold text-[#b26b00]">Cakupan: 98% (Ketat)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Running Footer */}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>nafkah.adenaufal.com</span>
            <span>Halaman 6 dari 8</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 7: INTEGRITAS DATA & AUDIT PROVENANCE                   */}
        {/* ============================================================ */}
        <div
          id="page-7"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative min-h-[297mm] flex flex-col justify-between ${
            viewMode === "booklet" && currentPage !== 6 ? "hidden no-print" : "mb-10"
          }`}
        >
          <div>
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[11px] font-semibold text-stone-500">
              <span>NAFKAH • BUKU PANDUAN RESMI</span>
              <span>6. INTEGRITAS DATA & AUDIT PROVENANCE</span>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2452d]">
                Transparansi & Batasan
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                Integritas Data, Sumber Resmi, & Batasan (Disclaimer)
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm text-stone-700 leading-relaxed">
              <p>
                Salah satu komitmen utama Nafkah adalah <strong>kejujuran data (provenance-first)</strong>. Tidak ada angka yang ditampilkan tanpa label sumber dan tingkat keterpercayaan.
              </p>

              {/* 3 Confidence Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    Official (Resmi)
                  </span>
                  <p className="mt-1.5 text-xs text-stone-600">
                    Dataset resmi pemerintah: SK Gubernur penetapan UMK/UMP 2026, PP No. 49 Tahun 2025, dan data batas wilayah Kemendagri.
                  </p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3">
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                    Estimate (Estimasi)
                  </span>
                  <p className="mt-1.5 text-xs text-stone-600">
                    Model ekonometrik dari agregasi Susenas, IHK BPS, dan penyesuaian inflasi tahunan (+2,88% asOf Agustus 2026).
                  </p>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                    Sample (Sampel)
                  </span>
                  <p className="mt-1.5 text-xs text-stone-600">
                    Benchmark pasar lokal (misal: sewa rusun/kost) di daerah yang tidak memiliki survei biaya hidup primer dari BPS.
                  </p>
                </div>
              </div>

              {/* Important Disclaimers Callout */}
              <div className="rounded-xl border border-stone-300 bg-stone-50 p-4 space-y-2.5">
                <h3 className="inline-flex items-center gap-1.5 font-bold text-stone-900 text-xs uppercase tracking-wider">
                  <AppIcon name="warning" size={16} weight="bold" />
                  Dua Batasan Kritis yang Wajib Dipahami Pengguna:
                </h3>

                <div className="text-xs space-y-2 text-stone-700">
                  <p>
                    <strong>1. UMK adalah Lantai Regulasi, Bukan Potret Gaji Nyata:</strong> Upah minimum
                    adalah batas bawah yang ditetapkan pemerintah secara hukum bagi pekerja dengan masa
                    kerja di bawah 1 tahun. Di lapangan, banyak UMKM menggaji di bawah UMK, sementara sektor
                    formal/spesialis menggaji jauh di atasnya. Bacalah peta sebagai <em>&ldquo;apakah lantai
                    upah resmi daerah ini cukup menopang biaya hidup?&rdquo;</em> bukan sebagai rerata gaji nyata.
                  </p>
                  <p>
                    <strong>2. Model Estimasi Ekonometrik, Bukan Survei Per Orang:</strong> BPS hanya
                    menggelar Survei Biaya Hidup (SBH) di kota-kota sampel IHK tertentu. Angka pengeluaran
                    untuk kabupaten pedalaman/kepulauan dihitung lewat Susenas perdesaan dan biaya logistik
                    perintis.
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-white p-3 text-xs text-stone-600">
                <strong>Audit Kerapian Geometri:</strong> Dataset TopoJSON telah diaudit untuk menyaring poligon badan air/hutan tak berpenghuni (Danau Toba, Waduk Cirata, Kedungombo, Tondano) sehingga total tepat mencakup 514 daerah definitif Indonesia.
              </div>
            </div>
          </div>

          {/* Running Footer */}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>nafkah.adenaufal.com</span>
            <span>Halaman 7 dari 8</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PAGE 8: PANDUAN PENGGUNA, FAQ & AKSES WEBSITE                */}
        {/* ============================================================ */}
        <div
          id="page-8"
          className={`print-page rounded-2xl border border-stone-300 bg-white p-8 sm:p-12 shadow-md relative min-h-[297mm] flex flex-col justify-between ${
            viewMode === "booklet" && currentPage !== 7 ? "hidden no-print" : "mb-10"
          }`}
        >
          <div>
            {/* Running Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-2 text-[11px] font-semibold text-stone-500">
              <span>NAFKAH • BUKU PANDUAN RESMI</span>
              <span>7. PANDUAN PRAKTIS & AKSES WEBSITE</span>
            </div>

            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#c2452d]">
                Langkah Penggunaan
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
                Cara Menggunakan Website & Tanya Jawab (FAQ)
              </h2>
            </div>

            <div className="mt-5 space-y-4 text-sm text-stone-700">
              {/* 4 Steps Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <p className="font-bold text-[#c2452d]">Langkah 1</p>
                  <p className="font-semibold text-stone-900 mt-1">Cari Wilayah</p>
                  <p className="mt-1 text-[11px] text-stone-600">
                    Cari daerah domisili atau tujuan Anda lewat kolom pencarian atau klik poligon peta.
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <p className="font-bold text-blue-700">Langkah 2</p>
                  <p className="font-semibold text-stone-900 mt-1">Atur Asumsi</p>
                  <p className="mt-1 text-[11px] text-stone-600">
                    Buka tombol pengaturan Asumsi untuk memilih jenis rumah tangga, kost/rumah, dan moda transport.
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <p className="font-bold text-amber-700">Langkah 3</p>
                  <p className="font-semibold text-stone-900 mt-1">Uji Gaji Anda</p>
                  <p className="mt-1 text-[11px] text-stone-600">
                    Isi pendapatan pribadi bulanan untuk melihat status keterjangkauan spesifik Anda.
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
                  <p className="font-bold text-emerald-700">Langkah 4</p>
                  <p className="font-semibold text-stone-900 mt-1">Bandingkan Kota</p>
                  <p className="mt-1 text-[11px] text-stone-600">
                    Sematkan beberapa kota ke baki perbandingan untuk melihat grafik rincian 10 biaya.
                  </p>
                </div>
              </div>

              {/* FAQ Section */}
              <h3 className="font-bold text-stone-900 pt-1">Pertanyaan yang Sering Diajukan (FAQ)</h3>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg border border-stone-200 p-3 bg-white">
                  <p className="font-bold text-stone-900">Q: Apakah data gaji yang saya masukkan disimpan atau dikirim ke server?</p>
                  <p className="mt-1 text-stone-600">
                    <strong>A: Tidak sama sekali.</strong> Nafkah dibangun sebagai aplikasi statis murni tanpa backend database user. Seluruh simulasi gaji dihitung 100% di browser Anda dan hilang saat tab ditutup.
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 p-3 bg-white">
                  <p className="font-bold text-stone-900">Q: Jika saya menemukan angka UMK atau biaya yang meleset, bagaimana memperbaikinya?</p>
                  <p className="mt-1 text-stone-600">
                    <strong>A:</strong> Komunitas dapat mengajukan koreksi lewat Form Airtable Koreksi Data resmi atau membuat Pull Request di GitHub. Setiap usulan akan diverifikasi dengan SK penetapan resmi.
                  </p>
                </div>
                <div className="rounded-lg border border-stone-200 p-3 bg-white">
                  <p className="font-bold text-stone-900">Q: Apakah aplikasi ini gratis digunakan untuk kebutuhan riset atau organisasi?</p>
                  <p className="mt-1 text-stone-600">
                    <strong>A: Ya, 100% gratis.</strong> Kode dirilis dengan lisensi MIT dan dataset dengan lisensi Creative Commons (CC-BY-4.0).
                  </p>
                </div>
              </div>

              {/* Back Cover Callout */}
              <div className="mt-4 rounded-xl border border-stone-300 bg-stone-900 p-5 text-white flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-black text-lg tracking-tight text-white">
                    Mulai Eksplorasi Sekarang
                  </h4>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Kunjungi tautan resmi web app peta ekonomi Indonesia:
                  </p>
                  <p className="text-sm font-bold text-amber-400 mt-1">
                    https://nafkah.adenaufal.com
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#c2452d] px-4 py-2 text-xs font-bold text-white hover:bg-[#a83624] transition-colors"
                  >
                    Buka Aplikasi Sekarang
                    <AppIcon name="arrowUpRight" size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Running Footer */}
          <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-[11px] text-stone-400">
            <span>nafkah.adenaufal.com</span>
            <span>Halaman 8 dari 8 • Akhir Booklet</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE COMPANION SECTION (SCREEN ONLY)                  */}
        {/* ============================================================ */}
        <section className="no-print mt-12 rounded-2xl border border-stone-300 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <span className="rounded bg-[#c2452d]/10 px-2 py-0.5 text-[11px] font-bold text-[#c2452d]">
                Simulator Interaktif
              </span>
              <h3 className="mt-1 text-lg font-bold text-stone-900">
                Uji Kalkulasi Rasio Nafkah Langsung di Sini
              </h3>
              <p className="text-xs text-stone-500">
                Cobalah contoh kalkulasi interaktif untuk memahami cara kerja formula peta ekonomi Nafkah:
              </p>
            </div>
            <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-lg">
              Status Simulasi Live
            </span>
          </div>

          {/* Live Mini Calculator */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Input Column 1 */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  1. Pilih Kota Sampel:
                </label>
                <select
                  value={sampleRegion}
                  onChange={(e) => setSampleRegion(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-stone-50 p-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-[#c2452d]"
                >
                  {sampleRegions.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.name} (UMK Rp {r.umk.toLocaleString("id-ID")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  2. Profil Rumah Tangga:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(["single", "couple", "family"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setHouseholdType(t)}
                      className={`rounded py-1.5 text-center text-xs font-semibold transition-colors ${
                        householdType === t
                          ? "bg-[#c2452d] text-white"
                          : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                      }`}
                    >
                      {t === "single" ? "Lajang" : t === "couple" ? "Pasangan" : "Keluarga"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Column 2 */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  3. Gaji / Pendapatan Bulanan:
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-2 text-stone-400 font-bold">Rp</span>
                  <input
                    type="number"
                    step="500000"
                    value={customIncomeInput}
                    onChange={(e) => setCustomIncomeInput(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 bg-stone-50 pl-9 pr-2.5 py-1.5 text-xs font-bold text-stone-800 focus:outline-none focus:border-[#c2452d]"
                  />
                </div>
                <div className="mt-1 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCustomIncomeInput(activeSample.umk)}
                    className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                  >
                    Gunakan UMK {activeSample.name}
                  </button>
                  <span className="text-stone-300">•</span>
                  <button
                    type="button"
                    onClick={() => setCustomIncomeInput(10000000)}
                    className="text-[10px] text-stone-500 hover:text-stone-800 underline"
                  >
                    Rp 10 Juta
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-[11px] text-stone-600">
                <p>
                  <strong>Catatan:</strong> Estimasi pengeluaran mencakup 10 komponen kebutuhan layak
                  termasuk hunian dan konsumsi harian.
                </p>
              </div>
            </div>

            {/* Results Column */}
            <div
              className="rounded-xl border p-4 text-center flex flex-col justify-between"
              style={{ borderColor: bandInfo.color, backgroundColor: bandInfo.bg }}
            >
              <div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider"
                  style={{ color: bandInfo.color, backgroundColor: "white" }}
                >
                  Kategori {bandInfo.label}
                </span>
                <p className="mt-2 text-3xl font-black" style={{ color: bandInfo.color }}>
                  {coverageRatio}%
                </p>
                <p className="text-[11px] text-stone-600 mt-1">Rasio Keterjangkauan</p>
              </div>

              <div className="border-t border-stone-200/70 pt-2.5 mt-2 text-left text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-600">Estimasi Biaya:</span>
                  <span className="font-bold text-stone-900">Rp {estimatedCost.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Gaji Dicoba:</span>
                  <span className="font-bold text-stone-900">Rp {incomeToUse.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-stone-200/50">
                  <span className="text-stone-600">Surplus / Defisit:</span>
                  <span className={`font-bold ${surplusDeficit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                    {surplusDeficit >= 0 ? "+" : ""}Rp {surplusDeficit.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Feature Catalog Filter */}
          <div className="mt-8 border-t border-stone-200 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Katalog Fitur Lengkap Website Nafkah
                </h4>
                <p className="text-xs text-stone-500">
                  Temukan rincian kemampuan peta dan fitur teknis:
                </p>
              </div>

              {/* Search input for features */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Cari fitur (misal: satelit, gaji, pin)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#c2452d] w-64"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none text-xs">
              {[
                { id: "all", label: "Semua Fitur" },
                { id: "peta", label: "Peta & Spasial" },
                { id: "simulasi", label: "Simulasi & Asumsi" },
                { id: "komparasi", label: "Komparasi & Analisis" },
                { id: "data", label: "Data & Provenance" },
                { id: "aksesibilitas", label: "Aksesibilitas & Panduan" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors shrink-0 ${
                    categoryFilter === c.id
                      ? "bg-stone-900 text-white"
                      : "border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredFeatures.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-stone-200 bg-stone-50/70 p-3.5 hover:border-stone-400 hover:bg-white transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded bg-stone-200 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                        {item.badge}
                      </span>
                    </div>
                    <h5 className="mt-2 text-xs font-bold text-stone-900 leading-snug">
                      {item.title}
                    </h5>
                    <p className="mt-1 text-[11px] text-stone-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.tags.map((t) => (
                      <span key={t} className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] text-stone-500 font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {filteredFeatures.length === 0 && (
                <div className="col-span-full py-8 text-center text-xs text-stone-500">
                  Tidak ada fitur yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Screen-Only Footer */}
      <footer className="no-print mt-16 border-t border-stone-300 bg-white py-8 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-4xl px-4 space-y-2">
          <p className="font-semibold text-stone-800">
            Nafkah — Peta Kecukupan Gaji dan Biaya Hidup 514 Kabupaten/Kota Indonesia
          </p>
          <p className="text-[11px] text-stone-500">
            Karya Ade Naufal • Kode berlisensi MIT • Data berlisensi CC-BY-4.0 • Edisi 2026
          </p>
          <div className="pt-2 flex justify-center gap-4 text-xs font-medium text-[#c2452d]">
            <Link href="/" className="hover:underline">Peta Utama</Link>
            <span>•</span>
            <button type="button" onClick={triggerPrint} className="hover:underline">
              Cetak Dokumen (A4)
            </button>
            <span>•</span>
            <a
              href="https://github.com/adenaufal/nafkah"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
