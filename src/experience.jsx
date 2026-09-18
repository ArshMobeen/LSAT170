import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  AnimatePresence,
} from "motion/react";
import * as Dialog from "@radix-ui/react-dialog";
import { MetalFx } from "metal-fx";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Check,
  Plus,
  X,
  BookOpen,
  Search,
  Feather,
  Pause,
  Play,
  ChevronRight,
} from "lucide-react";
import { dayKey } from "./model";
import { useCalmMotion } from "./motion-preference";
import { motivations, personalNotes } from "./content";

export function SilverButton({ children, onClick, className = "" }) {
  const reduced = useCalmMotion();
  return (
    <MetalFx
      normalizeHostStyles={false}
      preset="silver"
      strength={0.38}
      theme="dark"
      paused={!!reduced}
      disableGlow
    >
      <button className={"silver-button " + className} onClick={onClick}>
        {children}
      </button>
    </MetalFx>
  );
}
export function Opening({ remaining, prefs, onClose }) {
  const reduced = useCalmMotion() || prefs.reducedMotion;
  return (
    <motion.div
      className="opening-v2"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.6 }}
    >
      <motion.div
        className="opening-photo left"
        initial={{ x: 0 }}
        animate={{ x: reduced ? "-100%" : "-84%" }}
        transition={{ delay: 0.6, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="opening-photo right"
        initial={{ x: 0 }}
        animate={{ x: reduced ? "100%" : "84%" }}
        transition={{ delay: 0.6, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <div
        className={`headlight-scene ${reduced ? "reduced" : ""}`}
        aria-hidden="true"
      >
        <div className="headlight-haze" />
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="carPaint" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#29425f" />
              <stop offset="0.45" stopColor="#0b1727" />
              <stop offset="1" stopColor="#02060c" />
            </linearGradient>
            <radialGradient id="lampGlass">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.25" stopColor="#dfeeff" />
              <stop offset="0.7" stopColor="#738aa5" />
              <stop offset="1" stopColor="#121d2d" />
            </radialGradient>
            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#eaf4ff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#91bbeb" stopOpacity="0" />
            </linearGradient>
            <filter
              id="lampGlow"
              x="-200%"
              y="-200%"
              width="500%"
              height="500%"
            >
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>
          <path
            className="car-silhouette"
            d="M220 704C270 494 425 330 720 320C1015 330 1170 494 1220 704L1120 810H320Z"
            fill="url(#carPaint)"
          />
          <path
            className="hood-line"
            d="M330 626C486 540 592 514 720 518C848 514 954 540 1110 626"
          />
          <g className="headlamp left-lamp">
            <path
              className="beam"
              d="M302 615L14 720L0 900H540L498 647Z"
              fill="url(#beam)"
            />
            <path
              className="lamp-glow"
              d="M278 620C337 574 423 557 510 596L486 666C404 678 333 662 278 620Z"
            />
            <path
              className="lamp-housing"
              d="M278 620C337 574 423 557 510 596L486 666C404 678 333 662 278 620Z"
            />
            <path
              className="lamp-signature"
              d="M304 621C355 592 419 588 481 610C438 617 385 632 333 650"
            />
            <circle
              className="projector"
              cx="414"
              cy="623"
              r="24"
              fill="url(#lampGlass)"
            />
          </g>
          <g className="headlamp right-lamp">
            <path
              className="beam"
              d="M1138 615L1426 720L1440 900H900L942 647Z"
              fill="url(#beam)"
            />
            <path
              className="lamp-glow"
              d="M1162 620C1103 574 1017 557 930 596L954 666C1036 678 1107 662 1162 620Z"
            />
            <path
              className="lamp-housing"
              d="M1162 620C1103 574 1017 557 930 596L954 666C1036 678 1107 662 1162 620Z"
            />
            <path
              className="lamp-signature"
              d="M1136 621C1085 592 1021 588 959 610C1002 617 1055 632 1107 650"
            />
            <circle
              className="projector"
              cx="1026"
              cy="623"
              r="24"
              fill="url(#lampGlass)"
            />
          </g>
          <path
            className="grille"
            d="M570 600Q720 560 870 600L846 786Q720 824 594 786Z"
          />
          {[-95, -62, -31, 0, 31, 62, 95].map((x) => (
            <path
              key={x}
              className="grille-slat"
              d={`M${720 + x} 592L${720 + x * 0.82} 796`}
            />
          ))}
          <g className="front-star" transform="translate(720 665)">
            <circle r="72" />
            <path d="M0-66L10-7L57 33L0 11L-57 33L-10-7Z" />
          </g>
        </svg>
      </div>
      <motion.div
        className="opening-content"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 1.2 }}
      >
        <div className="opening-emblem">
          <svg viewBox="0 0 100 100" aria-label="Mercedes-Benz inspired star">
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M50 7L56 46L88 73L50 57L12 73L44 46Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <p className="eyebrow">A LIFE WITH YOUR NAME ON IT</p>
        <h1>
          Welcome, <em>Angel Thukral.</em>
        </h1>
        <p className="opening-line">
          {prefs.tone === "tough"
            ? "I will get a 170. I will get a 170."
            : prefs.tone === "practical"
              ? "One question. One clear next step."
              : "You don’t have to feel ready. You can begin here."}
        </p>
        {prefs.showCountdown && (
          <div className="opening-clock">
            {remaining.map((n, i) => (
              <span key={i}>
                {String(n).padStart(2, "0")}
                <small>{["DAYS", "HOURS", "MINUTES", "SECONDS"][i]}</small>
              </span>
            ))}
          </div>
        )}
        <button className="ghost" onClick={onClose}>
          Enter my space <ArrowRight size={16} />
        </button>
      </motion.div>
      <button className="opening-skip" onClick={onClose}>
        Skip intro
      </button>
    </motion.div>
  );
}
export function EditorialHero({ remaining, prefs, onStart }) {
  const ref = useRef(),
    reduced = useCalmMotion() || prefs.reducedMotion;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });
  const left = useTransform(smooth, [0, 1], ["0%", "-32%"]),
    right = useTransform(smooth, [0, 1], ["0%", "32%"]),
    scale = useTransform(smooth, [0, 1], [1, 1.15]);
  return (
    <section ref={ref} className="editorial-hero">
      <div className="hero-photograph">
        <motion.div
          className="photo-panel photo-left"
          style={reduced ? {} : { x: left, scale }}
        />
        <motion.div
          className="photo-panel photo-right"
          style={reduced ? {} : { x: right, scale }}
        />
        <div className="photo-vignette" />
      </div>
      <div className="editorial-caption">
        <span className="eyebrow">THE ANGEL THUKRAL CHAPTER / 2026</span>
        <h2>
          A little discipline.
          <br />A little grace.
          <br />
          <em>A life that’s yours.</em>
        </h2>
        <p>
          {prefs.tone === "tough"
            ? "The dream is beautiful. Today, do the work that brings it closer."
            : prefs.tone === "practical"
              ? "Choose one task. Give it your attention. Learn something you can use tomorrow."
              : "You can want something extraordinary and start with something small."}
        </p>
        <SilverButton onClick={onStart}>
          Begin with two minutes <ArrowUpRight size={17} />
        </SilverButton>
      </div>
      <div className="hero-editorial-number">
        <span>THE INTENTION</span>
        <b>170</b>
        <i>I will get a 170.</i>
      </div>
      <div className="editorial-bottom">
        <span>YOUR NEXT CHAPTER IS TAKING SHAPE.</span>
        {prefs.showCountdown ? (
          <div className="mini-countdown">
            {remaining.map((n, i) => (
              <span key={i}>
                <b>{String(n).padStart(2, "0")}</b>
                <small>{["DAYS", "HRS", "MIN", "SEC"][i]}</small>
              </span>
            ))}
          </div>
        ) : (
          <span>ONE GOOD STEP IS ENOUGH TO BEGIN.</span>
        )}
      </div>
    </section>
  );
}

