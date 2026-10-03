import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { summarizeCommunitySamples } from "@/data/community-samples";

async function main(): Promise<void> {
  const inputPath = process.argv[2];
  if (!inputPath || process.argv.length !== 3) {
    console.error("Usage: npm run community:summary -- <private-input.json>");
    process.exitCode = 2;
    return;
  }
  try {
    const [inputText, regionsText] = await Promise.all([
      readFile(resolve(inputPath), "utf8"), readFile("public/data/v2026.1/regions.json", "utf8"),
    ]);
    const regions: unknown = JSON.parse(regionsText);
    if (!Array.isArray(regions) || !regions.every((region: unknown) => region !== null && typeof region === "object" && "code" in region && typeof region.code === "string")) {
      throw new Error("Invalid region dataset");
    }
    const result = summarizeCommunitySamples(JSON.parse(inputText), regions as { code: string }[]);
    if (result.errors.length) {
      for (const error of result.errors) console.error(error);
      process.exitCode = 1;
      return;
    }
    console.log(JSON.stringify(result.summaries, null, 2));
  } catch {
    console.error("Could not read or parse community input/region dataset JSON.");
    process.exitCode = 1;
  }
}

void main();
