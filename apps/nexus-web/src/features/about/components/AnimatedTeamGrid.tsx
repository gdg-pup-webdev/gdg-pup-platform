"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";

// ─── Animation variants ──────────────────────────────────────────────────────

/**
 * Parent: triggers staggered entrance once the grid scrolls into view.
 * delayChildren gives the page a beat to settle before cards begin flying in.
 */
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/**
 * Individual card: shoots up from below with a scale pop.
 * Spring physics (no duration) gives it a natural, snappy feel.
 */
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 72,
    scale: 0.80,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 220,
      damping: 20,
      mass: 0.75,
    },
  },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface AnimatedTeamGridProps {
  children: React.ReactNode;
}

/**
 * Drop-in replacement for the team page grid `<div>`.
 * Automatically wraps every direct child in a staggered entrance animation.
 *
 * @example
 * ```tsx
 * <AnimatedTeamGrid>
 *   {MEMBERS.map((m) => <TeamCard key={m.name} {...m} />)}
 * </AnimatedTeamGrid>
 * ```
 */
export function AnimatedTeamGrid({ children }: AnimatedTeamGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Trigger once per mount (re-triggers naturally on route navigation since
  // the component unmounts and remounts between team pages).
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      variants={gridVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="grid grid-cols-1 justify-items-center gap-x-4 gap-y-8 p-3 pb-10 md:grid-cols-3 md:justify-items-stretch lg:grid-cols-4"
    >
      {React.Children.map(children, (child) => {
        if (child == null) return null;

        const isFullRow =
          React.isValidElement(child) &&
          child.props &&
          child.props["data-grid-span"] === "full";

        return (
          <motion.div
            variants={cardVariants}
            className={
              isFullRow
                ? "col-span-1 md:col-span-3 lg:col-span-4"
                : "w-full flex justify-center md:block"
            }
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

