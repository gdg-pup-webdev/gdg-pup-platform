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
  void onBack;
  void summaryView;

  return null;
}
