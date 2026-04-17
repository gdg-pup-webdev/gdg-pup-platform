"use client";

import Link from "next/link";
import Image from "next/image";
import { Button, Text } from "@packages/spark-ui";
import { CosmosParticles } from "@/components/shared";
import { ASSETS } from "@/lib/constants/assets";

interface SparkmatesBrandedErrorScreenProps {
  title: string;
  message: string;
  backHref?: string;
  onAction?: () => void;
  buttonLabel?: string;
}

export function SparkmatesBrandedErrorScreen({
  title,
  message,
  backHref,
  onAction,
  buttonLabel = "Back",
}: SparkmatesBrandedErrorScreenProps) {
  const actionButton = (
    <Button
      variant="colored"
      subVariant="red"
      className="text-white font-semibold text-sm sm:text-base px-5 sm:px-8 py-2 sm:py-3 bg-red-600 hover:bg-red-700"
      onClick={onAction}
    >
      {buttonLabel}
    </Button>
  );

  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4", "#ea4335", "#fbbc04", "#34a853"]}
      particleCount={300}
      particleSpread={15}
      speed={0.03}
      particleBaseSize={80}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-x-hidden py-12 bg-[#0a162a]"
    >
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden={true}>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-yellow-500/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      <div className="group relative z-40 flex items-center justify-center w-full px-4 shrink-0">
        <div className="relative rounded-[28px] rainbow-border backdrop-blur-md bg-white/5 shadow-[inset_0px_4px_16px_0px_rgba(255,255,255,0.05)] text-center w-full max-w-xl pt-14 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-12">
          <div className="-top-12 sm:-top-14 absolute left-1/2 -translate-x-1/2 z-50 group-hover:scale-105 group-hover:rotate-2 transition-all duration-200">
            <Image
              src={ASSETS.SPARKY_POINTS.CIRBY_DENIED}
              alt="Cirby crying"
              width={140}
              height={140}
              className="object-contain w-22.5 sm:w-30"
              priority
            />
          </div>

          <Text as="h2" variant="heading-5" gradient="red" className="mb-2 font-bold text-[24px]! sm:text-[32px]!">
            Oops! Something Went Wrong
          </Text>

          <Text as="h2" variant="heading-6" className="mb-4 sm:mb-6 font-bold text-white text-[18px]! sm:text-[24px]!">
            {title}
          </Text>

          <Text as="p" variant="body" gradient="white-blue" className="mb-6 sm:mb-8 text-[14px]! sm:text-[16px]!">
            {message}
          </Text>

          <div className="flex justify-center">
            {backHref ? <Link href={backHref}>{actionButton}</Link> : actionButton}
          </div>
        </div>
      </div>
    </CosmosParticles>
  );
}
