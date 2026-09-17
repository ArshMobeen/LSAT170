import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Matter from "matter-js";
import {
  PenLine,
  Waves,
  FileText,
  Palette,
  RotateCcw,
  Download,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";

import ColorFlow from "./color-flow";

const palettes = {
  Pearl: "#d7dfed",
  Burgundy: "#bf8395",
  Gold: "#c4af86",
  Blue: "#829dc7",
};
export default function ResetRoom({ settings, onSettings, onStart }) {
  const [mode, setMode] = useState("ink"),
    [revision, setRevision] = useState(0),
    [paper, setPaper] = useState(""),
    [crumpled, setCrumpled] = useState(false),
    [notice, setNotice] = useState("");
  const canvas = useRef(null),
    api = useRef({}),
    audio = useRef(null),
    reduced = useReducedMotion();
  const config = {
    width: 5,
    resistance: 55,
    intensity: 65,
    color: "Pearl",
    sound: false,
    ...settings,
  };
  const live = useRef(config);
  live.current = { ...config, reduced: reduced || config.reducedMotion };
  const chime = () => {
    if (!live.current.sound) return;
    try {
      const ctx =
        audio.current ||
        (audio.current = new (
          window.AudioContext || window.webkitAudioContext
        )());
      ctx.resume();
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(mode === "water" ? 180 : 320, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(85, ctx.currentTime + 0.3);
      g.gain.setValueAtTime(0.035, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.35);
    } catch {}
  };
  useEffect(
    () => () => {
      audio.current?.close();
    },
    [],
  );
  useEffect(() => {
    if (mode === "flow") return;
    const el = canvas.current,
      ctx = el.getContext("2d");
    let width = 1,
      height = 1,
      frame,
      previous = 0,
      down = false,
      target = { x: 0, y: 0 },
      pen = null,
      velocity = { x: 0, y: 0 },
      ripples = [],
      paths = [],
      path = null,
      dragBody = null,
      lastPointer = null;
    const { Engine, Bodies, Body, Composite, Query } = Matter,
      engine = Engine.create({ enableSleeping: true });
    let boundaries = [],
      balls = [];
    function resize() {
      const rect = el.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      el.width = width * dpr;
      el.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      boundaries.forEach((b) => Composite.remove(engine.world, b));
      boundaries = [
        Bodies.rectangle(width / 2, height - 20, width + 120, 60, {
          isStatic: true,
        }),
        Bodies.rectangle(-30, height / 2, 60, height * 3, { isStatic: true }),
        Bodies.rectangle(width + 30, height / 2, 60, height * 3, {
          isStatic: true,
        }),
      ];
      Composite.add(engine.world, boundaries);
      balls.forEach((b) =>
        Body.setPosition(b, {
          x: Math.min(width - 35, Math.max(35, b.position.x)),
          y: Math.min(height - 35, b.position.y),
        }),
      );
    }
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const point = (e) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const ripple = (p) => {
      ripples.push({ ...p, age: 0, color: palettes[live.current.color] });
      if (ripples.length > 65) ripples.shift();
    };
    const start = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      down = true;
      target = point(e);
      el.setPointerCapture(e.pointerId);
      lastPointer = { ...target, t: performance.now() };
      if (mode === "ink") {
        pen = { ...target };
        velocity = { x: 0, y: 0 };
        path = {
          points: [{ ...target }],
          color: palettes[live.current.color],
          width: Number(live.current.width),
        };
        paths.push(path);
        if (paths.length > 120) paths.shift();
      }
      if (mode === "water") ripple(target);
      if (mode === "paper") {
        dragBody = Query.point(balls, target)[0];
        if (dragBody) {
          Matter.Sleeping.set(dragBody, false);
          Body.setStatic(dragBody, true);
          Body.setVelocity(dragBody, { x: 0, y: 0 });
        }
      }
      chime();
    };
    const move = (e) => {
      if (!down) return;
      const p = point(e),
        t = performance.now();
      if (mode === "paper" && dragBody) {
        const dt = Math.max(8, t - (lastPointer?.t || t));
        velocity = {
          x: ((p.x - target.x) / dt) * 16.67,
          y: ((p.y - target.y) / dt) * 16.67,
        };
        Body.setPosition(dragBody, p);
      }
      if (mode === "water" && Math.hypot(p.x - target.x, p.y - target.y) > 10)
        ripple(p);
      target = p;
      lastPointer = { ...p, t };
    };
    const end = (e) => {
      down = false;
      if (el.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
      if (dragBody) {
        Body.setStatic(dragBody, false);
        Body.setVelocity(dragBody, {
          x: Math.max(-25, Math.min(25, velocity.x)),
          y: Math.max(-25, Math.min(25, velocity.y)),
        });
        dragBody = null;
      }
      if (mode !== "ink") {
        path = null;
        pen = null;
      }
    };
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    api.current = {
      crumple() {
        const b = Bodies.circle(width * 0.5, height * 0.32, 34, {
          restitution: 0.58,
          friction: 0.2,
          frictionAir: 0.008,
        });
        Composite.add(engine.world, b);
        balls.push(b);
        if (balls.length > 12) {
          Composite.remove(engine.world, balls.shift());
        }
        Body.setAngularVelocity(b, 0.06);
      },
      toss() {
        const b = balls.at(-1);
        if (b) {
          Matter.Sleeping.set(b, false);
          Body.setVelocity(b, { x: 6, y: -12 });
          Body.setAngularVelocity(b, 0.18);
        }
      },
      ripple() {
        ripple({ x: width / 2, y: height / 2 });
        chime();
      },
      undo() {
        paths.pop();
      },
      download() {
        const out = document.createElement("canvas");
        out.width = el.width;
        out.height = el.height;
        const c = out.getContext("2d");
        c.fillStyle = "#101e32";
        c.fillRect(0, 0, out.width, out.height);
        c.drawImage(el, 0, 0);
        const a = document.createElement("a");
        a.href = out.toDataURL("image/png");
        a.download = "a-little-release.png";
        a.click();
      },
    };
    function draw(t) {
      const dt = Math.min(32, t - (previous || t));
      previous = t;
      ctx.clearRect(0, 0, width, height);
      const strength = live.current.reduced?.valueOf()
        ? 0
        : Number(live.current.intensity) / 100;
      if (mode === "ink") {
        if (pen && path) {
          const k = 0.09 + (100 - Number(live.current.resistance)) * 0.002;
          velocity.x = (velocity.x + (target.x - pen.x) * k) * 0.62;
          velocity.y = (velocity.y + (target.y - pen.y) * k) * 0.62;
          pen.x += velocity.x;
          pen.y += velocity.y;
          if (
            Math.hypot(
              pen.x - path.points.at(-1).x,
              pen.y - path.points.at(-1).y,
            ) > 0.6
          ) {
            path.points.push({ ...pen });
            if (path.points.length > 6000) path.points.shift();
          }
          if (!down && Math.hypot(target.x - pen.x, target.y - pen.y) < 0.6) {
            path.points.push({ ...target });
            pen = null;
            path = null;
          }
        }
        for (const p of paths) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.width;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10 * strength;
          ctx.beginPath();
          p.points.forEach((q, i) =>
            i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y),
          );
          if (p.points.length === 1) {
            ctx.lineTo(p.points[0].x + 0.1, p.points[0].y);
          }
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      } else if (mode === "water") {
        for (const r of ripples) {
          r.age += dt / 1000;
          for (let j = 0; j < 4; j++) {
            const age = r.age - j * 0.11;
            if (age < 0) continue;
            const radius =
              5 + age * (live.current.reduced ? 25 : 65 + strength * 70);
            ctx.globalAlpha = Math.max(
              0,
              (1 - age / (live.current.reduced ? 1.2 : 3.5)) * 0.42,
            );
            ctx.strokeStyle = r.color;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.ellipse(r.x, r.y, radius, radius * 0.7, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        ripples = ripples.filter((r) => r.age < 4);
      } else {
        engine.gravity.y = live.current.reduced ? 1 : 0.65 + strength * 0.55;
        Engine.update(engine, Math.min(dt, 1000 / 60));
        for (const b of balls) {
          ctx.save();
          ctx.translate(b.position.x, b.position.y);
          ctx.rotate(b.angle);
          const g = ctx.createRadialGradient(-13, -15, 2, 0, 0, 37);
          g.addColorStop(0, "#f5eee1");
          g.addColorStop(0.65, "#c3b7a2");
          g.addColorStop(1, "#746d66");
          ctx.fillStyle = g;
          ctx.shadowColor = "#0006";
          ctx.shadowBlur = 18;
          ctx.beginPath();
          for (let i = 0; i <= 14; i++) {
            const a = (i / 14) * Math.PI * 2,
              r = 31 + Math.sin(i * 9) * 3;
            i
              ? ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r)
              : ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = "#756d5a55";
          ctx.lineWidth = 0.7;
          for (let i = 0; i < 10; i++) {
            const a = i * 2.4;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * 28, Math.sin(a) * 28);
            ctx.lineTo(Math.sin(i) * 12, Math.cos(i * 3) * 15);
            ctx.lineTo(Math.cos(a + 1.5) * 28, Math.sin(a + 1.5) * 28);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("pointerdown", start);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      api.current = {};
    };
  }, [mode, revision]);
  const clear = () => {
    setRevision((r) => r + 1);
    setPaper("");
    setCrumpled(false);
    setNotice("A fresh surface. Nothing to carry over.");
  };
  return (
    <div className="reset-room">
      <div className="reset-top">
        <div className="segmented">
          {[
            ["ink", PenLine, "Ink ribbons"],
            ["water", Waves, "Still water"],
            ["paper", FileText, "Let it go"],
            ["flow", Palette, "Color flow"],
          ].map(([key, Icon, label]) => (
            <button
              key={key}
              aria-pressed={mode === key}
              onClick={() => {
                setMode(key);
                setCrumpled(false);
                setPaper("");
                setNotice("");
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
        <span className="eyebrow">NO SCORE. NO EXPECTATIONS.</span>
      </div>
      <div className={"reset-stage " + mode}>
        <div className="water-orb" />
        {mode === "flow" ? (
          <ColorFlow settings={config} revision={revision} />
        ) : (
          <canvas
            ref={canvas}
            aria-label={
              mode === "ink"
                ? "Draw ink ribbons by dragging"
                : mode === "water"
                  ? "Drag to make ripples"
                  : "Drag and throw the crumpled paper"
            }
          />
        )}
        <div className="reset-stage-caption">
          <span>
            0{["ink", "water", "paper", "flow"].indexOf(mode) + 1} / A MOMENT
            FOR YOU
          </span>
          <h2>
            {mode === "ink"
              ? "Let your hands do the talking."
              : mode === "water"
                ? "Nothing to solve. Just soften."
                : mode === "flow"
                  ? "Follow the color. Let everything else drift."
                  : "Some things can stay on the page."}
          </h2>
        </div>
        <AnimatePresence>
          {mode === "paper" && !crumpled && (
            <motion.div
              className="release-paper"
              initial={{ opacity: 0, rotate: -3, y: 30 }}
              animate={{ opacity: 1, rotate: -2, y: 0 }}
              exit={{ scale: 0.1, rotate: 120, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
            >
              <span>DEAR THINGS I CAN’T CARRY TODAY,</span>
              <textarea
                aria-label="Let it go writing"
                value={paper}
                onChange={(e) => setPaper(e.target.value)}
                placeholder="Put it here. You don’t have to make it pretty."
              />
              <small>Private. Ephemeral. Yours to release.</small>
            </motion.div>
          )}
        </AnimatePresence>
        {mode !== "flow" && (
          <div className="reset-tools">
            {mode === "ink" ? (
              <>
                <button onClick={() => api.current.undo?.()}>
                  <RotateCcw size={15} /> Undo
                </button>
                <button onClick={() => api.current.download?.()}>
                  <Download size={15} /> Save drawing
                </button>
              </>
            ) : mode === "water" ? (
              <button onClick={() => api.current.ripple?.()}>
                <Waves size={16} /> Make a ripple
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!crumpled) {
                    setCrumpled(true);
                    setPaper("");
                    api.current.crumple?.();
                    chime();
                    setNotice("Drag the paper and release to throw it.");
                  } else {
                    api.current.toss?.();
                    chime();
                  }
                }}
              >
                {crumpled ? "Toss again" : "Crumple & let go"}{" "}
                <ArrowRight size={15} />
              </button>
            )}
            <button onClick={clear}>Fresh start</button>
          </div>
        )}
      </div>
      <div className="reset-controls">
        <label>
          {mode === "flow" ? "Color spread" : "Thickness"}{" "}
          <input
            aria-label={mode === "flow" ? "Color spread" : "Ink thickness"}
            type="range"
            min="1"
            max="18"
            value={config.width}
            disabled={mode !== "ink" && mode !== "flow"}
            onChange={(e) =>
              onSettings({ ...config, width: Number(e.target.value) })
            }
          />
        </label>
        <label>
          {mode === "flow" ? "Color linger" : "Ink resistance"}{" "}
          <input
            aria-label={mode === "flow" ? "Color linger" : "Ink resistance"}
            type="range"
            min="0"
            max="100"
            value={config.resistance}
            disabled={mode !== "ink" && mode !== "flow"}
            onChange={(e) =>
              onSettings({ ...config, resistance: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Motion energy{" "}
          <input
            aria-label="Motion energy"
            type="range"
            min="0"
            max="100"
            value={config.intensity}
            onChange={(e) =>
              onSettings({ ...config, intensity: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Palette
          <select
            value={
              mode === "flow" ? config.flowPalette || "Aurora" : config.color
            }
            onChange={(e) =>
              onSettings({
                ...config,
                [mode === "flow" ? "flowPalette" : "color"]: e.target.value,
              })
            }
          >
            {(mode === "flow"
              ? ["Aurora", "Ocean", "Ember", "Pearl"]
              : Object.keys(palettes)
            ).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        {mode !== "flow" && (
          <button
            className="sound-toggle"
            aria-pressed={config.sound}
            onClick={() => onSettings({ ...config, sound: !config.sound })}
          >
            {config.sound ? <Volume2 size={19} /> : <VolumeX size={19} />} Sound{" "}
            {config.sound ? "on" : "off"}
          </button>
        )}
      </div>
      <div className="reset-after">
        <p role="status">
          {notice ||
            (mode === "flow"
              ? "Move to stir. Click and drag to add color."
              : "Nothing here needs to be perfect.")}
        </p>
        <button className="text-button" onClick={onStart}>
          Ready for one small thing? <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
