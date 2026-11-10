# Focused mobile production-readiness pass — 2026-11-10

Follow-up to `RECENT_CHANGES_REGRESSION.md`. Existing design, routes, SEO and
translation structure are preserved. Scope: StudioProof/B-roll/portraits and
their loading impact, with checks of Studio, Impressie and the surrounding page.

## Implemented

- Added a mobile MP4 directly from the untouched original, retaining the same
  loop dissolve, 29.97 fps and 16:9 proportions. H.264 High Level 3.1, yuv420p,
  CRF 20 / slow, 2-second keyframes, faststart, no audio/data streams.
- Widths below 768 px select that file on approach. Desktop retains the existing
  1080p export. Selection is held across resizing to avoid downloading both.
- Added a smaller real poster with picture/media selection. The video and image
  use the same mobile poster URL, allowing browser cache reuse.
- Deferred poster and portrait source attachment until within 200 px of the
  film. Native `loading="lazy"` alone fetched all three during hero loading;
  the slower-network baseline downloaded approximately 397 KB of new images
  before any scroll. After the change, none of that section's media is requested
  at initial load. Existing dimensions/aspect-ratio containers reserve its space.
- Preserved reduced-motion poster-only behavior, manual pause, offscreen/tab
  pause, natural looping and the native WebKit loop safeguard.

## Media sizes (decimal units)

| Media | Source / previous | Browser derivative |
| --- | --- | --- |
| Original B-roll | 48.89 MB, HEVC Main 10, 3840×2160, 6.89 s container, 52.58 Mb/s video | Original preserved |
| Desktop B-roll | Original above | Existing 6.48 MB, 1920×1080 H.264, 6.473 s, 8.01 Mb/s |
| Mobile B-roll | Desktop 6.48 MB | **2.67 MB**, 1280×720 H.264, 6.473 s, 3.30 Mb/s (59% smaller) |
| Poster | Desktop 214.60 KB, 1920×1080 | **94.38 KB**, 960×540 (56% smaller) |
| Primary portrait | 1.12 MB JPEG, 2218×2957 | Existing 640/960 WebP: 97.51 / 171.88 KB |
| Secondary portrait | 985.57 KB JPEG, 2327×3103 | Existing 640/960 WebP: 84.60 / 148.36 KB |
| Studio photos | Original JPEGs 11.64–14.66 MB, 7242–8192 px wide | Existing 640/1280/1920 WebP and responsive sizes retained |
| Studio/gallery variants | 14 referenced photographs | 640 px: 15.67–42.55 KB; 1280 px: 38.18–115.44 KB; 1920 px: 66.53–227.23 KB |

Both portraits remain monochrome, framed and asymmetrically layered. No new
cutouts or external image processing were introduced. Their existing derivatives
were already suitable. A complete local image dimension/size inventory is saved
with the test artifacts, including unused repository variants; only referenced
assets are emitted by Vite. Original media SHA256 hashes are unchanged.

## Validation

- Eight exact widths: **320, 375, 390, 430, 768, 1024, 1440, 1920 px**, NL and EN.
- **48 focused Playwright checks passed**, plus **4 existing media/gallery/
  surrounding-page checks**, and an isolated repeat of the slow-mobile check.
- All 48 referenced WebP variants decoded. Phone DPR 2 selected 640 px portraits
  and the responsive 1280 px hero photo; no 1920 px new-section poster on mobile.
- Slow-mobile simulation: **1.6 Mbps, 150 ms RTT, CPU 4× slowdown, 390 px/DPR 2**.
  No initial new-section media or Maps request; selected mobile video only;
  successful playback and unchanged film dimensions after loading. Resize did
  not request a second MP4. Browser pinch zoom at 2× retained keyboard pause.
- Isolated lab CLS: **0.00166** at initial load, **0.00198** through film loading.
  This is a local lab observation, not field Core Web Vitals.
- Checked overflow, overlap, crop, responsive composition, alt text, contrast,
  keyboard/focus, live reduced motion, language switching and semantic HTML.
- Surrounding navigation, mobile menu, FAQ, 14-photo gallery/swipe, maps, booking
  link targets, legal routes, metadata, canonical, robots, sitemap and restored
  homepage JSON-LD passed. No new local asset/console/runtime errors found.
- Production build, application/test TypeScript and scoped ESLint passed.
  No new dependencies. Files remain suitable for Git/GitHub/Vercel.

Evidence: `testing/artifacts/mobile-readiness/` (ignored): `before.json`, image
inventory, `widths/`, `media/`, and `isolated-network/` reports/screenshots/JSON.
Encoding provenance is in `src/assets/bts/MEDIA.md`.

## Remaining limitations

- The isolated slow-mobile initial LCP was **9.48 s**, with the existing hero
  paragraph as the last candidate. The new media no longer competes with initial
  loading, but this does not establish a fast overall mobile LCP. Further startup/
  hero profiling would be separate from this focused media pass. LCP entries
  after programmatic scrolling are not reported as initial page-load performance.
- The original hero hosted `/__l5e/.../hero-studio.mp4` asset returns HTML locally;
  only its manifest is present. Photo fallback and playback logic with the existing
  fixture passed. Its actual footage cannot be optimized or verified without the
  original file or a working asset host; it has not been replaced.
- Physical iOS/Safari, field performance and a completed Cal.com reservation were
  not exercised. Existing Browserslist-age and bundle-size build advisories remain.
