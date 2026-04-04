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
  void onSelectView;

  return null;
}
