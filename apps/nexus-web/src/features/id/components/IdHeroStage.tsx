"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Button, GdgIdCard } from "@packages/spark-ui";
import { IdHeroBeams } from "./IdHeroBeams";
import { ASSETS } from "@/lib/constants/assets";

/**
 * CSS custom properties that control spiral depths and beam geometry.
 * All values use clamp() so they scale fluidly from mobile → desktop.
 *
 * To adjust:
 *   --outer/center/inner-y  → vertical offset of each spiral ring
 *   --beam-w / --beam-h     → spotlight beam dimensions (% of slot)
 *   --beam-N-x              → per-beam horizontal nudge within its slot
 *   --beam-N-y              → per-beam vertical offset within the container
 */
const STAGE_STYLE = {
  minHeight: "clamp(460px, 75vh, 650px)",
  "--outer-y": "clamp(220px, 29vw, 420px)",
  "--center-y": "clamp(205px, 28vw, 400px)",
  "--inner-y": "clamp(190px, 27vw, 385px)",
  "--beam-w": "800%",
  "--beam-h": "100%",
  "--beam-1-x": "-500%",
  "--beam-2-x": "-400%",
  "--beam-3-x": "-290%",
  "--beam-4-x": "-189%",
  "--beam-1-y": "10%",
  "--beam-2-y": "6%",
  "--beam-3-y": "6%",
  "--beam-4-y": "10%",
} as React.CSSProperties;

/**
 * Hero stage: spotlight beams, three spiral rings, decorative side elements,
 * the GDG ID card, and the CTA button — all layered and animated.
 */
export function IdHeroStage() {
  return (
    <motion.div
      className="relative flex items-center justify-center transition-all duration-300"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-150px" }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      style={STAGE_STYLE}
    >
      {/* Spotlight beams + animated gradients (z 35) */}
      <IdHeroBeams />

      {/* Spiral outer — z 10 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 10, y: "var(--outer-y)" }}
        initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
        animate={{ opacity: 0.7, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.7 }}
      >
        <div className="relative" style={{ width: "clamp(300px, 83.6vw, 1204px)", aspectRatio: "1204 / 188" }}>
          <Image src={ASSETS.ID.SPIRAL_OUTER} alt="" aria-hidden fill className="object-contain" />
        </div>
      </motion.div>

      {/* Spiral center — z 20 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 20, y: "var(--center-y)" }}
        initial={{ opacity: 0, scale: 0.7, filter: "blur(20px)" }}
        animate={{ opacity: 0.85, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.0, ease: "easeOut", delay: 0.35 }}
      >
        <div className="relative" style={{ width: "clamp(250px, 70.7vw, 1018px)", aspectRatio: "1018 / 125" }}>
          <Image src={ASSETS.ID.SPIRAL_CENTER} alt="" aria-hidden fill className="object-contain" />
        </div>
      </motion.div>

      {/* Spiral inner — z 30 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ zIndex: 30, y: "var(--inner-y)" }}
        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0 }}
      >
        <div className="relative" style={{ width: "clamp(180px, 48.4vw, 697px)", aspectRatio: "697 / 66" }}>
          <Image src={ASSETS.ID.SPIRAL_INNER} alt="" aria-hidden fill className="object-contain" />
        </div>
      </motion.div>

      {/* Decorative left — z 40, hidden on mobile */}
      <motion.div
        className="absolute pointer-events-none select-none hidden md:block"
        style={{ left: "clamp(0px, 4vw, 60px)", top: "50%", y: "-50%", zIndex: 40 }}
        initial={{ opacity: 0, x: "50%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
      >
        <motion.div
          animate={{ y: [0, -25, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Image
            src={ASSETS.ID.DECOR_LEFT}
            alt=""
            aria-hidden
            width={250}
            height={430}
            style={{ width: "clamp(120px, 18vw, 250px)", height: "auto" }}
          />
        </motion.div>
      </motion.div>

      {/* Decorative right — z 40, hidden on mobile */}
      <motion.div
        className="absolute pointer-events-none select-none hidden md:block"
        style={{ right: "clamp(0px, 4vw, 60px)", top: "50%", y: "-50%", zIndex: 40 }}
        initial={{ opacity: 0, x: "-50%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
      >
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        >
          <Image
            src={ASSETS.ID.DECOR_RIGHT}
            alt=""
            aria-hidden
            width={250}
            height={430}
            style={{ width: "clamp(120px, 18vw, 250px)", height: "auto" }}
          />
        </motion.div>
      </motion.div>

      {/* GDG ID card + CTA button — z 50 (topmost) */}
      <motion.div
        className="relative flex flex-col items-center gap-6"
        style={{ zIndex: 50 }}
        initial={{ opacity: 0, scale: 0.82, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.34, 1.56, 0.64, 1], delay: 1.3 }}
      >
        <div className="scale-[0.68] sm:scale-[0.82] md:scale-95 lg:scale-100 origin-center">
          <GdgIdCard
            name="Arky"
            gdgId="GDG-PUP-26-001"
            fullName="Sparky Batumbakal"
            email="sparky.batumbakal@gmail.com"
            course="BS in Information Technology"
          />
        </div>

        <Link href="#">
          <Button variant="default">Get Your Digital ID</Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
