"use client";

import { WhoAreWeSection, HeroSection, WhatWeDoSection, WhatDrivesUsSection, ImpactSection, SparkStartsHereSection, HomeBackground } from "@/features/home";

export default function HomePage() {
  return (
    <>
      <div className="relative z-20">
        <HeroSection />
      </div>
      <div className="relative z-10">
        <HomeBackground />
        <div className="relative z-10">
          <WhoAreWeSection />
          <WhatWeDoSection />
          <WhatDrivesUsSection />
          <ImpactSection />
          <SparkStartsHereSection />
        </div>
      </div>
    </>
  );
}
