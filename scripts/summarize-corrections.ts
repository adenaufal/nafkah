import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { inspectCorrectionLedger } from "@/data/correction-ledger";

async function main(): Promise<void> {
  const ledgerPath = process.argv[2];
  if (!ledgerPath || process.argv.length !== 3) {
    console.error("Usage: npm run corrections:summary -- <private-ledger.json>");
    process.exitCode = 2;
    return;
  }
  try {
    const [ledgerText, regionsText] = await Promise.all([
      readFile(resolve(ledgerPath), "utf8"),
      readFile("public/data/v2026.1/regions.json", "utf8"),
    ]);
    const result = inspectCorrectionLedger(JSON.parse(ledgerText), JSON.parse(regionsText));
    if (result.errors.length) {
      console.error(`Correction ledger invalid: ${result.errors.length} issue(s).`);
      for (const error of result.errors.slice(0, 20)) console.error(`- ${error}`);
      if (result.errors.length > 20) console.error(`- ${result.errors.length - 20} additional issue(s) omitted`);
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify(result.summary, null, 2));
  } catch {
    console.error("Could not read or parse ledger/region JSON.");
    process.exitCode = 1;
  }
}

void main();
