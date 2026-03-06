"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { IdInfoCard } from "./IdInfoCard";

/**
 * "How it works" section: Cirby mascot (left, behind) overlapped by the
 * glassmorphic IdInfoCard (right, in front). Uses absolute positioning so
 * the card visually slides over the image.
 */
export function IdHowItWorks() {
  return (
    <motion.div
      className="mt-32 pt-16"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
    >
      <div className="relative h-120 flex items-stretch">
        {/* Cirby mascot — positioned behind the card */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[55%] z-10 pointer-events-none">
          <Image
            src="/pages/id/cirby2.png"
            alt="Cirby mascot"
            width={320}
            height={320}
            className="object-contain w-full h-auto drop-shadow-2xl"
          />
        </div>

        {/* Info card — overlaps Cirby, glassmorphism frosts the image beneath */}
        <div className="absolute right-0 top-0 bottom-0 w-[57%] z-20">
          <IdInfoCard />
        </div>
      </div>
    </motion.div>
  );
}
