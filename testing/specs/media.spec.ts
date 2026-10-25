import { test, expect } from "@playwright/test";
import { readFile, readdir } from "node:fs/promises";
import { center, imageLoaded, saveEvidence } from "./helpers";

test("all responsive variants decode and delayed or failed media retain a visible photo", async ({ page, browserName }, info) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator("main > section img").first();
  await imageLoaded(hero);
  const development = (await hero.getAttribute("src"))?.includes("/src/assets/");
  const files = development ? [
    ...(await readdir("src/assets/responsive")).filter((name) => /^studio-[1-4]-.*\.webp$/.test(name)).map((name) => `/src/assets/responsive/${name}`),
    ...(await readdir("src/assets/impressie")).filter((name) => name.endsWith(".webp")).map((name) => `/src/assets/impressie/${name}`),
  ] : (await readdir("dist/assets")).filter((name) => name.endsWith(".webp")).map((name) => `/assets/${name}`);
  expect(files).toHaveLength(42);
  for (let i = 0; i < files.length; i += 6) {
    await page.evaluate(async (urls) => {
      await Promise.all(urls.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok || !response.headers.get("content-type")?.includes("image/webp")) throw new Error(`Bad image response: ${url}`);
        const image = new Image();
        image.src = URL.createObjectURL(await response.blob());
        await image.decode();
        if (!image.naturalWidth) throw new Error(`Empty image: ${url}`);
        URL.revokeObjectURL(image.src);
      }));
    }, files.slice(i, i + 6));
  }

  const preferredHero = await hero.evaluate((image: HTMLImageElement) => image.currentSrc);
  await page.route(preferredHero, (route) => route.fulfill({ contentType: "image/webp", body: "invalid image fixture" }));
  await page.reload({ waitUntil: "domcontentloaded" });
  await imageLoaded(hero);
  expect(await hero.evaluate((image: HTMLImageElement) => image.currentSrc)).not.toBe(preferredHero);
  await page.unroute(preferredHero);

  await page.route("**/__l5e/**", (route) => route.fulfill({ status: 404, body: "" }));
  await page.reload({ waitUntil: "domcontentloaded" });
  await imageLoaded(hero);
  expect(await page.locator("video").evaluateAll((videos: HTMLVideoElement[]) => videos.every((video) => video.hidden || getComputedStyle(video).opacity === "0"))).toBe(true);
  const dimensions = await page.locator("main > section").first().boundingBox();
  await page.waitForTimeout(500);
  expect((await page.locator("main > section").first().boundingBox())?.height).toBe(dimensions?.height);

  let release!: () => void;
  const hold = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/*impressie-10-*.webp*", async (route) => {
    if (route.request().resourceType() !== "image") { await route.continue(); return; }
    await hold; await route.continue();
  });
  // A fresh document prevents the earlier decode checks from warming the carousel cache.
  await page.reload({ waitUntil: "domcontentloaded" });
  await center(page.locator('#impressie [role="region"]'));
  await imageLoaded(page.locator("#impressie img"));
  const previous = await page.locator("#impressie img").getAttribute("src");
  await page.locator('#impressie button[aria-label="Impressie 14"]').click();
  await page.waitForTimeout(3500);
  expect(await page.locator("#impressie img").getAttribute("src")).toBe(previous);
  await expect(page.locator("#impressie [aria-current]")).toHaveAttribute("aria-label", "Impressie 14");
  release();
  await expect(page.locator("#impressie img").last()).toHaveAttribute("src", /impressie-10-/);
  await page.route("**/__l5e/**", async (route) => route.fulfill({ contentType: "video/webm", body: await readFile("testing/fixtures/hero.webm") }));
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("video")).toHaveCount(1);
  if (browserName !== "webkit") {
    await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.videoWidth > 0 && !video.paused)).toBe(true);
    await expect(page.locator("video")).toHaveCSS("opacity", "1");
    await page.locator("video").evaluate((video: HTMLVideoElement) => video.pause());
    await expect(page.locator("video")).toHaveCSS("opacity", "0");
  }
  await imageLoaded(hero);
  await saveEvidence(info, "media", { decodedVariants: files, corruptHeroVariantFallback: true, missingVideoFallback: true, delayedImageRetainsPrevious: true, availableVideoProbe: true, nativeVideoPlayback: browserName !== "webkit" ? "verified" : "Windows WebKit codec-dependent; fallback verified" });
});
