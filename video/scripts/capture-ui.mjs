// Screenshot UI asli Nafkah (hasil `next build`) dalam ukuran ponsel @3x,
// untuk adegan mockup di video, plus hero desktop untuk README
// (`docs/hero.png`). State diatur lewat tautan berbagi (?naf=2) supaya tiap
// tangkapan bisa diulang persis.
//
//   node scripts/capture-ui.mjs [folder-out] [chrome-exe]                 teaser
//   node scripts/capture-ui.mjs [folder-out] [chrome-exe] --set=update    update v0.4.0
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright-core";
import { serveStatic } from "./serve-static.mjs";

const args = process.argv.slice(2);
const SET = args.find((a) => a.startsWith("--set="))?.slice("--set=".length) ?? "teaser";
const [outArg, chromeArg] = args.filter((a) => !a.startsWith("--"));
const OUT_DIR = resolve(outArg ?? "../out");
const CHROME =
  chromeArg ??
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

/**
 * A fresh phone-sized page (or desktop 1440×900 @1x) on `path`, map settled,
 * panel optionally expanded.
 */
async function openPage(
  browser,
  path,
  { dark = false, expand = false, phoneShare = false, desktop = false, name = path } = {},
) {
  const context = await browser.newContext({
    viewport: desktop ? { width: 1440, height: 900 } : { width: 390, height: 844 },
    deviceScaleFactor: desktop ? 1 : 3,
    isMobile: !desktop,
    hasTouch: !desktop,
    locale: "id-ID",
    colorScheme: dark ? "dark" : "light",
  });
  await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: BASE });
  await context.addInitScript(
    ([isDark, share]) => {
      const key = "nafkah.v1";
      const prev = JSON.parse(localStorage.getItem(key) ?? "{}");
      localStorage.setItem(
        key,
        JSON.stringify({
          ...prev,
          darkMode: isDark,
          basemap: isDark ? "dark" : "light",
          onboardCardDismissed: true,
        }),
      );
      // A phone's share sheet takes files (Android Chrome, iOS Safari); the
      // headless shell does not, so the dialog would hide "Bagikan gambar".
      if (share) {
        navigator.canShare = () => true;
        navigator.share = async () => {};
      }
    },
    [dark, phoneShare],
  );
  const page = await context.newPage();
  page.on("pageerror", (e) => console.warn(`[${name}] pageerror`, e.message));
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  // Peta MapLibre + tile basemap butuh waktu setelah networkidle pertama.
  await page.waitForTimeout(3500);
  if (expand) {
    const grow = page.getByRole("button", { name: "Perbesar panel" });
    if (await grow.count()) {
      await grow.first().click();
      await page.waitForTimeout(900);
    }
  }
  return { context, page };
}

async function captureTeaser(browser) {
  for (const shot of SHOTS_TO_TAKE) {
    const { context, page } = await openPage(browser, shot.path, {
      dark: shot.dark,
      expand: shot.expand,
      desktop: shot.desktop,
      name: shot.name,
    });
    if (shot.prepare) await shot.prepare(page);
    const file = shot.file ?? join(SHOTS, `${shot.name}.png`);
    await page.screenshot({ path: file });
    console.log("saved", file);
    await context.close();
  }
}

/* ---------- Update v0.4.0: crops of the new controls ---------- */

const V040 = join(SHOTS, "v040");
/** Crop sizes and tap targets, in CSS px from each crop's top-left. */
const manifest = {};

/**
 * Scroll the story panel so `locator` sits low-centre, clear of the sticky
 * bar; a section taller than half the panel goes just under the bar instead.
 */
async function centerInPanel(page, locator) {
  await locator.evaluate((el) => {
    const panel = el.closest(".thin-scroll.overflow-y-auto");
    if (!panel) return el.scrollIntoView({ block: "center" });
    const p = panel.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    panel.scrollTop +=
      r.height > p.height * 0.5 ? r.top - (p.top + 72) : r.top + r.height / 2 - (p.top + p.height * 0.62);
  });
  await page.waitForTimeout(350);
}

const round = (v) => Math.round(v * 10) / 10;
const centerOf = (box, origin) => ({
  x: round(box.x + box.width / 2 - origin.x),
  y: round(box.y + box.height / 2 - origin.y),
});

/**
 * Screenshot the union of `locators` with a little air around it, and note
 * where each named target lands inside the crop.
 */
