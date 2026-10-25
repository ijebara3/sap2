# Responsive and functionality audit

Run from the project root:

```sh
npm install
npx playwright install chromium firefox webkit
npm run test:audit
npm run test:audit:review
npm run test:audit:report
```

In PowerShell environments that restrict script execution, use `npm.cmd` and
`npx.cmd` for the equivalent commands.

The configuration reuses `http://localhost:8080` or starts Vite there. Override
`AUDIT_BASE_URL` to check a production preview, and `AUDIT_ARTIFACTS` to retain a
separate run. For example, build and start Vite preview on port 4173, then set
`AUDIT_BASE_URL=http://localhost:4173` before running the tests.

`devices.ts` defines 19 configurations across Chromium, Firefox, and WebKit:
iPhone SE, iPhone 15, iPhone 15 Pro Max, Samsung Galaxy S24, Google Pixel 8,
iPad Mini, iPad Pro 11, and Samsung Galaxy Tab S9 in portrait and landscape,
plus desktop widths 1280, 1440, and 1920. Dimensions and browser metadata are
saved with each result. These are browser-emulated visible viewports, rather
than physical device certification. Firefox does not implement Playwright's
`isMobile` flag; its mobile runs retain the viewport, device scale, user agent,
and touch support, with that flag disabled.

Every configuration checks layouts, images, navigation, language persistence,
booking destinations, FAQ, features, and routes. Complete 14-photo gallery
interaction checks run on representative phone, tablet, and desktop sizes in
each engine. Native Chromium touch injection tests actual touch swiping;
Firefox/WebKit use pointer dragging because Playwright has no native swipe API
for those engines. Desktop media tests decode all 42 variants and inject slow,
missing, corrupt, and available video/image responses. The slow-image test holds
a photo longer than three seconds to ensure autoplay does not skip it. The small WebM fixture is a
generated solid-color test clip, and is never included in the website build.

Outputs are in `testing/artifacts/`:

- `html-report/index.html`: interactive Playwright report.
- `results.json`: machine-readable results.
- `screenshots/<browser-device-orientation>/`: full homepage and legal/404
  pages, plus hero, gallery, footer, and mobile menu captures.
- `evidence/`: geometry, requests, console errors, image URLs, and timing data.
- `results/`: failure screenshots and traces.
- `lighthouse/`: production mobile and desktop HTML/JSON audits.
- `visual-review/`: screenshot review sheets and notes.
- `summary.html` / `summary.json`: combined results when separate reruns are used.

Generated artifacts are intentionally ignored by Git but remain available
locally. Test sources and this documentation are versionable. The runtime site's
dependencies are unchanged; Playwright is a development dependency.

Lighthouse can be run separately using a local Chrome/Chromium installation:

```sh
npx lighthouse http://localhost:4173 --output=html --output=json --output-path=testing/artifacts/lighthouse/mobile --chrome-flags="--headless"
npx lighthouse http://localhost:4173 --preset=desktop --output=html --output=json --output-path=testing/artifacts/lighthouse/desktop --chrome-flags="--headless"
```

Performance audits use the production build and run sequentially without the
browser matrix competing for CPU. External Google Fonts/Maps availability and
the hosted video endpoint are recorded separately from application failures.

To combine retained runs without modifying their raw reports:

```sh
node testing/summarize.mjs testing/artifacts testing/artifacts/tablet-rerun testing/artifacts/production
```

The latest executed result for each project/test is used in the combined view;
earlier failures remain visible in the original HTML and JSON reports.
