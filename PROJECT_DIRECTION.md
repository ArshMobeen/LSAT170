# Project direction

## User preferences recorded September 17, 2026

- Windows and macOS desktop app for Angel Thukral, targeting LSAT preparation and a 170 aspiration.
- Retain the navy palette; refine it with ink blue, pearl/ivory, restrained silver, espresso brown, and dark burgundy.
- Elegant, distinctive, real photography, editorial composition, and custom component treatments. Avoid the appearance of a generic template or uniform card grid.
- Scroll should reveal and transform imagery, including images opening apart. Interactions should feel tactile through inertia, damping, spring response, and carefully choreographed transitions.
- A dedicated place to let off steam through satisfying digital scribbling and physical interactions, with adjustable settings, is explicitly requested.
- First propose additions and changes, then ask the user what to retain/remove before implementing the visual overhaul.
- Keep these preferences in project files for future work; do not claim memory beyond this project.

## Iteration 2 — approved September 17, 2026

The user approved Reset Room (all three modes), Start Small, flexible daily plans, motivation preferences expanded into a scrollable quote library, learning reviews integrated into the existing journal, and personal notes. Add free writing at the top of the journal. The separate evidence-of-progress collection was not selected. Proceed with the approved visual overhaul following a quick component-library search.

The library should offer direct tough-love language, family-inspired motivation, encouragement, and practical next steps. Keep tone selectable; the user specifically requested parental-effort themes. Personal notes should retain the user's affectionate, informal voice: “My lawyer kuri,” future parking tickets, “lock in you got this mf,” and reminders that she is strong and smart.

## Product approach

Help the learner restart and recognize concrete progress. Avoid guilt-based messaging, punitive missed-day counters, or treating a score as a measure of personal worth. Let the learner choose motivational tone and whether the countdown is prominent.

1. Reset Room: springy ink ribbons, liquid ripples, and optional crumple/toss interactions; adjustable drag/smoothing, ink width, palette, sound, and motion intensity. Ephemeral by default. Optional transition to a small next study action.
2. Start Small: a two-minute entry point, one achievable action, then a choice to continue or stop.
3. Evidence of Progress: saved wins, reviewed mistakes, completed sessions, and practice trends rather than slogans alone.
4. Flexible daily plan: minimum/standard/stretch intentions; a missed day starts fresh rather than creating study debt.
5. Supportive notes: user-provided messages available by choice, with no automatic sharing or surveillance.
6. Motivation preferences: ambitious/gentle/practical wording and optional countdown visibility; retain the user's 170 affirmation as a selectable tone.
7. Learning review: question type, reasoning error, correction in her own words, and a next review date.

## Proposed visual choreography

- Opening: real photographic composition parts like a pair of panels; a restrained silver star catches light; personalized welcome resolves into a living countdown. Skippable and reduced-motion compatible.
- Overview: asymmetrical editorial layout, a clear next action, dimensional typography, fewer boxed statistics.
- Vision board: large photographs with layered depth, scroll expansion, mask reveals, and draggable photo objects that settle naturally.
- Journal: ivory paper against navy, tactile page transitions, stable writing areas.
- Focus: quiet, minimally animated study surface; a spring transition to a compact timer in navigation.
- Reset Room: expressive physics isolated from the focused study experience.
- Use a coherent motion vocabulary across components; do not make every element compete for attention. No mandatory long intro or forced scroll sequence for routine logging.

## References researched

- https://skiper-ui.com/ — includes both free and premium components.
- https://skiper-ui.com/docs/quick-start — documents `npx shadcn add @skiper-ui/skiper40`; inspect the actual component before choosing its role.
- https://ui.shadcn.com/docs/directory — registry/component foundation, customized to the visual direction.
- https://libraries.dev/metal — `metal-fx`, silver/chromatic/gold presets and WebGL2 effects with a plain-child fallback.
- https://www.reactbits.dev/get-started/index — candidate scroll expansion, image reveal, and ribbon effects; select sparingly.
- https://motion.dev/docs/react-scroll-animations — scroll-linked transforms and spring smoothing.
- https://motion.dev/docs/animate — spring mass, stiffness, damping, and inertia.
- https://brm.io/matter-js/ — optional rigid-body physics for draggable/tossable objects.
- https://www.youtube.com/watch?v=Jhx7n9uAKHg — user reference; web retrieval failed. Video contents have NOT been reviewed. Request the relevant timestamp or description if needed.

The user supplied two concatenated URLs; interpreted them as https://skiper-ui.com/ and https://libraries.dev/metal.

## Additional library search and implementation choices

Researched Magic UI (https://magicui.design/docs/components), Aceternity UI (https://ui.aceternity.com/explore), Cult UI (https://www.cult-ui.com/docs), and React Bits. These were references, not copied or bundled components.

Actual iteration-2 dependencies: Motion for choreography/springs; metal-fx 2 for silver reflections; Radix Dialog for modal keyboard/focus behavior; Matter.js for crumpled-paper collisions and throws. Custom Canvas rendering implements spring ink and ripple visualization. No paid components were acquired. Water mode is a ripple visualization, not a fluid-dynamics simulation.

## Iteration 2.1, approved September 17, 2026

Four Reset Room modes now include Color flow: black canvas, cursor-following dye, fluid curls, click/drag painting, adjustable spread/linger/energy, four palettes, pause, clear and PNG export. Use a lighter particle fallback if WebGL2 float rendering is unavailable. Focus Room must support fullscreen with an accessible exit. Personal letters are titled From Arsh and signed Arsh. Keep navigation elegant, grouped and responsive, with a moving active indicator. Remove unnecessary descriptive annotations. Do not use em dashes in user-facing text. These refinements are approved; preserve existing study data.

## Iteration 2.3, approved September 18, 2026

Progress includes a focused versus unfocused daily bar chart with hover and keyboard details, context notes, exact logging time for new entries, and a complete session table. Time and practice-score records have guarded deletion controls. The opening adds an original luxury-car headlight illumination sequence behind the welcome and countdown. All saved study records remain device-local and persist across restart and power-off. Existing backups and older records remain compatible.

## Iteration 2.4, approved September 18, 2026

The study chart is a horizontally scrollable history spanning at least one year, with 2-day, 5-day, weekly, two-week, monthly and three-month zoom levels. Include earlier/later navigation, Last month and Today jumps, month markers, visible-date feedback, hover details and keyboard access. The user supplied https://www.youtube.com/watch?v=ZY6OTqnEZUg as an intro reference and specified the sequence around 0:43. That frame was inspected: a close black-glass lamp, sharp white perimeter signature and internal digital projectors. Recreate the mood and staged illumination in original SVG/CSS with two headlights, pulses, opening shutters and sequential projector light. Do not show the car body or grille.

## Iteration 2.4.1, approved September 18, 2026

Restore the opening from commit `5f9e6f3`: the split library photograph and simple Mercedes-Benz inspired three-pointed star. Remove the digital-headlight scene and its animation code. Keep the complete scrollable and zoomable progress timeline from iteration 2.4.
