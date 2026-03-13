"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

export const GdgLoader = () => {
  return (
    <motion.div
      animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src={ASSETS.BRANDING.GDG_LOGO_SVG}
        alt="GDG Logo"
        width={80}
        height={80}
        priority
      />
    </motion.div>
  );
};
