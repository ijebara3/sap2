import { test, expect } from "@playwright/test";
import { readFile, readdir } from "node:fs/promises";
import { center, imageLoaded, noOverflow, saveEvidence } from "./helpers";

test("all responsive variants decode and delayed or failed media retain a visible photo", async ({ page, browserName }, info) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator("main > section img").first();
  await imageLoaded(hero);
  const development = (await hero.getAttribute("src"))?.includes("/src/assets/");
  const files = development ? [
    ...(await readdir("src/assets/responsive")).filter((name) => /^studio-[1-4]-.*\.webp$/.test(name)).map((name) => `/src/assets/responsive/${name}`),
    ...(await readdir("src/assets/impressie")).filter((name) => name.endsWith(".webp")).map((name) => `/src/assets/impressie/${name}`),
    ...(await readdir("src/assets/bts")).filter((name) => name.endsWith(".webp")).map((name) => `/src/assets/bts/${name}`),
  ] : (await readdir("dist/assets")).filter((name) => name.endsWith(".webp")).map((name) => `/assets/${name}`);
  expect(files).toHaveLength(48);
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
  const heroVideo = page.locator("main > section").first().locator("video");
  expect(await heroVideo.evaluateAll((videos: HTMLVideoElement[]) => videos.every((video) => video.hidden || getComputedStyle(video).opacity === "0"))).toBe(true);
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
  await expect(heroVideo).toHaveCount(1);
  if (browserName !== "webkit") {
    await expect.poll(() => heroVideo.evaluate((video: HTMLVideoElement) => video.videoWidth > 0 && !video.paused)).toBe(true);
    await expect(heroVideo).toHaveCSS("opacity", "1");
    await heroVideo.evaluate((video: HTMLVideoElement) => video.pause());
    await expect(heroVideo).toHaveCSS("opacity", "0");
  }
  await imageLoaded(hero);
  await saveEvidence(info, "media", { decodedVariants: files, corruptHeroVariantFallback: true, missingVideoFallback: true, delayedImageRetainsPrevious: true, availableVideoProbe: true, nativeVideoPlayback: browserName !== "webkit" ? "verified" : "Windows WebKit codec-dependent; fallback verified" });
});

test.describe("mobile media delivery", () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  test("slow mobile network defers new media, selects one mobile video and reserves space", async ({ page, context, browserName }, info) => {
    test.skip(browserName !== "chromium", "Network/CPU throttling and pinch zoom use Chromium CDP.");
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750, connectionType: "cellular4g" });
    await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    const mediaRequests: string[] = [];
    page.on("request", request => {
      if (request.resourceType() !== "script" && /broll-|remy-|ref-|google\.com\/maps/.test(request.url())) mediaRequests.push(request.url());
    });
    await page.addInitScript(() => {
      const metrics = { cls: 0, lcp: 0, lcpElement: "", lcpURL: "" };
      Object.assign(window, { mobileMediaMetrics: metrics });
      new PerformanceObserver(list => list.getEntries().forEach(entry => {
        const shift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
        if (!shift.hadRecentInput) metrics.cls += shift.value;
      })).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => list.getEntries().forEach(entry => {
        const paint = entry as PerformanceEntry & { element?: Element; url?: string };
        metrics.lcp = paint.startTime;
        metrics.lcpElement = paint.element?.tagName || "";
        metrics.lcpURL = paint.url || "";
      })).observe({ type: "largest-contentful-paint", buffered: true });
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("main h1")).toBeVisible({ timeout: 30_000 });
    await imageLoaded(page.locator("main > section img").first());
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    expect(mediaRequests).toEqual([]);
    const initial = await page.evaluate(() => ({
      metrics: { ...(window as typeof window & { mobileMediaMetrics: { cls: number; lcp: number } }).mobileMediaMetrics },
      resources: performance.getEntriesByType("resource").map(entry => { const resource = entry as PerformanceResourceTiming; return { url: resource.name, bytes: resource.transferSize, duration: resource.duration }; }),
    }));
    const film = page.locator("#bekend-in-de-studio .studio-proof-film");
    const video = film.locator("video");
    const before = await film.boundingBox();
    await center(film);
    await expect(video).toHaveAttribute("src", /broll-web-mobile/);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState), { timeout: 30_000 }).toBeGreaterThanOrEqual(2);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
    const selected = await video.getAttribute("src");
    const poster = await film.locator("img").evaluate((image: HTMLImageElement) => image.currentSrc);
    expect(poster).toContain("broll-poster-mobile");
    await expect(video).toHaveAttribute("poster", /broll-poster-mobile/);
    expect(mediaRequests.filter(url => /broll-web-/.test(url)).every(url => url.includes("broll-web-mobile"))).toBe(true);
    await imageLoaded(film.locator("img"));
    const after = await film.boundingBox();
    expect(after?.width).toBe(before?.width);
    expect(after?.height).toBe(before?.height);
    await noOverflow(page);
    const finalMetrics = await page.evaluate(() => (window as typeof window & { mobileMediaMetrics: { cls: number; lcp: number } }).mobileMediaMetrics);
    expect(finalMetrics.cls).toBeLessThan(0.1);
    await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
    expect(await page.evaluate(() => visualViewport!.scale)).toBeCloseTo(2);
    const pause = page.getByRole("button", { name: "Pauzeer de studiofilm", exact: true });
    await pause.focus();
    await page.keyboard.press("Space");
    await expect(video).toHaveJSProperty("paused", true);
    await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
    await page.setViewportSize({ width: 1024, height: 768 });
    await expect(video).toHaveAttribute("src", selected!);
    expect(mediaRequests.filter(url => /broll-web-/.test(url)).every(url => url.includes("broll-web-mobile"))).toBe(true);
    await saveEvidence(info, "slow-mobile", { network: "1.6 Mbps / 150 ms RTT; CPU 4x slowdown; DPR 2", initial, finalMetrics, selected, poster, mediaRequests, before, after, pinchZoom: "2x; keyboard pause remained usable" });
  });
});
