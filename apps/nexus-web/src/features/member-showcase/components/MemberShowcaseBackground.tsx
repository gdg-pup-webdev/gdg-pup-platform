"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CosmosParticles } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";

const MotionImage = motion.create(Image);

interface MemberShowcaseBackgroundProps {
  children: React.ReactNode;
}

type BlobMotion = "vertical" | "horizontal" | "diagonal" | "none";

function motionToAnimation(
  motionType: BlobMotion,
  duration: number,
  delay: string,
): React.CSSProperties {
  if (motionType === "none") return {};
  const keyframe =
    motionType === "vertical"
      ? "blobDriftV"
      : motionType === "horizontal"
        ? "blobDriftH"
        : "blobDriftD";

  return {
    animation: `${keyframe} ${duration}s ease-in-out infinite`,
    animationDelay: delay,
  };
}

export function MemberShowcaseBackground({
  children,
}: MemberShowcaseBackgroundProps) {
  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={500}
      particleSpread={15}
      speed={0.03}
      particleBaseSize={100}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="relative overflow-x-hidden bg-[#0F0E0E] px-4 pt-8 pb-8 md:px-8 md:pt-12 md:pb-12 lg:pt-12 lg:pb-12"
    >
      <motion.div
        className="pointer-events-none absolute z-[5]"
        style={{
          top: "-10rem",
          left: "-6rem",
          width: "48rem",
          height: "48rem",
          opacity: 0.8,
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
          ["--travel" as string]: "34px",
          ...motionToAnimation("horizontal", 58, "-14s"),
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0 }}
      >
        <MotionImage
          src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.ORANGE_SPOTLIGHT}
          alt="orange spotlight"
          fill
          priority
          unoptimized
          className="object-contain"
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute z-[5]"
        style={{
          top: "-10rem",
          right: "-6rem",
          width: "48rem",
          height: "48rem",
          opacity: 0.8,
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
          ["--travel" as string]: "38px",
          ...motionToAnimation("vertical", 88, "0s"),
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.25 }}
      >
        <MotionImage
          src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.GREEN_SPOTLIGHT}
          alt="green spotlight"
          fill
          priority
          unoptimized
          className="object-contain"
        />
      </motion.div>

      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.STARS_1}
        alt="Stars decoration left"
        className="pointer-events-none absolute z-10 -top-28 -left-32 h-auto w-[72%] max-w-none md:-top-44 md:-left-22 md:w-auto lg:-top-60 lg:-left-15"
        width={1060}
        height={1060}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.STARS_2}
        alt="Stars decoration bottom left"
        className="pointer-events-none absolute z-10 top-[58%] -left-10 h-auto w-40 md:top-[54%] md:-left-8 md:w-52 lg:top-150 lg:-left-15 lg:w-auto"
        width={337}
        height={403}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.STARS_1}
        alt="Stars decoration right"
        className="pointer-events-none absolute z-10 -top-28 -right-32 h-auto w-[72%] max-w-none scale-x-[-1] md:-top-44 md:-right-22 md:w-auto lg:-top-60 lg:-right-15"
        width={1060}
        height={1060}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.GDG_SHADOW}
        alt="gdg shadow"
        className="z-3 pointer-events-none absolute -bottom-50 -right-15 w-126.5 h-auto"
        width={506}
        height={507}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.VECTOR_1296}
        alt="vector decoration left"
        className="pointer-events-none absolute -bottom-50 -left-15 h-full w-screen max-w-none"
        width={2269}
        height={2030}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.VECTOR_1297}
        alt="vector decoration right"
        className="pointer-events-none absolute -bottom-50 -right-15 h-full w-full"
        width={1959}
        height={1147}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.VECTOR_1298}
        alt="vector decoration center"
        className="pointer-events-none absolute -bottom-50 left-1/2 h-auto w-screen max-w-none -translate-x-1/2"
        width={2071}
        height={1249}
      />
      {children}
    </CosmosParticles>
  );
}
