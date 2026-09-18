import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { studyTimeline } from "./model";

const dateLabel = (key, options = { month: "short", day: "numeric" }) =>
  new Date(`${key}T12:00:00`).toLocaleDateString(undefined, options);
const durationLabel = (minutes) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`
    : `${minutes}m`;

const zoomLevels = [
  { days: 2, label: "2 days" },
  { days: 5, label: "5 days" },
  { days: 7, label: "1 week" },
  { days: 14, label: "2 weeks" },
  { days: 31, label: "1 month" },
  { days: 90, label: "3 months" },
];

const metricsFor = (visibleDays, width) => {
  const gap = visibleDays <= 7 ? 8 : visibleDays <= 31 ? 5 : 1;
  const dayWidth = Math.max(
    2.2,
    (Math.max(width, 320) - gap * (visibleDays - 1)) / visibleDays,
  );
  return { gap, dayWidth, step: gap + dayWidth };
};

const timelineLength = (logs) => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const oneYearAgo = new Date(today);
  oneYearAgo.setDate(oneYearAgo.getDate() - 364);
  let start = oneYearAgo;
  for (const log of logs) {
    const date = new Date(`${log.date}T12:00:00`);
    if (Number.isFinite(date.getTime()) && date < start) start = date;
  }
  return Math.min(
    1826,
    Math.max(365, Math.round((today - start) / 86400000) + 1),
  );
};

const windowLabel = (start, end) => {
  if (!start || !end) return "";
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();
  const startText = startDate.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
  const endText = sameMonth
    ? `${endDate.getDate()}, ${endDate.getFullYear()}`
    : endDate.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  return `${startText} to ${endText}`;
};

function ConfirmDelete({ label, onDelete }) {
  const [armed, setArmed] = useState(false);
  if (armed)
    return (
      <span className="delete-confirm">
        <button aria-label={`Confirm ${label}`} onClick={onDelete}>
          <Check size={14} /> Delete
        </button>
        <button aria-label={`Cancel ${label}`} onClick={() => setArmed(false)}>
          <X size={14} />
        </button>
      </span>
    );
  return (
    <button
      className="row-delete"
      aria-label={label}
      onClick={() => setArmed(true)}
    >
      <Trash2 size={15} />
    </button>
  );
}

export function StudyHistory({ logs, onDelete }) {
  const historyDays = useMemo(() => timelineLength(logs), [logs]);
  const days = useMemo(
    () => studyTimeline(logs, historyDays),
    [logs, historyDays],
  );
  const scrollRef = useRef(null);
  const positioned = useRef(false);
  const pendingCenter = useRef(null);
  const [visibleDays, setVisibleDays] = useState(14);
  const [chartWidth, setChartWidth] = useState(800);
  const [viewport, setViewport] = useState(() => ({
    start: Math.max(0, historyDays - 14),
    end: historyDays - 1,
  }));
  const [active, setActive] = useState(null);
  const { gap, dayWidth, step } = useMemo(
    () => metricsFor(visibleDays, chartWidth),
    [visibleDays, chartWidth],
  );
  const selected = active ? days.find((day) => day.date === active) : null;
  const visibleSlice = days.slice(viewport.start, viewport.end + 1);
  const max = Math.max(
    60,
    ...visibleSlice.map((day) => day.focused + day.unfocused),
  );

  const syncViewport = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const start = Math.max(
      0,
      Math.min(days.length - 1, Math.floor((element.scrollLeft + 0.5) / step)),
    );
    const end = Math.min(days.length - 1, start + visibleDays - 1);
    setViewport((current) =>
      current.start === start && current.end === end ? current : { start, end },
    );
  }, [days.length, step, visibleDays]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(() => {
      setChartWidth(element.clientWidth);
      requestAnimationFrame(syncViewport);
    });
    observer.observe(element);
    setChartWidth(element.clientWidth);
    return () => observer.disconnect();
  }, [syncViewport]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || positioned.current || !chartWidth) return;
    positioned.current = true;
    requestAnimationFrame(() => {
      element.scrollLeft = element.scrollWidth - element.clientWidth;
      syncViewport();
    });
  }, [chartWidth, days.length, syncViewport]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || pendingCenter.current === null) return;
    const center = pendingCenter.current;
    pendingCenter.current = null;
    const previousBehavior = element.style.scrollBehavior;
    element.style.scrollBehavior = "auto";
    element.scrollLeft = Math.max(
      0,
      center * step - element.clientWidth / 2 + dayWidth / 2,
    );
    requestAnimationFrame(() => {
      element.style.scrollBehavior = previousBehavior;
      syncViewport();
    });
  }, [dayWidth, step, syncViewport, visibleDays]);

  const changeZoom = (nextDays, anchorIndex) => {
    const element = scrollRef.current;
    if (!element) return;
    const center =
      anchorIndex ??
      Math.max(
        0,
        Math.min(
          days.length - 1,
          Math.round((element.scrollLeft + element.clientWidth / 2) / step),
        ),
      );
    pendingCenter.current = center;
    setVisibleDays(nextDays);
    setActive(null);
  };

  const zoomIndex = zoomLevels.findIndex((level) => level.days === visibleDays);
  const shiftWindow = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * chartWidth * 0.84,
      behavior: "smooth",
    });
  };
  const jumpToToday = () => {
    const element = scrollRef.current;
    element?.scrollTo({
      left: element.scrollWidth - element.clientWidth,
      behavior: "smooth",
    });
  };
  const jumpToLastMonth = () => {
    const date = new Date();
    const first = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const last = new Date(date.getFullYear(), date.getMonth(), 0);
    const firstKey = [
      first.getFullYear(),
      String(first.getMonth() + 1).padStart(2, "0"),
      "01",
    ].join("-");
    const lastKey = [
      last.getFullYear(),
      String(last.getMonth() + 1).padStart(2, "0"),
      String(last.getDate()).padStart(2, "0"),
    ].join("-");
    const firstIndex = Math.max(
      0,
      days.findIndex((day) => day.date === firstKey),
    );
    const lastIndex = days.findIndex((day) => day.date === lastKey);
    const center = Math.round(
      (firstIndex + Math.max(firstIndex, lastIndex)) / 2,
    );
    changeZoom(31, center);
  };

  const sorted = logs
    .map((log, index) => ({ ...log, sourceIndex: index }))
    .sort((a, b) =>
      (b.createdAt || `${b.date}T23:59:59`).localeCompare(
        a.createdAt || `${a.date}T23:59:59`,
      ),
    );
  return (
    <section className="study-history panel">
      <div className="section-top study-history-heading">
        <div>
          <span className="eyebrow">TIME, MADE VISIBLE</span>
          <h3>Your study rhythm</h3>
        </div>
        <div className="timeline-presets">
          <button onClick={jumpToLastMonth}>
            <CalendarDays size={14} /> Last month
          </button>
          <button onClick={jumpToToday}>Today</button>
        </div>
      </div>
      <div className="timeline-toolbar">
        <div className="timeline-navigation">
          <button aria-label="Earlier dates" onClick={() => shiftWindow(-1)}>
            <ChevronLeft size={16} />
          </button>
          <strong aria-live="polite">
            {windowLabel(days[viewport.start]?.date, days[viewport.end]?.date)}
          </strong>
          <button aria-label="Later dates" onClick={() => shiftWindow(1)}>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="timeline-zoom">
          <button
            aria-label="Zoom in to fewer days"
            disabled={zoomIndex === 0}
            onClick={() => changeZoom(zoomLevels[zoomIndex - 1].days)}
          >
            <Plus size={14} />
          </button>
          <label>
            <span>View</span>
            <select
              aria-label="Days visible"
              value={visibleDays}
              onChange={(event) => changeZoom(Number(event.target.value))}
            >
              {zoomLevels.map((level) => (
                <option key={level.days} value={level.days}>
                  {level.label}
                </option>
              ))}
            </select>
          </label>
          <button
            aria-label="Zoom out to more days"
            disabled={zoomIndex === zoomLevels.length - 1}
            onClick={() => changeZoom(zoomLevels[zoomIndex + 1].days)}
          >
            <Minus size={14} />
          </button>
        </div>
      </div>
      <div className="chart-legend" aria-hidden="true">
        <span>
          <i className="focused" /> Focused
        </span>
        <span>
          <i className="unfocused" /> Unfocused
        </span>
      </div>
      <div className="study-chart-shell">
        <div className="chart-scale" aria-hidden="true">
          <span>{durationLabel(max)}</span>
          <span>{durationLabel(Math.round(max / 2))}</span>
          <span>0</span>
        </div>
        <div
          className="study-chart-scroll"
          ref={scrollRef}
          onScroll={syncViewport}
          onPointerDown={() => setActive(null)}
          tabIndex="0"
          aria-label="Scrollable study time timeline"
        >
          <div
            className={`study-chart ${visibleDays >= 60 ? "dense" : ""}`}
            style={{
              "--day-width": `${dayWidth}px`,
              "--chart-gap": `${gap}px`,
            }}
            role="list"
            aria-label={`${historyDays} day study time chart`}
          >
            {days.map((day, index) => {
              const total = day.focused + day.unfocused;
              const startsMonth = day.date.endsWith("-01") || index === 0;
              return (
                <button
                  type="button"
                  role="listitem"
                  key={day.date}
                  className={`study-day ${active === day.date ? "active" : ""}`}
                  onMouseEnter={() => setActive(day.date)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(day.date)}
                  onBlur={() => setActive(null)}
                  aria-label={`${dateLabel(day.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}: ${day.focused} focused minutes and ${day.unfocused} unfocused minutes`}
                >
                  {startsMonth && (
                    <span className="month-marker" aria-hidden="true">
                      {dateLabel(day.date, { month: "short", year: "numeric" })}
                    </span>
                  )}
                  <span className="bar-pair" aria-hidden="true">
                    <i
                      className="bar focused"
                      style={{
                        height: `${Math.max(day.focused ? 5 : 0, (day.focused / max) * 100)}%`,
                      }}
                    />
                    <i
                      className="bar unfocused"
                      style={{
                        height: `${Math.max(day.unfocused ? 5 : 0, (day.unfocused / max) * 100)}%`,
                      }}
                    />
                  </span>
                  <small>
                    {visibleDays <= 14 ||
                    (visibleDays <= 31 && index % 5 === 0) ||
                    (visibleDays > 31 && index % 15 === 0)
                      ? dateLabel(day.date, { day: "numeric" })
                      : ""}
                  </small>
                  {total > 0 && (
                    <span className="sr-only">
                      {durationLabel(total)} total
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {selected && (
          <div className="chart-tooltip" role="status">
            <b>
              {dateLabel(selected.date, {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </b>
            <p>
              <span>Focused</span>
              {durationLabel(selected.focused)}
            </p>
            <p>
              <span>Unfocused</span>
              {durationLabel(selected.unfocused)}
            </p>
            {selected.entries.length ? (
              <ul>
                {selected.entries.slice(0, 4).map((entry, index) => (
                  <li key={entry.id || index}>
                    {entry.note ||
                      (entry.type === "focused"
                        ? "Focused study"
                        : "Unfocused time")}
                  </li>
                ))}
              </ul>
            ) : (
              <small>No time logged.</small>
            )}
          </div>
        )}
      </div>
      <div className="session-table-wrap">
        <table className="session-table">
          <caption>Your logged sessions</caption>
          <thead>
            <tr>
              <th>Date</th>
              <th>Logged at</th>
              <th>Type</th>
              <th>Time</th>
              <th>What you worked on</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {!sorted.length ? (
              <tr>
                <td colSpan="6" className="empty">
                  Your first session will appear here.
                </td>
              </tr>
            ) : (
              sorted.map((log) => (
                <tr key={log.id || log.sourceIndex}>
                  <td>
                    {dateLabel(log.date, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "Earlier entry"}
                  </td>
                  <td>
                    <span className={`type-pill ${log.type}`}>
                      {log.type === "focused" ? "Focused" : "Unfocused"}
                    </span>
                  </td>
                  <td>{durationLabel(log.minutes)}</td>
                  <td className="session-note">
                    {log.note || "No context added"}
                  </td>
                  <td>
                    <ConfirmDelete
                      label={`Delete ${log.type} session from ${dateLabel(log.date)}`}
                      onDelete={() => onDelete(log.sourceIndex)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ScoreJourney({ scores, onAdd, onDelete }) {
  return (
    <section className="panel score-journey">
      <div className="section-top">
        <h3>Your score journey</h3>
        <button className="secondary" onClick={onAdd}>
          Log practice score
        </button>
      </div>
      <div className="score-chart">
        {[{ score: 141, date: "Starting point", fixed: true }, ...scores].map(
          (score, index) => (
            <div
              className="score-column"
              key={score.id || `${score.date}-${index}`}
            >
              <b>{score.score}</b>
              <div style={{ height: `${40 + (score.score - 120) * 2}px` }} />
              <small>{score.date}</small>
            </div>
          ),
        )}
      </div>
      {!!scores.length && (
        <div className="score-records">
          {scores.map((score, index) => (
            <div className="score-record" key={score.id || index}>
              <span>
                <b>{score.score}</b>
                <small>
                  {dateLabel(score.date, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </small>
              </span>
              <ConfirmDelete
                label={`Delete score ${score.score} from ${dateLabel(score.date)}`}
                onDelete={() => onDelete(index)}
              />
            </div>
          ))}
        </div>
      )}
      <p className="muted">
        Progress is information. Keep the lesson from every practice test.
      </p>
    </section>
  );
}
