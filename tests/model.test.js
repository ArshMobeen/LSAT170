import test from "node:test";
import assert from "node:assert/strict";
import { countdown, totals, dayKey } from "../src/model.js";
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
