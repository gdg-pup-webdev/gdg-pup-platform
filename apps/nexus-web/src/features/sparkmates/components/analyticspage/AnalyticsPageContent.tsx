"use client";

import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useGetProfileAnalytics, useGetNfcAnalytics } from "@/features/analytics";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import { Text, Badge } from "@packages/spark-ui";
import { SparkmatesRainbowStreak } from "../SparkmatesOwnerView/components/SparkmatesRainbowStreak";
import { FadeInSection } from "../SparkmatesOwnerView/components/FadeInSection";
import { Eye, Smartphone, TrendingUp, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const AnalyticsPageContent = () => {
  const { decodedToken } = useAuthContext();
  const gdgId = decodedToken?.memberInfo.gdgId || "";

  const { data: profileAnalytics, isLoading: loadingProfile } = useGetProfileAnalytics(gdgId);
  const { data: nfcAnalytics, isLoading: loadingNfc } = useGetNfcAnalytics(gdgId);

  const isLoading = loadingProfile || loadingNfc;

  if (isLoading) {
    return <LoadingScreen message="Loading analytics..." />;
  }


  const totalViews = profileAnalytics?.totalViews || 0;
  const totalScans = nfcAnalytics?.totalScans || 0;
  const recentViews = profileAnalytics?.latestViews.views || [];
  const recentScans = nfcAnalytics?.latestScans.scans || [];

  return (
    <CosmosParticles
      particleColors={["#ffffff", "#4285f4"]}
      particleCount={180}
      particleSpread={14}
      speed={0.028}
      particleBaseSize={75}
      moveParticlesOnHover
      alphaParticles={true}
      disableRotation={false}
      className="min-h-screen bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-6 pb-24 pt-36 text-white"
    >
      <div className="relative min-h-screen w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <SparkmatesRainbowStreak />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl">
          <FadeInSection delay={0.02}>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Link href="/sparkmates/me" className="mb-4 flex items-center gap-2 text-[#C1C7CD] transition-colors hover:text-white">
                  <ChevronLeft size={16} />
                  <span>Back to Portfolio</span>
                </Link>
                <Text variant="heading-4" className="text-white">
                  Analytics Overview
                </Text>
                <Text variant="body" className="text-[#C1C7CD]">
                  Track your digital presence and network impact.
                </Text>
              </div>
              <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400">
                Live Data
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-white/20">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                  <Eye size={24} />
                </div>
                <Text variant="body" className="text-[#C1C7CD]">Total Profile Views</Text>
                <Text variant="heading-2" className="mt-1 font-bold text-white">
                  {totalViews}
                </Text>
                <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
                  <TrendingUp size={14} />
                  <span>Always growing</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-white/20">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                  <Smartphone size={24} />
                </div>
                <Text variant="body" className="text-[#C1C7CD]">NFC Card Scans</Text>
                <Text variant="heading-2" className="mt-1 font-bold text-white">
                  {totalScans}
                </Text>
                <div className="mt-4 flex items-center gap-2 text-sm text-purple-400">
                  <Smartphone size={14} />
                  <span>Physical networking power</span>
                </div>
              </div>
            </div>

            {/* Activity Lists */}
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Recent Views */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <Text variant="heading-6" className="text-white">Recent Profile Views</Text>
                  <Eye size={18} className="text-white/60" />
                </div>
                <div className="space-y-4">
                  {recentViews.length > 0 ? (
                    recentViews.map((view) => (
                      <div key={view.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                            <Eye size={16} />
                          </div>
                          <div>
                            <Text variant="body-sm" className="font-medium text-white">
                              Viewed from {view.source}
                            </Text>
                            <Text variant="caption" className="text-[#C1C7CD]">
                              {view.user_agent.split(' ')[0]}
                            </Text>
                          </div>
                        </div>
                        <Text variant="caption" className="text-[#C1C7CD]">
                          {new Date(view.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center text-[#C1C7CD]">
                      <Calendar size={32} className="mb-2 opacity-40" />
                      <Text variant="body-sm">No recent views yet.</Text>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Scans */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <Text variant="heading-6" className="text-white">NFC Card Activity</Text>
                  <Smartphone size={18} className="text-white/60" />
                </div>
                <div className="space-y-4">
                  {recentScans.length > 0 ? (
                    recentScans.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                            <Smartphone size={16} />
                          </div>
                          <div>
                            <Text variant="body-sm" className="font-medium text-white">
                              NFC Card Scanned
                            </Text>
                            <Text variant="caption" className="text-[#C1C7CD]">
                              Context: {scan.scanContext || "Direct"}
                            </Text>
                          </div>
                        </div>
                        <Text variant="caption" className="text-[#C1C7CD]">
                          {new Date(scan.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-40 flex-col items-center justify-center text-[#C1C7CD]">
                      <Smartphone size={32} className="mb-2 opacity-40" />
                      <Text variant="body-sm">No recent scans yet.</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </CosmosParticles>
  );
};
