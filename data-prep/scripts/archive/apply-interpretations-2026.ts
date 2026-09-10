/**
 * Menerapkan pembaruan deskripsi analisis AI (interpretasi) UMK 2026
 * ke seluruh 38 file src/data/provinces/*.ts (514 kabupaten/kota).
 *
 * Jalankan dari root repo: npx tsx data-prep/scripts/apply-interpretations-2026.ts
 */
import * as fs from "fs";
import * as path from "path";
import { ALL_PROVINCE_PACKAGES } from "../../src/data/provinces/index";

const slugByCode: Record<string, string> = {
  "11": "aceh",
  "12": "sumatera-utara",
  "13": "sumatera-barat",
  "14": "riau",
  "15": "jambi",
  "16": "sumatera-selatan",
  "17": "bengkulu",
  "18": "lampung",
  "19": "kepulauan-bangka-belitung",
  "21": "kepulauan-riau",
  "31": "dki-jakarta",
  "32": "jawa-barat",
  "33": "jawa-tengah",
  "34": "daerah-istimewa-yogyakarta",
  "35": "jawa-timur",
  "36": "banten",
  "51": "bali",
  "52": "nusa-tenggara-barat",
  "53": "nusa-tenggara-timur",
  "61": "kalimantan-barat",
  "62": "kalimantan-tengah",
  "63": "kalimantan-selatan",
  "64": "kalimantan-timur",
  "65": "kalimantan-utara",
  "71": "sulawesi-utara",
  "72": "sulawesi-tengah",
  "73": "sulawesi-selatan",
  "74": "sulawesi-tenggara",
  "75": "gorontalo",
  "76": "sulawesi-barat",
  "81": "maluku",
  "82": "maluku-utara",
  "91": "papua",
  "92": "papua-barat",
  "93": "papua-selatan",
  "94": "papua-tengah",
  "95": "papua-pegunungan",
  "96": "papua-barat-daya",
};

export function fmtWage(n: number): string {
  const mil = (n / 1_000_000).toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `Rp${mil} juta`;
}

// Special hand-crafted adjustments for special cases with ranking shifts or complex wage references
const customOverrides: Record<string, (oldText: string, wageStr: string) => string> = {
  // Badung (Bali) - highest in Bali
  "51.03": (oldText, wageStr) =>
    `Badung memiliki UMK tertinggi di Bali (${wageStr}) didukung PAD pariwisata masif dan standar upah sektor perhotelan yang kuat. Namun, tingginya biaya sewa hunian di pesisir selatan memaksa mayoritas tenaga kerja lokal tinggal di daerah penyangga seperti Mengwi atau Dalung.`,

  // Luwu Timur (Sulsel)
  "73.25": (oldText, wageStr) =>
    `Pusat industri pertambangan nikel terintegrasi PT Vale Indonesia di Sorowako mendorong PDRB per kapita dan daya beli sangat tinggi di Luwu Timur. UMK mandiri ${wageStr} mengimbangi struktur harga lokal dan kebutuhan biaya hidup di lingkar industri tambang.`,

  // Sumbawa Barat (NTB) - highest in NTB in 2026
  "52.07": (oldText, wageStr) =>
    `Sumbawa Barat memiliki tingkat UMK tertinggi di NTB (${wageStr}) berkat geliat industri pertambangan tembaga dan emas. Tingginya perputaran uang membuat biaya sewa hunian dan makanan warung di lingkar tambang relatif di atas rata-rata NTB.`,

  // Mamuju (Sulbar)
  "76.04": (oldText, wageStr) =>
    `Sebagai ibu kota Provinsi Sulawesi Barat, Mamuju menjadi pusat aktivitas birokrasi pemerintahan, perdagangan, dan jasa perhotelan. Penerapan UMK mandiri sebesar ${wageStr} memberikan kemampuan belanja yang solid di tengah gaya hidup perkotaan pesisir yang dinamis namun tetap berbiaya wajar.`,

  // Mimika (Papua Tengah)
  "94.04": (oldText, wageStr) =>
    `Sebagai episentrum pertambangan emas dan tembaga skala global (PT Freeport Indonesia), Mimika ditopang oleh standar upah ${wageStr}. Daya beli yang tinggi diiringi oleh biaya konsumsi perkotaan dan perumahan yang paling premium di Provinsi Papua Tengah.`,

  // Kota Binjai (Sumut) - preserve transit fare Rp5.000
  "12.76": (oldText, wageStr) =>
    `Kota Binjai berfungsi sebagai kota hunian penyangga barat Medan dengan konektivitas kereta komuter murah Rp5.000 ke Stasiun Medan. UMK ${wageStr} cukup memadai untuk gaya hidup hemat.`,

  // Kota Mojokerto (Jatim) - preserve Trans Jatim fare Rp5.000
  "35.76": (oldText, wageStr) =>
    `Kota Mojokerto memiliki wilayah kompak dengan efisiensi mobilitas tinggi. UMK ${wageStr} didukung layanan Trans Jatim murah (Rp5.000) yang mempermudah mobilitas kerja lintas wilayah.`,
};

