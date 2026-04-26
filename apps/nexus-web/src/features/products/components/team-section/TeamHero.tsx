import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

const TEAM_IMAGES: Record<string, string> = {
  iot: "/products/iot-logo.webp",
  "ui-ux": "/products/ui-ux-logo.webp",
  "web-development": "/products/web-development-logo.webp",
  "data-ml": "/products/data-ml-logo.webp",
  cybersecurity: "/products/cybersecurity-logo.webp",
  "cloud-solutions": "/products/cloud-solutions-logo.webp",
  "project-management": "/products/project-management-logo.webp",
  executives: "/products/executives-logo.webp",
};

const TEAM_GLOW_COLORS: Record<string, string> = {
  "ui-ux": "#F9AB00",
  "web-development": "#4285F4",
  iot: "#EA4335",
  cybersecurity: "#34A853",
  "data-ml": "#4285F4",
  "cloud-solutions": "#EA4335",
  "project-management": "#34A853",
  executives: "#F9AB00",
};

type GlowSize = {
  base: string;
  md: string;
  lg: string;
};

const TEAM_GLOW_SIZES: Record<string, GlowSize> = {
  executives: {
    base: "420px",
    md: "280px",
    lg: "350px",
  },
};

interface TeamHeroProps {
  teamName: string;
  teamSlug: string;
}

export function TeamHero({ teamName, teamSlug }: TeamHeroProps) {
  const imageSrc = TEAM_IMAGES[teamSlug] ?? "/products/ui-ux-logo.webp";
  const glowColor = TEAM_GLOW_COLORS[teamSlug] ?? "#F9AB00";
  const glowSize = TEAM_GLOW_SIZES[teamSlug] ?? {
    base: "350px",
    md: "500px",
    lg: "550px",
  };

  return (
    <div className="relative w-full mt-20 flex flex-col items-center">
      {/* Main image */}
      <div className="relative w-full flex justify-center items-center">
        {/* Amber glow — radial-gradient, no CPU/GPU blur */}
        <div
          className="
    absolute rounded-full pointer-events-none z-[11]
    w-[var(--glow-size)] h-[var(--glow-size)]
    md:w-[var(--glow-size-md)] md:h-[var(--glow-size-md)]
    lg:w-[var(--glow-size-lg)] lg:h-[var(--glow-size-lg)]
  "
          style={{
            background: `radial-gradient(ellipse at center, ${glowColor}99 0%, ${glowColor}55 35%, ${glowColor}22 60%, transparent 75%)`,
            transform: "translateZ(0)",
            ["--glow-size" as string]: glowSize.base,
            ["--glow-size-md" as string]: glowSize.md,
            ["--glow-size-lg" as string]: glowSize.lg,
          }}
        />
        <Image
          src={imageSrc}
          alt={`${teamName} team`}
          width={900}
          height={500}
          className="w-full max-w-[250px] md:max-w-[350px] lg:max-w-[400px] rounded-2xl object-cover relative z-12"
        />
      </div>

      {/* Gold glow behind image — reduced blur cost */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-40 lg:-top-50 md:top-2 w-[1000px] md:w-[1000px] lg:w-[1900px] pointer-events-none z-10">
        <Image
          src="/products/gold-4.webp"
          alt=""
          width={1200}
          height={600}
          className="w-full h-auto  opacity-50 lg:opacity-30"
        />
      </div>

      {/* Spirals */}
      <div className="relative z-0 w-full max-w-3xl h-[110px] md:h-[140px] mt-[-6px] md:mt-[-10px] pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 -top-19 md:-top-20 w-[1360px] lg:w-570 aspect-[1204/188] opacity-70">
          <Image
            src={ASSETS.ID.SPIRAL_OUTER}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-18 md:-top-20 w-[1020px] md:w-[1170px] lg:w-480 aspect-[1204/188] opacity-70">
          <Image
            src={ASSETS.ID.SPIRAL_OUTER}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-14 md:-top-14 w-[880px] md:w-[1070px] lg:w-410 aspect-[1018/125] opacity-80">
          <Image
            src={ASSETS.ID.SPIRAL_CENTER}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-13 md:-top-14 w-[670px] md:w-[1070px] lg:w-450 aspect-[697/66] opacity-100">
          <Image
            src={ASSETS.ID.SPIRAL_INNER}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
