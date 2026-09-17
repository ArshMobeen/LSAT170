# First iteration verification

## Iteration 2

- Production build passes with the new experience, Reset Room, content, and preference modules.
- Seven tests pass, including version-1 migration, version-2 backup round trips, malformed backup rejection, content IDs, and the original countdown/date/study-total checks.
- Dependency installation audit reports zero vulnerabilities.
- Browser checks: spring ink draws visible strokes; water action produces expanding ripples; crumple removes the writing surface and creates a physical paper ball; toss is keyboard-operable as well as draggable.
- Motivation tone changes update the welcome copy after reload. Saving a quote and enabling favorites filters the library to that quote.
- All starter messages are app copy, not attributed quotations or messages fetched from third-party services.

Native macOS execution and signing remain untested on this Windows host. The original release remains available separately.

- Production Vite build: passed.
- Node tests: 3 passed (countdown expiry and unit splitting, focused/unfocused date-filtered totals, local calendar date keys).
- Dependency audit after Electron update: zero vulnerabilities reported.
- Browser preview visually checked at a desktop viewport and a narrow viewport.
- Manual UI check: a 60-minute focused session produced 1.0 focused hours and one study day. The verification session was removed afterward.
- Manual UI check: tomorrow’s journal plan persisted after a full reload. Verification text was cleared afterward.
- Starter law library, Mercedes-Benz, fashion, and Porsche images loaded in the vision board.

macOS packaging and native macOS behavior have not been tested on this Windows host. The desktop app is unsigned. The browser preview uses the same production UI code, but is not a substitute for native installation testing.

## Iteration 2.1 verification

- Seven automated tests passed, including old-backup migration and flow-palette validation.
- Vite production build passed. Non-blocking dependency directive and chunk-size warnings remain.
- Browser checked: fourth Color flow mode rendered actual WebGL dye curls on black and reacted to a drag. Pause and clear controls exercised.
- Fullscreen Focus Room visually checked at full display size. Exit control worked. Background controls are inert while fullscreen is active.
- From Arsh navigation and letter signature verified. Source scan found no em dashes in src or index.html.
- No new browser console errors observed during the final check.
- Native macOS packaging and execution have not been tested on this Windows machine. Graphics fallback and PNG download need wider hardware coverage.

Windows portable 2.1.0 packaging completed successfully. Executable copied to release/Angels 170 2.1.0.exe. Native executable launch was not exercised in this final pass.

## Version 2.2.0
Nine automated tests passed and production renderer built. Focus recovery preserves a checkpoint and resumes paused. Mac ARM64/x64 DMG and ZIP configuration, an ad-hoc signing build script and manual GitHub macOS workflow added. Native Mac build and runtime verification are pending; no finished Mac installer is claimed.


Browser persistence verified: a running focus session reloaded at 40 seconds, paused; a completed 1-minute log survived another reload; the timer stayed reset after saving. Temporary verification log removed through the UI. Mac configuration passed electron-builder schema validation; workflow YAML parsed; build kit ZIP includes the workflow and build script.


## Version 2.2.1 Mac release

Custom 1024px navy/silver monogram app icon added, with native package and browser icon wiring.
GitHub run: https://github.com/ArshMobeen/LSAT170/actions/runs/35245529844
Source commit: cba507e274ec296b56cd8bdd3fb612bac3383b85
Both macos-15 ARM64 and macos-15-intel x64 passed unit tests, production builds, DMG/ZIP packaging, ad-hoc signature verification and native packaged-app persistence tests. The native test launches the actual packaged executable, records a study log and journal, starts a focus timer, closes the process and relaunches to check saved data and paused recovery.
Apple Developer signing/notarization is not configured. First-open approval may be required. Minimum macOS version is 13. Actual hardware-specific graphics performance and Gatekeeper behavior still require recipient-device confirmation.
