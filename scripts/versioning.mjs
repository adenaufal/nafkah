import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACKAGE_PATH = path.join(ROOT, "package.json");
const CHANGELOG_PATH = path.join(ROOT, "CHANGELOG.md");

const LEVEL_RANK = { none: 0, patch: 1, minor: 2, major: 3 };
const LEVEL_LABEL = {
  none: "tidak ada bump otomatis",
  patch: "PATCH",
  minor: "MINOR",
  major: "MAJOR",
};

const SEMVER_PATTERN = /^v?(\d+)\.(\d+)\.(\d+)(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function runGit(args, { allowFailure = false } = {}) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
    }).trimEnd();
  } catch (error) {
    if (allowFailure) return "";
    const detail = error?.stderr?.toString().trim();
    throw new Error(detail || `Perintah git gagal: git ${args.join(" ")}`);
  }
}

function runNpm(script) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  execFileSync(npmCommand, ["run", script], {
    cwd: ROOT,
    stdio: "inherit",
  });
}

function readPackage() {
  return JSON.parse(readFileSync(PACKAGE_PATH, "utf8"));
}

function parseVersion(value) {
  const match = SEMVER_PATTERN.exec(value);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

function getLatestVersionTag() {
  const tags = runGit(
    ["tag", "--list", "v[0-9]*", "--sort=-version:refname"],
    { allowFailure: true },
  )
    .split(/\r?\n/)
    .map((tag) => tag.trim())
    .filter((tag) => tag && parseVersion(tag));

  return tags[0] || null;
}

function parseCommit(record) {
  const [hash, subject, body = ""] = record.split("\x1f");
  if (!hash || !subject) return null;

  const conventional = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?:\s+(?<description>.+)$/i.exec(
    subject,
  );
  const type = conventional?.groups?.type?.toLowerCase() || "other";
  const breaking = Boolean(conventional?.groups?.breaking) ||
    /(?:^|\n)BREAKING[- ]CHANGE(?:S)?\s*:/i.test(body);

  let bump = "none";
  if (breaking) {
    bump = "major";
  } else if (type === "feat") {
    bump = "minor";
  } else if (["fix", "perf", "revert"].includes(type)) {
    bump = "patch";
  }

  return {
    hash,
    subject,
    body,
    type,
    breaking,
    bump,
  };
}

function isVersionCommit(subject) {
  return /^chore(?:\([^)]*\))?!?:\s+(?:release|version)\b/i.test(subject);
}

function collectCommits() {
  const baseline = getLatestVersionTag();
  const args = [
    "log",
    "--no-merges",
    "--format=%H%x1f%s%x1f%b%x1e",
  ];
  if (baseline) args.push(`${baseline}..HEAD`);

  const raw = runGit(args, { allowFailure: true });
  const commits = raw
    .split("\x1e")
    .map((record) => record.trim())
    .filter(Boolean)
    .map(parseCommit)
    .filter((commit) => commit && !isVersionCommit(commit.subject));

  const recommended = commits.reduce(
    (highest, commit) =>
      LEVEL_RANK[commit.bump] > LEVEL_RANK[highest] ? commit.bump : highest,
    "none",
  );

  return { baseline, commits, recommended };
}

function nextVersion(current, bump) {
  const version = parseVersion(current);
  if (!version || bump === "none") return current;
  if (bump === "major") return `${version.major + 1}.0.0`;
  if (bump === "minor") return `${version.major}.${version.minor + 1}.0`;
  return `${version.major}.${version.minor}.${version.patch + 1}`;
}

function getRequestedBump() {
  const raw = process.env.npm_config_argv;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    const argumentsToInspect = [
      ...(parsed.original || []),
      ...(parsed.cooked || []),
    ];
    return argumentsToInspect.find((argument) =>
      ["patch", "minor", "major"].includes(argument.toLowerCase()),
    ) || null;
  } catch {
    return null;
  }
}

function formatBaseline(baseline) {
  return baseline || "belum ada tag versi (seluruh riwayat Git dihitung)";
}

function sectionName(commit) {
  if (commit.breaking) return "Breaking Changes";
  if (commit.type === "feat") return "Fitur";
  if (commit.type === "fix") return "Perbaikan";
  if (commit.type === "perf") return "Performa";
  if (commit.type === "docs") return "Dokumentasi";
  if (["refactor", "revert"].includes(commit.type)) return "Perubahan";
  if (commit.type === "other") return "Lainnya";
  return "Pemeliharaan";
}

function groupCommits(commits) {
  const groups = new Map();
  for (const commit of commits) {
    const heading = sectionName(commit);
    if (!groups.has(heading)) groups.set(heading, []);
    groups.get(heading).push(
      `- ${commit.subject} (${commit.hash.slice(0, 7)})`,
    );
  }
  return groups;
}

function currentDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderEntry(version, commits) {
  const groups = groupCommits(commits);
  const lines = [`## [${version}] - ${currentDate()}`, ""];

  for (const [heading, entries] of groups) {
    lines.push(`### ${heading}`, "", ...entries, "");
  }

  return lines.join("\n").trimEnd();
}

