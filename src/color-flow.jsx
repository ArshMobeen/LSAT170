import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Pause, Play, Download, RotateCcw } from "lucide-react";
import { createFluid, createFlowFallback } from "./fluid-engine";
import { useCalmMotion } from "./motion-preference";
export default function ColorFlow({ settings, revision }) {
  const glCanvas = useRef(),
    fallbackCanvas = useRef(),
    engine = useRef(),
    live = useRef(settings),
    [fallback, setFallback] = useState(false),
    [paused, setPaused] = useState(false),
    calm = useCalmMotion();
  live.current = { ...settings, reducedMotion: calm };
  useEffect(() => {
    let renderer;
    const fail = () => {
      renderer?.destroy();
      setFallback(true);
    };
    try {
      renderer = fallback
        ? createFlowFallback(fallbackCanvas.current, () => live.current)
        : createFluid(glCanvas.current, () => live.current);
      engine.current = renderer;
    } catch {
      setFallback(true);
      return;
    }
    const el = fallback ? fallbackCanvas.current : glCanvas.current;
    let prev = null,
      pressed = false;
    const position = (e) => {
      const rect = el.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
    };
    const move = (e) => {
      const p = position(e);
      if (prev) {
        const dx = (p.x - prev.x) * 1200,
          dy = (p.y - prev.y) * 1200;
        if (Math.hypot(dx, dy) > 0.2)
          renderer.inject(p.x, p.y, dx, dy, pressed ? 1.7 : 0.65);
      }
      prev = p;
    };
    const down = (e) => {
      pressed = true;
      el.setPointerCapture(e.pointerId);
      prev = position(e);
      renderer.inject(prev.x, prev.y, 30, -20, 3);
    };
    const up = (e) => {
      pressed = false;
      if (el.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
    };
    const leave = () => {
      if (!pressed) prev = null;
    };
    const lost = (e) => {
      e.preventDefault();
      fail();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("webglcontextlost", lost);
    setPaused(false);
    return () => {
      renderer.destroy();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("webglcontextlost", lost);
    };
  }, [fallback, revision]);
  const save = () => {
    const canvas = fallback ? fallbackCanvas.current : glCanvas.current;
    const a = document.createElement("a");
    a.download = "angels-color-flow.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };
  return (
    <>
      <canvas
        ref={glCanvas}
        className={fallback ? "flow-hidden" : ""}
        aria-label="Color flow. Move your cursor or drag to paint flowing color."
      />
      <canvas
        ref={fallbackCanvas}
        className={fallback ? "" : "flow-hidden"}
        aria-label="Flowing color canvas"
      />
      <div className="reset-tools flow-tools">
        <button onClick={() => engine.current?.burst()}>
          <Sparkles size={15} /> Add color
        </button>
        <button
          aria-pressed={paused}
          onClick={() => {
            engine.current?.pause(!paused);
            setPaused(!paused);
          }}
        >
          {paused ? <Play size={15} /> : <Pause size={15} />}{" "}
          {paused ? "Resume" : "Pause"}
        </button>
        <button onClick={save}>
          <Download size={15} /> Save
        </button>
        <button onClick={() => engine.current?.clear()}>
          <RotateCcw size={15} /> Clear
        </button>
      </div>
    </>
  );
}
