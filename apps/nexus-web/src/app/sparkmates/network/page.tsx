"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { useQuery } from "@tanstack/react-query";
import { contract } from "@packages/nexus-api-contracts";
import { Avatar, Badge, Button, Text } from "@packages/spark-ui";
import { CosmosParticles } from "@/components/shared";
import { SparkmatesRainbowStreak } from "@/features/sparkmates/components/SparkmatesOwnerView/components/SparkmatesRainbowStreak";
import { ASSETS } from "@/lib/constants/assets";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [10, 20, 50];
const MEMBERS_FETCH_PAGE_SIZE = 200;

type GdgMember = contract.api.v1.gdgmembers.GET.response[200]["data"][number];

const fetchAllMembers = async (): Promise<GdgMember[]> => {
  const firstPageResult = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.gdgmembers.GET,
    {
      query: { pageNumber: 1, pageSize: 1 },
    },
  );

  if (firstPageResult.status !== 200) {
    throw new Error(extractErrorMessage(firstPageResult.body));
  }

  const totalRecords = firstPageResult.body.meta?.totalRecords ?? 0;
  if (totalRecords <= 0) {
    return [];
  }

  const totalPages = Math.max(1, Math.ceil(totalRecords / MEMBERS_FETCH_PAGE_SIZE));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const results = await Promise.all(
    pages.map(async (pageNumber) => {
      const result = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.GET,
        {
          query: { pageNumber, pageSize: MEMBERS_FETCH_PAGE_SIZE },
        },
      );

      if (result.status !== 200) {
        throw new Error(extractErrorMessage(result.body));
      }

      return result.body.data;
    }),
  );

  return results.flat();
};

const NetworkSkeleton = () => (
  <CosmosParticles
    particleColors={["#ffffff", "#4285f4"]}
    particleCount={180}
    particleSpread={14}
    speed={0.028}
    particleBaseSize={75}
    moveParticlesOnHover
    alphaParticles={true}
    disableRotation={false}
    className="min-h-screen overflow-x-hidden bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-3 sm:px-6 pb-24 pt-32 sm:pt-36 text-white"
  >
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden sm:block">
        <SparkmatesRainbowStreak />
      </div>

      <div className="relative z-10 space-y-4 animate-pulse">
        <div className="h-5 w-40 rounded bg-white/10" />
        <div className="h-10 w-full rounded-lg border border-white/10 bg-white/5" />

        <div className="grid gap-4 md:grid-cols-[260px_1fr] md:items-start">
          <aside className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-3">
            <div className="h-4 w-28 rounded bg-white/10" />
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={`skeleton-filter-${index}`} className="h-7 rounded bg-white/10" />
            ))}
          </aside>

          <section className="space-y-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`skeleton-card-${index}`}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-3 py-3"
              >
                <div className="h-14 w-14 shrink-0 rounded-full bg-white/10" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-2/5 rounded bg-white/10" />
                  <div className="h-3 w-4/5 rounded bg-white/10" />
                </div>
                <div className="hidden sm:flex shrink-0 flex-col gap-2">
                  <div className="h-6 w-24 rounded-full bg-white/10" />
                  <div className="h-6 w-20 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  </CosmosParticles>
);

type FilterGroupProps = {
  label: string;
  options: string[];
  selectedOptions: string[];
  onToggle: (value: string) => void;
};

