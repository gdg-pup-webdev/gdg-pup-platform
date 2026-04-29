"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button, Text } from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import { CosmosParticles } from "@/components/shared";

export default function NotFound() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

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
      {/* Decorative background elements matching GDG colors subtly */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden={true}>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-yellow-500/5 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[100px]" />
      </div>

      {/* 404 text  */}
      <div className="relative z-20 flex items-center justify-center w-full shrink-0">
        <h1
          className="text-[120px] min-[380px]:text-[160px] sm:text-[240px] md:text-[340px] lg:text-[420px] font-extrabold leading-none text-transparent"
          style={{
            WebkitTextStroke: "8px transparent",
            backgroundImage:
              "linear-gradient(to bottom right, #1888F8, #1752A1)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextStrokeColor: "url(#gradient)",
          }}
        >
          404
        </h1>
      </div>

      {/* modal */}
      <div className="group relative z-40 flex items-center justify-center w-full px-4 shrink-0 -mt-4 sm:-mt-6 md:-mt-8">
        <div className="relative rounded-[28px] rainbow-border backdrop-blur-md bg-white/5 shadow-[inset_0px_4px_16px_0px_rgba(255,255,255,0.05)] text-center w-full max-w-xl pt-14 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-12">
          <div className="-top-12 sm:-top-14 absolute left-1/2 -translate-x-1/2 z-50 group-hover:scale-105 group-hover:rotate-2 transition-all duration-200">
            <Image
              src={ASSETS.NOT_FOUND.RESTING_SPARKY}
              alt="Resting Sparky"
              width={140}
              height={140}
              className="object-contain w-[90px] sm:w-[120px]"
              priority
            />
          </div>

          {/* modal content */}
          <Text as="h2" variant="heading-5" gradient="red" className="mb-2 font-bold !text-[24px] sm:!text-[32px]">
            Uh-oh! Page Not Found
          </Text>
          <Text as="h2" variant="heading-6" className="mb-4 sm:mb-6 font-bold text-white !text-[18px] sm:!text-[24px]">
            (But Sparky&apos;s here!)
          </Text>

          <Text as="p" variant="body" gradient="white-blue" className="mb-3 sm:mb-4 !text-[14px] sm:!text-[16px]">
            Looks like this page took a vacation without telling us! Don’t fret,
            even our amazing Sparky can’t find everything instantly.
          </Text>

          <Text as="p" variant="body" gradient="white-blue" className="mb-6 sm:mb-8 text-center text-balance mx-auto !text-[14px] sm:!text-[16px]">
            In the meantime, let’s get you back to where the magic happens.
          </Text>

          <div className="flex justify-center">
            <Button
              onClick={handleBackClick}
              variant="colored"
              subVariant="blue"
              className="text-white font-semibold text-sm sm:text-base px-5 sm:px-8 py-2 sm:py-3"
            >
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* gradient definition for stroke */}
      <svg width="0" height="0">
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop stopColor="#1888F8" offset="0%" />
          <stop stopColor="#1752A1" offset="100%" />
        </linearGradient>
      </svg>
    </CosmosParticles>
  );
}
