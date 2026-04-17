import { Metadata } from "next";
import { LeaderboardSection } from "@/features/leaderboard";

export const metadata: Metadata = {
  title: "Leaderboard | GDG PUP Nexus",
  description: "See the top contributors and most active members of GDG PUP. Earn Sparky Points by participating in events and activities.",
  openGraph: { images: ["/og/leaderboard.webp"] },
  twitter: { images: ["/og/leaderboard.webp"] },
};

export default function LeaderboardPage() {
  return <LeaderboardSection />;
}
