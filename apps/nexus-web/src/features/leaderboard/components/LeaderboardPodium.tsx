import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import type { PodiumEntry } from "../types";

interface LeaderboardPodiumProps {
  gold: PodiumEntry;
  silver: PodiumEntry;
  bronze: PodiumEntry;
}

export function LeaderboardPodium({
  gold,
  silver,
  bronze,
}: LeaderboardPodiumProps) {
  void gold;
  void silver;
  void bronze;

  return null;
}
