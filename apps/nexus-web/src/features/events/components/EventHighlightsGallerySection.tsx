"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container, Stack, Text } from "@packages/spark-ui";
import { getEventDetail } from "../api/getEventDetail";
import type { Event } from "../types";

type EventHighlightsGallerySectionProps = {
  yearParam: string;
  eventId: string;
  title?: string;
};

const MOCK_TOTAL_PAGES = 68;
const MOCK_TILES_PER_PAGE = 16;
const MOCK_TILE_SRC = "/pages/events/gallery-preview-year.svg";
const MOBILE_MOCK_TILE_COUNT = 20;
const MOBILE_SLIDE_WIDTH_PERCENT = 78;

function formatDateLabel(startDate?: string, endDate?: string) {
  if (!startDate) return "Date TBA";

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "Date TBA";

  const dayLabel = start.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTime =
    endDate && !Number.isNaN(new Date(endDate).getTime())
      ? new Date(endDate).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        })
      : null;

  return `${dayLabel}${endTime ? ` ${startTime} - ${endTime}` : ` ${startTime}`}`;
}

export function EventHighlightsGallerySection({
  yearParam,
  eventId,
  title,
}: EventHighlightsGallerySectionProps) {
  const [eventDetail, setEventDetail] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileIndex, setMobileIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadEvent() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const found = await getEventDetail({
          routeId: eventId,
          title: title?.trim() || undefined,
        });
        if (!cancelled) setEventDetail(found);
      } catch (error) {
        if (!cancelled) {
          setEventDetail(null);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to load event details.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [eventId, title]);

  const eventTitle = eventDetail?.title?.trim() || title?.trim() || "Event";
  const pageTitle = `${eventTitle} Gallery`;
  const tag =
    eventDetail?.tags?.find((theme) => Boolean(theme?.trim())) ||
    eventDetail?.category ||
    "General";
  const dateLabel = formatDateLabel(eventDetail?.start_date, eventDetail?.end_date);
  const venue = eventDetail?.venue?.trim() || "Location TBA";
  const mockTiles = useMemo(
    () =>
      Array.from({ length: MOCK_TILES_PER_PAGE }, (_, index) => ({
        id: `${currentPage}-${index}`,
        src: MOCK_TILE_SRC,
      })),
    [currentPage],
  );
  const mobileMockTiles = useMemo(
    () =>
      Array.from({ length: MOBILE_MOCK_TILE_COUNT }, (_, index) => ({
        id: `mobile-${index + 1}`,
        src: MOCK_TILE_SRC,
      })),
    [],
  );
  const pagerTokens = useMemo<(number | "...")[]>(
    () => [1, 2, 3, "...", MOCK_TOTAL_PAGES - 1, MOCK_TOTAL_PAGES],
    [],
  );
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < MOCK_TOTAL_PAGES;
  const canGoMobilePrev = mobileIndex > 0;
  const canGoMobileNext = mobileIndex < mobileMockTiles.length - 1;

  return (
    <div
      className="relative overflow-hidden min-h-screen pt-32 md:pt-48 pb-16 md:pb-28 px-4 md:px-8 lg:px-16"
      style={{ backgroundColor: "rgba(15, 14, 14, 1)" }}
    >
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "220px",
          height: "220px",
          top: "120px",
          left: "-85px",
          background: "rgba(66, 133, 244, 0.54)",
          filter: "blur(90px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "180px",
          height: "180px",
          top: "500px",
          right: "-72px",
          background: "rgba(52, 168, 83, 0.46)",
          filter: "blur(82px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "170px",
          height: "170px",
          top: "860px",
          left: "-68px",
          background: "rgba(234, 67, 53, 0.48)",
          filter: "blur(78px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none md:hidden"
        style={{
          width: "165px",
          height: "165px",
          top: "1160px",
          right: "-62px",
          background: "rgba(249, 171, 0, 0.52)",
          filter: "blur(74px)",
          zIndex: 0,
        }}
      />

      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(900px, 65vw)",
          height: "min(800px, 70vh)",
          top: "calc(4rem - 300px)",
          left: "max(calc((100vw - 80rem) / 2), 0px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(800px, 60vw)",
          height: "min(900px, 75vh)",
          top: "calc(4rem + 200px)",
          right: "max(calc((100vw - 80rem) / 2 - 300px), -150px)",
          background: "#4285F433",
          filter: "blur(579px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(520px, 40vw)",
          height: "min(520px, 40vw)",
          top: "220px",
          left: "-160px",
          background: "rgba(66, 133, 244, 0.75)",
          filter: "blur(220px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(460px, 34vw)",
          height: "min(460px, 34vw)",
          top: "1300px",
          left: "-150px",
          background: "rgba(234, 67, 53, 0.75)",
          filter: "blur(200px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(340px, 26vw)",
          height: "min(340px, 26vw)",
          top: "220px",
          right: "-100px",
          background: "rgba(52, 168, 83, 0.75)",
          filter: "blur(160px)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none hidden md:block"
        style={{
          width: "min(320px, 24vw)",
          height: "min(320px, 24vw)",
          top: "790px",
          right: "-100px",
          background: "rgba(249, 171, 0, 0.75)",
          filter: "blur(150px)",
          zIndex: 0,
        }}
      />

      <Container className="relative z-10">
        <Stack gap="xl" className="md:gap-2xl">
          <Link
            href={`/events/gallery/${encodeURIComponent(yearParam)}`}
            className="inline-flex items-center gap-2 text-white/85 hover:text-white transition-colors text-sm md:text-base w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span>Back</span>
          </Link>

          <Stack gap="lg" className="items-center !gap-5 md:!gap-6 pt-6 md:pt-8">
            <Text
              variant="heading-1"
              align="center"
              weight="bold"
              className="text-[1.6rem] sm:text-[2rem] leading-tight md:text-[3.25rem] text-white"
            >
              {pageTitle}
            </Text>

            {!isLoading ? (
              <div className="mt-2 md:mt-2 flex flex-nowrap items-center justify-center gap-2 md:gap-5 text-white/85 overflow-hidden">
                <span className="rounded-full bg-[#F9AB00] text-black text-[8px] md:text-xs font-semibold px-2 py-0.5 uppercase tracking-wide whitespace-nowrap shrink-0">
                  {tag}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] md:text-sm whitespace-nowrap shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3 w-3 md:h-3.5 md:w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8Z" />
                  </svg>
                  <span>{dateLabel}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] md:text-sm whitespace-nowrap shrink-0 max-w-[110px] md:max-w-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3 w-3 md:h-3.5 md:w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M12 2a7 7 0 0 0-7 7c0 4.7 5.1 11.5 6.4 13.1a.8.8 0 0 0 1.2 0C13.9 20.5 19 13.7 19 9a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                  </svg>
                  <span className="truncate">{venue}</span>
                </span>
              </div>
            ) : null}

            <Text
              variant="body"
              align="center"
              color="secondary"
              className="text-white text-sm md:text-base max-w-[72ch] mt-1 md:mt-0"
            >
              Built for the future of GDG PUP, the GDG ID Platform brings
              members together through a seamless, connected, and empowered
              digital experience.
            </Text>
          </Stack>

          <Stack gap="lg" className="!gap-7 md:!gap-7 pb-3">
            {isLoading ? (
              <Text
                variant="body"
                align="center"
                className="text-white/70 text-xs md:text-sm"
              >
                Loading event metadata...
              </Text>
            ) : errorMessage ? (
              <Text
                variant="body"
                align="center"
                className="text-red-200/90 text-xs md:text-sm"
              >
                {errorMessage}
              </Text>
            ) : null}

            <div className="md:hidden mt-2">
              <div className="overflow-hidden">
                <div
                  className="flex gap-3 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(calc((100% - ${MOBILE_SLIDE_WIDTH_PERCENT}%) / 2 - ${mobileIndex} * (${MOBILE_SLIDE_WIDTH_PERCENT}% + 0.75rem)))`,
                  }}
                >
                  {mobileMockTiles.map((tile, index) => (
                    <div
                      key={tile.id}
                      className="relative shrink-0 overflow-hidden rounded-[10px] border border-white/15 bg-black/30 aspect-[16/9]"
                      style={{ width: `${MOBILE_SLIDE_WIDTH_PERCENT}%` }}
                      aria-hidden={index !== mobileIndex}
                    >
                      <Image
                        src={tile.src}
                        alt={`Event highlight placeholder ${index + 1}`}
                        fill
                        sizes="78vw"
                        className="object-cover"
                        priority={false}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-6 text-white">
                <button
                  type="button"
                  aria-label="Previous slide"
                  disabled={!canGoMobilePrev}
                  onClick={() => setMobileIndex((index) => Math.max(0, index - 1))}
                  className="h-9 w-9 rounded-full border border-white/70 text-white/90 hover:text-white hover:border-white transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <span className="text-base font-medium">
                  {mobileIndex + 1} of {mobileMockTiles.length}
                </span>
                <button
                  type="button"
                  aria-label="Next slide"
                  disabled={!canGoMobileNext}
                  onClick={() =>
                    setMobileIndex((index) =>
                      Math.min(mobileMockTiles.length - 1, index + 1),
                    )
                  }
                  className="h-9 w-9 rounded-full border border-white/70 text-white/90 hover:text-white hover:border-white transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative px-10 md:px-16 hidden md:block">
              <button
                type="button"
                aria-label="Previous page"
                disabled={!canGoPrev}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/70 text-white/90 hover:text-white hover:border-white transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  className="h-4 w-4 md:h-5 md:w-5"
                  aria-hidden="true"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                aria-label="Next page"
                disabled={!canGoNext}
                onClick={() =>
                  setCurrentPage((page) => Math.min(MOCK_TOTAL_PAGES, page + 1))
                }
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-9 w-9 md:h-10 md:w-10 rounded-full border border-white/70 text-white/90 hover:text-white hover:border-white transition-colors cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  className="h-4 w-4 md:h-5 md:w-5"
                  aria-hidden="true"
                >
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                {mockTiles.map((tile) => (
                  <div
                    key={tile.id}
                    className="relative overflow-hidden rounded-[6px] border border-white/10 bg-black/30 aspect-[16/9]"
                  >
                    <Image
                      src={tile.src}
                      alt="Event highlight placeholder"
                      fill
                      sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center gap-2 text-sm md:text-base text-white/80 select-none">
              {pagerTokens.map((token, index) => {
                if (token === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-1.5 text-white/55">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    type="button"
                    key={`page-${token}`}
                    onClick={() => setCurrentPage(token)}
                    className={`min-w-6 h-6 rounded-full text-xs md:text-sm transition-colors ${
                      currentPage === token
                        ? "bg-white/15 text-white"
                        : "text-white/75 hover:text-white"
                    }`}
                  >
                    {token}
                  </button>
                );
              })}
            </div>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
