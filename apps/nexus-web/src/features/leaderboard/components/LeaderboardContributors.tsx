import { ASSETS } from "@/lib/constants/assets";
import { LeaderboardBackButton } from "./LeaderboardBackButton";
import { LeaderboardPodium } from "./LeaderboardPodium";
import { LeaderboardScaledFrame } from "./LeaderboardScaledFrame";
import { LeaderboardTable } from "./LeaderboardTable";
import type { LeaderboardEntry, PodiumEntry } from "../types";

interface LeaderboardContributorsProps {
  view: "members" | "core";
  onBack: () => void;
  onSeeMore: () => void;
}

const ARTBOARD_WIDTH = 1285;
const ARTBOARD_HEIGHT = 1685.9964599609375;

const PODIUM_ENTRIES: {
  gold: PodiumEntry;
  silver: PodiumEntry;
  bronze: PodiumEntry;
} = {
  gold: {
    name: "Sparky Lorenzo",
    points: 1000,
    avatarUrl: ASSETS.LEADERBOARD.AVATAR_GOLD,
  },
  silver: {
    name: "Sparky Locaycay",
    points: 900,
    avatarUrl: ASSETS.LEADERBOARD.AVATAR_SILVER,
  },
  bronze: {
    name: "Sparky Lorenzo",
    points: 850,
    avatarUrl: ASSETS.LEADERBOARD.AVATAR_BRONZE,
  },
};

function buildContributorEntries(view: "members" | "core"): LeaderboardEntry[] {
  const roles =
    view === "members"
      ? [
          "Sparkmate",
          "Sparkmate",
          "Role | Department/Team",
          "Role | Department/Team",
          "Role | Department/Team",
          "Role | Department/Team",
        ]
      : Array.from({ length: 6 }, () => "Role | Department/Team");

  return roles.map((role, index) => ({
    rank: index + 1,
    name: "Cirby Locaycay",
    role,
    points: 500,
    avatarUrl: ASSETS.LEADERBOARD.AVATAR_PLACEHOLDER,
    isCurrentUser: index === 5,
  }));
}

export function LeaderboardContributors({
  view,
  onBack,
  onSeeMore,
}: LeaderboardContributorsProps) {
  const viewLabel =
    view === "members" ? "Sparkmates (Members)" : "Sparkmates (Core)";

  return (
    <LeaderboardScaledFrame
      baseWidth={ARTBOARD_WIDTH}
      baseHeight={ARTBOARD_HEIGHT}
      className="w-full max-w-[1285px]"
    >
      <div className="relative h-[1685.996px] w-[1285px]">
        <div className="absolute left-[7px] top-0 flex w-[1271px] items-start gap-[96px]">
          <LeaderboardBackButton onClick={onBack} />

          <div className="flex w-[875px] justify-center">
            <div className="flex h-[176px] w-[912px] flex-col items-center justify-center">
              <div className="mt-[3.5px] flex flex-col items-center gap-[16px]">
                <h1
                  className="whitespace-nowrap bg-center bg-clip-text bg-cover bg-no-repeat text-center text-[72px] font-bold leading-[86.4px] text-transparent"
                  style={{
                    backgroundImage: `url('${ASSETS.LEADERBOARD.HEADLINE_GRADIENT_CONTRIBUTORS}')`,
                    fontFamily: "'Google Sans', sans-serif",
                  }}
                >
                  TOP CONTRIBUTORS
                </h1>
                <h2
                  className="text-center text-[48px] font-bold leading-[57.6px] text-white"
                  style={{ fontFamily: "'Google Sans', sans-serif" }}
                >
                  {viewLabel}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-[42.5px] top-[236px] h-[623.996px] w-[1200px]">
          <LeaderboardPodium
            gold={PODIUM_ENTRIES.gold}
            silver={PODIUM_ENTRIES.silver}
            bronze={PODIUM_ENTRIES.bronze}
          />
        </div>

        <div className="absolute left-0 top-[919.996px]">
          <LeaderboardTable
            entries={buildContributorEntries(view)}
            onSeeMore={onSeeMore}
            showFooter
          />
        </div>
      </div>
    </LeaderboardScaledFrame>
  );
}