async function crop(page, name, locators, targets = {}, pad = 10) {
  const boxes = [];
  for (const l of [locators].flat()) boxes.push(await l.boundingBox());
  const x0 = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
  const y0 = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
  const x1 = Math.min(390, Math.max(...boxes.map((b) => b.x + b.width)) + pad);
  const y1 = Math.min(844, Math.max(...boxes.map((b) => b.y + b.height)) + pad);
  const clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  await page.screenshot({ path: join(V040, `${name}.png`), clip });
  const points = {};
  for (const [key, l] of Object.entries(targets)) points[key] = centerOf(await l.boundingBox(), clip);
  manifest[name] = { file: `shots/v040/${name}.png`, w: round(clip.width), h: round(clip.height), targets: points };
  console.log("saved", name, `${Math.round(clip.width)}x${Math.round(clip.height)}`);
}

const group = (page, label) =>
  page.locator(`[role="radiogroup"][aria-labelledby="seg-${label.toLowerCase()}"]`);
/** Seg root: label, options, and the selected option's hint. */
const segRoot = (page, label) => group(page, label).locator("xpath=..");
const radio = (page, label, option) => group(page, label).getByRole("radio", { name: option });

async function openProfile(page) {
  await page.getByRole("button", { name: "Ubah profil" }).first().click();
  await page.waitForTimeout(900);
  const grow = page.getByRole("button", { name: "Perbesar panel" });
  if (await grow.count()) {
    await grow.first().click();
    await page.waitForTimeout(900);
  }
}

/** Type `digits` one key at a time, cropping `area` after every key. */
async function typeFrames(page, name, input, area, digits, targets = {}) {
  for (let i = 0; i < digits.length; i++) {
    await input.press(digits[i]);
    await page.waitForTimeout(160);
    await crop(page, `${name}-${i + 1}`, area, targets);
  }
}

const JOGJA = "34.71";
/** The placeholders the app itself suggests ("cth. 1.000.000", "cth. 4.000.000"). */
const SUPPORT = "1000000";
const PARTNER = "4000000";

