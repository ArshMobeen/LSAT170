# Angel’s 170

## Version 2.3.0

The progress screen now turns daily focused and unfocused study time into a paired bar chart with 14-day and 30-day views. Hover or keyboard-focus any day to see its totals and study context. A session table below shows the date, time logged, duration, focus type, and what was completed. Study sessions and practice scores have deliberate two-step delete controls for correcting mistakes.

The opening sequence now stages a custom, code-rendered luxury headlight illumination behind the welcome and countdown. All new records keep their local timestamps and continue to use the existing on-device storage and backup format.

## Iteration 2.1

The new edition adds an editorial photograph-led home, scroll-split imagery, reflective silver buttons, and tactile photo cards. New screens include Reset Room (spring ink, interactive water ripples, Matter.js crumple/toss paper, and colorful fluid painting on black), Words for You (24 original motivational passages, tone filters, search, favorites, optional family themes), and From Arsh (five personal notes plus custom notes).

The always-available “I’m stuck” button offers a two-minute restart with pause/resume and a choice to save/continue. Opening it pauses an active focus stopwatch to avoid double-counting. Today’s plan has minimum/standard/stretch intentions with an editable task and completion control. Journal pages now include free writing and dated reasoning-error reviews with revisit dates; due reviews surface when viewing that date or later.

Settings include motivation tone, countdown visibility, family themes, and calmer motion. Existing version-1 data and backups migrate automatically. Reset Room drawings and writing are ephemeral; only settings persist unless a drawing is explicitly downloaded.

Libraries actually used: Motion, metal-fx (MIT), Radix Dialog (MIT), Matter.js (MIT), React and Lucide. Additional research: Magic UI, Aceternity, Cult UI, React Bits and Skiper; no paid components were purchased or copied. Water is a ripple visualization rather than a fluid simulation. Pointer drawing/dragging is supported; water and paper also have keyboard-operable action buttons. System reduced-motion preference and the in-app calmer-motion preference are respected.

A personal LSAT study sanctuary for Angel Thukral. React, Motion, Lucide, Vite, and Electron; supports Windows and macOS.

## Run

```sh
npm install
npm run dev
```

For the desktop app: `npm run desktop`. To build a Windows portable executable: `npm run package:win`. To build a macOS DMG, run `npm run package:mac` **on a Mac** for Apple Silicon and Intel DMG/ZIP packages. Releases are unsigned; signing credentials are not included.

## Features

- Animated personalized welcome, three-pointed star and luxury headlight reveal, with skip and replay.
- Live countdown to November 14, 2026, defaulting to 8 AM device-local time. Set the actual appointment in Settings.
- Focus stopwatch, manual focused/unfocused logs, daily goal, paired history chart, contextual session table and study-day totals.
- Journals by date, tomorrow’s plan, wins, and practice score history.
- Editorial vision board, personal image uploads, original affirmations and study tips.
- Local storage, JSON export and validated restore. No account or cloud sync. Browser and Electron storage are separate; transfer via backup.

An unfinished focus timer checkpoints locally every second and on normal exit, then reopens paused. Finish & save adds it to the study log. External starter photos and Google Fonts require internet; system typography and gradient image backdrops remain available offline. User-uploaded images are stored locally. A 170 is an aspiration, not a promised outcome.

## Design references and image sources

Apple-inspired independent design, not an official Apple or Mercedes-Benz product. Apple’s SwiftUI UI components do not run on Windows, so the app uses original CSS glass surfaces, Motion animations and Lucide icons instead of claiming to embed native Apple components.

- [Apple Liquid Glass guidance](https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass)
- [Apple SwiftUI sample repository](https://github.com/apple-sample-code/SwiftUI-Tutorials)
- [Liquid Glass React library researched](https://github.com/rdev/liquid-glass-react) (not bundled; CSS blur gives a consistent fallback)
- Starter photography: Unsplash image URLs in `src/main.jsx`. This is a Pinterest-style board, not a live Pinterest feed. Upload saved inspiration from your own collection.

## Verify

`npm test` checks countdown boundaries, study totals, and local date keys. `npm run build` creates the production renderer.

Focus Room includes native fullscreen with a distraction-free fallback and keyboard exit. Color flow includes four palettes, adjustable spread/linger/energy, pause, clear and PNG export. Its original WebGL2 fluid renderer falls back to a lighter Canvas particle effect on unsupported devices.


## Mac build kit and persistent storage

See MAC-INSTALL.md for exact storage locations, transfer instructions, local Mac builds and the included GitHub Actions workflow. Native Apple Silicon and Intel installers are built and tested using GitHub Actions. Download the app from https://github.com/ArshMobeen/LSAT170/releases/latest. Requires macOS 13 or newer; see INSTALL-ON-MAC.txt for installation and first-open approval.


