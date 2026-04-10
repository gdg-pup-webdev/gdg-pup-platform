"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

const SIZE_MAP = {
  sm: 48,
  md: 80,
  lg: 120,
} as const;

interface GdgLoaderProps {
  size?: keyof typeof SIZE_MAP;
}

export const GdgLoader = ({ size = "md" }: GdgLoaderProps) => {
  const px = SIZE_MAP[size];
  return (
    <motion.div
      animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src={ASSETS.BRANDING.GDG_LOGO_SVG}
        alt="GDG Logo"
        width={px}
        height={px}
        priority
      />
    </motion.div>
  );
};
