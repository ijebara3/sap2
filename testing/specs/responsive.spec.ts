import { test, expect } from "@playwright/test";
import { center, imageLoaded, monitor, noOverflow, opaque, saveEvidence, saveScreenshot, visibleGallery } from "./helpers";

test("device audit: layouts, media, controls, languages and every route", async ({ page }, info) => {
  const evidence = monitor(page);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("main > section")).toHaveCount(10);
  await page.evaluate(() => document.fonts.ready);
  await imageLoaded(page.locator("main > section img").first());
  await opaque(page.locator("main > section h1").first());
  await opaque(page.locator("main > section").first().locator("a"));
  await opaque(page.locator("main > section").first().getByRole("button").first());
  await saveScreenshot(page, info, "hero");

  // Walk the actual page so below-fold reveal animations and lazy map media
  // are observed, including short landscape screens. Avoid forcing styles.
  await page.evaluate(async () => {
    const step = Math.max(100, innerHeight * 0.5);
    for (let top = 0; top < document.documentElement.scrollHeight; top += step) {
      scrollTo({ top, behavior: "instant" });
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    }
  });

  const geometry: unknown[] = [];
  for (const section of await page.locator("main > section").all()) {
    const heading = section.locator("h1,h2").first();
    if (await heading.count()) { await center(heading); await opaque(heading); }
    else await center(section);
    await noOverflow(page);
    const data = await section.evaluate((element) => {
      const invalid = [...element.querySelectorAll("h1,h2,h3,p,a,button")].filter((node) => {
        if (node.closest("#prijzen > div:last-child")) return false; // Intentional decorative ticker.
        const box = node.getBoundingClientRect();
        return box.width > 0 && box.bottom > 0 && box.top < innerHeight && (box.left < -1 || box.right > innerWidth + 1);
      }).map((node) => node.textContent?.trim());
      return { section: element.id || "hero-or-final-cta", invalid };
    });
    geometry.push(data);
    expect(data.invalid, JSON.stringify(data)).toEqual([]);
  }
  // Reveal individual rows before full-page capture; off-screen reveal animations are intentional.
  for (const row of await page.locator("#inbegrepen li, #hoe-werkt-het li").all()) {
    await center(row);
    // These steps follow scroll progress continuously; on tall tablets their
    // center position precedes the existing 45%-of-viewport completion point.
    if (await row.evaluate((element) => !!element.closest("#hoe-werkt-het"))) {
      await page.evaluate(() => scrollBy({ top: innerHeight * 0.1, behavior: "instant" }));
    }
    await opaque(row);
  }
  for (const word of await page.locator("#book-arrive-record .font-display, #prijzen .select-none, main > section:last-child h2 > span > span").all()) { await center(word); await opaque(word); }
  for (const image of await page.locator("main img").all()) {
    if (!(await image.evaluate((element) => element.getBoundingClientRect().width > 0))) continue;
    await center(image);
    await imageLoaded(image);
    await expect(image).toHaveCSS("object-fit", "cover");
  }
  const map = page.locator("#locatie iframe");
  await center(map); await opaque(map);
  await expect(page.frameLocator("#locatie iframe").locator("body")).toBeVisible({ timeout: 15_000 });
  await saveScreenshot(page, info, "location", page.locator("#locatie"));

  const choices = page.locator('#impressie button[aria-label^="Impressie "]');
  expect(await choices.count()).toBe(14);
  await center(page.locator('#impressie [role="region"]'));
  await choices.last().click();
  await visibleGallery(page, 14);
  const next = page.locator('#impressie button[aria-label="Volgende"]');
  await next.evaluate((element) => element.addEventListener("click", () => {
    const current = Number(document.querySelector('#impressie [aria-current]')?.getAttribute("aria-label")?.split(" ").pop());
    element.setAttribute("data-audit-expected", String(current % 14 + 1));
  }, { once: true, capture: true }));
  await center(next); await next.click();
  await visibleGallery(page, Number(await next.getAttribute("data-audit-expected")));
  await center(page.locator('#impressie [role="region"]'));
  await saveScreenshot(page, info, "gallery");

  const feature = page.locator("#inbegrepen button").last();
  await center(feature); await feature.click();
  await expect(feature).toHaveAttribute("aria-pressed", "true");
  await center(page.locator("#inbegrepen img"));
  await expect(page.locator("#inbegrepen img")).toHaveAttribute("alt", await feature.locator("h3").innerText());
  await opaque(page.locator("#inbegrepen img"));
  const faq = page.locator("#faq button").first();
  await center(faq); await opaque(faq); await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");
  await noOverflow(page); await faq.click();

  await center(page.locator("footer")); await noOverflow(page);
  await saveScreenshot(page, info, "footer", page.locator("footer"));
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await opaque(page.locator("main > section h1").first());
  const topGeometry = await page.evaluate(() => ({
    heading: document.querySelector("main section h1")!.getBoundingClientRect().top,
    header: document.querySelector("header")!.getBoundingClientRect().bottom,
    clipped: [...document.querySelectorAll("main section")].filter((section) => section.scrollTop || section.scrollLeft).map((section) => ({ id: section.id || "hero-or-final-cta", top: section.scrollTop, left: section.scrollLeft })),
  }));
  expect(topGeometry.clipped).toEqual([]);
  expect(topGeometry.heading).toBeGreaterThanOrEqual(topGeometry.header);
  await saveScreenshot(page, info, "homepage-nl-full");

  const menu = page.locator('header button[aria-controls="mobile-navigation"]');
  if (await menu.isVisible()) {
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#mobile-navigation")).toBeVisible();
    await opaque(page.locator("#mobile-navigation button").last());
    await saveScreenshot(page, info, "navigation-open");
    await page.locator("#mobile-navigation a").evaluate((element) => element.scrollIntoView({ block: "nearest", behavior: "instant" }));
    expect(await page.locator("#mobile-navigation a").evaluate((element) => element.getBoundingClientRect().bottom <= innerHeight + 1)).toBe(true);
    await saveScreenshot(page, info, "navigation-booking");
    await page.keyboard.press("Escape");
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(menu).toBeFocused();
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  }
  const headerOverlap = await page.locator("header").evaluate((header) => {
    const visible = [...header.querySelectorAll("button,a")].map((element) => ({ text: element.textContent, box: element.getBoundingClientRect() })).filter(({ box }) => box.width && box.height);
    return visible.flatMap((a, index) => visible.slice(index + 1).filter((b) => Math.min(a.box.right, b.box.right) - Math.max(a.box.left, b.box.left) > 2 && Math.min(a.box.bottom, b.box.bottom) - Math.max(a.box.top, b.box.top) > 2).map((b) => [a.text, b.text]));
  });
  expect(headerOverlap).toEqual([]);

  if (await menu.isVisible()) {
    if (info.project.use.hasTouch) await menu.tap();
    else await menu.click();
    await page.locator("#mobile-navigation").getByRole("button", { name: "Studio", exact: true }).click();
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  } else {
    await page.locator("header").getByRole("button", { name: "Studio", exact: true }).click();
  }
  await expect.poll(() => page.locator("#studio").evaluate((element) => Math.round(element.getBoundingClientRect().top))).toBe(80);

  await page.getByRole("button", { name: "EN", exact: true }).first().click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  for (const heading of await page.locator("main section h1,main section h2").all()) { await center(heading); await opaque(heading); await noOverflow(page); }
  await expect(page.locator("#locatie address")).toContainText("Netherlands");
  const bookingLinks = page.locator('a[href^="https://cal.com"]');
  expect(await bookingLinks.count()).toBeGreaterThanOrEqual(4);
  for (const link of await bookingLinks.all()) { await expect(link).toHaveAttribute("href", "https://cal.com/amsterdam-podcast-studio"); await expect(link).toHaveAttribute("target", "_blank"); }
  // Verify click behavior without opening or submitting a real external reservation.
  const book = page.locator("main > section").first().locator('a[href^="https://cal.com"]');
  await book.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault(), { once: true }));
  await center(book); await book.click();

  for (const route of ["/privacy", "/voorwaarden", "/audit-missing-page"]) {
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await noOverflow(page);
    await saveScreenshot(page, info, `route-${route.slice(1)}-full`);
  }
  await page.getByRole("link", { name: "Return to Home" }).click();
  await expect(page.locator("main > section")).toHaveCount(10);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await saveEvidence(info, "device-audit", { project: info.project.metadata, geometry, ...evidence });
  expect(evidence.runtimeErrors).toEqual([]);
  expect(evidence.consoleErrors).toEqual([]);
  expect(evidence.failedLocalRequests).toEqual([]);
});

