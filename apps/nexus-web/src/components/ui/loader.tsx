"use client";
import { motion } from "motion/react";
import Image from "next/image";

export const GdgLoader = () => {
  return (
    <motion.div
      animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src="/images/GDG.svg"
        alt="GDG Logo"
        width={80}
        height={80}
        priority
      />
    </motion.div>
  );
};
