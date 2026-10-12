// Screenshot UI asli Nafkah (hasil `next build`) dalam ukuran ponsel @3x,
// untuk adegan mockup di video, plus hero desktop untuk README
// (`docs/hero.png`). State diatur lewat tautan berbagi (?naf=2) supaya tiap
// tangkapan bisa diulang persis.
//
//   node scripts/capture-ui.mjs [folder-out] [chrome-exe]
import { mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveStatic } from "./serve-static.mjs";

const OUT_DIR = resolve(process.argv[2] ?? "../out");
const CHROME =
  process.argv[3] ??
  join(
    homedir(),
    "AppData/Local/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-win64/chrome-headless-shell.exe",
  );
const SHOTS = resolve("public/shots");
const PORT = 4318;
const BASE = `http://localhost:${PORT}`;

/** Profil awal aplikasi, ditulis eksplisit agar URL-nya stabil. */
const DEFAULT_QS =
  "naf=2&hh=single&kids=0&life=moderate&home=room&transport=motorcycle&savings=1&wage=gross&dual=0&color=coverage";

/**
 * Gulir panel cerita (satu-satunya area yang bisa digulir) ke sebuah elemen:
 * selector CSS, atau `text:<judul>` untuk h2 dengan teks itu.
 */
async function scrollPanelTo(page, selector, offset = 16) {
  await page.evaluate(
    ([sel, off]) => {
      const panel = document.querySelector(".thin-scroll.overflow-y-auto");
      const target = sel.startsWith("text:")
        ? [...document.querySelectorAll("h2")].find(
            (h) => h.textContent.trim() === sel.slice(5),
          )
        : document.querySelector(sel);
      if (!panel || !target) return;
      const top =
        target.getBoundingClientRect().top - panel.getBoundingClientRect().top;
      panel.scrollTop += top - off;
    },
    [selector, offset],
  );
  await page.waitForTimeout(400);
}

const SHOTS_TO_TAKE = [
  // Beranda: judul nasional + peta, panel bawah setengah terbuka.
  { name: "home", path: `/?${DEFAULT_QS}` },
  { name: "home-dark", path: `/?${DEFAULT_QS}`, dark: true },
  // Cerita daerah: Kota Yogyakarta dengan struk bulanan.
  { name: "jogja", path: `/?${DEFAULT_QS}&f=34.71`, expand: true },
  { name: "jogja-dark", path: `/?${DEFAULT_QS}&f=34.71`, expand: true, dark: true },
  {
    name: "jogja-receipt",
    path: `/?${DEFAULT_QS}&f=34.71`,
    expand: true,
    prepare: (page) => scrollPanelTo(page, "#receipt-title", 28),
  },
  // Gajiku Rp5 jt: peta dihitung ulang dengan satu gaji.
  { name: "gajiku", path: `/?${DEFAULT_QS.replace("naf=2", "naf=2&income=5000000")}` },
  {
    name: "gajiku-slider",
    path: `/?${DEFAULT_QS.replace("naf=2", "naf=2&income=5000000")}`,
    expand: true,
    prepare: (page) => scrollPanelTo(page, "text:Hitung dengan", 40),
  },
  // Editor profil: "Hitung untuk hidupmu."
  {
    name: "profile",
    path: `/?${DEFAULT_QS}`,
    prepare: async (page) => {
      await page.getByRole("button", { name: "Ubah profil" }).first().click();
      await page.waitForTimeout(900);
    },
  },
  // Perbandingan tiga daerah.
  { name: "compare", path: `/?${DEFAULT_QS}&r=31.71,36.74,32.75` },
  // Hero README: beranda desktop @1x.
  { name: "hero", path: `/?${DEFAULT_QS}`, desktop: true, file: resolve("../docs/hero.png") },
];

await mkdir(SHOTS, { recursive: true });
const server = await serveStatic(OUT_DIR, PORT);
const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

try {
  for (const shot of SHOTS_TO_TAKE) {
    const context = await browser.newContext({
      viewport: shot.desktop ? { width: 1440, height: 900 } : { width: 390, height: 844 },
      deviceScaleFactor: shot.desktop ? 1 : 3,
      isMobile: !shot.desktop,
      hasTouch: !shot.desktop,
      locale: "id-ID",
      colorScheme: shot.dark ? "dark" : "light",
    });
    await context.addInitScript(
      ([dark]) => {
        const key = "nafkah.v1";
        const prev = JSON.parse(localStorage.getItem(key) ?? "{}");
        localStorage.setItem(
          key,
          JSON.stringify({
            ...prev,
            darkMode: dark,
            basemap: dark ? "dark" : "light",
            onboardCardDismissed: true,
          }),
        );
      },
      [Boolean(shot.dark)],
    );
    const page = await context.newPage();
    page.on("pageerror", (e) => console.warn(`[${shot.name}] pageerror`, e.message));
    await page.goto(`${BASE}${shot.path}`, { waitUntil: "networkidle" });
    // Peta MapLibre + tile basemap butuh waktu setelah networkidle pertama.
    await page.waitForTimeout(3500);
    if (shot.expand) {
      const grow = page.getByRole("button", { name: "Perbesar panel" });
      if (await grow.count()) {
        await grow.first().click();
        await page.waitForTimeout(900);
      }
    }
    if (shot.prepare) await shot.prepare(page);
    const file = shot.file ?? join(SHOTS, `${shot.name}.png`);
    await page.screenshot({ path: file });
    console.log("saved", file);
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}
