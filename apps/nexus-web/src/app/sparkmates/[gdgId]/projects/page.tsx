"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button, Text } from "@packages/spark-ui";
import { CosmosParticles, LoadingScreen } from "@/components/shared";
import { useInfiniteMemberProjects } from "@/features/sparkmates";
import { useSparkmateProfile } from "@/features/sparkmates/hooks/useSparkmateProfile";
import { NameAndProfileSection } from "@/features/sparkmates/components/sections/NameAndProfileSection";
import { SuggestedPeopleSection } from "@/features/sparkmates/components/sections/SuggestedPeopleSection";
import { FadeInSection } from "@/features/sparkmates/components/SparkmatesOwnerView/components/FadeInSection";
import { SparkmatesRainbowStreak } from "@/features/sparkmates/components/SparkmatesOwnerView/components/SparkmatesRainbowStreak";
import { SortableProjectCardItem } from "@/features/sparkmates/components/SparkmatesOwnerView/components/SortableProjectCardItem";
import { SparkmatesBrandedErrorScreen } from "@/features/sparkmates/components/SparkmatesBrandedErrorScreen";

const PROJECTS_PER_LOAD = 10;

export default function PublicProjectsPage() {
  const params = useParams<{ gdgId: string }>();
  const gdgId = params?.gdgId ?? "";

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useSparkmateProfile({ gdgId, source: "direct_link" });

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteMemberProjects(gdgId, PROJECTS_PER_LOAD);

  const projects = data?.pages.flatMap((page) => page.data) || [];
  const totalRecords = data?.pages[0]?.meta.totalRecords || 0;

  if (isProfileLoading) {
    return <LoadingScreen message="Loading projects..." />;
  }

  if (isProfileError || !profile) {
    const message = profileError instanceof Error
      ? profileError.message
      : "Unable to load sparkmates profile.";

    return (
      <SparkmatesBrandedErrorScreen
        title="Unable to load Sparkmates profile"
        message={message}
        backHref="/sparkmates"
      />
    );
  }

  if (isError) {
    const message = error instanceof Error
      ? error.message
      : "Something went wrong while loading projects.";

    return (
      <SparkmatesBrandedErrorScreen
        title="Unable to load projects"
        message={message}
        backHref={`/sparkmates/${gdgId}`}
      />
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
      className="min-h-screen overflow-x-hidden bg-[#010B1D] bg-[radial-gradient(circle_at_30%_55%,rgba(66,133,244,0.2),transparent_30%),radial-gradient(circle_at_58%_73%,rgba(249,171,0,0.14),transparent_25%)] px-3 sm:px-6 pb-24 pt-24 sm:pt-36 text-white"
    >
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden hidden sm:block">
          <SparkmatesRainbowStreak />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-325 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <FadeInSection className="p-0" delay={0.02}>
            <NameAndProfileSection profile={profile} readOnly />

            <div className="mt-6 space-y-5">
              <Link
                prefetch={false}
                href={`/sparkmates/${gdgId}`}
                className="inline-flex items-center gap-2 text-[#C1C7CD] transition-colors hover:text-white"
              >
                <ChevronLeft size={16} />
                <span>Back to Portfolio</span>
              </Link>

              <div>
                <Text variant="heading-6" weight="bold" gradient="white-blue">
                  All Projects
                </Text>
                <p className="mt-1 text-sm text-[#C1C7CD]">
                  Showing {projects.length} of {totalRecords} projects.
                </p>
              </div>

              {isLoading ? (
                <LoadingScreen message="Loading projects..." />
              ) : projects.length === 0 ? (
                <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-5 py-8 text-center text-[#C1C7CD]">
                  <Text className="text-[#C1C7CD]" variant="body-sm">No projects yet.</Text>
                </div>
              ) : (
                <>
                  <div className="space-y-3.5">
                    {projects.map((project) => (
                      <SortableProjectCardItem
                        key={project.id}
                        id={String(project.id)}
                        project={project}
                        projectHref={`/sparkmates/${gdgId}/projects/${project.id}`}
                        readOnly
                        sortingDisabled
                        handleDisabled
                        truncateDescription
                      />
                    ))}
                  </div>

                  {hasNextPage ? (
                    <div className="mt-6 flex justify-center">
                      <Button
                        variant="colored"
                        subVariant="blue"
                        disabled={isFetchingNextPage}
                        onClick={() => {
                          fetchNextPage();
                        }}
                      >
                        {isFetchingNextPage ? "Loading..." : "Load More"}
                      </Button>
                    </div>
                  ) : (
                    <p className="mt-6 text-center text-sm text-[#9CA3AF]">
                      You have reached the end of projects.
                    </p>
                  )}
                </>
              )}
            </div>
          </FadeInSection>

          <SuggestedPeopleSection profile={profile} readOnly />
        </div>
      </div>
    </CosmosParticles>
  );
}
