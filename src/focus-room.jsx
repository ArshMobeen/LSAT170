import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Check,
  ArrowLeft,
} from "lucide-react";
export default function FocusRoom({
  seconds,
  running,
  onToggle,
  onFinish,
  intention,
  onIntention,
}) {
  const ref = useRef(),
    [full, setFull] = useState(false);
  useEffect(() => {
    const listener = () => {
      if (!document.fullscreenElement) setFull(false);
    };
    const key = (e) => {
      if (e.key === "Escape") setFull(false);
    };
    document.addEventListener("fullscreenchange", listener);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("fullscreenchange", listener);
      document.removeEventListener("keydown", key);
    };
  }, []);
  useEffect(() => {
    if (!full) return;
    const previous = document.body.style.overflow;
    const root = document.getElementById("root");
    const wasInert = root?.inert;
    if (root) root.inert = true;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      if (root) root.inert = wasInert;
    };
  }, [full]);
  const enter = async () => {
    setFull(true);
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      /* The distraction-free view remains usable when fullscreen is unavailable. */
    }
  };
  const exit = async () => {
    setFull(false);
    if (document.fullscreenElement)
      await document.exitFullscreen().catch(() => {});
  };
  const content = (
    <section
      ref={ref}
      tabIndex={-1}
      className={"focus-sanctuary " + (full ? "focus-fullscreen" : "")}
      aria-label="Focus room"
    >
      <div className="focus-toolbar">
        <span className="focus-brand">
          a<span>✦</span>
        </span>
        <button className="fullscreen-control" onClick={full ? exit : enter}>
          {full ? <Minimize2 size={17} /> : <Maximize2 size={17} />}{" "}
          {full ? "Exit fullscreen" : "Fullscreen"}
        </button>
      </div>
      <div className="focus-core">
        <span className="eyebrow">THIS MOMENT IS YOURS</span>
        <label className="focus-intention">
          <span className="sr-only">Focus intention</span>
          <input
            value={intention}
            onChange={(e) => onIntention(e.target.value)}
            maxLength={100}
            aria-label="Focus intention"
          />
        </label>
        <div
          className={"focus-clock " + (running ? "is-running" : "")}
          aria-label="Elapsed focus time"
        >
          {String(Math.floor(seconds / 3600)).padStart(2, "0")}
          <span>:</span>
          {String(Math.floor(seconds / 60) % 60).padStart(2, "0")}
          <span>:</span>
          {String(seconds % 60).padStart(2, "0")}
        </div>
        <div className="focus-state">
          <span className={running ? "live-dot" : ""} />
          {running
            ? "You’re showing up. Keep going."
            : seconds
              ? "Take your time. Come back when you’re ready."
              : "A deep breath. A small beginning."}
        </div>
        <div className="button-row">
          <button className="primary" onClick={onToggle}>
            {running ? <Pause size={18} /> : <Play size={18} />}{" "}
            {running ? "Pause" : seconds ? "Continue" : "Start focusing"}
          </button>
          <button className="secondary" onClick={onFinish}>
            <Check size={18} /> Finish & save
          </button>
        </div>
      </div>
      <div className="focus-bottom">
        <span>Make room for the woman you’re becoming.</span>
        <span>Timer saved here. Reopens paused.</span>
      </div>
    </section>
  );
  return full ? createPortal(content, document.body) : content;
}
