/**
 * Minimal ElevenLabs client for the build scripts. The key is read from
 * video/.env (ELEVENLABS_API_KEY=…), which .gitignore already excludes.
 */
import { existsSync, readFileSync } from "node:fs";

const BASE = "https://api.elevenlabs.io";

export function apiKey(): string {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  if (existsSync(".env")) {
    for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
      const m = /^\s*(?:export\s+)?(ELEVENLABS_API_KEY|XI_API_KEY)\s*=\s*"?([^"\s]+)"?/.exec(line);
      if (m) return m[2];
    }
  }
  throw new Error("ELEVENLABS_API_KEY tidak ditemukan. Simpan di video/.env: ELEVENLABS_API_KEY=sk_…");
}

export async function el(path: string, init: RequestInit & { json?: unknown } = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("xi-api-key", apiKey());
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(init.json);
  }
  const res = await fetch(`${BASE}${path}`, { ...init, headers, body });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ElevenLabs ${init.method ?? "GET"} ${path} -> ${res.status}: ${text.slice(0, 500)}`);
  }
  return res;
}

export async function elJson<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  return (await el(path, init)).json() as Promise<T>;
}

export async function usage(): Promise<{ used: number; limit: number; tier: string }> {
  const s = await elJson<{ character_count: number; character_limit: number; tier: string }>(
    "/v1/user/subscription",
  );
  return { used: s.character_count, limit: s.character_limit, tier: s.tier };
}
