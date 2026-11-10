# Recent changes regression check — 2026-11-10

Scope: StudioProof (B-roll, poster, guest portraits, captions, booking link),
Studio image layers/translated alt text, and Impressie gallery/media/controls.
Surrounding homepage functionality was checked without redesigning sections.

The subsequent mobile media/loading pass is recorded in `MOBILE_READINESS.md`;
it adds a mobile video/poster and raises the referenced WebP count from 47 to 48.

## Targeted fixes

- Increased the new studio label's contrast using the existing accent foreground
  token. Measured contrast is 10.86:1; body/caption text is 6.13:1.
- Made reduced-motion preferences reactive in the three scoped visual components.
  Changing the preference while the page is open now pauses/unloads the new video,
  stops gallery autoplay, and disables the scoped scroll/reveal motion.
- Added a keyboard-accessible, translated pause/resume control to Impressie.
  Manual carousel navigation remains available under reduced motion.
- Restored the existing LocalBusiness JSON-LD when navigating back from a legal
  page. Its contents, canonical policy and other SEO behavior remain unchanged.
- Updated existing media tests for two video sections and all 47 WebP variants.

## Validation

- Exact viewport widths: 320, 375, 430, 768, 1024, 1440 and 1920 px, in NL and EN.
- 42 focused Playwright checks passed across those widths.
- 13 surrounding-page/gallery/media checks passed on mobile, tablet and desktop.
- 13 additional checks passed with normal network access, loading real Google
  Fonts and Google Maps and repeating all seven visual widths.
- No horizontal overflow, media stretching, unstable section dimensions, heading/
  intro collisions, portrait/caption collisions, or broken local media found.
- Video autoplay, natural looping, manual pause, offscreen/hidden-tab pause,
  poster fallback, deferred source loading and live reduced motion passed.
- All 14 gallery photos, keyboard arrows, swipe, autoplay and pause/resume passed.
- One homepage H1, logical new H2, localized alt text and captions, metadata,
  robots, sitemap, valid JSON-LD and internal anchors passed.
- Navigation, mobile menu, FAQ, maps, legal routes, language switching and Cal.com
  link targets passed. No actual reservation was submitted.
- Production build, application/test TypeScript checks and scoped ESLint passed.
  Build retains its existing Browserslist age and bundle-size advisories.

Evidence, screenshots and Playwright reports are under the ignored directory
`testing/artifacts/recent-regression/`: `final-widths/`, `final-surrounding/`
and `network-enabled/`. The latter run has no failed external requests.

## Manual review / existing limitation

Physical iOS/Safari and a real booking transaction were not exercised in this
focused Chromium regression pass. The original hero's `/__l5e/.../hero-studio.mp4`
hosted asset URL returns HTML locally; the existing photo fallback is working.
Hero playback/fallback logic was checked using the existing local video fixture.
The original hosted footage needs its asset host/original file to verify live
playback; this task did not replace the hero or change its visual direction.
