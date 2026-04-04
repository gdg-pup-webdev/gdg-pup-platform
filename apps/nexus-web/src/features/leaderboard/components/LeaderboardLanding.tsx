import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import { LeaderboardScaledFrame } from "./LeaderboardScaledFrame";
import type { LeaderboardView } from "../types";

interface LeaderboardLandingProps {
  onSelectView: (view: LeaderboardView) => void;
}

const ARTBOARD_WIDTH = 1278.587158203125;
const ARTBOARD_HEIGHT = 1327.4185791015625;
const CARD_BACKGROUND =
  "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(65,65,65,0.8) 50%, rgba(0,0,0,0.8) 100%)";
const OUTER_BORDER_GRADIENT =
  "conic-gradient(from 180deg at 50% 50%, #4285F4 0deg, #EA4335 120deg, #FBBC04 240deg, #34A853 360deg)";
const MEMBERS_BORDER_GRADIENT =
  "linear-gradient(225deg, #EA4335 0%, rgba(255,255,255,0.1) 50%, #4285F4 100%)";
const CORE_BORDER_GRADIENT =
  "linear-gradient(135deg, rgba(255,255,255,0.1) 50%, #34A853 100%)";

function GradientBorder({
  gradient,
  radius,
  borderWidth,
}: {
  gradient: string;
  radius: string;
  borderWidth: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: radius,
        padding: borderWidth,
        background: gradient,
        WebkitMask:
          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
}

interface MembershipCardProps {
  borderGradient: string;
  description: string;
  descriptionPadding?: string;
  descriptionWidth: string;
  onClick: () => void;
  padding: string;
  title: string;
  titleInset: string;
  wrapperWidth: string;
}

function MembershipCard({
  borderGradient,
  description,
  descriptionPadding,
  descriptionWidth,
  onClick,
  padding,
  title,
  titleInset,
  wrapperWidth,
}: MembershipCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-[264px] w-[451px] appearance-none flex-col items-center justify-center rounded-[28px] bg-[rgba(217,217,217,0.05)] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${padding}`}
    >
      <GradientBorder
        gradient={borderGradient}
        radius="28px"
        borderWidth="2px"
      />

      <div className={`relative z-10 flex flex-col items-center gap-[16px] ${wrapperWidth}`}>
        <div className="relative h-[66px] w-[378px]">
          <div className="absolute inset-0 rounded-[100px] bg-[rgba(255,255,255,0.1)]" />
          <p
            className={`absolute text-[24px] font-bold leading-[36px] text-white whitespace-nowrap ${titleInset}`}
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            {title}
          </p>
        </div>

        <div
          className={`flex items-center justify-center ${descriptionPadding ?? ""}`}
        >
          <p
            className="text-[20px] leading-[30px] text-white"
            style={{
              fontFamily: "'Google Sans', sans-serif",
              width: descriptionWidth,
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function GoldGlow({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute flex items-center justify-center mix-blend-screen ${className}`}
      style={{ filter: "blur(50px)" }}
    >
      <div className="relative h-[625.301px] w-[351.851px] -scale-y-100 rotate-[-74.26deg]">
        <Image
          src={ASSETS.LEADERBOARD.GOLD_TEXTURE}
          alt=""
          fill
          sizes="351.851px"
          className="object-cover"
        />
      </div>
    </div>
  );
}

function PedestalBase() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 h-[183.902px] w-[1278.587px]"
    >
      <div
        className="absolute left-0 top-[8.728px] rounded-[50%]"
        style={{
          width: "1278.587158203125px",
          height: "175.17453002929688px",
          border: "1px solid rgba(255,255,255,0.2)",
          background:
            "radial-gradient(ellipse at center, rgba(63,63,63,0.22) 0%, rgba(17,17,17,0.82) 54%, rgba(0,0,0,0.96) 100%)",
          boxShadow: "inset 0 0 24px rgba(255,255,255,0.04)",
        }}
      />
      <div
        className="absolute left-[82.379px] top-0 rounded-[50%]"
        style={{
          width: "1120.2442626953125px",
          height: "125.30278778076172px",
          border: "1px solid rgba(255,255,255,0.3)",
          background:
            "radial-gradient(ellipse at center, rgba(53,53,53,0.22) 0%, rgba(14,14,14,0.6) 65%, rgba(0,0,0,0.12) 100%)",
          boxShadow: "inset 0 0 18px rgba(255,255,255,0.03)",
        }}
      />
      <div
        className="absolute left-[257.468px] top-[19.326px] rounded-[50%]"
        style={{
          width: "766.7781982421875px",
          height: "66.08007049560547px",
          border: "1px solid rgba(255,255,255,0.45)",
          background: "rgba(255,255,255,0.01)",
        }}
      />
    </div>
  );
}

