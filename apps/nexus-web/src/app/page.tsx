"use client";

import { motion, useScroll, useTransform } from "motion/react";

export default function HomePage() {
  const { scrollY } = useScroll();

  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  const textY = useTransform(scrollY, [0, 200], [30, 0]);

  const textOpacity = useTransform(scrollY, [0, 200], [0, 1]);

  return (
    <div className="relative min-h-[150vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url(/pages/hero.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          y: backgroundY,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </motion.div>

      {/* Hero Content with Fade In */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl"
        style={{
          opacity: textOpacity,
          y: textY,
        }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Bridging the gap between theory and practice.
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
          GDG PUP helps student developers grow through real projects, events,
          and mentorship connecting classroom learning to industry practice.
        </p>
      </motion.div>
    </div>
  );
}
