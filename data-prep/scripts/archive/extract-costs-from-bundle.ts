/**
 * Mengekstrak baseline costs 2025 ASLI dari bundle build out/ (chunk JS yang
 * masih memuat data sebelum perubahan 2026) untuk pemulihan deterministik.
 * Jalankan dari root repo: npx tsx data-prep/scripts/extract-costs-from-bundle.ts
 */
import * as fs from "fs";

const CHUNK = "out/_next/static/chunks/527.21bdb2eff39126b3.js";
const text = fs.readFileSync(CHUNK, "utf8");

function balancedFrom(text: string, start: number): string {
  let depth = 0;
  let inStr = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (ch === "\\") i++;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  throw new Error("balanced braces not found");
}

function num(token: string): number {
  if (/e\d/i.test(token)) return Number(token);
  return Number(token.replace(/_/g, ""));
}

const CATEGORY_KEYS = [
  "housing",
  "food",
  "transport",
  "utilities",
  "connectivity",
  "healthcare",
  "personalCare",
  "leisure",
  "education",
  "contingency",
] as const;

const out: Record<
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
> = {};

let idx = 0;
let count = 0;
while (true) {
  const m = /regionCode:"(\d{2}\.\d{2})",baseline:\{/.exec(text.slice(idx));
  if (!m) break;
  const start = idx + m.index + m[0].length - 1; // posisi '{' baseline
  const obj = balancedFrom(text, start);
  const inner = obj.slice(1, -1); // tanpa kurung luar
  const rec: Record<
    string,
    {
      amount: number;
      source: string;
      asOf: string;
      confidence: string;
    }
  > = {};
  let pos = 0;
  while (true) {
    const k = new RegExp(`(${CATEGORY_KEYS.join("|")}):\\{`).exec(
      inner.slice(pos),
    );
    if (!k) break;
    const keyStart = pos + k.index;
    const val = balancedFrom(inner, keyStart + k[0].length - 1);
    const body = val.slice(1, -1);
    const amt = /amount:([\d.e_]+)/.exec(body);
    const src = /source:"((?:[^"\\]|\\.)*)"/.exec(body);
    const asOf = /asOf:"([^"]*)"/.exec(body);
    const conf = /confidence:"([^"]*)"/.exec(body);
    if (!amt || !src || !asOf || !conf) {
      throw new Error(`Field tidak lengkap di ${m[1]} ${k[1]}`);
    }
    rec[k[1]] = {
      amount: num(amt[1]),
      source: src[1].replace(/\\"/g, '"'),
      asOf: asOf[1],
      confidence: conf[1],
    };
    pos = keyStart + k[0].length + val.length;
  }
  if (Object.keys(rec).length !== CATEGORY_KEYS.length) {
    throw new Error(
      `Kategori tidak lengkap (${Object.keys(rec).length}) di ${m[1]}`,
    );
  }
  out[m[1]] = rec;
  count++;
  idx = idx + m.index + m[0].length;
}

fs.writeFileSync(
  "data-prep/data/costs-2025-original.json",
  JSON.stringify(out, null, 1),
);
console.log(JSON.stringify({ regionsExtracted: count }));