const levels = {
  minimum: {
    label: "A small beginning",
    detail: "One question. One lesson. Enough to keep the door open.",
    minutes: 10,
    task: "Review one missed question.",
  },
  standard: {
    label: "A steady day",
    detail: "A focused set, followed by a thoughtful review.",
    minutes: 60,
    task: "Complete a practice set and review my reasoning.",
  },
  stretch: {
    label: "A little further",
    detail: "Two deliberate sessions, with a real break between.",
    minutes: 120,
    task: "Practice, take a break, then review the patterns I missed.",
  },
};
export function DailyPlan({ plan, onChange, onFocus }) {
  const p = plan || {
    level: "minimum",
    task: levels.minimum.task,
    done: false,
  };
  return (
    <section className="daily-plan">
      <div className="plan-heading">
        <div>
          <span className="eyebrow">TODAY, ON YOUR TERMS</span>
          <h2>
            What kind of day <em>is this?</em>
          </h2>
        </div>
        <span className="plan-date">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
          <small>A fresh plan. No catch-up debt.</small>
        </span>
      </div>
      <div className="plan-levels">
        {Object.entries(levels).map(([key, v], i) => (
          <motion.button
            whileTap={{ scale: 0.985 }}
            key={key}
            className={p.level === key ? "selected" : ""}
            aria-pressed={p.level === key}
            onClick={() => onChange({ level: key, task: v.task, done: false })}
          >
            <span className="level-index">0{i + 1}</span>
            <span className="eyebrow">{key}</span>
            <strong>{v.label}</strong>
            <p>{v.detail}</p>
            <span className="level-duration">
              {v.minutes} MIN INTENTION <ArrowUpRight size={15} />
            </span>
          </motion.button>
        ))}
      </div>
      <div className="plan-action">
        <label>
          My next concrete step
          <input
            aria-label="Today’s next step"
            value={p.task}
            maxLength={200}
            onChange={(e) =>
              onChange({ ...p, task: e.target.value, done: false })
            }
          />
        </label>
        <button
          className={"plan-check " + (p.done ? "done" : "")}
          aria-pressed={p.done}
          onClick={() => onChange({ ...p, done: !p.done })}
        >
          <Check size={17} />
          {p.done ? "I showed up" : "Mark complete"}
        </button>
        <button className="text-button" onClick={onFocus}>
          Go focus <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

export function StuckDialog({
  open,
  onOpenChange,
  onReset,
  onJournal,
  onSession,
}) {
  const [reason, setReason] = useState("overwhelmed"),
    [seconds, setSeconds] = useState(120),
    [active, setActive] = useState(false),
    [complete, setComplete] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    if (!open) {
      setActive(false);
      setSeconds(120);
      setComplete(false);
    }
  }, [open]);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      const next = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setSeconds(next);
      if (next === 0) {
        setActive(false);
        setComplete(true);
      }
    }, 200);
    return () => clearInterval(t);
  }, [active]);
  const tasks = {
    overwhelmed: [
      "You can make this smaller.",
      "Open one missed question. Read the explanation without asking yourself to do anything else.",
    ],
    tired: [
      "A gentle start is still a start.",
      "Get comfortable, have some water, and write one thing you learned last time.",
    ],
    unsure: [
      "Here is a place to begin.",
      "Take one logical reasoning question. Identify only the conclusion and the evidence.",
    ],
  };
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="radix-overlay" />
        <Dialog.Content className="stuck-dialog">
          <Dialog.Close className="dialog-x" aria-label="Close restart">
            <X size={20} />
          </Dialog.Close>
          <span className="eyebrow">LET’S FIND YOUR WAY BACK</span>
          <Dialog.Title>
            Just the <em>next two minutes.</em>
          </Dialog.Title>
          <Dialog.Description>
            No perfect mood required. Choose what’s getting in the way.
          </Dialog.Description>
          <div className="segmented">
            {[
              ["overwhelmed", "Overwhelmed"],
              ["tired", "Tired"],
              ["unsure", "Where do I start?"],
            ].map(([k, v]) => (
              <button
                key={k}
                disabled={active}
                aria-pressed={reason === k}
                onClick={() => setReason(k)}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="stuck-task">
            <h3>
              {complete ? "You gave yourself a beginning." : tasks[reason][0]}
            </h3>
            <p>
              {complete
                ? "Keep going if you have room. Or save these two minutes and take your next step later."
                : tasks[reason][1]}
            </p>
          </div>
          <div
            className="restart-clock"
            aria-label={`${seconds} seconds remaining`}
          >
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
          </div>
          {complete ? (
            <div className="button-row">
              <button
                className="primary"
                onClick={() => {
                  onSession(true);
                  onOpenChange(false);
                }}
              >
                Save & keep focusing <ArrowRight size={16} />
              </button>
              <button
                className="secondary"
                onClick={() => {
                  onSession(false);
                  onOpenChange(false);
                }}
              >
                Save & finish for now
              </button>
            </div>
          ) : (
            <SilverButton
              onClick={() => {
                if (active) setActive(false);
                else {
                  deadline.current = Date.now() + seconds * 1000;
                  setActive(true);
                }
              }}
            >
              {active ? <Pause size={16} /> : <Play size={16} />}{" "}
              {active
                ? "Pause"
                : seconds < 120
                  ? "Continue"
                  : "Try two minutes"}
            </SilverButton>
          )}
          <div className="stuck-alternatives">
            <button
              onClick={() => {
                onOpenChange(false);
                onReset();
              }}
            >
              Let off steam first
            </button>
            <button
              onClick={() => {
                onOpenChange(false);
                onJournal();
              }}
            >
              Write it out
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function MotivationLibrary({ prefs, onPrefs, favorites, onFavorites }) {
  const [filter, setFilter] = useState(prefs.tone),
    [search, setSearch] = useState(""),
    [saved, setSaved] = useState(false);
  const cards = motivations.filter(
    (q) =>
      (filter === "all" || q.tone === filter) &&
      (prefs.family || q.theme !== "family") &&
      (!saved || favorites.includes(q.id)) &&
      `${q.title} ${q.text}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <section className="motivation-library">
      <div className="library-intro">
        <span className="eyebrow">WORDS FOR THE WOMAN YOU’RE BECOMING</span>
        <h2>
          Some days, a push.
          <br />
          <em>Some days, a hand to hold.</em>
        </h2>
        <p>
          Choose what you need today. You’re allowed to need something different
          tomorrow.
        </p>
      </div>
      <div className="library-controls">
        <div className="segmented">
          {[
            ["all", "All words"],
            ["tough", "Tough love"],
            ["gentle", "Encouragement"],
            ["practical", "Next steps"],
          ].map(([k, v]) => (
            <button
              key={k}
              aria-pressed={filter === k}
              onClick={() => {
                setFilter(k);
                if (k !== "all") onPrefs({ ...prefs, tone: k });
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <button
          className={"favorite-filter " + (saved ? "selected" : "")}
          aria-pressed={saved}
          onClick={() => setSaved(!saved)}
        >
          <Heart size={16} />
          {saved ? "Saved words" : "My favorites"}
        </button>
        <label className="quote-search">
          <Search size={16} />
          <input
            aria-label="Search motivation"
            placeholder="Find the words…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <label className="toggle-line">
        <input
          type="checkbox"
          checked={prefs.family}
          onChange={(e) => onPrefs({ ...prefs, family: e.target.checked })}
        />{" "}
        Include family-inspired motivation
      </label>
      <div className="quote-collection">
        {cards.map((q, i) => (
          <motion.article
            key={q.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ type: "spring", stiffness: 100, damping: 22 }}
            className={`motivation-card ${q.tone} design-${i % 4}`}
          >
            <span className="quote-index">
              {String(motivations.indexOf(q) + 1).padStart(2, "0")} /{" "}
              {q.tone === "tough"
                ? "A LITTLE FIRE"
                : q.tone === "gentle"
                  ? "A LITTLE GRACE"
                  : "A LITTLE DIRECTION"}
            </span>
            <h3>{q.title}</h3>
            <p>{q.text}</p>
            <div className="motivation-foot">
              <span>FOR ANGEL, ALWAYS.</span>
              <button
                aria-label={`${favorites.includes(q.id) ? "Unsave" : "Save"} ${q.title}`}
                aria-pressed={favorites.includes(q.id)}
                onClick={() =>
                  onFavorites(
                    favorites.includes(q.id)
                      ? favorites.filter((id) => id !== q.id)
                      : [...favorites, q.id],
                  )
                }
              >
                <Heart
                  size={18}
                  fill={favorites.includes(q.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
          </motion.article>
        ))}
      </div>
      {!cards.length && (
        <p className="empty">
          No words match this view. Try another tone or clear your search.
        </p>
      )}
    </section>
  );
}

export function NotesFromMe({ notes, onNotes }) {
  const [selected, setSelected] = useState(null),
    [adding, setAdding] = useState(false);
  const all = [...personalNotes, ...notes];
  return (
    <section className="love-notes">
      <div className="notes-heading">
        <span className="eyebrow">A LITTLE CORNER OF US</span>
        <h2>
          For my <em>lawyer kuri.</em>
        </h2>
        <p>Open one whenever you need me in your corner.</p>
        <button className="text-button" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add a personal note
        </button>
      </div>
      <div className="envelope-grid">
        {all.map((note, i) => (
          <motion.button
            key={note.id}
            className="envelope"
            whileHover={{ y: -9, rotate: i % 2 ? 2 : -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(note)}
          >
            <span className="envelope-number">
              NO. {String(i + 1).padStart(2, "0")}
            </span>
            <span className="envelope-flap" />
            <span className="wax-seal">a</span>
            <strong>{note.title}</strong>
            <small>
              OPEN WHEN YOU NEED A LITTLE LOVE <ArrowUpRight size={12} />
            </small>
          </motion.button>
        ))}
      </div>
      <Dialog.Root
        open={!!selected || adding}
        onOpenChange={(v) => {
          if (!v) {
            setSelected(null);
            setAdding(false);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="radix-overlay" />
          <Dialog.Content className="letter-dialog">
            <Dialog.Close className="dialog-x" aria-label="Close letter">
              <X size={20} />
            </Dialog.Close>
            <span className="eyebrow">JUST BETWEEN US</span>
            <Dialog.Title>
              {adding ? "A note for Angel" : selected?.title}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              A personal message for Angel.
            </Dialog.Description>
            {adding ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  onNotes([
                    ...notes,
                    {
                      id: crypto.randomUUID(),
                      title: f.get("title"),
                      text: f.get("text"),
                      sign: f.get("sign"),
                    },
                  ]);
                  setAdding(false);
                }}
              >
                <label>
                  Envelope title
                  <input
                    name="title"
                    required
                    maxLength="70"
                    placeholder="For a hard day…"
                  />
                </label>
                <label>
                  Your words
                  <textarea
                    name="text"
                    required
                    maxLength="2000"
                    placeholder="My lawyer kuri…"
                  />
                </label>
                <label>
                  Sign-off
                  <input name="sign" maxLength="70" defaultValue="Arsh" />
                </label>
                <button className="primary">
                  Seal this note <Heart size={15} />
                </button>
              </form>
            ) : (
              <>
                <p className="letter-body">{selected?.text}</p>
                <p className="letter-sign">{selected?.sign} ♡</p>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}

export function JournalExtras({
  date,
  journal,
  onJournal,
  reviews,
  onReviews,
}) {
  const [adding, setAdding] = useState(false);
  const list = reviews.filter(
    (r) => r.date === date || (!r.mastered && r.next <= date),
  );
  return (
    <>
      <div className="freewrite">
        <span className="eyebrow">NO PROMPT. NO PERFECT WORDS.</span>
        <h2>
          Whatever’s on <em>your mind.</em>
        </h2>
        <textarea
          aria-label="Free writing"
          placeholder="Start anywhere. This page is yours…"
          value={journal.freewrite || ""}
          onChange={(e) => onJournal({ ...journal, freewrite: e.target.value })}
        />
      </div>
      <section className="review-section">
        <div className="section-top">
          <div>
            <span className="eyebrow">FROM MISTAKE TO UNDERSTANDING</span>
            <h3>The lessons I’m keeping.</h3>
          </div>
          <button className="text-button" onClick={() => setAdding(!adding)}>
            <Plus size={16} />
            {adding ? "Close form" : "Add a question review"}
          </button>
        </div>
        {adding && (
          <form
            className="review-form"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              onReviews([
                ...reviews,
                {
                  id: crypto.randomUUID(),
                  date,
                  type: f.get("type"),
                  reference: f.get("reference"),
                  mistake: f.get("mistake"),
                  lesson: f.get("lesson"),
                  next: f.get("next"),
                  mastered: false,
                },
              ]);
              setAdding(false);
            }}
          >
            <div className="review-form-row">
              <label>
                Question type
                <select name="type">
                  <option>Logical reasoning</option>
                  <option>Reading comprehension</option>
                </select>
              </label>
              <label>
                Question reference
                <input
                  name="reference"
                  required
                  placeholder="PT / section / question"
                  maxLength="100"
                />
              </label>
            </div>
            <label>
              Why did my answer seem right?
              <textarea name="mistake" required maxLength="4000" />
            </label>
            <label>
              What I understand now, in my words
              <textarea name="lesson" required maxLength="4000" />
            </label>
            <label>
              Revisit on
              <input
                name="next"
                type="date"
                required
                defaultValue={dayKey(new Date(Date.now() + 3 * 86400000))}
              />
            </label>
            <button className="primary">
              Keep this lesson <Check size={16} />
            </button>
          </form>
        )}
        {list.length === 0 && !adding && (
          <p className="muted review-empty">
            The questions that challenged you can become your best teachers.
            Keep the reasoning here.
          </p>
        )}
        {list.map((r) => (
          <article className="review-entry" key={r.id}>
            <div>
              <span className="eyebrow">{r.type}</span>
              <h4>{r.reference}</h4>
              <span className="review-due">
                {r.mastered
                  ? "Reviewed"
                  : r.next <= dayKey()
                    ? "Ready to revisit"
                    : `Revisit ${r.next}`}
              </span>
            </div>
            <p>
              <b>What tripped me up</b>
              {r.mistake}
            </p>
            <p>
              <b>The lesson</b>
              {r.lesson}
            </p>
            <button
              className="text-button"
              aria-pressed={r.mastered}
              onClick={() =>
                onReviews(
                  reviews.map((x) =>
                    x.id === r.id ? { ...x, mastered: !x.mastered } : x,
                  ),
                )
              }
            >
              <Check size={15} />
              {r.mastered ? "Reviewed ,  undo" : "Mark reviewed"}
            </button>
            <button
              className="text-button remove-review"
              onClick={() => onReviews(reviews.filter((x) => x.id !== r.id))}
            >
              Delete review
            </button>
          </article>
        ))}
      </section>
    </>
  );
}

export function PreferenceControls({ prefs, onChange }) {
  return (
    <section className="preference-controls">
      <h3>How this space speaks to you</h3>
      <label>
        My default motivation
        <select
          value={prefs.tone}
          onChange={(e) => onChange({ ...prefs, tone: e.target.value })}
        >
          <option value="gentle">Encouragement · a little grace</option>
          <option value="tough">Tough love · a little fire</option>
          <option value="practical">Practical · a clear next step</option>
        </select>
      </label>
      {[
        ["showCountdown", "Show the exam countdown"],
        ["family", "Include family-inspired motivation"],
        ["reducedMotion", "Use calmer motion"],
      ].map(([k, label]) => (
        <label className="toggle-line" key={k}>
          <input
            type="checkbox"
            checked={prefs[k]}
            onChange={(e) => onChange({ ...prefs, [k]: e.target.checked })}
          />
          {label}
        </label>
      ))}
    </section>
  );
}

export function ScrollVision({ children }) {
  const ref = useRef(),
    reduced = useCalmMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const clip = useTransform(
    scrollYProgress,
    [0, 0.8],
    ["inset(12% 9% 0% 9% round 60px)", "inset(0% 0% 0% 0% round 12px)"],
  );
  return (
    <motion.div
      ref={ref}
      className="scroll-vision"
      style={reduced ? {} : { clipPath: clip }}
    >
      {children}
    </motion.div>
  );
}
