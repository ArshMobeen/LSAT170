import React, { useMemo, useState } from "react";
import { Clock, Trash2, Check, X } from "lucide-react";
import { studyTimeline } from "./model";

const dateLabel = (key, options = { month: "short", day: "numeric" }) =>
  new Date(`${key}T12:00:00`).toLocaleDateString(undefined, options);
const durationLabel = (minutes) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}m` : ""}`
    : `${minutes}m`;

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
  const [range, setRange] = useState(14),
    [active, setActive] = useState(null);
  const days = useMemo(() => studyTimeline(logs, range), [logs, range]);
  const max = Math.max(60, ...days.map((day) => day.focused + day.unfocused));
  const selected = active === null ? null : days[active];
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
        <div className="range-picker" aria-label="Chart range">
          {[14, 30].map((value) => (
            <button
              key={value}
              className={range === value ? "active" : ""}
              aria-pressed={range === value}
              onClick={() => {
                setRange(value);
                setActive(null);
              }}
            >
              {value} days
            </button>
          ))}
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
          className="study-chart"
          style={{ "--chart-days": range }}
          role="list"
          aria-label={`${range} day study time chart`}
        >
          {days.map((day, index) => {
            const total = day.focused + day.unfocused;
            return (
              <button
                type="button"
                role="listitem"
                key={day.date}
                className={`study-day ${active === index ? "active" : ""}`}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                aria-label={`${dateLabel(day.date, { weekday: "long", month: "long", day: "numeric" })}: ${day.focused} focused minutes and ${day.unfocused} unfocused minutes`}
              >
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
                  {range === 14 || index % 3 === 0 || index === days.length - 1
                    ? dateLabel(day.date)
                    : ""}
                </small>
                {total > 0 && (
                  <span className="sr-only">{durationLabel(total)} total</span>
                )}
              </button>
            );
          })}
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
