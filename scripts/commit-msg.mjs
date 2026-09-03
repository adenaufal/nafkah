import { readFileSync } from "node:fs";

const messagePath = process.argv[2];
const allowedTypes = new Set([
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
]);

function fail(message) {
  console.error(`[commit-msg] ${message}`);
  console.error("[commit-msg] Contoh: fix(data): koreksi nilai UMK Jakarta");
  console.error("[commit-msg] Contoh: feat(ui): tambah perbandingan wilayah");
  console.error("[commit-msg] Breaking change: feat(data)!: ubah skema data");
  process.exit(1);
}

if (!messagePath) {
  fail("Path commit message tidak diberikan.");
}

const content = readFileSync(messagePath, "utf8");
const subject = content
  .split(/\r?\n/)
  .find((line) => line.trim() && !line.trim().startsWith("#"))
  ?.trim();

if (!subject) {
  fail("Commit message tidak boleh kosong.");
}

// Pesan bawaan Git untuk merge/revert dan commit sementara rebase tidak
// mengubah kategori versioning, jadi tidak dipaksa mengikuti format ini.
if (
  /^(Merge\s|Revert\s")/.test(subject) ||
  /^(fixup|squash)!\s/.test(subject)
) {
  process.exit(0);
}

const conventional = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s+(?<description>\S.*)$/i.exec(
  subject,
);

if (!conventional) {
  fail("Format harus Conventional Commits: type(scope): deskripsi.");
}

const { type: rawType, breaking: breakingMark } = conventional.groups;
const type = rawType.toLowerCase();
if (!allowedTypes.has(type)) {
  fail(`Tipe commit '${rawType}' belum didukung oleh aturan versioning.`);
}

const breaking = Boolean(breakingMark) ||
  /(?:^|\n)BREAKING[- ]CHANGE(?:S)?\s*:/i.test(content);
const impact = breaking
  ? "MAJOR"
  : type === "feat"
    ? "MINOR"
    : ["fix", "perf", "revert"].includes(type)
      ? "PATCH"
      : "tidak menaikkan versi otomatis";

console.log(`[commit-msg] Valid. Dampak versi: ${impact}.`);
