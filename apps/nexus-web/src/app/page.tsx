"use client";


import { WhoAreWeSection, HeroSection, WhatWeDoSection, WhatDrivesUsSection, ImpactSection, SparkStartsHereSection, HomeBackground } from "@/features/home";
import { CosmosParticles } from "@/components/shared";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <div className="relative z-20">
        <HeroSection />
      </div>
      <div className="relative z-10 bg-[#010B1D]">
        <HomeBackground />
        <CosmosParticles particleColors={["#ffffff"]} particleCount={135} className="min-h-screen">
          <div className="relative z-10">
            <WhoAreWeSection />
            <WhatWeDoSection />
            <WhatDrivesUsSection />
            <ImpactSection />
            <SparkStartsHereSection />
          </div>
        </CosmosParticles>
      </div>
    </main>
  );
}
