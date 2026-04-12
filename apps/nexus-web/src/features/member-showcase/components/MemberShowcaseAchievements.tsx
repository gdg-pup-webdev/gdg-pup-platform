"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Skeleton,
  Stack,
  Text,
} from "@packages/spark-ui";
import { ASSETS } from "@/lib/constants/assets";
import {
  createContainerVariants,
  createSectionVariants,
  ITEM_VARIANTS,
  SECTION_DELAYS,
  SECTION_VIEWPORT,
} from "./memberShowcaseMotion";
import { useMemberShowcases } from "../hooks/useMemberShowcases";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const achievementsSectionVariants = createSectionVariants(
  SECTION_DELAYS.achievements,
);
const achievementsListVariants = createContainerVariants(0.18, 0.14);

function AchievementSkeletonCard() {
  return (
    <Card className="relative w-full overflow-hidden bg-[#1d2231]/85 shadow-[0_7px_18px_rgba(0,0,0,0.25)] backdrop-blur-md">
      <div className="relative z-10">
        {/* Fixed 293×208 aspect ratio skeleton matches the image wrapper */}
        <Skeleton
          className="w-full rounded-lg"
          style={{ aspectRatio: "293/208" }}
        />
        <div className="mt-3 px-4 md:mt-3.5">
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-4 flex justify-end px-4 pb-4 md:mt-5">
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

function AchievementsLoadingState() {
  return (
    <div className="grid flex-1 min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
      <AchievementSkeletonCard />
      <div className="hidden md:block">
        <AchievementSkeletonCard />
      </div>
      <div className="hidden lg:block">
        <AchievementSkeletonCard />
      </div>
    </div>
  );
}

export function MemberShowcaseAchievements() {
  const prefersReduced = useReducedMotion();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3); // SSR-safe default
  const prevPageSizeRef = useRef(3);

  // Sync pageSize with the number of visible columns at each breakpoint:
  // mobile (< 768px) = 1, tablet (< 1024px) = 2, desktop = 3
  // Also resets page to 1 when the breakpoint is crossed to prevent skipping.
  useEffect(() => {
    const updatePageSize = () => {
      const next =
        window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      if (next !== prevPageSizeRef.current) {
        prevPageSizeRef.current = next;
        setPageSize(next);
        setPage(1);
      }
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const { data, isLoading, error } = useMemberShowcases(page, pageSize);

  const MEMBER_ACHIEVEMENT_CARDS = data
    ? data.data.map((showcase) => ({
        ...showcase,
        src: showcase.thumbnailUrl,
        alt: showcase.title,
        title: showcase.title,
      }))
    : [];

  const handleOnNextPage = async () => {
    setPage((prev) =>
      Math.min(prev + 1, data ? data.meta.totalPages : prev + 1),
    );
  };

  const handleOnPreviousPage = async () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <motion.div
      variants={prefersReduced ? undefined : achievementsSectionVariants}
      initial={prefersReduced ? undefined : "hidden"}
      whileInView={prefersReduced ? undefined : "visible"}
      viewport={SECTION_VIEWPORT}
    >
      <Stack gap="xl" className="mt-16">
        <Stack className="gap-1">
          <Text
            variant="heading-4"
            gradient="white-blue"
            align="center"
            weight="bold"
          >
            Member Achievements
          </Text>
          <Text variant="heading-6" color="on-primary" align="center">
            Check out the latest achievements of our members!
          </Text>
        </Stack>

        <motion.div
          className="flex items-center gap-2 md:gap-3 lg:gap-4"
          variants={prefersReduced ? undefined : achievementsListVariants}
        >
          <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
            <Button
              className="rounded-full px-0 w-9 h-9 min-w-0 md:w-10 md:h-10 lg:w-12 lg:h-12 shrink-0"
              size="lg"
              subVariant="blue"
              variant="colored"
              onClick={handleOnPreviousPage}
              disabled={page === 1 || isLoading}
            >
              ←
            </Button>
          </motion.div>

          {isLoading ? (
            <AchievementsLoadingState />
          ) : (
            <motion.div
              className="grid flex-1 min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6"
              variants={prefersReduced ? undefined : achievementsListVariants}
            >
              {MEMBER_ACHIEVEMENT_CARDS.map((card, index) => (
                <motion.div
                  key={`${card.alt}-${index}`}
                  className={index === 1 ? "hidden md:block" : index === 2 ? "hidden lg:block" : undefined}
                >
                  <Card className="relative w-full overflow-hidden bg-[#1d2231]/85 shadow-[0_7px_18px_rgba(0,0,0,0.25)] backdrop-blur-md">
                    <div className="pointer-events-none absolute inset-0 z-0">
                      <div className="absolute inset-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(69,88,132,0.55)_0%,rgba(31,40,66,0.86)_38%,rgba(15,27,59,0.98)_100%)]" />
                      <div className="absolute inset-0 rounded-[inherit] mix-blend-overlay opacity-80 blur-xl bg-[radial-gradient(130%_90%_at_50%_120%,rgba(92,132,255,0.84)_0%,rgba(68,205,255,0.4)_30%,rgba(68,205,255,0)_62%)]" />
                      <div className="absolute right-0 bottom-5 left-0 h-24 bg-[radial-gradient(84%_185%_at_50%_100%,rgba(140,166,255,0.78)_0%,rgba(140,166,255,0.3)_48%,rgba(140,166,255,0)_78%)] blur-2xl" />
                      <div className="absolute right-2 bottom-5 left-2 h-16 bg-[radial-gradient(95%_180%_at_50%_100%,rgba(79,255,173,0.62)_0%,rgba(79,255,173,0)_80%)] blur-xl" />
                      <div className="absolute -top-12 -left-24 h-24 w-[170%] rotate-30 bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.62)_50%,rgba(255,255,255,0)_100%)] opacity-50 blur-[6px] mix-blend-overlay" />
                    </div>

                    <div className="relative z-10">
                      {/* Fixed 293×208 aspect-ratio wrapper — prevents warping at any screen size */}
                      <div
                        className="relative w-full overflow-hidden rounded-lg border border-white"
                        style={{ aspectRatio: "293/208" }}
                      >
                        <Image
                          src={card.src}
                          alt={card.alt}
                          fill
                          className="object-cover pointer-events-none"
                        />
                      </div>
                      <CardHeader className="mt-3 text-lg font-bold md:mt-3.5 md:text-xl capitalize">
                        {card.title}
                      </CardHeader>
                      <CardFooter className="mt-4 flex justify-end md:mt-5">
                        <Link prefetch={false} href={card.articleUrl || "#"}>
                          <Button
                            className="w-fit"
                            size="lg"
                            subVariant="blue"
                            variant="colored"
                          >
                            <Image
                              src={ASSETS.MEMBER_SHOWCASE.ICONS.LINK}
                              alt="Link"
                              width={27}
                              height={27}
                            />
                          </Button>
                        </Link>
                      </CardFooter>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div variants={prefersReduced ? undefined : ITEM_VARIANTS}>
            <Button
              className="rounded-full px-0 w-9 h-9 min-w-0 md:w-10 md:h-10 lg:w-12 lg:h-12 shrink-0"
              size="lg"
              subVariant="blue"
              variant="colored"
              onClick={handleOnNextPage}
              disabled={page === (data ? data.meta.totalPages : 1) || isLoading}
            >
              →
            </Button>
          </motion.div>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
