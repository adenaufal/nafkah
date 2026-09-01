/**
 * Menerapkan hasil riset UMP/UMK 2026 (data-prep/wages-2026-research.json)
 * ke seluruh file src/data/provinces/*.ts:
 *  - Regenerasi blok `wages` (year 2026, dekrit resmi, asOf 2026-01-01).
 *  - Daerah tanpa UMK mandiri 2026 menginduk UMP 2026 provinsinya.
 *  - Blok `costs`: nominal diskalakan x1,0288 (IHK nasional yoy Juli 2026, BPS),
 *    dibulatkan ke ribuan terdekat, asOf -> 2026-08-01, source diberi keterangan.
 *
 * Jalankan dari root repo: npx tsx data-prep/scripts/apply-2026.ts
 */
import * as fs from "fs";
import * as path from "path";
import { ALL_PROVINCE_PACKAGES } from "../../src/data/provinces/index";

type Spec = {
  umpSourceUrl: string;
  ump2026: Record<string, { value: number; decree?: string }>;
  umk2026: Record<string, Record<string, number>>;
  umkDecrees: Record<string, Record<string, string>>;
  costs2025: Record<
    string,
    Record<
      string,
      {
        amount: number;
        source: string;
        asOf: string;
        confidence: string;
      }
    >
  >;
};

function loadJson<T>(rel: string): T {
  try {
    return JSON.parse(fs.readFileSync(rel, "utf8")) as T;
  } catch (err) {
    throw new Error(`Gagal memuat ${rel}: ${String(err)}`);
  }
}

const spec = loadJson<Spec>("data-prep/wages-2026-research.json");
const costsOrig = loadJson<NonNullable<Spec["costs2025"]>>(
  "data-prep/costs-2025-original.json",
);

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

const INFLATION = 1.0288; // BPS: inflasi yoy Juli 2026 = 2,88%
const scale = (n: number) => Math.round((n * INFLATION) / 1000) * 1000;

function umpSource(provCode: string, provName: string): string {
  const u = spec.ump2026[provCode];
  if (u.decree) {
    // pisahkan catatan "(nilai resmi ...)" agar susunan kalimat tetap rapi
    const m = u.decree.match(/^(.*?)\s*(\((nilai resmi)[^)]*\))$/);
    if (m) return `${m[1]} tentang Upah Minimum Provinsi Tahun 2026 ${m[2]}`;
    return `${u.decree} tentang Upah Minimum Provinsi Tahun 2026`;
  }
  return `Keputusan Gubernur ${provName} tentang Upah Minimum Provinsi Tahun 2026 (rilis resmi Kemnaker, 6 Januari 2026; ${spec.umpSourceUrl})`;
}

function umkSource(provCode: string, provName: string, name: string): string {
  const d = spec.umkDecrees[provCode] ?? {};
  const decree = d[name] ?? d["_"];
  if (!decree)
    throw new Error(`Decree UMK 2026 tidak ditemukan: ${provCode} ${name}`);
  if (/tentang/i.test(decree)) return decree;
  return `${decree} tentang Upah Minimum Kabupaten/Kota di Provinsi ${provName} Tahun 2026`;
}

function tsLiteral(v: string): string {
  return v.length > 82
    ? `source:\n        ${JSON.stringify(v)}`
    : `source: ${JSON.stringify(v)}`;
}

let totalRows = 0;
let umkRows = 0;
const dump: unknown[] = [];

