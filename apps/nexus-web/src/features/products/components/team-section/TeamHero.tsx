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
  executives: "/products/executives-logo.png",
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
const TEAM_GLOW_SIZES: Record<string, string> = {
  executives: "350px",
};

interface TeamHeroProps {
  teamName: string;
  teamSlug: string;
}

export function TeamHero({ teamName, teamSlug }: TeamHeroProps) {
  const imageSrc = TEAM_IMAGES[teamSlug] ?? "/products/ui-ux-logo.webp";
  const glowColor = TEAM_GLOW_COLORS[teamSlug] ?? "#F9AB00";
  const glowSize = TEAM_GLOW_SIZES[teamSlug] ?? "550px";

  return (
    <div className="w-full mt-20 flex flex-col items-center">
      {/* Main image */}
      <div className="relative w-full flex justify-center items-center">
        {/* Amber glow */}
        <div
          className="absolute rounded-full blur-[218.50px] pointer-events-none z-11"
          style={{
            backgroundColor: glowColor,
            opacity: 0.75,
            width: glowSize,
            height: glowSize,
          }}
        />
        <Image
          src={imageSrc}
          alt={`${teamName} team`}
          width={900}
          height={500}
          className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] rounded-2xl object-cover relative z-12"
        />
      </div>

      {/* Gold glow behind image */}
      <div className="absolute left-1/2 -translate-x-1/2 top-10 w-[1200px] lg:w-[1900px] pointer-events-none z-10">
        <Image
          src="/products/gold-4.png"
          alt=""
          width={1200}
          height={600}
          className="w-full h-auto mix-blend-screen opacity-67 blur-[50px]"
        />
      </div>

      {/* Spirals */}
      <div className="relative w-full max-w-3xl h-[100px] md:h-[140px] mt-[-10px] pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-[300px] md:w-[450px] lg:w-570 aspect-[1204/188] opacity-70">
          <Image
            src={ASSETS.ID.SPIRAL_OUTER}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-30 w-[240px] md:w-[360px] lg:w-480 aspect-[1204/188] opacity-70">
          <Image
            src={ASSETS.ID.SPIRAL_OUTER}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-[200px] md:w-[300px] lg:w-410 aspect-[1018/125] opacity-80">
          <Image
            src={ASSETS.ID.SPIRAL_CENTER}
            alt=""
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-[220px] md:w-[330px] lg:w-450 aspect-[697/66] opacity-100">
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
