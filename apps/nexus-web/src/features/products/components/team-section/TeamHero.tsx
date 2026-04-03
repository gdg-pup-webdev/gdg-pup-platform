import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";

interface TeamHeroProps {
  teamName: string;
}

export function TeamHero({ teamName }: TeamHeroProps) {
  return (
    <div className="w-full mt-20 flex flex-col items-center">
      {/* Main image */}
      <div className="w-full flex justify-center">
        <Image
          src="/products/ui-ux-logo.webp"
          alt={`${teamName} team`}
          width={900}
          height={500}
          className="w-full max-w-[400px] md:max-w-[500px] lg:max-w-[600px] rounded-2xl object-cover relative z-20"
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
          <Image src={ASSETS.ID.SPIRAL_OUTER} alt="" fill className="object-contain" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-30 w-[240px] md:w-[360px] lg:w-480 aspect-[1204/188] opacity-70">
          <Image src={ASSETS.ID.SPIRAL_OUTER} alt="" fill className="object-contain" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-24 w-[200px] md:w-[300px] lg:w-410 aspect-[1018/125] opacity-80">
          <Image src={ASSETS.ID.SPIRAL_CENTER} alt="" fill className="object-contain" />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -top-25 w-[220px] md:w-[330px] lg:w-450 aspect-[697/66] opacity-100">
          <Image src={ASSETS.ID.SPIRAL_INNER} alt="" fill className="object-contain" />
        </div>
      </div>
    </div>
  );
}
