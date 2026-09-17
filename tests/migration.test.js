import test from "node:test";
import assert from "node:assert/strict";
import { migrateData, initialState } from "../src/model.js";
import { motivations, personalNotes } from "../src/content.js";
test("v1 backups keep logs and journals while adding v2 defaults", () => {
  const old = {
    logs: [{ date: "2026-09-17", minutes: 90, type: "focused", id: "old" }],
    journals: {
      "2026-09-17": { reflection: "Keep my writing", tomorrow: "Review" },
    },
    scores: [{ score: 145, date: "2026-09-17" }],
    pins: [],
    goal: 4,
    exam: "2026-11-14T08:00",
  };
  const next = migrateData(old);
  assert.deepEqual(next.logs, old.logs);
  assert.deepEqual(next.journals, old.journals);
  assert.equal(next.preferences.tone, "gentle");
  assert.deepEqual(next.reviews, []);
  assert.deepEqual(next.plans, {});
});
test("v2 backup round trip preserves plans, reviews, notes, favorites and preferences", () => {
  const state = {
    ...initialState,
    plans: { "2026-09-17": { level: "stretch", task: "Review", done: true } },
    reviews: [
      {
        id: "r",
        date: "2026-09-17",
        type: "LR",
        reference: "PT 1",
        mistake: "Assumption",
        lesson: "Find the gap",
        next: "2026-09-20",
        mastered: true,
      },
    ],
    notes: [{ id: "n", title: "Kuri", text: "You got this", sign: "Me" }],
    favorites: ["quote-0"],
    preferences: {
      tone: "tough",
      showCountdown: false,
      family: false,
      reducedMotion: true,
    },
    resetSettings: {
      color: "Burgundy",
      width: 8,
      resistance: 30,
      intensity: 20,
      sound: false,
      flowPalette: "Ocean",
    },
  };
  assert.deepEqual(migrateData(JSON.parse(JSON.stringify(state))), state);
});
test("malformed backups are rejected before replacing current data", () => {
  for (const patch of [
    { logs: [{ minutes: -3, type: "focused" }] },
    { journals: { x: { reflection: { bad: true } } } },
    { preferences: { tone: "invalid" } },
    { reviews: [{ id: "bad" }] },
    { resetSettings: { color: "bad" } },
    { resetSettings: { flowPalette: "bad" } },
    { plans: { today: { level: "bad", task: "x", done: false } } },
  ])
    assert.throws(() => migrateData({ ...initialState, ...patch }));
});
test("motivation and personal notes use unique stable ids", () => {
  assert.equal(new Set(motivations.map((q) => q.id)).size, motivations.length);
  for (const t of ["gentle", "tough", "practical"])
    assert.ok(motivations.some((q) => q.tone === t));
  assert.equal(
    new Set(personalNotes.map((q) => q.id)).size,
    personalNotes.length,
  );
});