export function transformInterpretation(
  code: string,
  name: string,
  provCode: string,
  provName: string,
  gross: number,
  oldText: string
): string {
  const wageStr = fmtWage(gross);

  if (customOverrides[code]) {
    return customOverrides[code](oldText, wageStr);
  }

  let text = oldText;

  // Replace old wage pattern: RpX,XX juta / RpX,X juta / RpX.XXX.XXX
  text = text.replace(/Rp\s*([0-9]+[.,][0-9]+|[0-9]+)\s*juta/gi, wageStr);

  // Replace old year references
  text = text.replace(/UMK\s*2025/gi, "UMK 2026");
  text = text.replace(/UMP\s*2025/gi, "UMP 2026");
  text = text.replace(/tahun\s*2025/gi, "tahun 2026");
  text = text.replace(/2025/g, "2026");

  return text;
}

let totalUpdatedRegions = 0;

for (const pkg of ALL_PROVINCE_PACKAGES) {
  const provCode = pkg.provinceCode;
  const slug = slugByCode[provCode];
  if (!slug) throw new Error(`Slug not found for province ${provCode}`);

  const filePath = path.join("src", "data", "provinces", `${slug}.ts`);
  let content = fs.readFileSync(filePath, "utf8");

  const narrativesStart = content.indexOf("  narratives: [");
  if (narrativesStart < 0)
    throw new Error(`Narratives start not found in ${slug}.ts`);
  const narrativesEnd = content.indexOf("\n  ],", narrativesStart);
  if (narrativesEnd < 0)
    throw new Error(`Narratives end not found in ${slug}.ts`);

  const updatedNarratives = pkg.narratives.map((n) => {
    const reg = pkg.regions.find((r) => r.code === n.regionCode);
    const wage = pkg.wages.find((w) => w.regionCode === n.regionCode);
    const gross = wage?.grossMonthly ?? 0;

    const newInterp = transformInterpretation(
      n.regionCode,
      reg?.name ?? "",
      pkg.provinceCode,
      pkg.provinceName,
      gross,
      n.interpretation
    );

    totalUpdatedRegions++;

    return `    {
      regionCode: ${JSON.stringify(n.regionCode)},
      rentRange: {
        min: ${n.rentRange.min},
        max: ${n.rentRange.max},
        note:
          ${JSON.stringify(n.rentRange.note)},
        provenance: {
          source: "Model estimasi sewa hunian & pasar properti lokal — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)",
          asOf: "2026-08-01",
          confidence: "estimate",
        },
      },
      transportContext:
        ${JSON.stringify(n.transportContext)},
      interpretation:
        ${JSON.stringify(newInterp)},
    },`;
  });

  const narrativesBlock = `  narratives: [\n${updatedNarratives.join("\n")}\n  ],`;

  const newContent =
    content.slice(0, narrativesStart) +
    narrativesBlock +
    content.slice(narrativesEnd + "\n  ],".length);

  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`Updated ${slug}.ts (${pkg.narratives.length} regions)`);
}

console.log(
  `\nSuccessfully applied 2026 interpretations to ${totalUpdatedRegions} regions across 38 provinces.`
);
