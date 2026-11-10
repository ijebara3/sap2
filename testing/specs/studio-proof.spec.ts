import { test, expect } from "@playwright/test";
import { center, imageLoaded, monitor, noOverflow, saveEvidence, saveScreenshot } from "./helpers";

const section = "#bekend-in-de-studio";
const film = `${section} video`;
const requestsVideo = (url: string) => /broll-web.*\.mp4/.test(url) && !new URL(url).searchParams.has("import");

test("studio proof defers video, plays and loops near the viewport, and pauses away", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", request => { if (requestsVideo(request.url())) requests.push(request.url()); });
  await page.goto("/");
  await expect(page.locator("main > section").nth(1)).toHaveAttribute("id", "bekend-in-de-studio");
  await expect(page.locator("main > section").nth(2)).toHaveAttribute("id", "book-arrive-record");
  await page.waitForTimeout(500);
  expect(requests).toHaveLength(0);
  const video = page.locator(film);
  await expect(video).not.toHaveAttribute("src");
  for (const image of await page.locator(`${section} img`).all()) await expect(image).not.toHaveAttribute("src");
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("src", await page.evaluate(() => innerWidth < 768) ? /broll-web-mobile/ : /broll-web(?!-mobile)/);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState)).toBeGreaterThanOrEqual(2);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  const media = await video.evaluate((element: HTMLVideoElement) => ({ muted: element.muted, loop: element.loop, inline: element.hasAttribute("playsinline"), controls: element.controls, width: element.videoWidth, height: element.videoHeight, duration: element.duration }));
  expect(media).toMatchObject({ muted: true, loop: true, inline: true, controls: false });
  expect(media.width).toBeGreaterThan(0);
  expect(media.height).toBeGreaterThan(0);
  await video.evaluate((element: HTMLVideoElement) => {
    let previous = element.currentTime;
    element.addEventListener("timeupdate", () => {
      if (previous > element.duration / 2 && element.currentTime < previous - 1) element.dataset.looped = "true";
      previous = element.currentTime;
    });
  });
  await expect(video).toHaveAttribute("data-looped", "true", { timeout: 15_000 });
  await expect(video).toHaveJSProperty("paused", false);
  const pause = page.getByRole("button", { name: "Pauzeer de studiofilm", exact: true });
  await pause.click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveJSProperty("paused", true);
  await page.getByRole("button", { name: "Speel de studiofilm af", exact: true }).click();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: false }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
});

test("studio proof uses real portraits, has no overflow, and switches NL/EN", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/");
  const proof = page.locator(section);
  await proof.scrollIntoViewIfNeeded();
  await expect(proof.getByRole("heading")).toHaveText("Hier gingen al bijzondere gasten voor de microfoon zitten.");
  const portraits = proof.locator("figure img");
  await expect(portraits).toHaveCount(2);
  for (const image of await portraits.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  }
  const bounds = await proof.evaluate(element => {
    const film = element.querySelector(".studio-proof-film")!.getBoundingClientRect();
    const photos = [...element.querySelectorAll("figure")].map(photo => photo.getBoundingClientRect());
    return { viewport: innerWidth, width: document.documentElement.scrollWidth, filmWidth: film.width, primaryWidth: photos[0].width, secondaryWidth: photos[1].width, photos: photos.map(photo => ({ left: photo.left, right: photo.right, width: photo.width })) };
  });
  expect(bounds.width).toBeLessThanOrEqual(bounds.viewport);
  expect(bounds.filmWidth).toBeGreaterThan(bounds.primaryWidth * 1.5);
  expect(bounds.primaryWidth).toBeGreaterThan(bounds.secondaryWidth);
  for (const photo of bounds.photos) { expect(photo.left).toBeGreaterThanOrEqual(-1); expect(photo.right).toBeLessThanOrEqual(bounds.viewport + 1); expect(photo.width).toBeGreaterThan(100); }
  await expect(proof.getByRole("link")).toHaveAttribute("href", "https://cal.com/amsterdam-podcast-studio");
  await page.locator("header").getByRole("button", { name: "EN", exact: true }).click();
  await expect(proof.getByRole("heading")).toHaveText("Some remarkable guests have already taken a seat behind these microphones.");
  await expect(proof.getByText("Seen in the studio", { exact: true })).toBeVisible();
  await proof.getByRole("heading").scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator("header").getByRole("button", { name: "NL", exact: true }).click();
  await proof.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("studio-proof.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("reduced motion shows the real poster without requesting or playing video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const requests: string[] = [];
  page.on("request", request => { if (requestsVideo(request.url())) requests.push(request.url()); });
  await page.goto("/");
  await page.locator(section).scrollIntoViewIfNeeded();
  const video = page.locator(film);
  await expect(video).not.toHaveAttribute("src");
  await expect(video).toHaveJSProperty("paused", true);
  await expect(page.locator(`${section} .studio-proof-poster`)).toBeVisible();
  await expect(page.locator(`${section} .studio-proof-playback`)).toHaveCount(0);
  await expect(page.locator(`${section} h2`)).toBeVisible();
  await page.waitForTimeout(300);
  expect(requests).toHaveLength(0);
});

