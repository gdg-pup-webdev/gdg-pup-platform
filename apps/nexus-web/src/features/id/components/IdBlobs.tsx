"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";

// --- Shared Team Blob Logic ---
type BlobMotion = "vertical" | "horizontal" | "diagonal" | "none";

interface BlobConfig {
  width: number;
  height: number;
  top: number;
  left: string;
  right?: string;
  color: string;
  blur: number;
  motion: BlobMotion;
  duration: number;
  travel: number;
  delay: string;
  interactive: boolean;
  interactiveStrength: number;
  fixed: boolean;
  fixedTop?: string;
  fixedLeft?: string;
}

// ── Edit these to tune the spotlight-amplifier blobs ──────────────────────────
// All four are small, interactive (follow the cursor), and positioned to
// cluster around the hero card / spotlight beam zone.
const TEAM_BLOBS: Record<string, BlobConfig> = {
  blue: {
    width: 350,
    height: 350,
    top: 550,
    left: "calc(60% - 30px)",
    color: "#4285F455",
    blur: 100,
    motion: "horizontal" as BlobMotion,
    duration: 70,
    travel: 32,
    delay: "0s",
    interactive: true,
    interactiveStrength: 0.25,
    fixed: false,
    fixedTop: undefined,
    fixedLeft: undefined,
  },
  red: {
    width: 370,
    height: 370,
    top: 750,
    left: "calc(50% - 450px)",
    color: "#EA433555",
    blur: 65,
    motion: "diagonal" as BlobMotion,
    duration: 60,
    travel: 28,
    delay: "-8s",
    interactive: true,
    interactiveStrength: 0.22,
    fixed: false,
    fixedTop: undefined,
    fixedLeft: undefined,
  },
  yellow: {
    width: 400,
    height: 400,
    top: 850,
    left: "calc(60% + 60px)",
    color: "#F9AB0048",
    blur: 70,
    motion: "diagonal" as BlobMotion,
    duration: 65,
    travel: 25,
    delay: "-15s",
    interactive: true,
    interactiveStrength: 0.20,
    fixed: false,
    fixedTop: undefined,
    fixedLeft: undefined,
  },
  green: {
    width: 400,
    height: 400,
    top: 500,
    left: "calc(35% + 50px)",
    color: "#34A85348",
    blur: 60,
    motion: "vertical" as BlobMotion,
    duration: 55,
    travel: 22,
    delay: "-3s",
    interactive: true,
    interactiveStrength: 0.18,
    fixed: false,
    fixedTop: undefined,
    fixedLeft: undefined,
  },
};

function motionToTeamAnimation(m: BlobMotion, duration: number, delay: string): React.CSSProperties {
  if (m === "none") return {};
  const kf = m === "vertical" ? "blobDriftV" : m === "horizontal" ? "blobDriftH" : "blobDriftD";
  return {
    animationName: kf,
    animationDuration: `${duration}s`,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationDelay: delay,
  };
}

export function IdBlobs(): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const blueRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);
  const greenRef = useRef<HTMLDivElement>(null);

  const [sectionVisible, setSectionVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setSectionVisible(entry.isIntersecting), { threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const blobRefs: Record<keyof typeof TEAM_BLOBS, React.RefObject<HTMLDivElement | null>> = {
    blue: blueRef,
    yellow: yellowRef,
    red: redRef,
    green: greenRef,
  };

  useEffect(() => {
    const hasInteractive = Object.values(TEAM_BLOBS).some((b) => b.interactive);
    if (!hasInteractive) return;
    const targets = (Object.keys(TEAM_BLOBS) as (keyof typeof TEAM_BLOBS)[])
      .filter((k) => TEAM_BLOBS[k].interactive)
      .map((k) => ({
        ref: blobRefs[k],
        strength: TEAM_BLOBS[k].interactiveStrength,
        cx: 0,
        cy: 0,
      }));
    let mouseX = 0, mouseY = 0, rafId: number;
    const onMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
    };
    const tick = () => {
      for (const t of targets) {
        t.cx += (mouseX * t.strength - t.cx) * 0.08;
        t.cy += (mouseY * t.strength - t.cy) * 0.08;
        if (t.ref?.current) t.ref.current.style.translate = `${t.cx.toFixed(1)}px ${t.cy.toFixed(1)}px`;
      }
      rafId = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  function blobStyle(cfg: BlobConfig): React.CSSProperties {
    const base: React.CSSProperties = {
      position: cfg.fixed ? "fixed" : "absolute",
      zIndex: 2,
      borderRadius: "50%",
      pointerEvents: "none",
      willChange: "transform",
      width: cfg.width,
      height: cfg.height,
      background: cfg.color,
      filter: `blur(${cfg.blur}px)`,
      ...motionToTeamAnimation(cfg.motion, cfg.duration, cfg.delay),
    } as React.CSSProperties;
    // Add custom var for --travel
    (base as any)["--travel"] = `${cfg.travel}px`;

    if (cfg.fixed && cfg.fixedTop !== undefined) {
      base.top = cfg.fixedTop;
      base.left = cfg.fixedLeft;
    } else {
      base.top = cfg.top;
      base.left = cfg.left;
      if (cfg.right) base.right = cfg.right;
    }
    return base;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none">

      <motion.div
        ref={blueRef}
        style={blobStyle(TEAM_BLOBS.blue)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0 }}
      />
      <motion.div
        ref={yellowRef}
        style={blobStyle(TEAM_BLOBS.yellow)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: sectionVisible ? 1 : 0, scale: sectionVisible ? 1 : 0.4 }}
        transition={{ duration: sectionVisible ? 2.2 : 0.6, ease: "easeOut", delay: sectionVisible ? 0.35 : 0 }}
      />
      <motion.div
        ref={redRef}
        style={blobStyle(TEAM_BLOBS.red)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: sectionVisible ? 1 : 0, scale: sectionVisible ? 1 : 0.4 }}
        transition={{ duration: sectionVisible ? 2.2 : 0.6, ease: "easeOut", delay: sectionVisible ? 0.7 : 0 }}
      />
      <motion.div
        ref={greenRef}
        style={blobStyle(TEAM_BLOBS.green)}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: sectionVisible ? 1 : 0, scale: sectionVisible ? 1 : 0.4 }}
        transition={{ duration: sectionVisible ? 2.2 : 0.6, ease: "easeOut", delay: sectionVisible ? 1 : 0 }}
      />
    </div>
  );
}
