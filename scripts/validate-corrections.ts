import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateCorrectionProposal } from "@/data/correction-proposals";

async function main(): Promise<void> {
  const proposalPath = process.argv[2];
  if (!proposalPath || process.argv.length > 3) {
    console.error("Usage: npm run corrections:validate -- <proposal.json>");
    process.exitCode = 2;
    return;
  }

  try {
    const [proposalText, regionsText, wagesText, costsText, narrativesText] = await Promise.all([
      readFile(resolve(proposalPath), "utf8"),
      readFile("public/data/v2026.1/regions.json", "utf8"),
      readFile("public/data/v2026.1/wages.json", "utf8"),
      readFile("public/data/v2026.1/costs.json", "utf8"),
      readFile("public/data/v2026.1/narratives.json", "utf8"),
    ]);
    const errors = validateCorrectionProposal(JSON.parse(proposalText), {
      regions: JSON.parse(regionsText),
      wages: JSON.parse(wagesText),
      costs: JSON.parse(costsText),
      narratives: JSON.parse(narrativesText),
    });
    if (errors.length) {
      console.error(`Correction proposal invalid: ${errors.length} issue(s).`);
      for (const error of errors.slice(0, 20)) console.error(`- ${error}`);
      if (errors.length > 20) console.error(`- ${errors.length - 20} additional issue(s) omitted`);
      process.exitCode = 1;
      return;
    }
    const { changes } = JSON.parse(proposalText) as { changes: unknown[] };
    console.log(`Correction proposal valid: ${changes.length} change(s); dataset integrity passed. Shipped dataset unchanged.`);
  } catch {
    console.error("Could not read or parse proposal/dataset JSON.");
    process.exitCode = 1;
  }
}

void main();
