import { test, expect } from "@playwright/test";
import { center, imageLoaded, noOverflow, saveEvidence, visibleGallery } from "./helpers";

test("all 14 photos, arrows, indicators, keyboard, swipe and real autoplay", async ({ page, browserName, context }, info) => {
  test.skip(!/(iphone-15-portrait|ipad-mini-portrait|desktop-1440)$/.test(info.project.name), "Detailed gallery checks run on representative mobile, tablet and desktop in every engine.");
  await page.goto("/");
  const region = page.locator('#impressie [role="region"]');
  await center(region);
  const choices = page.locator('#impressie button[aria-label^="Impressie "]');
  const files: string[] = [];
  const original = await region.boundingBox();
  for (let i = 0; i < 14; i++) {
    await choices.nth(i).click(); await visibleGallery(page, i + 1);
    files.push(await page.locator("#impressie img").evaluate((image: HTMLImageElement) => image.currentSrc));
    const current = await region.boundingBox();
    expect(current?.width).toBe(original?.width); expect(current?.height).toBe(original?.height);
    await noOverflow(page);
  }
  expect(new Set(files).size).toBe(14);
  await center(region); await region.focus(); await page.keyboard.press("ArrowRight"); await visibleGallery(page, 1);
  await page.keyboard.press("ArrowLeft"); await visibleGallery(page, 14);
  await choices.first().click(); await visibleGallery(page, 1);
  const box = await region.boundingBox();
  if (!box) throw new Error("Gallery has no geometry");
  const startX = box.x + box.width * 0.75, endX = box.x + box.width * 0.25, y = box.y + box.height * 0.5;
  if (browserName === "chromium" && info.project.use.hasTouch) {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: startX, y }] });
    for (let i = 1; i <= 10; i++) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: startX + (endX - startX) * i / 10, y }] }); await page.waitForTimeout(20); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    await page.mouse.move(startX, y); await page.mouse.down(); await page.mouse.move(endX, y, { steps: 12 }); await page.mouse.up();
  }
  await visibleGallery(page, 2);
  await choices.last().click(); await visibleGallery(page, 14);
  const start = Date.now();
  await expect(page.locator('#impressie [aria-current]')).toHaveAttribute("aria-label", "Impressie 1", { timeout: 4000 });
  const elapsed = Date.now() - start;
  // The first image transition has already consumed part of the three-second interval.
  expect(elapsed).toBeGreaterThan(1000); expect(elapsed).toBeLessThan(4000);
  await imageLoaded(page.locator("#impressie img").last());
  await saveEvidence(info, "gallery", { files, autoplayObservedAfterVisibleTransitionMs: elapsed, swipe: browserName === "chromium" && info.project.use.hasTouch ? "CDP native touch" : "pointer drag (native touch injection unavailable in this engine)" });
});

test("gallery can be paused and resumed with the keyboard in both languages", async ({ page }) => {
  await page.goto("/");
  const region = page.locator('#impressie [role="region"]');
  await center(region);
  const pause = page.getByRole("button", { name: "Pauzeer de diavoorstelling", exact: true });
  await pause.focus();
  await page.keyboard.press("Space");
  const resume = page.getByRole("button", { name: "Hervat de diavoorstelling", exact: true });
  await expect(resume).toHaveAttribute("aria-pressed", "true");
  const before = await page.locator("#impressie [aria-current]").getAttribute("aria-label");
  await center(region);
  await page.waitForTimeout(3500);
  await expect(page.locator("#impressie [aria-current]")).toHaveAttribute("aria-label", before!);
  await region.focus();
  await page.keyboard.press("ArrowRight");
  await visibleGallery(page, Number(before!.split(" ").pop()) % 14 + 1);
  await page.locator("header").getByRole("button", { name: "EN", exact: true }).click();
  const englishResume = page.getByRole("button", { name: "Resume the slideshow", exact: true });
  await page.keyboard.press("Tab");
  await englishResume.focus();
  await expect(englishResume).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(page.getByRole("button", { name: "Pause the slideshow", exact: true })).toHaveAttribute("aria-pressed", "false");
  await center(region);
  const current = await page.locator("#impressie [aria-current]").getAttribute("aria-label");
  await expect(page.locator("#impressie [aria-current]")).not.toHaveAttribute("aria-label", current!, { timeout: 5000 });
});

test("reduced motion keeps gallery static and studio layers still while manual controls work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const region = page.locator('#impressie [role="region"]');
  await center(region);
  await visibleGallery(page, 1);
  await expect(page.getByRole("button", { name: "Pauzeer de diavoorstelling", exact: true })).toHaveCount(0);
  await page.waitForTimeout(3500);
  await visibleGallery(page, 1);
  await region.focus();
  await page.keyboard.press("ArrowRight");
  await visibleGallery(page, 2);
  const layers = page.locator("#studio img");
  for (const layer of await layers.all()) {
    if (!await layer.isVisible()) continue;
    await center(layer);
    const transform = await layer.evaluate(image => getComputedStyle(image.parentElement!).transform);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
    await expect(layer.locator("..")).toHaveCSS("opacity", "1");
  }
});
