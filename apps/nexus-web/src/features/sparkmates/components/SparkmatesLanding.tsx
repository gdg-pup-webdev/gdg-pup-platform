"use client";

import Link from "next/link";
import { CosmosParticles } from "@/components/shared";
import { SparkmatesMascot } from "./SparkmatesMascot";
import { SparkmatesRainbowStreak } from "./SparkmatesRainbowStreak";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";

export const SparkmatesLanding = () => {
  const {  status  } = useAuthContext();
  const gdgId = "me";

  const portfolioHref = gdgId ? `/sparkmates/${gdgId}` : "/signin";

  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={350}
      particleSpread={15}
      speed={0.03}
      particleBaseSize={80}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="bg-[#010b1d] min-h-screen"
    >
      <div className="flex flex-col min-h-screen relative w-full overflow-hidden">
        {/* Rainbow streak — absolute behind content */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <SparkmatesRainbowStreak />
        </div>

        {/* Main content area */}
        <div className="flex flex-col items-center justify-center flex-1 pt-[168px] pb-24 relative z-10">
          <div className="flex flex-col md:flex-row gap-[64px] xl:gap-[80px] items-center justify-center w-full max-w-7xl px-6">

            {/* Left: Sparky Mascot */}
            <div className="hidden md:flex items-center justify-center shrink-0">
              <SparkmatesMascot />
            </div>

            {/* Right: Text + CTAs */}
            <div className="flex flex-col gap-[32px] items-center md:items-start w-full max-w-[494px] shrink-0">

              {/* Title & tagline */}
              <div className="flex flex-col gap-[16px] items-center text-center w-full">
                <h1
                  className="text-[40px] font-bold leading-[1.3] bg-clip-text text-transparent bg-gradient-to-b from-white to-[#4285f4] whitespace-nowrap"
                  style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
                >
                  Sparkmates
                </h1>
                <p
                  className="text-[#e5e5e5] text-[20px] font-bold leading-[1.5]"
                  style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
                >
                  Your GDG PUP Profile, Portfolio, and Progress
                  <br />
                  All in One Place
                </p>
              </div>

              {/* Description card */}
              <div 
                className="w-full rainbow-border backdrop-blur-md bg-white/5 px-6 py-10 transition-transform hover:scale-[1.01] duration-300 relative rounded-[28px]"
              >
                <div className="relative z-10 w-full">
                  <p
                    className="text-white text-[18px] leading-[1.5] text-justify whitespace-pre-wrap"
                    style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
                  >
                    <strong>Sparkmates</strong>
                    {" is your personalized space inside the Nexus. It brings together your learning journey, contributions, and growth within the GDG PUP community—whether you're just starting out or already building your path in tech."}
                  </p>
                  <br />
                  <p
                    className="text-white text-[18px] leading-[1.5] text-justify"
                    style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
                  >
                    {"Built to support students and beginners, Sparkmates helps you track progress, showcase achievements, and grow confidently alongside a community that learns and builds together."}
                  </p>
                </div>
                {/* Subtle inner glow */}
                <div className="absolute inset-0 pointer-events-none rounded-[28px] shadow-[inset_0px_4px_16px_0px_rgba(255,255,255,0.05)] z-0" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-[16px] items-center w-full">
                {/* View My Portfolio — dynamic link */}
                <Link
                  href={portfolioHref}
                  className="relative flex items-center justify-center w-full px-[16px] py-[12px] rounded-[8px] bg-gradient-to-b from-[#2b7fff] to-[#162456] border border-black shadow-[0px_4px_46.1px_0px_rgba(0,0,0,0.25),0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-opacity hover:opacity-90"
                  aria-label={gdgId ? `View portfolio for ${gdgId}` : "Sign in to view your portfolio"}
                >
                  <span
                    className="text-white text-[18px] font-medium leading-[1.5] text-center whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
                  >
                    {status === "checking"
                      ? "Loading..."
                      : gdgId
                      ? "View My Portfolio"
                      : "Sign In to View Portfolio"}
                  </span>
                  {/* Inner highlight */}
                  <div className="absolute inset-0 pointer-events-none rounded-[8px] shadow-[inset_0px_2px_0px_0px_rgba(255,255,255,0.4)]" />
                </Link>

                {/* View My XPark Points with rainbow bottom border */}
                <Link
                  href="/leaderboard"
                  className="relative flex items-center justify-center px-[8px] py-[8px] transition-opacity hover:opacity-80 group overflow-hidden"
                >
                  <span
                    className="text-white text-[18px] font-medium leading-[1.5] text-center whitespace-nowrap"
                    style={{ fontFamily: 'var(--font-google-sans, "Google Sans", sans-serif)' }}
                  >
                    View My XPark Points
                  </span>
                  {/* Rainbow Bottom Border Component */}
                  <div 
                    className="absolute bottom-0 left-0 w-full h-[2px]"
                    style={{ background: "linear-gradient(157deg, #FB2C36 0%, #F0B100 5%, #00C950 10%, #2B7FFF 15%, #FFF 50.48%, #2B7FFF 85%, #00C950 90%, #F0B100 95%, #FB2C36 100%)" }}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CosmosParticles>
  );
};
