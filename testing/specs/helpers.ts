import { expect, type Locator, type Page, type TestInfo } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const artifactRoot = path.resolve(process.env.AUDIT_ARTIFACTS || "testing/artifacts");

export async function center(locator: Locator) {
  // scrollIntoView also scrolls overflow:hidden ancestors. Oversized decorative
  // backgrounds intentionally extend past those clips, so move the window only.
  await locator.evaluate((element) => {
    const box = element.getBoundingClientRect();
    scrollTo({ top: scrollY + box.top + box.height / 2 - innerHeight / 2, behavior: "instant" });
  });
}

export async function opaque(locator: Locator) {
  await expect.poll(() => locator.evaluate((element) => {
    let node: Element | null = element;
    while (node && node !== document.body) {
      if (Number(getComputedStyle(node).opacity) < 0.98) return false;
      node = node.parentElement;
    }
    return true;
  })).toBe(true);
}

export async function noOverflow(page: Page) {
  const measured = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
  expect(measured.content, JSON.stringify(measured)).toBeLessThanOrEqual(measured.width);
}

export async function imageLoaded(image: Locator) {
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await image.evaluate((element: HTMLImageElement) => element.decode());
}

export function monitor(page: Page) {
  const results = { runtimeErrors: [] as string[], consoleErrors: [] as string[], failedLocalRequests: [] as string[], externalFailures: [] as string[], videoResponses: [] as string[] };
  const local = (url: string) => /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(url);
  page.on("pageerror", (error) => results.runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.location().url && !local(message.location().url)) results.externalFailures.push(message.text());
    else results.consoleErrors.push(message.text());
  });
  page.on("requestfailed", (request) => {
    if (request.failure()?.errorText.includes("ABORTED") || request.failure()?.errorText.includes("NS_BINDING_ABORTED")) return;
    (local(request.url()) ? results.failedLocalRequests : results.externalFailures).push(`${request.method()} ${request.url()} ${request.failure()?.errorText}`);
  });
  page.on("response", (response) => {
    const url = response.url();
    if (response.status() >= 400) (local(url) ? results.failedLocalRequests : results.externalFailures).push(`${response.status()} ${url}`);
    if (url.endsWith("hero-studio.mp4")) results.videoResponses.push(`${response.request().method()} ${response.status()} ${response.headers()["content-type"]} ${url}`);
  });
  return results;
}

export async function saveScreenshot(page: Page, info: TestInfo, label: string, locator?: Locator) {
  const directory = path.join(artifactRoot, "screenshots", info.project.name);
  await mkdir(directory, { recursive: true });
  const file = path.join(directory, `${label}.png`);
  if (label === "homepage-nl-full") {
    await writeFile(path.join(directory, `${label}.geometry.json`), JSON.stringify(await page.evaluate(() => ({
      scrollY, viewportHeight: innerHeight,
      visualViewport: { top: visualViewport?.offsetTop, pageTop: visualViewport?.pageTop, height: visualViewport?.height },
      heroHeading: document.querySelector("main section h1")?.getBoundingClientRect().toJSON(),
      hero: document.querySelector("main section")?.getBoundingClientRect().toJSON(),
      clippedContainers: [...document.querySelectorAll("main section")].filter((section) => section.scrollTop || section.scrollLeft).map((section) => ({ id: section.id, scrollTop: section.scrollTop, scrollLeft: section.scrollLeft })),
    })), null, 2));
  }
  if (locator) await locator.screenshot({ path: file, scale: "css" });
  else await page.screenshot({ path: file, fullPage: label.includes("full") || label.startsWith("route-"), scale: "css" });
  await info.attach(label, { path: file, contentType: "image/png" });
}

export async function saveEvidence(info: TestInfo, label: string, data: unknown) {
  const directory = path.join(artifactRoot, "evidence");
  await mkdir(directory, { recursive: true });
  const file = path.join(directory, `${info.project.name}-${label}.json`);
  await writeFile(file, JSON.stringify(data, null, 2));
  await info.attach(label, { path: file, contentType: "application/json" });
}

export async function visibleGallery(page: Page, number: number) {
  await expect(page.locator("#impressie [aria-current]")).toHaveAttribute("aria-label", new RegExp(` ${number}$`));
  const filename = number <= 4 ? `studio-${[1, 3, 4, 2][number - 1]}-` : `impressie-${number - 4}-`;
  // The counter changes before decoding finishes. Wait atomically for the actual
  // requested photo and the outgoing animation, rather than accepting the old image.
  await expect.poll(() => page.locator("#impressie img").evaluateAll((images: HTMLImageElement[], expected) => {
    const state = images.map((image) => ({ source: image.currentSrc, complete: image.complete, width: image.naturalWidth, opacity: Number(getComputedStyle(image.parentElement!).opacity) }));
    if (state.length === 1 && state[0].source.includes(expected) && state[0].complete && state[0].width > 0 && state[0].opacity > 0.98) return "ready";
    return JSON.stringify(state);
  }, filename), { intervals: [50, 100, 100] }).toBe("ready");
}
