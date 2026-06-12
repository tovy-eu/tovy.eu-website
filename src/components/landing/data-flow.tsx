"use client";

import { useEffect, useRef } from "react";

/**
 * DataFlow: animated canvas of particle streams that start scattered and
 * converge into ordered parallel lanes — the "chaos to clarity" brand metaphor.
 *
 * Performance constraints: single canvas, ~90 particles, pauses when the
 * section leaves the viewport or the tab is hidden. With prefers-reduced-motion
 * it renders one static frame instead of animating.
 */

const PARTICLE_COUNT = 90;
const LANE_COUNT = 5;

type Particle = {
  t: number;       // progress along x, 0..1
  speed: number;
  lane: number;    // target lane index
  seed: number;    // phase offset for the chaotic left half
  amp: number;     // chaos amplitude
};

function makeParticle(randomT: boolean): Particle {
  return {
    t: randomT ? Math.random() : 0,
    speed: 0.0006 + Math.random() * 0.0012,
    lane: Math.floor(Math.random() * LANE_COUNT),
    seed: Math.random() * Math.PI * 2,
    amp: 0.25 + Math.random() * 0.75,
  };
}

// Smoothstep-style easing: chaos on the left, fully converged from ~75% width.
function convergence(t: number) {
  const x = Math.min(Math.max((t - 0.15) / 0.6, 0), 1);
  return x * x * (3 - 2 * x);
}

function particleY(p: Particle, t: number, h: number, time: number) {
  const laneSpread = h * 0.5;
  const laneY = h * 0.5 + (p.lane - (LANE_COUNT - 1) / 2) * (laneSpread / LANE_COUNT);
  const chaosY =
    h * 0.5 +
    Math.sin(t * 7 + p.seed + time * 0.0004) * h * 0.28 * p.amp +
    Math.sin(t * 13 + p.seed * 2) * h * 0.1 * p.amp;
  const c = convergence(t);
  return chaosY * (1 - c) + laneY * c;
}

export function DataFlow({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(true));

    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawLanes = () => {
      // Faint guide lanes on the converged (right) side
      const laneSpread = height * 0.5;
      for (let i = 0; i < LANE_COUNT; i++) {
        const y = height * 0.5 + (i - (LANE_COUNT - 1) / 2) * (laneSpread / LANE_COUNT);
        const grad = ctx.createLinearGradient(width * 0.45, 0, width, 0);
        grad.addColorStop(0, "rgba(43, 94, 255, 0)");
        grad.addColorStop(0.7, "rgba(43, 94, 255, 0.05)");
        grad.addColorStop(1, "rgba(59, 226, 176, 0.08)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(width * 0.45, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawParticle = (p: Particle, time: number) => {
      const x = p.t * width;
      const y = particleY(p, p.t, height, time);
      const tailT = Math.max(p.t - 0.035, 0);
      const tailY = particleY(p, tailT, height, time);

      // Blue near the chaotic side, teal once converged
      const c = convergence(p.t);
      const r = Math.round(43 + (59 - 43) * c);
      const g = Math.round(94 + (226 - 94) * c);
      const b = Math.round(255 + (176 - 255) * c);
      // Fade in/out at the horizontal edges
      const edge = Math.min(p.t / 0.08, (1 - p.t) / 0.08, 1);
      const alpha = 0.5 * edge;

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(tailT * width, tailY);
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      drawLanes();
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) drawParticle(p, time);
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (time: number) => {
      for (const p of particles) {
        p.t += p.speed * 16;
        if (p.t >= 1) Object.assign(p, makeParticle(false));
      }
      drawFrame(time);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reducedMotion) {
      drawFrame(0); // single static frame
    } else {
      start();
    }

    const onResize = () => {
      resize();
      if (reducedMotion) drawFrame(0);
    };
    window.addEventListener("resize", onResize);

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
    />
  );
}
