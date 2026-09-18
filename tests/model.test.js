import test from "node:test";
import assert from "node:assert/strict";
import { countdown, totals, dayKey, studyTimeline } from "../src/model.js";
test("countdown splits days, hours, minutes, seconds and stops at zero", () => {
  assert.deepEqual(
    countdown("2026-11-14T13:00:00Z", Date.parse("2026-11-13T11:58:57Z")),
    [1, 1, 1, 3],
  );
  assert.deepEqual(
    countdown("2026-11-14T13:00:00Z", Date.parse("2026-11-15T00:00:00Z")),
    [0, 0, 0, 0],
  );
});
test("study totals separate focus types and filter by local date", () => {
  const logs = [
    { date: "2026-09-17", minutes: 60, type: "focused" },
    { date: "2026-09-17", minutes: 20, type: "unfocused" },
    { date: "2026-09-16", minutes: 35, type: "focused" },
  ];
  assert.deepEqual(totals(logs, "2026-09-17"), { focused: 60, unfocused: 20 });
  assert.deepEqual(totals(logs), { focused: 95, unfocused: 20 });
  assert.deepEqual(totals([]), { focused: 0, unfocused: 0 });
});
test("journal date keys use local calendar dates", () =>
  assert.equal(dayKey(new Date(2026, 8, 17, 23, 30)), "2026-09-17"));
test("study timeline fills missing days and splits focused from unfocused time", () => {
  const logs = [
    { date: "2026-09-17", minutes: 50, type: "focused", note: "LR" },
    { date: "2026-09-17", minutes: 10, type: "unfocused", note: "Break" },
    { date: "2026-09-15", minutes: 20, type: "focused", note: "RC" },
  ];
  const timeline = studyTimeline(logs, 3, new Date(2026, 8, 17, 12));
  assert.deepEqual(
    timeline.map(({ date, focused, unfocused }) => ({
      date,
      focused,
      unfocused,
    })),
    [
      { date: "2026-09-15", focused: 20, unfocused: 0 },
      { date: "2026-09-16", focused: 0, unfocused: 0 },
      { date: "2026-09-17", focused: 50, unfocused: 10 },
    ],
  );
  assert.equal(timeline[2].entries[0].note, "LR");
});
