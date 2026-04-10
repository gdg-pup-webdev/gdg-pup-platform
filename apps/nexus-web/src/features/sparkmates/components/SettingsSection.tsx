"use client";

import { AccountSettingsSection } from "./AccountSettingsSection";
import { Text } from "@packages/spark-ui";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ASSETS } from "@/lib/constants/assets";
import { CosmosParticles } from "@/components/shared";

// ─── Blob config ─────────────────────────────────────────────────────────────
type BlobMotion = "vertical" | "horizontal" | "diagonal";

const BLOBS = {
  yellowLeft: {
    width: 480, height: 480,
    top: 40, left: "-5%",
    color: "#F9AB0040", blur: 120,
    motion: "horizontal" as BlobMotion,
    duration: 58, travel: 30, delay: "-14s",
    interactive: true, interactiveStrength: 0.14,
  },
  greenLeft: {
    width: 380, height: 380,
    top: 180, left: "3%",
    color: "#34A85340", blur: 110,
    motion: "diagonal" as BlobMotion,
    duration: 72, travel: 28, delay: "-22s",
    interactive: true, interactiveStrength: 0.16,
  },
  yellowRight: {
    width: 460, height: 460,
    top: 60, left: "65%",
    color: "#F9AB0040", blur: 120,
    motion: "diagonal" as BlobMotion,
    duration: 65, travel: 30, delay: "-8s",
    interactive: true, interactiveStrength: 0.12,
  },
  greenRight: {
    width: 360, height: 360,
    top: 220, left: "76%",
    color: "#34A85340", blur: 110,
    motion: "vertical" as BlobMotion,
    duration: 80, travel: 26, delay: "-35s",
    interactive: true, interactiveStrength: 0.15,
  },
} satisfies Record<string, {
  width: number; height: number;
  top: number; left: string;
  color: string; blur: number;
  motion: BlobMotion; duration: number; travel: number; delay: string;
  interactive: boolean; interactiveStrength: number;
}>;

function motionToAnimation(blobMotion: BlobMotion, duration: number, delay: string): React.CSSProperties {
  const keyframe = blobMotion === "vertical" ? "blobDriftV" : blobMotion === "horizontal" ? "blobDriftH" : "blobDriftD";
  return { animation: `${keyframe} ${duration}s ease-in-out infinite`, animationDelay: delay };
}

function SettingsBlobBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs: Record<keyof typeof BLOBS, React.RefObject<HTMLDivElement | null>> = {
    yellowLeft: useRef(null),
    greenLeft: useRef(null),
    yellowRight: useRef(null),
    greenRight: useRef(null),
  };

  useEffect(() => {
    const targets = (Object.keys(BLOBS) as (keyof typeof BLOBS)[])
      .filter((k) => BLOBS[k].interactive)
      .map((k) => ({ ref: refs[k], strength: BLOBS[k].interactiveStrength, cx: 0, cy: 0 }));

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
        if (t.ref.current) t.ref.current.style.translate = `${t.cx.toFixed(1)}px ${t.cy.toFixed(1)}px`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMouseMove); cancelAnimationFrame(rafId); };
  }, []);

  const base: React.CSSProperties = { position: "absolute", borderRadius: "50%", pointerEvents: "none", willChange: "transform" };

  function blobStyle(cfg: (typeof BLOBS)[keyof typeof BLOBS]): React.CSSProperties {
    return {
      ...base,
      top: cfg.top, left: cfg.left,
      width: cfg.width, height: cfg.height,
      background: cfg.color,
      filter: `blur(${cfg.blur}px)`,
      ["--travel" as string]: `${cfg.travel}px`,
      ...motionToAnimation(cfg.motion, cfg.duration, cfg.delay),
    };
  }

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {(Object.keys(BLOBS) as (keyof typeof BLOBS)[]).map((k, i) => (
        <motion.div
          key={k}
          ref={refs[k]}
          style={blobStyle(BLOBS[k])}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.2, ease: "easeOut", delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function SettingsSection() {
  return (
    <div className="relative min-h-screen bg-[#010B1D] overflow-hidden">

      {/* ── CosmosParticles — desktop only (hidden on mobile for perf) ── */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none z-0">
        <CosmosParticles
          particleColors={["#ffffff", "#4285f4"]}
          particleCount={180}
          particleSpread={14}
          speed={0.028}
          particleBaseSize={75}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Interactive blobs — desktop only */}
      <div className="hidden sm:block">
        <SettingsBlobBackground />
      </div>

      {/* ── Mobile hero image ──────────────────────────────────────────────
           Sits BEHIND the page content (z-0). The heading and profile card
           render on top (z-10). The image is OUTSIDE the profile card. */}
      <div className="sm:hidden absolute inset-x-0 top-0 h-[400px] pointer-events-none select-none z-0">
        <Image
          src={ASSETS.SPARKMATES.SETTINGS_MOBILE_HERO}
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent to-[#010B1D]" />
      </div>

      {/* ── Decorative element 1 — left, desktop only */}
      <div
        className="hidden sm:block pointer-events-none select-none absolute z-0"
        style={{
          left: "-80px",
          top: "0px",
          transform: "rotate(26.31deg)",
          transformOrigin: "center center",
          width: "480px",
        }}
        aria-hidden
      >
        <Image
          src={ASSETS.SPARKMATES.SETTINGS_ELEMENT_1}
          alt=""
          width={480}
          height={620}
          className="w-full h-auto"
          sizes="480px"
        />
      </div>

      {/* ── Decorative element 2 — right, desktop only */}
      <div
        className="hidden sm:block pointer-events-none select-none absolute z-0"
        style={{
          right: "-80px",
          top: "260px",
          transform: "rotate(-18deg)",
          transformOrigin: "center center",
          width: "560px",
        }}
        aria-hidden
      >
        <Image
          src={ASSETS.SPARKMATES.SETTINGS_ELEMENT_2}
          alt=""
          width={560}
          height={730}
          className="w-full h-auto"
          sizes="560px"
        />
      </div>

      {/* ── Page content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 px-4 sm:px-6 pb-24 pt-24 sm:pt-40">
        <div className="max-w-3xl mx-auto">

          {/* Heading — centred on mobile, left-aligned on desktop */}
          <div className="mb-4 sm:mb-6">
            <Text
              variant="heading-4"
              weight="bold"
              gradient="white-blue"
              className="mb-2 text-center sm:text-left"
            >
              Account Settings
            </Text>
            {/* Subtitle — centred on mobile, left + divider on desktop */}
            <p className="text-[#C1C7CD] text-center sm:text-left sm:border-b sm:border-white/10 sm:pb-6 text-sm sm:text-base">
              Manage your personal information, security preferences, and Sparkmates visibility.
            </p>
          </div>

          <AccountSettingsSection />
        </div>
      </div>
    </div>
  );
}
