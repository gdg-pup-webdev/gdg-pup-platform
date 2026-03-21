"use client";
import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { CosmosParticles } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";

interface MemberShowcaseBackgroundProps {
  children: React.ReactNode;
}

type BlobMotion = "vertical" | "horizontal" | "diagonal" | "none";

function motionToAnimation(motionType: BlobMotion, duration: number, delay: string): React.CSSProperties {
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
  const orangeBlobRef = React.useRef<HTMLDivElement>(null);
  const greenBlobRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const targets = [
      { ref: orangeBlobRef, strength: 0.08, cx: 0, cy: 0 },
      { ref: greenBlobRef, strength: 0.16, cx: 0, cy: 0 },
    ];

    let mouseX = 0;
    let mouseY = 0;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - window.innerWidth / 2;
      mouseY = e.clientY - window.innerHeight / 2;
    };

    const tick = () => {
      for (const target of targets) {
        target.cx += (mouseX * target.strength - target.cx) * 0.08;
        target.cy += (mouseY * target.strength - target.cy) * 0.08;
        if (target.ref.current) {
          target.ref.current.style.translate = `${target.cx.toFixed(1)}px ${target.cy.toFixed(1)}px`;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

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
      className="relative overflow-x-hidden bg-[#0F0E0E] px-4 pt-28 pb-24 md:px-8 md:pt-40 md:pb-32 lg:px-16 lg:pt-60 lg:pb-48"
    >
      <motion.div
        ref={orangeBlobRef}
        className="pointer-events-none absolute -top-120 -left-120 z-0"
        style={{
          width: "clamp(24rem, 58vw, 64rem)",
          height: "clamp(24rem, 58vw, 64rem)",
          borderRadius: "50%",
          background: "#FF620066",
          filter: "blur(100px)",
          ["--travel" as string]: "34px",
          ...motionToAnimation("horizontal", 58, "-14s"),
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0 }}
      />
      <motion.div
        ref={greenBlobRef}
        className="pointer-events-none absolute -top-120 -right-120 z-0"
        style={{
          width: "clamp(24rem, 58vw, 64rem)",
          height: "clamp(24rem, 58vw, 64rem)",
          borderRadius: "50%",
          background: "#00FF5566",
          filter: "blur(100px)",
          ["--travel" as string]: "38px",
          ...motionToAnimation("vertical", 88, "0s"),
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut", delay: 0.25 }}
      />
        
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
        className="z-3 pointer-events-none absolute -bottom-50 -right-15 h-auto w-auto max-w-none"
        width={506}
        height={507}
      >
      </Image>
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