const FilterGroup = ({
  label,
  options,
  selectedOptions,
  onToggle,
}: FilterGroupProps) => {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Text variant="body-sm" weight="bold" className="text-[#F0B100]">
        {label}
      </Text>

      <div className="space-y-1">
        {options.map((option) => {
          const checked = selectedOptions.includes(option);

          return (
            <label
              key={`${label}-${option}`}
              className="group flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1 text-sm text-[#E5EAF4] transition-colors duration-200 hover:bg-white/6"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option)}
                className="mt-0.5 h-3.5 w-3.5 rounded border border-white/35 bg-transparent accent-[#4285F4]"
              />
              <span className="line-clamp-2 leading-snug group-hover:text-white">
                {option}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default function SparkmatesNetworkPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const {
    data: allMembers,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["members", "all-network"],
    queryFn: fetchAllMembers,
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });

  const members = allMembers ?? [];
  const [search, setSearch] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);

  const departments = useMemo(() => {
    const values = members
      .map((member) => member.department?.trim())
      .filter((value): value is string => Boolean(value));

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [members]);

  const years = useMemo(() => {
    const values = members
      .map((member) => member.yearLevel)
      .filter((value): value is number => typeof value === "number")
      .map((value) => {
        if (value === 1) return "1st Year";
        if (value === 2) return "2nd Year";
        if (value === 3) return "3rd Year";
        return `${value}th Year`;
      });

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [members]);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return members.filter((member) => {
      const fullName = [member.firstName, member.middleName, member.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();
      const displayName = (member.displayName || "").trim();
      const bio = (member.bio || "").trim();
      const department = (member.department || "").trim();
      const memberTeams = (member.technicalSkills || [])
        .map((value) => value.trim())
        .filter(Boolean);
      const yearLabel = member.yearLevel
        ? member.yearLevel === 1
          ? "1st Year"
          : member.yearLevel === 2
            ? "2nd Year"
            : member.yearLevel === 3
              ? "3rd Year"
              : `${member.yearLevel}th Year`
        : "";

      const matchesSearch =
        !normalizedSearch ||
        `${fullName} ${displayName} ${bio} ${department} ${memberTeams.join(" ")}`
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesDepartment =
        selectedDepartments.length === 0 || selectedDepartments.includes(department);

      const matchesYear =
        selectedYears.length === 0 || selectedYears.includes(yearLabel);

      return matchesSearch && matchesDepartment && matchesYear;
    });
  }, [members, search, selectedDepartments, selectedYears]);

  useEffect(() => {
    setPage(1);
  }, [search, selectedDepartments, selectedYears, pageSize]);

  const paginatedMembers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMembers.slice(start, start + pageSize);
  }, [filteredMembers, page, pageSize]);

  const totalRecords = filteredMembers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const toggleFilter = (
    value: string,
    values: string[],
    setValues: (next: string[]) => void,
  ) => {
    if (values.includes(value)) {
      setValues(values.filter((item) => item !== value));
      return;
    }

    setValues([...values, value]);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedDepartments([]);
    setSelectedYears([]);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let value = 1; value <= totalPages; value += 1) {
        pages.push(value);
      }
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let value = start; value <= end; value += 1) {
      pages.push(value);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  }, [page, totalPages]);

  if (isLoading) {
    return <NetworkSkeleton />;
  }

  if (isError) {
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
        className="min-h-screen overflow-x-hidden bg-[#010B1D] px-4 pb-24 pt-32 sm:pt-36 text-white"
      >
        <div className="mx-auto w-full max-w-4xl rounded-2xl border border-red-500/30 bg-red-950/35 p-6">
          <Text variant="heading-6" className="text-red-200" weight="bold">
            Unable to load members
          </Text>
          <Text variant="body-sm" className="mt-2 text-red-100">
            {error instanceof Error ? error.message : "Something went wrong while loading the network."}
          </Text>
          <Button variant="colored" subVariant="blue" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </CosmosParticles>
    );
  }

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
      className="min-h-screen overflow-x-hidden bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-3 sm:px-6 pb-24 pt-32 sm:pt-36 text-white"
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden sm:block">
          <SparkmatesRainbowStreak />
        </div>

        <div className="relative z-10 space-y-4">
          <Link
            prefetch={false}
            href="/sparkmates/me"
            className="inline-flex items-center gap-2 text-[#C1C7CD] transition-colors hover:text-white"
          >
            <ChevronLeft size={16} />
            <span>Back to Sparkmates</span>
          </Link>

          <div className="rainbow-border-animated-hover w-full rounded-xl bg-white/20 p-px focus-within:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.45)]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-[11px] border-none bg-[#07142b]/95 px-3 text-sm text-white outline-none placeholder:text-[#8FA1C7] transition-colors group-hover:bg-[#06132A] group-focus-within:bg-[#06132A]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-[260px_1fr] md:items-start">
            <aside className="md:sticky md:top-32 self-start rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(9,20,43,0.95)_0%,rgba(21,37,67,0.92)_100%)] p-3 shadow-[inset_0px_8px_24px_rgba(255,255,255,0.07),0_10px_30px_-20px_rgba(0,0,0,0.7)] transition-all duration-300">
              <div className="mb-3 flex items-center justify-between">
                <Text variant="body" className="text-white" weight="bold">
                  Filters
                </Text>
                <Button variant="ghost" size="sm" className="text-[#C1C7CD]" onClick={clearFilters}>
                  Clear
                </Button>
              </div>

              <FilterGroup
                label="Department"
                options={departments}
                selectedOptions={selectedDepartments}
                onToggle={(value) =>
                  toggleFilter(value, selectedDepartments, setSelectedDepartments)
                }
              />

              <div className="my-3 border-t border-white/10" />

              <FilterGroup
                label="Year"
                options={years}
                selectedOptions={selectedYears}
                onToggle={(value) => toggleFilter(value, selectedYears, setSelectedYears)}
              />
            </aside>

            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/15 bg-[linear-gradient(180deg,rgba(7,20,43,0.85)_0%,rgba(10,26,54,0.78)_100%)] px-3 py-2">
                <Text variant="body-sm" className="text-[#C1C7CD]">
                  Showing {paginatedMembers.length} of {totalRecords} filtered members
                </Text>

                <div className="flex items-center gap-2">
                  <Text variant="body-sm" className="text-[#C1C7CD]">
                    Rows
                  </Text>
                  <select
                    value={pageSize}
                    onChange={(event) => {
                      setPageSize(Number(event.target.value));
                      setPage(1);
                    }}
                    className="h-8 rounded-md border border-white/20 bg-[#07142b] px-2 text-sm text-white outline-none"
                  >
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {totalRecords === 0 ? (
                <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-8 text-center">
                  <Text variant="body-sm" className="text-[#C1C7CD]">
                    No members match your filters.
                  </Text>
                </div>
              ) : (
                paginatedMembers.map((member) => {
                  const fullName = [member.firstName, member.middleName, member.lastName]
                    .filter(Boolean)
                    .join(" ")
                    .trim();
                  const displayName = (member.displayName || fullName || member.gdgId).trim();
                  const bio = (member.bio || "No description yet.").trim();
                  const memberTeams = (member.technicalSkills || [])
                    .map((value) => value.trim())
                    .filter(Boolean);
                  const primaryTeam = memberTeams[0] || member.department || "General";
                  const secondaryTeam =
                    member.department && member.department !== primaryTeam
                      ? member.department
                      : memberTeams[1] || "";

                  return (
                    <Link
                      prefetch={false}
                      key={member.gdgId}
                      href={`/sparkmates/${member.gdgId}`}
                      className="block"
                    >
                      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-[linear-gradient(90deg,rgba(12,26,52,0.9)_0%,rgba(28,46,83,0.68)_55%,rgba(16,30,60,0.9)_100%)] px-3 py-3 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.18)] transition hover:brightness-110">
                        <Avatar
                          src={member.avatarUrl || ASSETS.PROFILE.DEFAULT_AVATAR}
                          alt={displayName}
                          fallback={displayName.charAt(0)}
                          className="h-14 w-14 shrink-0 rounded-full border border-white/30"
                        />

                        <div className="min-w-0 flex-1">
                          <Text variant="body-lg" className="line-clamp-1 text-white" weight="medium">
                            {displayName}
                          </Text>
                          <Text variant="body-sm" className="line-clamp-2 text-[#D4DAE3]">
                            {bio}
                          </Text>
                          <div className="mt-2 flex flex-wrap gap-1.5 sm:hidden">
                            <Badge variant="yellow">{primaryTeam}</Badge>
                            {secondaryTeam ? <Badge variant="blue">{secondaryTeam}</Badge> : null}
                          </div>
                        </div>

                        <div className="hidden shrink-0 flex-col items-end gap-2 sm:flex">
                          <Badge variant="yellow">{primaryTeam}</Badge>
                          {secondaryTeam ? <Badge variant="blue">{secondaryTeam}</Badge> : null}
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#C1C7CD]"
                  onClick={() => setPage((previous) => Math.max(1, previous - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>

                {pageNumbers.map((entry, index) =>
                  entry === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-sm text-[#8FA1C7]">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={`page-${entry}`}
                      variant={entry === page ? "colored" : "ghost"}
                      subVariant={entry === page ? "blue" : undefined}
                      size="sm"
                      className={entry === page ? "text-white" : "text-[#C1C7CD]"}
                      onClick={() => setPage(entry)}
                    >
                      {entry}
                    </Button>
                  ),
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#C1C7CD]"
                  onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </CosmosParticles>
  );
}
