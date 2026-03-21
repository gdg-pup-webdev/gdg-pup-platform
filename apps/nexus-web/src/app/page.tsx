"use client";

import { WhoAreWeSection, HeroSection, WhatWeDoSection, WhatDrivesUsSection, ImpactSection, SparkStartsHereSection, HomeBackground } from "@/features/home";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <div className="relative z-20">
        <HeroSection />
      </div>
      <div className="relative z-10 bg-[#010B1D]">
        <HomeBackground />
        <div className="relative z-10">
          <WhoAreWeSection />
          <WhatWeDoSection />
          <WhatDrivesUsSection />
          <ImpactSection />
          <SparkStartsHereSection />
        </div>
      </div>
    </main>
  );
}
