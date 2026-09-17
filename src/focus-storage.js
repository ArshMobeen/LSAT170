export const FOCUS_KEY = "angel170-focus";
export function recoverFocus(value) {
  return {
    seconds:
      Number.isSafeInteger(value?.seconds) && value.seconds >= 0
        ? value.seconds
        : 0,
    intention:
      typeof value?.intention === "string"
        ? value.intention.slice(0, 100)
        : "One question at a time.",
  };
}
export function focusCheckpoint(
  elapsed,
  running,
  started,
  intention,
  now = Date.now(),
) {
  return recoverFocus({
    seconds:
      elapsed +
      (running && Number.isFinite(started)
        ? Math.max(0, Math.floor((now - started) / 1000))
        : 0),
    intention,
  });
}
