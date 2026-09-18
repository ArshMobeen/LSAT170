import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import {
  LayoutDashboard,
  Timer,
  BookOpen,
  Images,
  TrendingUp,
  Settings,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Play,
  Pause,
  Check,
  Flame,
  Target,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Download,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
import { dayKey, countdown, totals, initialState, migrateData } from "./model";
import ResetRoom from "./reset-room";
import FocusRoom from "./focus-room";
import { FOCUS_KEY, recoverFocus, focusCheckpoint } from "./focus-storage";
import { ScoreJourney, StudyHistory } from "./progress-view";
import { MotionPreference } from "./motion-preference";
import {
  Opening,
  EditorialHero,
  DailyPlan,
  StuckDialog,
  MotivationLibrary,
  NotesFromMe,
  JournalExtras,
  PreferenceControls,
  ScrollVision,
} from "./experience";
import "./styles.css";
import "./v2.css";
import "./refinements.css";
const nav = [
  ["Overview", LayoutDashboard],
  ["Focus room", Timer],
  ["Daily journal", BookOpen],
  ["My progress", TrendingUp],
  ["Reset room", Sparkles],
  ["Words for you", BookOpen],
  ["Vision board", Images],
  ["From Arsh", Heart],
];
const quotes = [
  "The life you’re imagining is built in the hours no one sees.",
  "One question. One lesson. One step closer.",
  "You don’t have to feel ready to begin.",
  "A difficult practice day is still a day of progress.",
];
const tips = [
  "After every missed question, explain why the right answer is right, and why your answer is wrong.",
  "Read for structure: identify the conclusion, the evidence, and the gap between them.",
  "Review untimed before checking the answer key. Give your reasoning room to grow.",
];
function Star({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      aria-label="Mercedes-Benz inspired three-pointed star"
    >
      <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="2" />
      <path d="M50 7L56 46L88 73L50 57L12 73L44 46Z" fill="currentColor" />
      <path d="M50 7V52L88 73M50 52L12 73" stroke="#0a1423" strokeWidth="1" />
    </svg>
  );
}
function App() {
  const [data, setData] = useState(() => {
    try {
      return migrateData(JSON.parse(localStorage.getItem("angel170") || "{}"));
    } catch {
      return initialState;
    }
  });
  const [page, setPage] = useState("Overview"),
    [intro, setIntro] = useState(true),
    [now, setNow] = useState(Date.now()),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [date, setDate] = useState(dayKey()),
    [quote, setQuote] = useState(0);
  const [stuck, setStuck] = useState(false);
  const [recoveredFocus] = useState(() => {
    try {
      return recoverFocus(
        JSON.parse(localStorage.getItem(FOCUS_KEY) || "null"),
      );
    } catch {
      return recoverFocus(null);
    }
  });
  const [intention, setIntention] = useState(recoveredFocus.intention);
  const [focusStorageError, setFocusStorageError] = useState(false);
  const [running, setRunning] = useState(false),
    [elapsed, setElapsed] = useState(recoveredFocus.seconds),
    [started, setStarted] = useState(null),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const save = () => {
      try {
        localStorage.setItem(
          FOCUS_KEY,
          JSON.stringify(focusCheckpoint(elapsed, running, started, intention)),
        );
        setFocusStorageError(false);
      } catch {
        setFocusStorageError(true);
      }
    };
    save();
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    return () => {
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
    };
  }, [elapsed, running, started, intention, now]);
  useEffect(() => {
    try {
      localStorage.setItem("angel170", JSON.stringify(data));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [data]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (intro) {
      const t = setTimeout(() => setIntro(false), 6500);
      return () => clearTimeout(t);
    }
  }, [intro]);
  useEffect(() => {
    if (!modal) return;
    const handler = (e) => {
      if (e.key === "Escape") setModal(null);
      if (e.key === "Tab") {
        const items = Array.from(
          document.querySelectorAll(
            ".modal button,.modal input,.modal select,.modal textarea",
          ),
        ).filter((el) => !el.disabled && el.offsetParent !== null);
        const first = items[0],
          last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modal]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const today = totals(data.logs, dayKey()),
    all = totals(data.logs),
    remaining = countdown(data.exam, now),
    seconds = elapsed + (running ? Math.floor((now - started) / 1000) : 0),
    currentScore = data.scores.at(-1)?.score || 141;
  const update = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const addLog = (log) => {
    setData((d) => ({
      ...d,
      logs: [
        ...d.logs,
        {
          ...log,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
    setToast("Session saved. Another promise kept.");
  };
  const toggleTimer = () => {
    if (running) {
      setElapsed(seconds);
      setRunning(false);
    } else {
      setStarted(Date.now());
      setNow(Date.now());
      setRunning(true);
    }
  };
  const finish = () => {
    if (seconds < 60) {
      setToast("Study for at least one minute before saving.");
      return;
    }
    addLog({
      date: dayKey(),
      minutes: Math.floor(seconds / 60),
      type: "focused",
      note: "Focus room session",
    });
    setRunning(false);
    setElapsed(0);
  };
  const openStuck = () => {
    if (running) {
      setElapsed(seconds);
      setRunning(false);
    }
    setStuck(true);
  };
  const exportData = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `angel-170-${dayKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Your backup is downloaded.");
  };
  return (
    <MotionPreference.Provider value={data.preferences.reducedMotion}>
      <MotionConfig
        reducedMotion={data.preferences.reducedMotion ? "always" : "user"}
      >
        <div className={data.preferences.reducedMotion ? "calm-motion" : ""}>
          <AnimatePresence>
            {intro && (
              <Opening
                remaining={remaining}
                prefs={data.preferences}
                onClose={() => setIntro(false)}
              />
            )}
          </AnimatePresence>
          <StuckDialog
            open={stuck}
            onOpenChange={setStuck}
            onReset={() => setPage("Reset room")}
            onJournal={() => setPage("Daily journal")}
            onSession={(keepGoing) => {
              addLog({
                date: dayKey(),
                minutes: 2,
                type: "focused",
                note: "A two-minute beginning",
              });
              if (keepGoing) {
                setPage("Focus room");
                if (!running) {
                  setStarted(Date.now());
                  setNow(Date.now());
                  setRunning(true);
                }
              }
            }}
          />
          <button className="stuck-trigger" onClick={openStuck}>
            <Sparkles size={16} /> I’m stuck <ArrowUpRight size={14} />
          </button>

          <div className="app-shell">
            <aside className="sidebar">
              <a
                className="brand"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage("Overview");
                }}
              >
                <span className="brand-mark">
                  a<span>✦</span>
                </span>
                <div>
                  angel’s 170
                  <small>A LITTLE EVERY DAY. A WHOLE NEW LIFE.</small>
                </div>
              </a>
              <nav className="chapter-nav" aria-label="Main navigation">
                {nav.map(([name, Icon], index) => (
                  <React.Fragment key={name}>
                    {(index === 0 || index === 4) && (
                      <div className="nav-group-title">
                        {index === 0 ? "Your practice" : "Your space"}
                      </div>
                    )}
                    <motion.button
                      aria-label={name}
                      aria-current={page === name ? "page" : undefined}
                      title={name}
                      className={page === name ? "active" : ""}
                      onClick={() => {
                        setPage(name);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.975 }}
                    >
                      {page === name && (
                        <motion.span
                          className="nav-active-surface"
                          layoutId="chapter-nav-pill"
                          transition={{
                            type: "spring",
                            stiffness: 340,
                            damping: 32,
                          }}
                        />
                      )}
                      <span className="nav-icon">
                        <Icon size={18} />
                      </span>
                      <span className="nav-title">{name}</span>
                      {page === name && (
                        <motion.span
                          className="nav-current-dot"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        />
                      )}
                    </motion.button>
                  </React.Fragment>
                ))}
              </nav>
              <div className="sidebar-mantra">
                <Sparkles size={19} />
                <p>
                  She believed she could.
                  <br />
                  <em>So she put in the work.</em>
                </p>
                <span>THIS IS YOUR SEASON, ANGEL.</span>
              </div>
              <button
                aria-label="Settings & backup"
                className={"settings " + (page === "Settings" ? "active" : "")}
                onClick={() => setPage("Settings")}
              >
                <Settings size={18} /> Settings & backup
              </button>
              <div className="profile">
                <div className="avatar">AT</div>
                <div>
                  Angel Thukral<small>Future attorney. Always her.</small>
                </div>
                <Heart size={15} />
              </div>
            </aside>
            <main>
              <header>
                <div className="breadcrumb">
                  My space <span>/</span> {page}
                </div>
                <div className="header-right">
                  <span className="live-dot" /> THE 170 ERA{" "}
                  <span className="header-date">
                    {new Date(now).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </header>
              {(storageError || focusStorageError) && (
                <div role="alert" className="error">
                  Storage is full or unavailable. Export a backup before closing
                  the app.
                </div>
              )}
              <motion.div
                key={page}
                className="page"
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 170, damping: 25 }}
              >
                <div className="page-heading">
                  <div>
                    <div className="eyebrow">
                      {page === "Overview"
                        ? "A NEW DAY. A LITTLE CLOSER."
                        : "YOUR DREAM DESERVES YOUR ATTENTION."}
                    </div>
                    <h1>
                      {page === "Overview" ? (
                        <>
                          Your future looks good, <em>Angel.</em>
                        </>
                      ) : page === "Focus room" ? (
                        "Make this hour yours."
                      ) : page === "Daily journal" ? (
                        "A little reflection. A lot of growth."
                      ) : page === "Vision board" ? (
                        "The life you’re working toward."
                      ) : page === "My progress" ? (
                        "Look how far you’re going."
                      ) : page === "Reset room" ? (
                        "Leave a little lighter."
                      ) : page === "Words for you" ? (
                        "The words you need, when you need them."
                      ) : page === "From Arsh" ? (
                        "Always in your corner."
                      ) : (
                        "Make yourself at home."
                      )}
                    </h1>
                    <p>
                      {page === "Overview"
                        ? "Show up for the woman you’re becoming. One focused hour at a time."
                        : page === "Vision board"
                          ? "Not just pretty pictures. A reminder of your why."
                          : "You’re building something beautiful, one day at a time."}
                    </p>
                  </div>
                  <button className="primary" onClick={() => setModal("log")}>
                    <Plus size={17} /> Log study time
                  </button>
                </div>
                {page === "Overview" && (
                  <>
                    <EditorialHero
                      remaining={remaining}
                      prefs={data.preferences}
                      onStart={openStuck}
                    />
                    <DailyPlan
                      plan={data.plans[dayKey()]}
                      onChange={(p) =>
                        setData((d) => ({
                          ...d,
                          plans: { ...d.plans, [dayKey()]: p },
                        }))
                      }
                      onFocus={() => setPage("Focus room")}
                    />
                    <section className="stats">
                      <Stat
                        icon={Clock}
                        label="Focused today"
                        value={
                          today.focused < 60
                            ? today.focused
                            : (today.focused / 60).toFixed(1)
                        }
                        unit={today.focused < 60 ? "min" : "hrs"}
                        sub="A little time invested in you."
                        progress={Math.min(
                          100,
                          (today.focused / (data.goal * 60)) * 100,
                        )}
                      />
                      <Stat
                        icon={Timer}
                        label="Unfocused today"
                        value={(today.unfocused / 60).toFixed(1)}
                        unit="hrs"
                        sub="Notice it. Reset. Begin again."
                      />
                      <Stat
                        icon={Flame}
                        label="Study days"
                        value={
                          new Set(
                            data.logs
                              .filter((l) => l.type === "focused")
                              .map((l) => l.date),
                          ).size
                        }
                        unit="days"
                        sub="Every day you show up counts."
                      />
                      <Stat
                        icon={Target}
                        label="The goal"
                        value="170"
                        unit={`/ ${currentScore} current`}
                        sub={`${Math.max(0, 170 - currentScore)} points of possibility`}
                        accent
                      />
                    </section>
                    <div className="dashboard-lower">
                      <section className="panel">
                        <div className="section-top">
                          <h3>
                            <BookOpen size={18} /> Your daily pages
                          </h3>
                          <button
                            className="text-button"
                            onClick={() => setPage("Daily journal")}
                          >
                            Open journal <ArrowUpRight size={15} />
                          </button>
                        </div>
                        <p className="muted">
                          Clear your mind. Give tomorrow a head start.
                        </p>
                        <label className="journal-label">
                          What did you work on today?
                        </label>
                        <textarea
                          value={data.journals[dayKey()]?.reflection || ""}
                          onChange={(e) =>
                            setData((d) => ({
                              ...d,
                              journals: {
                                ...d.journals,
                                [dayKey()]: {
                                  ...d.journals[dayKey()],
                                  reflection: e.target.value,
                                },
                              },
                            }))
                          }
                          placeholder="The questions, the breakthroughs, the little wins…"
                        />
                        <div className="saved">
                          <span className="live-dot" />{" "}
                          {storageError
                            ? "Not saved ,  export a backup"
                            : "Saved on this device as you write"}{" "}
                          <span>Be proud of the effort.</span>
                        </div>
                      </section>
                      <section className="quote-card">
                        <span className="eyebrow">
                          A NOTE TO YOUR FUTURE SELF
                        </span>
                        <span className="quote-mark">“</span>
                        <blockquote>{quotes[quote % quotes.length]}</blockquote>
                        <div className="quote-bottom">
                          <span>WITH LOVE, YOUR 170 ERA</span>
                          <button
                            aria-label="Next quote"
                            onClick={() =>
                              setQuote((quote + 1) % quotes.length)
                            }
                          >
                            <ArrowRight size={19} />
                          </button>
                        </div>
                      </section>
                    </div>
                    <section className="vision-preview">
                      <div className="section-top">
                        <h3>
                          Your vision, in view <span>KEEP YOUR WHY CLOSE.</span>
                        </h3>
                        <button
                          className="text-button"
                          onClick={() => setPage("Vision board")}
                        >
                          The whole vision <ArrowRight size={15} />
                        </button>
                      </div>
                      <Board preview pins={data.pins} />
                    </section>
                  </>
                )}
                {page === "Focus room" && (
                  <>
                    <FocusRoom
                      intention={intention}
                      onIntention={setIntention}
                      seconds={seconds}
                      running={running}
                      onToggle={toggleTimer}
                      onFinish={finish}
                    />
                    <section className="panel tips">
                      <h3>A thought to take into your next question</h3>
                      <p>{tips[quote % tips.length]}</p>
                      <button
                        className="text-button"
                        onClick={() => setQuote(quote + 1)}
                      >
                        Another study tip <ArrowRight size={16} />
                      </button>
                    </section>
                    <LogList
                      logs={data.logs}
                      remove={(id) =>
                        update(
                          "logs",
                          data.logs.filter((l) => l.id !== id),
                        )
                      }
                    />
                  </>
                )}
                {page === "Daily journal" && (
                  <section className="panel journal-full">
                    <div className="section-top">
                      <h3>A conversation with yourself.</h3>
                      <input
                        aria-label="Journal date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <JournalExtras
                      date={date}
                      journal={data.journals[date] || {}}
                      onJournal={(j) =>
                        setData((d) => ({
                          ...d,
                          journals: { ...d.journals, [date]: j },
                        }))
                      }
                      reviews={data.reviews}
                      onReviews={(r) => update("reviews", r)}
                    />
                    {[
                      [
                        "reflection",
                        "Today, I showed up by…",
                        "What did you study? What clicked? What felt difficult?",
                      ],
                      [
                        "tomorrow",
                        "Tomorrow, I’m making room for…",
                        "Choose a clear, achievable next step.",
                      ],
                      [
                        "win",
                        "One thing I’m proud of…",
                        "Small wins belong here, too.",
                      ],
                    ].map(([key, label, placeholder]) => (
                      <label className="journal-field" key={key}>
                        {label}
                        <textarea
                          placeholder={placeholder}
                          value={data.journals[date]?.[key] || ""}
                          onChange={(e) =>
                            setData((d) => ({
                              ...d,
                              journals: {
                                ...d.journals,
                                [date]: {
                                  ...d.journals[date],
                                  [key]: e.target.value,
                                },
                              },
                            }))
                          }
                        />
                      </label>
                    ))}
                    <div className="saved">
                      <Check size={15} />{" "}
                      {storageError
                        ? "Not saved ,  export a backup"
                        : "Saved automatically on this device"}
                    </div>
                  </section>
                )}
                {page === "Vision board" && (
                  <>
                    <div className="board-heading">
                      <span className="pill">ELEGANCE IS AN INTENTION.</span>
                      <button
                        className="secondary"
                        onClick={() => setModal("pin")}
                      >
                        <Plus size={16} /> Add inspiration
                      </button>
                    </div>
                    <ScrollVision>
                      <Board
                        pins={data.pins}
                        remove={(id) =>
                          update(
                            "pins",
                            data.pins.filter((p) => p.id !== id),
                          )
                        }
                      />
                    </ScrollVision>
                  </>
                )}
                {page === "My progress" && (
                  <>
                    <section className="stats">
                      <Stat
                        icon={TrendingUp}
                        label="Latest practice score"
                        value={currentScore}
                        sub="Your starting score was 141."
                      />
                      <Stat
                        icon={Clock}
                        label="Total focused"
                        value={(all.focused / 60).toFixed(1)}
                        unit="hrs"
                        sub="Time invested in yourself."
                      />
                      <Stat
                        icon={Timer}
                        label="Total unfocused"
                        value={(all.unfocused / 60).toFixed(1)}
                        unit="hrs"
                        sub="Awareness is progress."
                      />
                      <Stat
                        icon={Target}
                        label="Target score"
                        value="170"
                        sub="I will get a 170."
                      />
                    </section>
                    <ScoreJourney
                      scores={data.scores}
                      onAdd={() => setModal("score")}
                      onDelete={(index) => {
                        update(
                          "scores",
                          data.scores.filter(
                            (_, scoreIndex) => scoreIndex !== index,
                          ),
                        );
                        setToast("Practice score deleted.");
                      }}
                    />
                    <StudyHistory
                      logs={data.logs}
                      onDelete={(index) => {
                        update(
                          "logs",
                          data.logs.filter((_, logIndex) => logIndex !== index),
                        );
                        setToast("Study entry deleted.");
                      }}
                    />
                  </>
                )}
                {page === "Reset room" && (
                  <ResetRoom
                    settings={{
                      ...data.resetSettings,
                      reducedMotion: data.preferences.reducedMotion,
                    }}
                    onSettings={(v) => update("resetSettings", v)}
                    onStart={openStuck}
                  />
                )}
                {page === "Words for you" && (
                  <MotivationLibrary
                    prefs={data.preferences}
                    onPrefs={(v) => update("preferences", v)}
                    favorites={data.favorites}
                    onFavorites={(v) => update("favorites", v)}
                  />
                )}
                {page === "From Arsh" && (
                  <NotesFromMe
                    notes={data.notes}
                    onNotes={(v) => update("notes", v)}
                  />
                )}
                {page === "Settings" && (
                  <section className="panel settings-panel">
                    <PreferenceControls
                      prefs={data.preferences}
                      onChange={(v) => update("preferences", v)}
                    />
                    <h3>Your study intentions</h3>
                    <label>
                      Exam countdown target
                      <input
                        type="datetime-local"
                        value={data.exam}
                        onChange={(e) => {
                          if (e.target.value) update("exam", e.target.value);
                        }}
                      />
                    </label>
                    <p className="muted">
                      Defaults to November 14, 2026 at 8:00 AM in your device’s
                      local time. Set your actual appointment time here.
                    </p>
                    <label>
                      Daily focused study goal (hours)
                      <input
                        type="number"
                        min="0.5"
                        max="16"
                        step="0.5"
                        value={data.goal}
                        onChange={(e) => {
                          const n = Number(e.target.value);
                          if (n >= 0.5 && n <= 16) update("goal", n);
                        }}
                      />
                    </label>
                    <h3>Your memories, kept close.</h3>
                    <p className="muted">
                      Logs, scores, images, and journals are stored on this
                      device. Export a backup to keep a copy or move to another
                      computer.
                    </p>
                    <div className="button-row">
                      <button className="secondary" onClick={exportData}>
                        <Download size={17} /> Export backup
                      </button>
                      <label className="secondary import-label">
                        Restore backup
                        <input
                          type="file"
                          accept="application/json,.json"
                          onChange={async (e) => {
                            try {
                              const parsed = migrateData(
                                JSON.parse(await e.target.files[0].text()),
                              );
                              setModal({ restore: parsed });
                            } catch {
                              setToast(
                                "That backup is not valid. Your data is unchanged.",
                              );
                            }
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                    <button
                      className="text-button replay"
                      onClick={() => setIntro(true)}
                    >
                      <RotateCcw size={16} /> Replay welcome animation
                    </button>
                  </section>
                )}
                <footer>
                  <Star />
                  <span>
                    A little discipline. A little grace.{" "}
                    <em>A whole new chapter.</em>
                  </span>
                  <span>MADE FOR ANGEL, WITH LOVE ♡</span>
                </footer>
              </motion.div>
            </main>
          </div>
          <AnimatePresence>
            {modal && (
              <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModal(null)}
              >
                <section
                  className="modal glass"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Add to your journey"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="close"
                    aria-label="Close dialog"
                    onClick={() => setModal(null)}
                  >
                    <X />
                  </button>
                  {modal.restore ? (
                    <>
                      <h2>Restore this backup?</h2>
                      <p>
                        This replaces the data on this device. Export your
                        current data first if you want to keep it.
                      </p>
                      <div className="button-row">
                        <button className="secondary" onClick={exportData}>
                          Export current data
                        </button>
                        <button
                          className="primary"
                          onClick={() => {
                            setData(migrateData(modal.restore));
                            setModal(null);
                            setToast("Backup restored.");
                          }}
                        >
                          Restore backup
                        </button>
                      </div>
                    </>
                  ) : (
                    <EntryForm
                      type={modal}
                      onSave={(value) => {
                        if (modal === "log") addLog(value);
                        if (modal === "score") {
                          update("scores", [
                            ...data.scores,
                            {
                              ...value,
                              id: crypto.randomUUID(),
                              createdAt: new Date().toISOString(),
                            },
                          ]);
                          setToast("Score saved. Keep learning.");
                        }
                        if (modal === "pin") {
                          update("pins", [
                            ...data.pins,
                            { ...value, id: crypto.randomUUID() },
                          ]);
                          setToast("Added to your vision.");
                        }
                        setModal(null);
                      }}
                    />
                  )}
                </section>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {toast && (
              <motion.div
                role="status"
                className="toast"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Check size={17} />
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </MotionPreference.Provider>
  );
}
function Stat({ icon: Icon, label, value, unit, sub, progress, accent }) {
  return (
    <div className={"stat panel " + (accent ? "stat-accent" : "")}>
      <div className="stat-label">
        <Icon size={16} />
        {label}
      </div>
      <div className="stat-value">
        {value}
        <small>{unit}</small>
      </div>
      <p>{sub}</p>
      {progress !== undefined && (
        <div className="progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
const photos = [
  {
    title: "A seat at the table.",
    tag: "THE FUTURE ATTORNEY",
    url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=900&q=85",
    kind: "law",
  },
  {
    title: "Driven by something more.",
    tag: "THE LIFE YOU CHOOSE",
    url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=85",
    kind: "car",
  },
  {
    title: "Quiet confidence.",
    tag: "BECOME HER",
    url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    kind: "style",
  },
  {
    title: "Taste the possibility.",
    tag: "A PORSCHE KIND OF FUTURE",
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=85",
    kind: "porsche",
  },
];
function Board({ preview, pins, remove }) {
  return (
    <div className={"board " + (preview ? "board-preview" : "")}>
      {photos.map((p, i) => (
        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.12}
          dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
          whileHover={{ rotate: i % 2 ? 1 : -1 }}
          className={"vision-tile " + p.kind}
          key={p.title}
        >
          <img
            draggable="false"
            src={p.url}
            alt={
              p.tag === "THE FUTURE ATTORNEY"
                ? "Historic law library"
                : p.kind === "car"
                  ? "Mercedes-Benz car"
                  : p.kind === "porsche"
                    ? "Porsche sports car"
                    : "Elegant fashion inspiration"
            }
            loading="lazy"
          />
          <div className="tile-shade" />
          <div className="tile-caption">
            <span>{p.tag}</span>
            <h3>{p.title}</h3>
          </div>
          {i === 1 && <Star className="tile-star" />}
        </motion.div>
      ))}
      {!preview && (
        <>
          <div className="vision-tile mantra-tile">
            <span>REPEAT UNTIL YOU BELIEVE IT.</span>
            <p>
              I will get a 170.
              <br />
              <em>I will get a 170.</em>
              <br />I will get a 170.
            </p>
            <small>THEN SHOW UP LIKE YOU MEAN IT.</small>
          </div>
          {pins.map((p) => (
            <div className="vision-tile custom-pin" key={p.id}>
              <img src={p.image} alt={p.title} />
              <div className="tile-shade" />
              <div className="tile-caption">
                <h3>{p.title}</h3>
              </div>
              <button
                className="delete-pin"
                aria-label={`Remove ${p.title}`}
                onClick={() => remove(p.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
function LogList({ logs, remove }) {
  return (
    <section className="panel log-list">
      <h3>The hours behind the dream</h3>
      {!logs.length ? (
        <p className="empty">
          Your first session is a fresh start. Log it when you’re ready.
        </p>
      ) : (
        logs
          .slice()
          .reverse()
          .map((l) => (
            <div className="log-row" key={l.id}>
              <div className={"log-icon " + l.type}>
                <Clock size={18} />
              </div>
              <div>
                <b>
                  {l.type === "focused" ? "Focused study" : "Unfocused time"}
                </b>
                <small>
                  {l.date}
                  {l.note && ` · ${l.note}`}
                </small>
              </div>
              <strong>{l.minutes} min</strong>
              <button aria-label="Delete session" onClick={() => remove(l.id)}>
                <Trash2 size={15} />
              </button>
            </div>
          ))
      )}
    </section>
  );
}
function EntryForm({ type, onSave }) {
  const [image, setImage] = useState(""),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (type === "pin") {
          if (!image) {
            setError("Choose an image first.");
            return;
          }
          onSave({ title: f.get("title"), image });
        } else if (type === "score")
          onSave({ score: Number(f.get("score")), date: f.get("date") });
        else
          onSave({
            minutes: Number(f.get("minutes")),
            date: f.get("date"),
            type: f.get("type"),
            note: f.get("note"),
          });
      }}
    >
      <div className="eyebrow">A LITTLE CLOSER TO 170</div>
      <h2>
        {type === "log"
          ? "Every hour matters."
          : type === "score"
            ? "A new point in your journey."
            : "Keep your why close."}
      </h2>
      {type === "pin" ? (
        <>
          <label>
            A few words
            <input
              name="title"
              required
              maxLength="100"
              placeholder="The life I’m building…"
              autoFocus
            />
          </label>
          <label>
            Your inspiration
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              required
              onChange={(e) => {
                const file = e.target.files[0];
                setImage("");
                if (!file) return;
                if (
                  file.size > 1500000 ||
                  !["image/png", "image/jpeg", "image/webp"].includes(file.type)
                ) {
                  setError("Choose a PNG, JPG, or WebP smaller than 1.5 MB.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  setImage(reader.result);
                  setError("");
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {image && (
            <img
              className="upload-preview"
              src={image}
              alt="Your selected inspiration"
            />
          )}
        </>
      ) : (
        <>
          <label>
            Date
            <input
              name="date"
              type="date"
              defaultValue={dayKey()}
              required
              autoFocus
            />
          </label>
          {type === "score" ? (
            <label>
              Practice score
              <input
                name="score"
                type="number"
                min="120"
                max="180"
                required
                placeholder="141-170 and beyond"
              />
            </label>
          ) : (
            <>
              <label>
                How was your time spent?
                <select name="type">
                  <option value="focused">Focused study</option>
                  <option value="unfocused">Unfocused time</option>
                </select>
              </label>
              <label>
                Minutes
                <input
                  name="minutes"
                  type="number"
                  min="1"
                  max="1440"
                  required
                  placeholder="60"
                />
              </label>
              <label>
                What did you work on? (optional)
                <textarea
                  name="note"
                  maxLength="200"
                  rows="3"
                  placeholder="Logical reasoning set, blind review, reading comprehension…"
                />
              </label>
            </>
          )}
        </>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <button className="primary" type="submit">
        <Check size={17} />{" "}
        {type === "pin" ? "Add to my vision" : "Save to my journey"}
      </button>
    </form>
  );
}
createRoot(document.getElementById("root")).render(<App />);
