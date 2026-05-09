"use client";

import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useGetProfileAnalytics, useGetNfcAnalytics } from "@/features/analytics";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import { Text, Badge } from "@packages/spark-ui";
import { FadeInSection } from "../SparkmatesOwnerView/components/FadeInSection";
import { Eye, Smartphone, TrendingUp, Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const AnalyticsPageContent = () => {
  const { decodedToken } = useAuthContext();
  const gdgId = decodedToken?.memberInfo.gdgId || "";

  const [daysFilter, setDaysFilter] = useState<number>(7);

  const { data: profileAnalytics, isLoading: loadingProfile } = useGetProfileAnalytics(gdgId, daysFilter);
  const { data: nfcAnalytics, isLoading: loadingNfc } = useGetNfcAnalytics(gdgId, daysFilter);

  const isLoading = loadingProfile || loadingNfc;

  const totalViews = profileAnalytics?.totalViews || 0;
  const totalScans = nfcAnalytics?.totalScans || 0;
  const recentViews = (profileAnalytics?.latestViews.views || []).slice(0, 10);
  const recentScans = (nfcAnalytics?.latestScans.scans || []).slice(0, 10);

  // Merge daily stats for the chart
  const mergedStats = useMemo(() => {
    const pStats = (profileAnalytics?.dailyStats as { date: string; count: number }[]) || [];
    const nStats = (nfcAnalytics?.dailyStats as { date: string; count: number }[]) || [];
    
    const statsMap = new Map<string, { date: string; views: number; scans: number }>();
    
    // Aggressively group by month if the data represents more than a single month (31 days)
    // or if the daysFilter is explicitly 365. This ensures the chart is never overloaded.
    const shouldGroupByMonth = pStats.length > 31 || nStats.length > 31 || Number(daysFilter) === 365;
    
    const getGroupKey = (dateStr: string) => {
      if (shouldGroupByMonth) {
        // Group by YYYY-MM
        const [year, month] = dateStr.split("-");
        return `${year}-${month}`;
      }
      return dateStr;
    };

    pStats.forEach((p) => {
      const key = getGroupKey(p.date);
      if (statsMap.has(key)) {
        statsMap.get(key)!.views += p.count;
      } else {
        statsMap.set(key, { date: key, views: p.count, scans: 0 });
      }
    });
    
    nStats.forEach((n) => {
      const key = getGroupKey(n.date);
      if (statsMap.has(key)) {
        statsMap.get(key)!.scans += n.count;
      } else {
        statsMap.set(key, { date: key, views: 0, scans: n.count });
      }
    });

    return Array.from(statsMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(stat => {
        if (shouldGroupByMonth) {
          // Parse YYYY-MM
          const [year, month] = stat.date.split("-");
          const d = new Date(Number(year), Number(month) - 1, 1);
          return {
            ...stat,
            displayDate: d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
          };
        }
        return {
          ...stat,
          displayDate: new Date(stat.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
        };
      });
  }, [profileAnalytics?.dailyStats, nfcAnalytics?.dailyStats, daysFilter]);

  if (isLoading) {
    return <LoadingScreen message="Loading analytics..." />;
  }

  return (
    <div className="relative min-h-screen bg-[#010B1D] overflow-hidden">
      {/* ── CosmosParticles — desktop only (hidden on mobile for perf) ── */}
      <div className="hidden sm:block absolute inset-0 pointer-events-none z-0">
        <CosmosParticles
          particleColors={["#ffffff", "#4285f4"]}
          particleCount={180}
          particleSpread={14}
          speed={0.028}
          particleBaseSize={75}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* ── Mobile hero image ────────────────────────────────────────────── */}
      <div className="sm:hidden absolute inset-x-0 top-0 h-[400px] pointer-events-none select-none z-0">
        <Image
          src={ASSETS.SPARKMATES.SETTINGS_MOBILE_HERO}
          alt=""
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-b from-transparent to-[#010B1D]" />
      </div>

      {/* ── Decorative element 1 — left, desktop only */}
      <div
        className="hidden sm:block pointer-events-none select-none absolute z-0"
        style={{
          left: "-80px",
          top: "0px",
          transform: "rotate(26.31deg)",
          transformOrigin: "center center",
          width: "480px",
        }}
        aria-hidden
      >
        <Image
          src={ASSETS.SPARKMATES.SETTINGS_ELEMENT_1}
          alt=""
          width={480}
          height={620}
          className="w-full h-auto"
          sizes="480px"
        />
      </div>

      {/* ── Decorative element 2 — right, desktop only */}
      <div
        className="hidden sm:block pointer-events-none select-none absolute z-0"
        style={{
          right: "-80px",
          top: "260px",
          transform: "rotate(-18deg)",
          transformOrigin: "center center",
          width: "560px",
        }}
        aria-hidden
      >
        <Image
          src={ASSETS.SPARKMATES.SETTINGS_ELEMENT_2}
          alt=""
          width={560}
          height={730}
          className="w-full h-auto"
          sizes="560px"
        />
      </div>

      <div className="relative z-10 px-4 sm:px-6 pb-24 pt-24 sm:pt-40">
        <div className="mx-auto w-full max-w-5xl">
          <FadeInSection delay={0.02}>
            {/* Heading — left-aligned on all screen sizes */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 items-start">
              <div>
                <Link prefetch={false} href="/sparkmates/me" className="mb-4 flex items-center justify-start gap-2 text-[#C1C7CD] transition-colors hover:text-white w-fit">
                  <ChevronLeft size={16} />
                  <span>Back to Portfolio</span>
                </Link>
                <Text variant="heading-4" weight="bold" gradient="white-blue" className="mb-2 text-left">
                  Analytics Overview
                </Text>
                <p className="text-[#C1C7CD] text-left text-sm sm:text-base">
                  Track your digital presence and network impact.
                </p>
              </div>
              <div className="flex justify-start sm:justify-end">
                <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-400 w-fit">
                  Live Data
                </Badge>
              </div>
            </div>

            {/* Stats Grid - 2 columns on all devices */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-8 backdrop-blur-xl transition-all hover:border-white/20">
                <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                  <Eye size={20} className="sm:w-6 sm:h-6" />
                </div>
                <Text variant="body-sm" className="text-[#C1C7CD] sm:text-base block mb-1">Total Profile Views</Text>
                <Text variant="heading-3" className="font-bold text-white sm:text-4xl">
                  {totalViews}
                </Text>
                <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm text-green-400">
                  <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">Always growing</span>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-8 backdrop-blur-xl transition-all hover:border-white/20">
                <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400">
                  <Smartphone size={20} className="sm:w-6 sm:h-6" />
                </div>
                <Text variant="body-sm" className="text-[#C1C7CD] sm:text-base block mb-1">NFC Card Scans</Text>
                <Text variant="heading-3" className="font-bold text-white sm:text-4xl">
                  {totalScans}
                </Text>
                <div className="mt-3 flex items-center gap-1.5 text-xs sm:text-sm text-purple-400">
                  <Smartphone size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">Physical network</span>
                </div>

              </div>
            </div>

            {/* Line Chart */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8 backdrop-blur-xl">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Text variant="heading-6" className="text-white">Activity Trends</Text>
                  <TrendingUp size={18} className="text-white/60" />
                </div>
                
                <div className="grid grid-cols-3 sm:flex items-center rounded-lg bg-black/40 p-1 border border-white/10 w-full sm:w-fit">
                  <button
                    onClick={() => setDaysFilter(7)}
                    className={`px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                      daysFilter === 7 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-[#C1C7CD] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    7 Days
                  </button>
                  <button
                    onClick={() => setDaysFilter(30)}
                    className={`px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                      daysFilter === 30 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-[#C1C7CD] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    30 Days
                  </button>
                  <button
                    onClick={() => setDaysFilter(365)}
                    className={`px-2 sm:px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-200 ${
                      daysFilter === 365 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "text-[#C1C7CD] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    12 Months
                  </button>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mergedStats} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis 
                      dataKey="displayDate" 
                      stroke="#C1C7CD" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#C1C7CD" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(10, 10, 12, 0.82)", 
                        backdropFilter: "blur(24px) saturate(160%)",
                        border: "1px solid rgba(255, 255, 255, 0.09)",
                        borderRadius: "12px",
                        color: "#fff"
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Line 
                      type="monotone" 
                      name="Profile Views"
                      dataKey="views" 
                      stroke="#4285f4" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "#4285f4", strokeWidth: 2 }}
                      activeDot={{ r: 6 }} 
                    />
                    <Line 
                      type="monotone" 
                      name="NFC Scans"
                      dataKey="scans" 
                      stroke="#a855f7" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: "#a855f7", strokeWidth: 2 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Activity Lists */}
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              {/* Recent Views */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <Text variant="heading-6" className="text-white">Recent Profile Views ({totalViews})</Text>
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
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <Text variant="heading-6" className="text-white">NFC Card Activity ({totalScans})</Text>
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
    </div>
  );
};
