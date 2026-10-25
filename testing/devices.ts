import { devices, type Project } from "@playwright/test";

type BrowserName = "chromium" | "firefox" | "webkit";

const names = ["iPhone SE", "iPhone 15", "iPhone 15 Pro Max", "Galaxy S24", "Pixel 8", "iPad Mini", "iPad Pro 11", "Galaxy Tab S9"];

export const profiles = names.flatMap((name) => ["portrait", "landscape"].map((orientation) => {
  const preset = devices[orientation === "landscape" ? `${name} landscape` : name];
  const { defaultBrowserType: _browser, ...options } = preset;
  return { name: `${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${orientation}`, label: name, orientation, options };
})).concat([1280, 1440, 1920].map((width) => ({
  name: `desktop-${width}`, label: `Desktop ${width}px`, orientation: "desktop",
  options: { ...devices["Desktop Chrome"], viewport: { width, height: width === 1920 ? 1080 : 900 } },
})));

export const projects: Project[] = (["chromium", "firefox", "webkit"] as BrowserName[]).flatMap((browserName) =>
  profiles.map((profile) => ({
    name: `${browserName}-${profile.name}`,
    metadata: { device: profile.label, orientation: profile.orientation, viewport: profile.options.viewport, mobileEmulation: browserName !== "firefox" },
    testMatch: ["**/responsive.spec.ts", ...(/(iphone-15-portrait|ipad-mini-portrait|desktop-1440)$/.test(profile.name) ? ["**/gallery.spec.ts"] : []), ...(profile.name === "desktop-1440" ? ["**/media.spec.ts"] : [])],
    use: { ...profile.options, browserName, ...(browserName === "firefox" ? { isMobile: false } : {}) },
  })),
);