export function LeaderboardLanding({ onSelectView }: LeaderboardLandingProps) {
  return (
    <LeaderboardScaledFrame
      baseWidth={ARTBOARD_WIDTH}
      baseHeight={ARTBOARD_HEIGHT}
      className="w-full max-w-[1278.587158203125px]"
    >
      <div
        className="relative"
        style={{
          width: `${ARTBOARD_WIDTH}px`,
          height: `${ARTBOARD_HEIGHT}px`,
        }}
      >
        <div className="absolute left-[39.294px] top-0 flex h-[241px] w-[1200px] flex-col items-center justify-center gap-[23px]">
          <h1
            className="bg-center bg-clip-text bg-cover bg-no-repeat text-[72px] font-bold leading-[86.4px] text-transparent whitespace-nowrap"
            style={{
              backgroundImage: `url('${ASSETS.LEADERBOARD.HEADLINE_GRADIENT}')`,
              fontFamily: "'Google Sans', sans-serif",
            }}
          >
            LEADERBOARD
          </h1>

          <div className="flex flex-col items-center text-center text-white">
            <h2
              className="text-[48px] font-bold leading-[57.6px] whitespace-nowrap"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              See Who&apos;s Leading the Community
            </h2>
            <div
              className="mt-[12px] w-[1152px] text-[24px] leading-[36px]"
              style={{ fontFamily: "'Google Sans', sans-serif" }}
            >
              <p>
                Track participation, celebrate impact, and recognize the members
                who help move GDG PUP forward.
              </p>
              <p>
                Our leaderboards highlight active contributors across events,
                projects, and community initiatives.
              </p>
            </div>
          </div>
        </div>

        <div className="absolute left-[376px] top-[285px] z-20 h-[490px] w-[493px]">
          <Image
            src={ASSETS.LEADERBOARD.SPARKY_MASCOT}
            alt="Sparky leaderboard mascot"
            fill
            sizes="493px"
            priority
            className="object-contain"
            style={{ objectPosition: "50% 45px", transform: "scale(1.02)" }}
          />
        </div>

        <GoldGlow className="left-[241px] top-[819.094px] h-[508.325px] w-[697.314px]" />

        <div className="absolute left-0 top-[1104.094px]">
          <PedestalBase />
        </div>

        <div
          className="absolute left-[111.782px] top-[699px] z-10 flex h-[435px] w-[1022px] flex-col items-center justify-end gap-[24px] rounded-[24px] px-[52px] py-[33px]"
          style={{ background: CARD_BACKGROUND }}
        >
          <GradientBorder
            gradient={OUTER_BORDER_GRADIENT}
            radius="24px"
            borderWidth="2px"
          />

          <h3
            className="relative z-10 w-[1152px] text-center text-[40px] font-bold leading-[52px] text-white"
            style={{ fontFamily: "'Google Sans', sans-serif" }}
          >
            Choose a Membership View:
          </h3>

          <div className="relative z-10 flex h-[264px] items-end justify-center gap-[32px]">
            <MembershipCard
              borderGradient={MEMBERS_BORDER_GRADIENT}
              description="Explore rankings among GDG PUP members based on engagement, participation, and earned Spark Points."
              descriptionPadding="p-[10px]"
              descriptionWidth="368px"
              onClick={() => onSelectView("members")}
              padding="px-[31px] py-[19px]"
              title="Sparkmates (Members)"
              titleInset="inset-x-[55px] top-[15px]"
              wrapperWidth="w-[388px]"
            />

            <MembershipCard
              borderGradient={CORE_BORDER_GRADIENT}
              description="View the leaderboard for core team members and leads who drive initiatives, organize events, and support the community behind the scenes."
              descriptionWidth="362px"
              onClick={() => onSelectView("core")}
              padding="px-[36px] py-[16px]"
              title="Sparkmates (Core)"
              titleInset="inset-x-[68px] top-[15px]"
              wrapperWidth="w-[378px]"
            />
          </div>
        </div>
      </div>
    </LeaderboardScaledFrame>
  );
}
