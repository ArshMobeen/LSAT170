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

Release publishing note: both native Mac jobs succeeded. The subsequent bulk upload job stalled and was cancelled after the verified artifacts were downloaded locally. Local artifact SHA-256 values matched GitHub: ARM64 efbfe84b286522d5e1bbaca13a571035bdbd1201bc4d6837b25d6bdcb558fdc6; x64 741fd0b9bb06afdce78d4d90f0bf5158688d887d5d3f25bd0934fc6da60ea1a8. Native DMGs were extracted unchanged. Publishing was retried directly; future workflows upload DMGs sequentially. Application ZIPs remain in Actions artifacts.

Public release: https://github.com/ArshMobeen/LSAT170/releases/tag/v2.2.1-mac-1 . Apple Silicon DMG published and server digest verified against the local file. Intel DMG is complete and verified locally at release/Angels-170-2.2.1-x64.dmg, but its public upload returned HTTP 500 and then timed out on retry. Release notes disclose that limitation. Both native Mac build/test jobs passed.

## Version 2.3.0

- Added a contiguous daily study timeline with focused and unfocused totals, including empty dates.
- Added accessible chart hover and keyboard details, a contextual session table, and guarded deletion for study logs and practice scores.
- Added a code-rendered luxury headlight illumination scene to the opening sequence with a reduced-motion state.
- Backup validation now accepts and validates optional record IDs and creation timestamps while retaining compatibility with older backups.
- Ten model and migration tests pass. Production renderer build passes.
- The packaged desktop smoke test checks the headlight scene, persisted chart/table data after a full process restart, two-step score and session deletion, journal persistence, and paused timer recovery.

## Version 2.4.0

- Added a one-year-or-longer scrollable daily timeline with 2-day, 5-day, weekly, two-week, monthly and three-month zoom levels.
- Added earlier/later paging, Last month and Today jumps, month markers and live visible-date feedback while preserving hover and keyboard details.
- Replaced the vehicle-front intro with two original close-up digital headlights. The animation includes light pulses, opening projector shutters, perimeter tracing and sequential pixels, plus a static reduced-motion state.
- Expanded release automation to build and test Windows x64 alongside Mac ARM64 and Mac x64, then publish all three installers in one release.
- Ten automated tests and the Vite production build pass. The isolated Electron smoke test passes against source and the packaged Windows payload, including chart zoom, restart persistence and guarded deletion.
- Browser checks covered 2-day and 3-month zoom, month markers, date-preserving zoom and the completed headlight composition. No browser runtime errors were observed.
- Local Windows portable: `release/Angels-170-2.4.0-Windows-x64.exe`, SHA-256 `8D048A1886C04CA5B7BCE929CCC6216EF1ADBE5316CED8692F2D08103B8F988C`.