function insertEntry(changelog, entry) {
  const lines = changelog.split(/\r?\n/);
  const unreleasedIndex = lines.findIndex((line) =>
    /^## \[Unreleased\]\s*$/i.test(line.trim()),
  );
  const firstReleaseIndex = lines.findIndex((line, index) =>
    index > unreleasedIndex && /^## \[[^]]+\]/.test(line.trim()),
  );
  const insertionIndex = firstReleaseIndex >= 0
    ? firstReleaseIndex
    : unreleasedIndex >= 0
      ? lines.length
      : Math.max(lines.findIndex((line) => /^## /.test(line.trim())), 0);

  const before = lines.slice(0, insertionIndex);
  const after = lines.slice(insertionIndex);
  return [...before, "", ...entry.split("\n"), "", ...after]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd() + "\n";
}

function updateChangelog(version, commits) {
  const initial = [
    "# Changelog",
    "",
    "Semua perubahan penting pada project ini dicatat di sini.",
    "Nomor versi mengikuti Semantic Versioning: MAJOR.MINOR.PATCH.",
    "",
    "## [Unreleased]",
    "",
  ].join("\n");
  const changelog = existsSync(CHANGELOG_PATH)
    ? readFileSync(CHANGELOG_PATH, "utf8")
    : initial;
  const headingPattern = new RegExp(
    `^## \\[${version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]`,
    "m",
  );

  if (headingPattern.test(changelog)) {
    throw new Error(`CHANGELOG.md sudah memiliki entry untuk versi ${version}.`);
  }

  writeFileSync(
    CHANGELOG_PATH,
    insertEntry(changelog, renderEntry(version, commits)),
    "utf8",
  );
}

function printPreview() {
  const packageInfo = readPackage();
  const { baseline, commits, recommended } = collectCommits();

  console.log(`[versioning] Versi saat ini: v${packageInfo.version}`);
  console.log(`[versioning] Baseline: ${formatBaseline(baseline)}`);
  console.log(`[versioning] Perubahan belum diberi versi: ${commits.length} commit`);

  if (!baseline) {
    console.log(
      "[versioning] Catatan: setelah setup ini di-commit, tandai commit tersebut sebagai baseline dengan `npm run version:baseline`.",
    );
  }

  if (recommended === "none") {
    console.log(
      "[versioning] Tidak ada PATCH/MINOR/MAJOR otomatis dari commit yang terdeteksi.",
    );
  } else {
    console.log(
      `[versioning] Bump yang disarankan: ${LEVEL_LABEL[recommended]} → v${nextVersion(packageInfo.version, recommended)}`,
    );
  }

  for (const [heading, entries] of groupCommits(commits)) {
    console.log(`\n${heading}`);
    console.log(entries.join("\n"));
  }
}

function runPreversion() {
  const packageInfo = readPackage();
  const { baseline, commits, recommended } = collectCommits();
  const requested = getRequestedBump();

  if (commits.length === 0) {
    throw new Error(
      `Tidak ada perubahan sejak ${formatBaseline(baseline)}. Buat perubahan dulu sebelum menaikkan versi.`,
    );
  }

  if (
    requested &&
    recommended !== "none" &&
    LEVEL_RANK[requested] < LEVEL_RANK[recommended]
  ) {
    throw new Error(
      `Bump ${requested.toUpperCase()} terlalu kecil. Perubahan tertinggi memerlukan ${recommended.toUpperCase()} (v${nextVersion(packageInfo.version, recommended)}).`,
    );
  }

  console.log(`[versioning] Pre-version check: ${commits.length} commit pending.`);
  console.log(
    `[versioning] Rekomendasi: ${LEVEL_LABEL[recommended]}${requested ? `; diminta: ${requested.toUpperCase()}` : ""}.`,
  );
  console.log("[versioning] Menjalankan typecheck, test, dan build...");
  runNpm("typecheck");
  runNpm("test");
  runNpm("build");
}

function runVersionHook() {
  const packageInfo = readPackage();
  const { commits } = collectCommits();
  if (commits.length === 0) {
    throw new Error("Tidak ada perubahan untuk dimasukkan ke changelog.");
  }

  updateChangelog(packageInfo.version, commits);
  console.log(
    `[versioning] CHANGELOG.md diperbarui untuk v${packageInfo.version} dengan ${commits.length} commit.`,
  );
}

function runPostversion() {
  const packageInfo = readPackage();
  const tag = `v${packageInfo.version}`;
  const tagExists = runGit(["tag", "--list", tag], { allowFailure: true }) === tag;

  console.log(`[versioning] Versioning selesai: v${packageInfo.version}.`);
  if (tagExists) {
    console.log(`[versioning] Git tag ${tag} sudah dibuat oleh npm.`);
  } else {
    console.log(
      `[versioning] Git tag ${tag} tidak dibuat (misalnya karena memakai --no-git-tag-version).`,
    );
  }
  console.log(
    "[versioning] Tidak ada GitHub Release atau executable yang dibuat; ini hanya pencatatan versi dan changelog.",
  );
}

function createBaseline() {
  const packageInfo = readPackage();
  const tag = `v${packageInfo.version}`;
  const existing = runGit(["tag", "--list", tag], { allowFailure: true });
  if (existing === tag) {
    throw new Error(`${tag} sudah ada.`);
  }

  const status = runGit(["status", "--porcelain"], { allowFailure: true });
  if (status) {
    throw new Error(
      "Working tree belum bersih. Commit setup versioning ini terlebih dahulu, lalu jalankan ulang `npm run version:baseline`.",
    );
  }

  runGit(["tag", "-a", tag, "-m", `chore: mark ${tag} baseline`]);
  console.log(`[versioning] Baseline ${tag} dibuat pada commit saat ini.`);
}

const command = process.argv[2] || "preview";

try {
  if (command === "preview") {
    printPreview();
  } else if (command === "preversion") {
    runPreversion();
  } else if (command === "version") {
    runVersionHook();
  } else if (command === "postversion") {
    runPostversion();
  } else if (command === "baseline") {
    createBaseline();
  } else {
    throw new Error(
      `Perintah tidak dikenal: ${command}. Gunakan preview, baseline, preversion, version, atau postversion.`,
    );
  }
} catch (error) {
  console.error(`[versioning] ${error.message}`);
  process.exitCode = 1;
}
