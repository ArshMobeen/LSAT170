import test from "node:test";
import assert from "node:assert/strict";
import { recoverFocus, focusCheckpoint } from "../src/focus-storage.js";

test("focus checkpoint preserves study time without counting time after closing", () => {
  const saved = focusCheckpoint(60, true, 1000, "Review assumptions", 65000);
  assert.equal(saved.seconds, 124);
  assert.deepEqual(recoverFocus(JSON.parse(JSON.stringify(saved))), saved);
  assert.equal(
    focusCheckpoint(saved.seconds, false, null, saved.intention, 99999999)
      .seconds,
    124,
  );
});
test("paused, finished and malformed timers recover safely", () => {
  assert.equal(
    focusCheckpoint(0, false, 1000, "Next question", 99999).seconds,
    0,
  );
  assert.equal(recoverFocus({ seconds: -1 }).seconds, 0);
  assert.equal(recoverFocus({ seconds: Infinity }).seconds, 0);
  assert.equal(recoverFocus(null).intention, "One question at a time.");
});
