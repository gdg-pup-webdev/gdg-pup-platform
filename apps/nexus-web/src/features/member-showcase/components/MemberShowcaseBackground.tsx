"use client";
import React from "react";
import Image from "next/image";
import { CosmosParticles } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";

interface MemberShowcaseBackgroundProps {
  children: React.ReactNode;
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
      className="relative overflow-x-hidden bg-[#0F0E0E] px-4 pt-28 pb-24 md:px-8 md:pt-40 md:pb-32 lg:px-16 lg:pt-60 lg:pb-48"
    >
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.ORANGE_COLOR}
        alt="orange color"
        className="pointer-events-none absolute -top-28 -left-36 h-auto w-[130%] max-w-none opacity-80 md:-top-44 md:-left-24 md:w-auto md:opacity-100 lg:-top-60 lg:-left-15"
        width={1583}
        height={1583}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.GREEN_COLOR}
        alt="green color"
        className="pointer-events-none absolute -top-28 -right-36 h-auto w-[130%] max-w-none opacity-80 md:-top-44 md:-right-24 md:w-auto md:opacity-100 lg:-top-60 lg:-right-15"
        width={1583}
        height={1583}
      />
        
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.STARS_1}
        alt="Stars decoration left"
        className="pointer-events-none absolute -top-28 -left-32 h-auto w-[72%] max-w-none md:-top-44 md:-left-22 md:w-auto lg:-top-60 lg:-left-15"
        width={1060}
        height={1060}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.STARS_2}
        alt="Stars decoration bottom left"
        className="pointer-events-none absolute top-[58%] -left-10 h-auto w-40 md:top-[54%] md:-left-8 md:w-52 lg:top-150 lg:-left-15 lg:w-auto"
        width={337}
        height={403}
      />
      <Image
        src={ASSETS.MEMBER_SHOWCASE.BACKGROUND.STARS_1}
        alt="Stars decoration right"
        className="pointer-events-none absolute -top-28 -right-32 h-auto w-[72%] max-w-none scale-x-[-1] md:-top-44 md:-right-22 md:w-auto lg:-top-60 lg:-right-15"
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
        className="pointer-events-none absolute -bottom-50 -left-15 h-full w-full"
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