async function captureUpdate(browser) {
  await mkdir(V040, { recursive: true });

  // 1. Profil: hunian Rusun/kost -> Rumah sendiri, tanggungan keluarga, transportasi.
  {
    const { context, page } = await openPage(browser, `/?${DEFAULT_QS}`, { name: "profile" });
    await openProfile(page);
    const hunian = segRoot(page, "Hunian");
    const owner = radio(page, "Hunian", "Rumah sendiri");
    await centerInPanel(page, hunian);
    await crop(page, "hunian-room", hunian, { owner });
    await owner.click();
    await page.waitForTimeout(700);
    await crop(page, "hunian-owner", hunian, { owner });

    const input = page.locator("#profile-family-support");
    const field = input.locator("xpath=../..");
    await centerInPanel(page, field);
    await crop(page, "support-0", field, { input });
    await input.click();
    await page.waitForTimeout(250);
    await typeFrames(page, "support", input, field, SUPPORT, { input });
    await input.blur();
    await page.waitForTimeout(700);

    const transport = segRoot(page, "Transportasi");
    const targets = {
      car: radio(page, "Transportasi", "Mobil"),
      walk: radio(page, "Transportasi", "Jalan kaki"),
    };
    await centerInPanel(page, transport);
    await crop(page, "transport-motor", transport, targets);
    await targets.car.click();
    await page.waitForTimeout(600);
    await crop(page, "transport-car", transport, targets);
    await targets.walk.click();
    await page.waitForTimeout(600);
    await crop(page, "transport-walk", transport, targets);
    await context.close();
  }

  // 2. Gaji pasangan: rumah tangga Pasangan, lalu "Pasangan juga bekerja".
  {
    const qs = DEFAULT_QS.replace("hh=single", "hh=couple");
    const { context, page } = await openPage(browser, `/?${qs}`, { name: "partner" });
    await openProfile(page);
    const row = page.locator("label", { hasText: "Pasangan juga bekerja" });
    const toggle = row.getByRole("switch");
    await centerInPanel(page, row);
    await crop(page, "partner-off", row, { toggle });
    await toggle.click();
    await page.waitForTimeout(700);
    const input = page.getByLabel(/^Gaji pasangan/);
    const field = input.locator("xpath=../..");
    await crop(page, "partner-on", [row, field], { toggle, input });
    await input.click();
    await page.waitForTimeout(250);
    await typeFrames(page, "partner", input, [row, field], PARTNER, { toggle, input });
    await input.blur();
    await page.waitForTimeout(500);
    await crop(page, "partner-done", [row, field], { toggle, input });
    await context.close();
  }

  // 3. Struk Kota Yogyakarta (rumah sendiri + tanggungan), lalu Bagikan struk.
  {
    const qs = `${DEFAULT_QS.replace("home=room", "home=owner")}&support=${SUPPORT}&f=${JOGJA}`;
    const { context, page } = await openPage(browser, `/?${qs}`, { expand: true, phoneShare: true, name: "share" });
    const section = page.locator('section[aria-label="Rincian bulanan"]');
    const shareBtn = section.getByRole("button", { name: "Bagikan struk" });
    await centerInPanel(page, section);
    // Park the pointer off the receipt: hovering a line highlights it.
    await page.mouse.move(1, 1);
    await page.waitForTimeout(200);
    await crop(page, "receipt", section, { share: shareBtn });
    await shareBtn.click();

    const dialog = page.getByRole("dialog", { name: "Bagikan struk" });
    const preview = dialog.locator("img");
    const toggleRow = dialog.locator("label", { hasText: "Tampilkan nominal rupiah" });
    const toggle = toggleRow.getByRole("switch");
    const hint = toggleRow.locator("xpath=following-sibling::p[1]");
    const footer = dialog.locator("footer");
    const copyBtn = footer.getByRole("button", { name: /Salin teks/ });
    // The PNG exactly as the app makes it, from the preview's blob URL.
    const savePng = async (name) => {
      const b64 = await preview.evaluate(async (img) => {
        const bytes = new Uint8Array(await (await fetch(img.src)).arrayBuffer());
        let bin = "";
        for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
        return btoa(bin);
      });
      await writeFile(join(V040, `${name}.png`), Buffer.from(b64, "base64"));
      manifest[name] = { file: `shots/v040/${name}.png`, w: 1080, h: 1350, targets: {} };
      console.log("saved", name, "(app PNG)");
    };
    const waitPreview = async (before) => {
      await page.waitForFunction(
        (prev) => {
          const img = document.querySelector('[role="dialog"] img');
          return img && img.complete && img.naturalWidth > 0 && img.src !== prev;
        },
        before,
      );
      await page.waitForTimeout(300);
    };
    await waitPreview("");
    // The dialog is cropped on its own: it renders inside the region article,
    // whose finished rise animation still holds an identity transform, so on
    // a phone it opens below the fold instead of as a bottom sheet.
    await dialog.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await crop(page, "toggle-on", [toggleRow, hint], { toggle });
    await crop(page, "footer", footer, { copy: copyBtn }, 0);
    await savePng("struk-on");
    const before = await preview.getAttribute("src");
    await toggle.click();
    await waitPreview(before);
    await crop(page, "toggle-off", [toggleRow, hint], { toggle });
    await savePng("struk-off");
    await copyBtn.click();
    await page.waitForTimeout(400);
    await crop(page, "footer-copied", footer, { copy: copyBtn }, 0);
    const copied = await page.evaluate(() => navigator.clipboard.readText().catch(() => ""));
    await writeFile(join(V040, "struk.txt"), copied);
    console.log(copied);
    await context.close();
  }

  // 4. Halaman Tentang: "Angkanya dari mana?" dan "Cara dibuat".
  {
    const { context, page } = await openPage(browser, "/tentang", { name: "tentang" });
    const source = page.locator("#tanya dt", { hasText: "Angkanya dari mana?" }).locator("xpath=..");
    const made = page.locator("#cara-dibuat");
    await source.scrollIntoViewIfNeeded();
    await crop(page, "about-source", source);
    await made.scrollIntoViewIfNeeded();
    await crop(page, "about-made", [page.locator("#cara-dibuat-h"), made.locator(":scope > div")]);
    await context.close();
  }

  await writeFile("src/data/shots-v040.json", JSON.stringify(manifest, null, 1) + "\n");
  console.log("manifest:", Object.keys(manifest).length, "shots");
}

await mkdir(SHOTS, { recursive: true });
const server = await serveStatic(OUT_DIR, PORT);
const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});

try {
  if (SET === "update") await captureUpdate(browser);
  else await captureTeaser(browser);
} finally {
  await browser.close();
  server.close();
}