test("a failed video keeps the real poster and the booking action usable", async ({ page }) => {
  await page.goto("/");
  const video = page.locator(film);
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveAttribute("src", /broll-web/);
  // Use a real non-video response: WebKit's native media requests can bypass route interception.
  await video.evaluate((element: HTMLVideoElement) => { element.src = "/robots.txt"; element.load(); });
  await expect(page.locator(`${section} .studio-proof-playback`)).toHaveCount(0);
  await expect(page.locator(`${section} .studio-proof-poster`)).toBeVisible();
  await expect(page.locator(`${section} .studio-proof-film video`)).not.toHaveClass("is-ready");
  await expect(page.locator(section).getByRole("link")).toHaveAttribute("href", "https://cal.com/amsterdam-podcast-studio");
});

test("recent section preserves semantic content, keyboard controls, contrast and surrounding layout", async ({ page }, info) => {
  const evidence = monitor(page);
  const warnings: string[] = [];
  page.on("console", message => { if (message.type() === "warning" && /React|unique.*key|unmounted|hydration/i.test(message.text())) warnings.push(message.text()); });
  await page.goto("/");
  const proof = page.locator(section);
  await center(proof.locator("h2"));
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(proof.locator("h2")).toHaveCount(1);
  await expect(proof.locator("h1,h3")).toHaveCount(0);
  await expect(page.locator("head title")).toHaveCount(1);
  for (const selector of ['meta[name="description"]', 'meta[name="robots"]', 'link[rel="canonical"]', '#business-schema']) await expect(page.locator(selector)).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  expect(JSON.parse(await page.locator("#business-schema").textContent() || "null")["@type"]).toBe("LocalBusiness");
  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.getAttribute("href")!).filter(href => href.length > 1 && !document.getElementById(decodeURIComponent(href.slice(1)))));
  expect(brokenAnchors).toEqual([]);

  for (const language of ["nl", "en"] as const) {
    await page.locator("header").getByRole("button", { name: language.toUpperCase(), exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", language);
    await expect(proof.locator(".studio-proof-footnote")).toHaveText(language === "nl" ? "Dit is waar verhalen samenkomen." : "This is where stories come together.");
    await center(proof.locator(".studio-proof-film"));
    for (const image of await proof.locator("img").all()) await imageLoaded(image);
    await expect(proof.locator(".studio-proof-poster")).toHaveAttribute("alt", "");
    for (const portrait of await proof.locator("figure img").all()) await expect(portrait).toHaveAttribute("alt", language === "nl" ? /^Een gast/ : /^A guest/);
    await noOverflow(page);
    const before = await proof.boundingBox();
    await page.waitForTimeout(800);
    const after = await proof.boundingBox();
    expect(after?.height).toBe(before?.height);
    const layout = await proof.evaluate(element => {
      const box = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
      const heading = box("h2"), intro = box(".studio-proof-intro"), film = box(".studio-proof-film"), caption = box(".studio-proof-footnote");
      const photos = [...element.querySelectorAll("figure img")].map(image => {
        const frame = image.parentElement!.getBoundingClientRect();
        return { left: frame.left, right: frame.right, top: frame.top, bottom: frame.bottom, fit: getComputedStyle(image).objectFit };
      });
      const intersects = (a: Pick<DOMRect, "left" | "right" | "top" | "bottom">, b: Pick<DOMRect, "left" | "right" | "top" | "bottom">) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
      const label = box(".studio-proof-film-label"), control = box(".studio-proof-playback");
      const outer = element.getBoundingClientRect();
      return { width: innerWidth, photos, headingCollision: intersects(heading, intro), controlCollision: intersects(label, control), videoFit: getComputedStyle(element.querySelector("video")!).objectFit, filmRatio: film.width / film.height, captionCollision: photos.some(photo => intersects(caption, photo)), heroGap: outer.top - element.previousElementSibling!.getBoundingClientRect().bottom, nextGap: element.nextElementSibling!.getBoundingClientRect().top - outer.bottom };
    });
    expect(layout.headingCollision).toBe(false);
    expect(layout.controlCollision).toBe(false);
    expect(layout.captionCollision).toBe(false);
    expect(layout.videoFit).toBe("cover");
    expect(layout.filmRatio).toBeCloseTo(layout.width < 640 ? 1.6 : 16 / 9, 2);
    expect(layout.heroGap).toBeGreaterThanOrEqual(-1);
    expect(layout.nextGap).toBeGreaterThanOrEqual(-1);
    for (const photo of layout.photos) { expect(photo.left).toBeGreaterThanOrEqual(0); expect(photo.right).toBeLessThanOrEqual(layout.width); expect(photo.fit).toBe("cover"); }
    await saveEvidence(info, `recent-${language}`, layout);
    await saveScreenshot(page, info, `recent-${language}`, proof);
  }

  const contrast = await proof.evaluate(element => {
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => { const s = value / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const background = luminance(getComputedStyle(element).backgroundColor);
    return [...element.querySelectorAll(".section-label,.studio-proof-intro p,.studio-proof-footnote")].map(node => {
      const foreground = luminance(getComputedStyle(node).color);
      return { text: node.textContent, ratio: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05) };
    });
  });
  for (const result of contrast) expect(result.ratio, JSON.stringify(result)).toBeGreaterThanOrEqual(4.5);
  const booking = proof.getByRole("link");
  await page.keyboard.press("Tab");
  await booking.focus();
  await expect(booking).toBeFocused();
  await expect(booking).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  const pause = proof.getByRole("button", { name: "Pause the studio film", exact: true });
  await expect(pause).toBeFocused();
  await expect(pause).toHaveCSS("outline-width", "2px");
  await page.keyboard.press("Space");
  await expect(proof.locator("video")).toHaveJSProperty("paused", true);
  await expect(proof.getByRole("button", { name: "Play the studio film", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(warnings).toEqual([]);
  expect(evidence.runtimeErrors).toEqual([]);
  expect(evidence.consoleErrors).toEqual([]);
  expect(evidence.failedLocalRequests).toEqual([]);
  await saveEvidence(info, "recent-runtime", { contrast, warnings, ...evidence });
});

test("live reduced-motion changes stop the new video and gallery without a reload", async ({ page }) => {
  await page.goto("/");
  const video = page.locator(film);
  await center(video);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).not.toHaveAttribute("src");
  await expect(video).not.toHaveClass("is-ready");
  const gallery = page.locator('#impressie [role="region"]');
  await center(gallery);
  await expect(page.getByRole("button", { name: "Pauzeer de diavoorstelling", exact: true })).toHaveCount(0);
  const current = await page.locator("#impressie [aria-current]").getAttribute("aria-label");
  await page.waitForTimeout(3500);
  await expect(page.locator("#impressie [aria-current]")).toHaveAttribute("aria-label", current!);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await center(video);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(false);
});
