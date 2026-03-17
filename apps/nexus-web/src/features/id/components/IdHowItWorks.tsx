"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { IdInfoCard } from "./IdInfoCard";
import { ASSETS } from "@/lib/constants/assets";

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
      <div className="relative h-auto md:h-120 flex flex-col md:flex-row items-stretch">
        {/* Cirby mascot — positioned behind the card on desktop, above on mobile */}
        <div className="static md:absolute left-0 top-1/2 md:-translate-y-1/2 w-full md:w-[55%] z-10 pointer-events-none flex justify-start md:justify-start -mt-50 md:mt-0 px-6 md:px-0">
          <div className="w-[60%] md:w-full">
            <Image
              src={ASSETS.ID.CIRBY}
              alt="Cirby mascot"
              width={320}
              height={320}
              className="object-contain w-full h-auto drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Info card — overlaps Cirby on desktop, stacks on mobile */}
        <div className="static md:absolute right-0 top-0 bottom-0 w-full md:w-[57%] z-20 flex justify-center items-center -mt-16 md:mt-0">
          <div className="w-full max-w-full md:max-w-none px-4 md:px-0">
            <IdInfoCard />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
