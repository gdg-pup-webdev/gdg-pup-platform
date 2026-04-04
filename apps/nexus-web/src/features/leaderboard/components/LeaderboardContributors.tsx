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
  void view;
  void onBack;
  void onSeeMore;

  return null;
}
