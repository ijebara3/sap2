import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(process.env.AUDIT_ARTIFACTS || "testing/artifacts");
const screenshots = path.join(root, "screenshots");
const output = path.join(root, "visual-review");
await fs.mkdir(output, { recursive: true });
const entries = (await fs.readdir(screenshots)).sort();
const groups = [
  ["phones-portrait", (name) => /iphone|galaxy-s24|pixel/.test(name) && name.endsWith("portrait")],
  ["phones-landscape", (name) => /iphone|galaxy-s24|pixel/.test(name) && name.endsWith("landscape")],
  ["tablets-portrait", (name) => /ipad|galaxy-tab/.test(name) && name.endsWith("portrait")],
  ["tablets-landscape", (name) => /ipad|galaxy-tab/.test(name) && name.endsWith("landscape")],
  ["desktop", (name) => name.includes("desktop")],
];
const css = `<style>body{font:14px system-ui;margin:20px;background:#eee;color:#111}h1{font-size:24px}.grid{display:grid;gap:12px;grid-template-columns:repeat(var(--columns),minmax(0,1fr))}article{padding:10px;background:white;border:1px solid #bbb}h2{font-size:13px;overflow-wrap:anywhere}img{width:100%;height:250px;object-fit:contain;background:#ddd;display:block;margin:6px 0}img.gallery{height:220px}img.footer{height:170px}a{color:#174b94}.full{height:400px;overflow:auto}.full img{height:auto}</style>`;
const cards = (names) => names.map((name) => `<article><h2>${name}</h2><a href="../screenshots/${name}/homepage-nl-full.png">Full homepage</a> · <a href="../screenshots/${name}/route-privacy-full.png">Privacy</a> · <a href="../screenshots/${name}/route-voorwaarden-full.png">Terms</a> · <a href="../screenshots/${name}/route-audit-missing-page-full.png">404</a><img src="../screenshots/${name}/hero.png"><img class="gallery" src="../screenshots/${name}/gallery.png"><img class="footer" src="../screenshots/${name}/footer.png"></article>`).join("");
const browser = await chromium.launch();
const manifest = [];
try {
  for (const engine of ["chromium", "firefox", "webkit"]) {
    for (const [group, matches] of groups) {
      const names = entries.filter((name) => name.startsWith(`${engine}-`) && matches(name));
      if (!names.length) continue;
      const columns = names.length === 5 ? 5 : 3;
      const file = path.join(output, `${engine}-${group}.html`);
      await fs.writeFile(file, `<!doctype html><meta charset="utf-8"><title>${engine} ${group}</title>${css}<h1>${engine} — ${group}</h1><div class="grid" style="--columns:${columns}">${cards(names)}</div>`);
      const page = await browser.newPage({ viewport: { width: columns === 5 ? 1600 : 1440, height: 900 } });
      await page.goto(pathToFileURL(file).href);
      await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
      const image = file.replace(/\.html$/, ".png");
      await page.screenshot({ path: image, fullPage: true });
      await page.close();
      manifest.push({ engine, group, profiles: names, html: path.basename(file), image: path.basename(image) });
    }
  }
  // Fold selected complete pages into readable columns without changing the
  // original screenshots. This makes the sections between hero/gallery/footer
  // practical to inspect, including long phone pages.
  for (const name of entries.filter((entry) => /(iphone-se-portrait|iphone-se-landscape|ipad-mini-portrait|ipad-pro-11-landscape|desktop-1440)$/.test(entry))) {
    const source = pathToFileURL(path.join(screenshots, name, "homepage-nl-full.png")).href;
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(output, "chromium-desktop.html")).href);
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#ddd;font:16px system-ui}h1{font-size:18px;margin:12px}.strips{display:flex;gap:8px}.strip{overflow:hidden;position:relative}img{display:block;position:absolute;top:0;left:0}</style><h1>${name} — complete homepage, read columns left to right</h1>`);
    const dimensions = await page.evaluate(async (url) => {
      const image = new Image(); image.src = url; await image.decode();
      const width = Math.min(image.naturalWidth, 480);
      const columns = image.naturalWidth <= 430 ? 6 : 3;
      const height = Math.ceil(image.naturalHeight * width / image.naturalWidth / columns);
      const strips = document.createElement("div"); strips.className = "strips";
      for (let i = 0; i < columns; i++) {
        const strip = document.createElement("div"); strip.className = "strip"; strip.style.cssText = `width:${width}px;height:${height}px`;
        const copy = image.cloneNode(); copy.style.cssText = `width:${width}px;transform:translateY(-${i * height}px)`;
        strip.append(copy); strips.append(strip);
      }
      document.body.append(strips);
      return { width: columns * (width + 8), height: height + 70 };
    }, source);
    await page.setViewportSize(dimensions);
    await page.waitForFunction(() => [...document.images].every((image) => image.complete));
    await page.screenshot({ path: path.join(output, `${name}-complete.png`), fullPage: true });
    await page.close();
  }
} finally { await browser.close(); }
await fs.writeFile(path.join(output, "manifest.json"), JSON.stringify(manifest, null, 2));
await fs.writeFile(path.join(root, "screenshots.html"), `<!doctype html><meta charset="utf-8"><title>Responsive screenshot index</title>${css}<h1>Amsterdam Studio Podcast — screenshots</h1><p>Every configuration has full-page homepage, legal, and 404 captures. Review sheets show hero, gallery and footer details; follow the full-page links for the complete layout.</p><div class="grid" style="--columns:3">${cards(entries).replaceAll('../screenshots/', './screenshots/')}</div>`);
console.log(`Created ${manifest.length} visual review sheets for ${entries.length} device/browser configurations.`);
