import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import { LeaderboardBackButton } from "./LeaderboardBackButton";
import { LeaderboardScaledFrame } from "./LeaderboardScaledFrame";
import { LeaderboardTable } from "./LeaderboardTable";
import type { LeaderboardEntry } from "../types";

interface LeaderboardSummaryProps {
  view: "summary";
  summaryView: "members" | "core";
  onBack: () => void;
}

const ARTBOARD_WIDTH = 1286;
const ARTBOARD_HEIGHT = 2294.23046875;

function buildSummaryEntries(role: string): LeaderboardEntry[] {
  return Array.from({ length: 15 }, (_, index) => ({
    rank: index + 1,
    name: "Cirby Locaycay",
    role,
    points: 500,
    avatarUrl: ASSETS.LEADERBOARD.AVATAR_PLACEHOLDER,
    isCurrentUser: index === 11,
  }));
}

export function LeaderboardSummary({
  onBack,
  summaryView,
}: LeaderboardSummaryProps) {
  const summaryLabel =
    summaryView === "members" ? "Sparkmates (Members)" : "Sparkmates (Core)";
  const summaryRole =
    summaryView === "members" ? "Sparkmate" : "Role | Department/Team";

  return (
    <LeaderboardScaledFrame
      baseWidth={ARTBOARD_WIDTH}
      baseHeight={ARTBOARD_HEIGHT}
      className="w-full max-w-[1286px]"
    >
      <div className="relative h-[2294.23px] w-[1286px]">
        <div className="absolute left-0 top-0 flex w-[1271px] items-start gap-[96px]">
          <LeaderboardBackButton onClick={onBack} />

          <div className="flex w-[919px] justify-center">
            <div className="flex h-[176px] w-[912px] flex-col items-center justify-center">
              <div className="mt-[3.5px] flex flex-col items-center gap-[16px]">
                <h1
                  className="w-[912px] whitespace-nowrap bg-center bg-clip-text bg-cover bg-no-repeat text-center text-[68px] font-bold leading-[81.6px] text-transparent"
                  style={{
                    backgroundImage: `url('${ASSETS.LEADERBOARD.HEADLINE_GRADIENT}')`,
                    fontFamily: "'Google Sans', sans-serif",
                  }}
                >
                  LEADERBOARD SUMMARY
                </h1>
                <h2
                  className="text-center text-[48px] font-bold leading-[57.6px] text-white"
                  style={{ fontFamily: "'Google Sans', sans-serif" }}
                >
                  {summaryLabel}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-[208px] h-[2086.23px] w-[1286px]">
          <div className="absolute left-[400px] top-0 z-[1] h-[486px] w-[493px]">
            <div className="relative h-[486px] w-[493px] overflow-hidden">
              <Image
                src={ASSETS.LEADERBOARD.SPARKY_MASCOT}
                alt="Sparky leaderboard mascot"
                width={493}
                height={668}
                sizes="493px"
                className="absolute left-[0.986px] top-[-57.008px] h-[668.007px] w-[493px] max-w-none -scale-x-100 object-fill"
              />
            </div>
          </div>

          <div className="absolute left-0 top-[402.23px] z-0">
            <LeaderboardTable
              entries={buildSummaryEntries(summaryRole)}
              showFooter
            />
          </div>
        </div>
      </div>
    </LeaderboardScaledFrame>
  );
}
