"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Spotlight } from "@packages/spark-ui";

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

const TEAM_BLOBS: Record<string, BlobConfig> = {
  blue: {
    width: 680,
    height: 680,
    top: -430,
    left: "calc(50% - 340px)",
    color: "#4286f4a8",
    blur: 210,
    motion: "vertical" as BlobMotion,
    duration: 92,
    travel: 36,
    delay: "0s",
    interactive: true,
    interactiveStrength: 0.25,
    fixed: false,
    fixedTop: undefined,
    fixedLeft: undefined,
  },
  red: {
    width: 620,
    height: 620,
    top: 560,
    left: "calc(20% - 200px)",
    color: "#ea44354f",
    blur: 120,
    motion: "diagonal" as BlobMotion,
    duration: 75,
    travel: 30,
    delay: "-20s",
    interactive: false,
    interactiveStrength: 0.04,
    fixed: true,
    fixedTop: "28vh",
    fixedLeft: "-20vw",
  },
  yellow: {
    width: 640,
    height: 640,
    top: 540,
    left: "calc(55%)",
    color: "#f9aa0021",
    blur: 130,
    motion: "horizontal" as BlobMotion,
    duration: 85,
    travel: 32,
    delay: "-10s",
    interactive: false,
    interactiveStrength: 0.04,
    fixed: true,
    fixedTop: "36vh",
    fixedLeft: "72vw",
  },
  green: {
    width: 500,
    height: 500,
    top: 200,
    left: "auto",
    right: "-100px",
    color: "#34a85322",
    blur: 150,
    motion: "diagonal" as BlobMotion,
    duration: 80,
    travel: 40,
    delay: "-5s",
    interactive: false,
    interactiveStrength: 0,
    fixed: true,
    fixedTop: "50vh",
    fixedLeft: "80vw",
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
      zIndex: -2,
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

      {/* --- Team Blobs --- */}

      {/* --- Team Blobs --- */}
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
