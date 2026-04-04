"use client";

import { useState } from "react";
import { LeaderboardBackground } from "./LeaderboardBackground";
import { LeaderboardLanding } from "./LeaderboardLanding";
import { LeaderboardContributors } from "./LeaderboardContributors";
import { LeaderboardSummary } from "./LeaderboardSummary";
import type { LeaderboardView } from "../types";

export function LeaderboardSection() {
  const [view, setView] = useState<LeaderboardView>("landing");
  const [summarySource, setSummarySource] = useState<"members" | "core">("members");

  return (
    <div className="relative overflow-x-hidden pt-60 pb-48 w-full min-h-screen bg-[#0b0b0b] text-white">
      {/* Absolute positioned background art for the entire page */}
      <LeaderboardBackground />

      {/* Main Content Area */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {view === "landing" && (
          <LeaderboardLanding onSelectView={(v) => setView(v)} />
        )}

        {(view === "members" || view === "core") && (
          <LeaderboardContributors
            view={view}
            onBack={() => setView("landing")}
            onSeeMore={() => {
              setSummarySource(view);
              setView("summary");
            }}
          />
        )}

        {view === "summary" && (
          <LeaderboardSummary
            view={view}
            summaryView={summarySource}
            onBack={() => setView(summarySource)}
          />
        )}
      </div>
    </div>
  );
}
