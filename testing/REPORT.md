# Amsterdam Studio Podcast — executed responsive audit

Audit executed: 22 October 2026. Report finalized: 25 October 2026. Development: http://localhost:8080. Production preview: http://localhost:4173.

Executed verification is complete: 69 development cases and 12 production cases pass after fixes and reruns. Screenshot review found no additional layout defects in the reviewed captures. Mobile performance remains an improvement opportunity, as detailed below. Completed device tests were not repeated during report finalization.

## Website fixes

| File | Finding and correction |
| --- | --- |
| `src/components/site/Hero.tsx` | The hosted video URL returns the Vite HTML fallback locally, rather than a video. Probe its response before mounting the video, retain the real responsive photograph underneath, and reveal the video only after playback starts. Correct the React 18 priority-attribute warning while keeping high image priority. |
| `src/components/site/Nav.tsx` | Smooth scrolling could be cancelled while the mobile menu closed. Complete the existing exit animation before scrolling to the chosen section. |
| `src/components/site/Impressie.tsx` | A photo taking over three seconds to decode could be skipped by autoplay. Start the next three-second interval after the selected photo is prepared. |

The existing 14 photographs, styling, animations, translations, booking destinations, and section order are retained. Earlier uncommitted responsiveness/gallery work in this workspace was preserved and included in verification.

## Audit tooling

Playwright is a development dependency; runtime dependencies are unchanged. Configuration and tests are in `testing/`, with package scripts in `package.json`. Generated reports/screenshots are ignored by Git. ESLint and Vite exclude audit output, so HTML trace snapshots do not enter development watching or lint traversal.

The audit uses real window scrolling to reveal page content. It avoids `scrollIntoView` on oversized decorative backgrounds, which can scroll an intentionally clipped ancestor and create misleading captures. Short landscape viewports are swept through the complete page; continuous step animations are checked at their existing completion position. Media checks wait for application content rather than the third-party iframe's global load event.

## Coverage

19 configurations in each of Chromium 156.0.8078.4, Firefox 157.0, and WebKit 27.2, using Playwright 1.64.1:

- iPhone SE, iPhone 15, iPhone 15 Pro Max, Samsung Galaxy S24, Google Pixel 8.
- iPad Mini, iPad Pro 11, Samsung Galaxy Tab S9.
- Portrait and landscape for those eight devices; desktops at 1280, 1440, and 1920 pixels.

Each configuration checks all ten homepage sections, image decoding and sizing, horizontal overflow, navigation geometry, touch/menu behavior, feature selection, FAQ, Dutch/English switching and persistence, booking links, legal routes, and the 404 view. Full homepage, legal, and 404 screenshots are saved, alongside media/menu/detail captures and request/console evidence.

Detailed gallery checks run on phone, tablet, and desktop in every engine: all 14 distinct photos, indicators, arrows, keyboard navigation, swiping, looping, and the real three-second timer. Native touch injection is used in Chromium; pointer dragging verifies the same slider handlers in Firefox/WebKit.

Media tests decode all 42 WebP variants in development and production, and exercise a corrupt hero variant, missing video, available test video, and a gallery request held longer than three seconds. The solid-color WebM fixture is test-only and is excluded from the website build.

## Results and artifacts

| Verification | Final result |
| --- | --- |
| Development Playwright | 69/69 unique cases passing across 57 browser/viewport configurations |
| Production Playwright | 12/12 unique cases passing across six browser/viewport configurations |
| Production build | Passed |
| Application, Node/configuration, and audit TypeScript checks | Passed |
| ESLint | Passed; nine existing warnings |
| Visual review | All 15 hero/gallery/footer contact sheets covering 57 configurations inspected, plus selected complete-page, legal-route, and live-map captures |

The final passing cases cover all 14 gallery photos, responsive hero imagery and fallback, carousel timing/manual controls, translations and persistence, navigation, routes, booking destinations, overflow, browser errors, and local asset requests. Production media checks also decoded every one of the 42 responsive WebP variants. No additional runtime dependency was introduced.

Lighthouse 13.5.0 ran against the production preview with normal network access:

| Profile | Performance | Accessibility | Best practices | SEO | LCP | Total blocking time | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Mobile | 68 | 96 | 100 | 100 | 4.2 s | 450 ms | 0.023 |
| Desktop | 98 | 96 | 100 | 100 | 1.0 s | 50 ms | 0 |

Mobile Lighthouse identified render-blocking requests (estimated savings 1,570 ms), main-thread work (3.1 s), and unused JavaScript (about 64 KiB). Existing color contrast also reduces accessibility to 96. These findings remain; this audit does not claim flawless mobile performance or full accessibility conformance. Existing branding and animations were preserved, and no unrelated performance rewrite was started during finalization. Lighthouse results are individual lab measurements, rather than field performance guarantees.

Saved deliverables:

- [Combined executed test summary](artifacts/summary.html), with [machine-readable results](artifacts/summary.json).
- [Screenshot index](artifacts/screenshots.html) and [visual-review notes](artifacts/visual-review/notes.md).
- [Development Playwright HTML report](artifacts/html-report/index.html) and [production HTML report](artifacts/production/html-report/index.html).
- Lighthouse [mobile report](artifacts/lighthouse/mobile.report.html) and [desktop report](artifacts/lighthouse/desktop.report.html), with JSON alongside them.
- [Final build/lint/type-check status](artifacts/checks.json).

All generated evidence is under the ignored `testing/artifacts/` directory; the reusable configuration, tests, fixture, and documentation live in `testing/`. Setup and rerun commands are in [README.md](README.md).

Raw historical runs are retained. The combined summary uses the latest executed result per project/test; it does not alter earlier reports or hide their failures.

## Limits

- These are browser/device emulations, rather than physical-device certification. Firefox does not implement Playwright's `isMobile` mode; viewport, scale, user agent, and touch settings are retained with that flag disabled.
- The original hosted video is unavailable on localhost. The responsive photographic fallback is verified; valid video playback is tested with a small fixture in Chromium/Firefox. Windows WebKit codec support differs from native iOS Safari, so its safe fallback is verified without claiming native iPhone video certification.
- Booking destinations and click behavior are checked without submitting a real reservation. Google Fonts and Maps are tested with normal network access; external services remain outside the repository's control.
- Full-page screenshots cannot freeze every scroll-driven animation at its active viewport position. Intentional parallax, clipped decorative imagery/tickers, and fading step animations are preserved; viewport captures and geometry checks accompany the full-page images.
- A Firefox cross-origin Google Maps frame check timed out during the concurrent layout run and passed unchanged on an isolated rerun. The raw failure and successful rerun are retained. Off-screen iframe painting can also be blank in full-page captures; a dedicated mobile viewport capture verifies the actual map and loaded tiles.