for (const p of ALL_PROVINCE_PACKAGES) {
  const provCode = p.provinceCode;
  const provName = p.provinceName;
  const ump = spec.ump2026[provCode];
  if (!ump) throw new Error(`UMP 2026 belum ada untuk provinsi ${provCode}`);
  const umk = spec.umk2026[provCode] ?? {};
  const nameToCode = new Map(p.regions.map((r) => [r.name, r.code]));

  // validasi nama wilayah pada spesifikasi
  for (const name of Object.keys(umk)) {
    if (!nameToCode.has(name)) {
      throw new Error(`Nama wilayah tidak cocok di ${provName}: "${name}"`);
    }
  }

  // --- bangun record upah 2026 ---
  const rows = p.regions.map((r) => {
    const umkVal = umk[r.name];
    const gross = umkVal ?? ump.value;
    if (umkVal != null && umkVal < ump.value) {
      throw new Error(
        `UMK ${r.name} (${umkVal}) < UMP ${provName} (${ump.value})`,
      );
    }
    if (umkVal != null) umkRows++;
    return {
      regionCode: r.code,
      year: 2026,
      grossMonthly: gross,
      estimatedTakeHomeMonthly: Math.round(gross * 0.96),
      source:
        umkVal == null
          ? umpSource(provCode, provName)
          : umkSource(provCode, provName, r.name),
      asOf: "2026-01-01",
      confidence: "official",
    };
  });
  if (rows.length !== p.wages.length) {
    throw new Error(
      `${provName}: jumlah baris berubah ${p.wages.length} -> ${rows.length}`,
    );
  }
  totalRows += rows.length;
  dump.push({ provinceName: provName, provinceCode: provCode, wages: rows });

  // --- tulis ke file provinsi ---
  const slug = slugByCode[provCode];
  if (!slug) throw new Error(`Slug tidak ditemukan untuk provinsi ${provCode}`);
  const file = path.join("src", "data", "provinces", `${slug}.ts`);
  let text = fs.readFileSync(file, "utf8");

  const wagesStart = text.indexOf("  wages: [");
  if (wagesStart < 0)
    throw new Error(`Blok wages tidak ditemukan di ${slug}.ts`);
  const wagesEnd = text.indexOf("\n  ],", wagesStart);
  const newWages = `  wages: [\n${rows
    .map(
      (w) => `    {
      regionCode: ${JSON.stringify(w.regionCode)},
      year: 2026,
      grossMonthly: ${w.grossMonthly},
      estimatedTakeHomeMonthly: Math.round(${w.grossMonthly} * 0.96),
      ${tsLiteral(w.source)},
      asOf: "2026-01-01",
      confidence: "official",
    },`,
    )
    .join("\n")}\n  ],`;
  text =
    text.slice(0, wagesStart) +
    newWages +
    text.slice(wagesEnd + "\n  ],".length);

  const costsStart = text.indexOf("  costs: [");
  if (costsStart < 0)
    throw new Error(`Blok costs tidak ditemukan di ${slug}.ts`);
  const costsEnd = text.indexOf("\n  ],", costsStart);
  const newCosts = `  costs: [\n${p.regions
    .map((r) => {
      const rec = costsOrig[r.code];
      if (!rec)
        throw new Error(`Baseline costs asli tidak ditemukan untuk ${r.code}`);
      const cats = Object.entries(rec)
        .map(
          ([k, v]) => `        ${k}: {
          amount: ${scale(v.amount)},
          source: ${JSON.stringify(`${v.source} — disesuaikan IHK nasional Juli 2026 (+2,88% yoy)`)},
          asOf: "2026-08-01",
          confidence: "estimate",
        },`,
        )
        .join("\n");
      return `    {\n      regionCode: ${JSON.stringify(r.code)},\n      baseline: {\n${cats}\n      },\n    },`;
    })
    .join("\n")}\n  ],`;
  text =
    text.slice(0, costsStart) +
    newCosts +
    text.slice(costsEnd + "\n  ],".length);

  fs.writeFileSync(file, text);
}

fs.writeFileSync("data-prep/wages-2026.json", JSON.stringify(dump, null, 1));

console.log(
  JSON.stringify(
    {
      totalRows,
      umkRows,
      umpFallbackRows: totalRows - umkRows,
      inflation: INFLATION,
    },
    null,
    1,
  ),
);
