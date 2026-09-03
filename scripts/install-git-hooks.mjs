import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gitCommand = "git";

execFileSync(gitCommand, ["config", "core.hooksPath", ".githooks"], {
  cwd: ROOT,
  stdio: "inherit",
});

console.log("[hooks] Git hooks aktif dari .githooks.");
