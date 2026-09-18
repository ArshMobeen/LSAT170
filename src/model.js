export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function countdown(target, now = Date.now()) {
  const s = Math.max(0, Math.floor((new Date(target).getTime() - now) / 1000));
  return [
    Math.floor(s / 86400),
    Math.floor(s / 3600) % 24,
    Math.floor(s / 60) % 60,
    s % 60,
  ];
}
export function totals(logs, date) {
  return logs
    .filter((l) => !date || l.date === date)
    .reduce((a, l) => ({ ...a, [l.type]: a[l.type] + l.minutes }), {
      focused: 0,
      unfocused: 0,
    });
}
export function studyTimeline(logs, days = 14, end = new Date()) {
  const byDate = new Map();
  for (const log of logs) {
    const item = byDate.get(log.date) || {
      focused: 0,
      unfocused: 0,
      entries: [],
    };
    item[log.type] += log.minutes;
    item.entries.push(log);
    byDate.set(log.date, item);
  }
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(
      end.getFullYear(),
      end.getMonth(),
      end.getDate() - (days - 1 - index),
    );
    const key = dayKey(date);
    return {
      date: key,
      focused: 0,
      unfocused: 0,
      entries: [],
      ...byDate.get(key),
    };
  });
}
export const initialState = {
  logs: [],
  journals: {},
  scores: [],
  pins: [],
  exam: "2026-11-14T08:00",
  goal: 4,
  plans: {},
  reviews: [],
  notes: [],
  favorites: [],
  preferences: {
    tone: "gentle",
    showCountdown: true,
    family: true,
    reducedMotion: false,
  },
  resetSettings: {},
};
export function migrateData(value) {
  const d = {
    ...initialState,
    ...value,
    preferences: { ...initialState.preferences, ...value?.preferences },
  };
  for (const key of ["logs", "scores", "pins", "reviews", "notes", "favorites"])
    if (!Array.isArray(d[key])) throw Error("Invalid collection");
  for (const key of ["journals", "plans", "resetSettings"])
    if (!d[key] || typeof d[key] !== "object" || Array.isArray(d[key]))
      throw Error("Invalid object");
  if (
    !Number.isFinite(new Date(d.exam).getTime()) ||
    !Number.isFinite(d.goal) ||
    d.goal < 0.5 ||
    d.goal > 16
  )
    throw Error("Invalid settings");
  if (
    d.logs.some(
      (l) =>
        !l ||
        !["focused", "unfocused"].includes(l.type) ||
        !Number.isFinite(l.minutes) ||
        l.minutes < 1 ||
        l.minutes > 1440 ||
        typeof l.date !== "string" ||
        (l.id !== undefined && typeof l.id !== "string") ||
        (l.note !== undefined && typeof l.note !== "string") ||
        (l.createdAt !== undefined &&
          !Number.isFinite(new Date(l.createdAt).getTime())),
    )
  )
    throw Error("Invalid logs");
  if (
    d.scores.some(
      (s) =>
        !s ||
        !Number.isInteger(s.score) ||
        s.score < 120 ||
        s.score > 180 ||
        typeof s.date !== "string" ||
        (s.id !== undefined && typeof s.id !== "string") ||
        (s.createdAt !== undefined &&
          !Number.isFinite(new Date(s.createdAt).getTime())),
    )
  )
    throw Error("Invalid scores");
  if (
    d.pins.some(
      (p) =>
        !p ||
        typeof p.title !== "string" ||
        typeof p.image !== "string" ||
        !/^data:image\/(png|jpeg|webp);base64,/.test(p.image),
    )
  )
    throw Error("Invalid images");
  if (
    Object.values(d.journals).some(
      (j) =>
        !j ||
        typeof j !== "object" ||
        Array.isArray(j) ||
        Object.values(j).some((v) => typeof v !== "string"),
    )
  )
    throw Error("Invalid journal");
  if (
    d.notes.some(
      (n) =>
        !n ||
        typeof n.id !== "string" ||
        typeof n.title !== "string" ||
        typeof n.text !== "string",
    )
  )
    throw Error("Invalid notes");
  if (
    d.reviews.some(
      (r) =>
        !r ||
        ["id", "date", "type", "reference", "mistake", "lesson", "next"].some(
          (k) => typeof r[k] !== "string",
        ),
    )
  )
    throw Error("Invalid reviews");
  if (
    Object.values(d.plans).some(
      (p) =>
        !p ||
        !["minimum", "standard", "stretch"].includes(p.level) ||
        typeof p.task !== "string" ||
        typeof p.done !== "boolean",
    )
  )
    throw Error("Invalid plans");
  if (!["gentle", "tough", "practical"].includes(d.preferences.tone))
    throw Error("Invalid tone");
  for (const k of ["showCountdown", "family", "reducedMotion"])
    if (typeof d.preferences[k] !== "boolean")
      throw Error("Invalid preference");
  if (d.favorites.some((id) => typeof id !== "string"))
    throw Error("Invalid favorites");
  const r = d.resetSettings;
  for (const [k, min, max] of [
    ["width", 1, 18],
    ["resistance", 0, 100],
    ["intensity", 0, 100],
  ])
    if (
      r[k] !== undefined &&
      (!Number.isFinite(r[k]) || r[k] < min || r[k] > max)
    )
      throw Error("Invalid reset setting");
  if (
    r.color !== undefined &&
    !["Pearl", "Burgundy", "Gold", "Blue"].includes(r.color)
  )
    throw Error("Invalid palette");
  if (r.sound !== undefined && typeof r.sound !== "boolean")
    throw Error("Invalid sound");
  if (
    r.flowPalette !== undefined &&
    !["Aurora", "Ocean", "Ember", "Pearl"].includes(r.flowPalette)
  )
    throw Error("Invalid flow palette");
  return d;
}
