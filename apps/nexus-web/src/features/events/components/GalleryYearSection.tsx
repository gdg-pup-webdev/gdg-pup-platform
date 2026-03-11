"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container, Stack, Text } from "@packages/spark-ui";
import { getEventsByYear } from "../api/getEventsByYear";
import type { Event } from "../types";
import { normalizeEventDescription, splitBoldSegments } from "../utils/description";

type GalleryYearSectionProps = {
  yearParam: string;
};

const FALLBACK_COVER = "/pages/events/event-cover.png";

function getHighlightsRouteId(event: Event): string {
  const candidate =
    event.id ||
    event.bevy_url ||
    `${event.start_date || "event"}-${event.title || "details"}`;
  return String(candidate).trim();
}

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

function renderDescriptionWithBold(text: string) {
  return splitBoldSegments(text).map((segment, index) =>
    segment.bold ? (
      <strong key={`${segment.text}-${index}`} className="font-semibold text-white">
        {segment.text}
      </strong>
    ) : (
      <span key={`${segment.text}-${index}`}>{segment.text}</span>
    ),
  );
}

export function GalleryYearSection({ yearParam }: GalleryYearSectionProps) {
  const parsedYear = Number(yearParam);
  const isYearValid =
    Number.isInteger(parsedYear) && parsedYear >= 2022 && parsedYear <= 2100;
  const yearTitle = isYearValid ? String(parsedYear) : "YEAR";

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!isYearValid) return;

    let cancelled = false;

    async function loadEvents() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const yearEvents = await getEventsByYear(parsedYear);
        if (!cancelled) setEvents(yearEvents);
      } catch (error) {
        if (!cancelled) {
          setEvents([]);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Failed to load events for this year.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [isYearValid, parsedYear]);

  const visibleItems = useMemo(() => {
    if (!isYearValid) return [];
    return events;
  }, [events, isYearValid]);

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
            href="/events#events-gallery"
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

          <Stack gap="lg" className="items-center !gap-3 md:!gap-6 pt-4 md:pt-8">
            <Text
              variant="heading-1"
              gradient="white-blue"
              align="center"
              weight="bold"
              className="text-[1.85rem] sm:text-[2.15rem] leading-tight whitespace-nowrap md:text-[3.5rem]"
            >
              {yearTitle} EVENTS GALLERY
            </Text>
            <Text
              variant="body"
              align="center"
              color="secondary"
              className="text-white text-sm md:text-base max-w-[72ch]"
            >
              Built for the future of GDG PUP, the GDG ID Platform brings
              members together through a seamless, connected, and empowered
              digital experience.
            </Text>
          </Stack>

          {isLoading ? (
            <div className="rounded-2xl border border-white/15 bg-black/30 p-6 md:p-8">
              <Text variant="body" className="text-white/85">
                Loading events for {yearTitle}...
              </Text>
            </div>
          ) : !isYearValid ? (
            <div className="rounded-2xl border border-white/15 bg-black/30 p-6 md:p-8">
              <Text variant="body" className="text-white/85">
                Invalid year. Please choose a valid gallery year.
              </Text>
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border border-red-500/40 bg-black/30 p-6 md:p-8">
              <Text variant="body" className="text-red-200">
                {errorMessage}
              </Text>
            </div>
          ) : visibleItems.length === 0 ? (
            <div className="py-10 md:py-14">
              <Text
                variant="heading-5"
                align="center"
                className="italic text-white/80"
              >
                No events for this year
              </Text>
            </div>
          ) : (
            <div className="space-y-10 md:space-y-14">
              {visibleItems.map((event) => {
                const tag =
                  event.tags?.find((theme) => Boolean(theme?.trim())) ||
                  event.category ||
                  "General";
                const description =
                  normalizeEventDescription(
                    event.description?.trim() ||
                      event.short_description?.trim() ||
                      "Description will be announced soon.",
                  );
                const venue = event.venue?.trim() || "Location TBA";
                const routeId = getHighlightsRouteId(event);
                const canOpen = Boolean(routeId && event.title?.trim());
                const descriptionKey = `${event.id || routeId}-${event.start_date}`;
                const isExpanded = Boolean(expandedDescriptions[descriptionKey]);
                const isLongDescription = description.length > 420;
                const descriptionPreview =
                  isLongDescription && !isExpanded
                    ? `${description.slice(0, 420).trimEnd()}...`
                    : description;

                return (
                  <article key={`${event.id}-${event.start_date}-${event.title}`}>
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black min-h-[220px] md:min-h-[560px]">
                      <img
                        src={event.banner_url || FALLBACK_COVER}
                        alt={event.title}
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                    </div>

                    <div className="mt-5 md:mt-7">
                      <Text
                        variant="heading-3"
                        weight="bold"
                        className="text-white text-[1.375rem] md:text-[3rem] leading-tight text-center md:text-left"
                      >
                        {event.title}
                      </Text>

                      <div className="mt-3 md:mt-4 flex flex-nowrap items-center justify-center gap-2 md:gap-5 text-white/85 overflow-hidden">
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
                          <span>{formatDateLabel(event.start_date, event.end_date)}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[9px] md:text-sm whitespace-nowrap shrink-0 max-w-[120px] md:max-w-none">
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

                      <Text
                        variant="body"
                        className="text-white/85 mt-5 md:mt-6 leading-relaxed"
                      >
                        {renderDescriptionWithBold(descriptionPreview)}
                      </Text>

                      {isLongDescription ? (
                        <div className="mt-3 flex justify-center">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedDescriptions((prev) => ({
                                ...prev,
                                [descriptionKey]: !isExpanded,
                              }))
                            }
                            className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-1 cursor-pointer"
                          >
                            {isExpanded ? "See Less" : "See More"}
                            <span aria-hidden="true">{isExpanded ? "\u02c4" : "\u02c5"}</span>
                          </button>
                        </div>
                      ) : null}

                      {canOpen ? (
                        <Link
                          href={`/events/gallery/${encodeURIComponent(yearTitle)}/${encodeURIComponent(routeId)}?title=${encodeURIComponent(event.title)}`}
                          className="mt-6 md:mt-7 h-10 md:h-11 w-full rounded-md border border-[#4285F4] bg-[linear-gradient(90deg,rgba(20,57,132,0.9)_0%,rgba(59,141,255,0.96)_50%,rgba(20,57,132,0.9)_100%)] hover:bg-[linear-gradient(90deg,rgba(11,34,90,0.98)_0%,rgba(72,153,255,0.96)_50%,rgba(11,34,90,0.98)_100%)] text-white text-sm md:text-base font-medium inline-flex items-center justify-center gap-1 transition-[background-image,border-color,box-shadow] duration-300 ease-out hover:border-[#5B95FF] hover:shadow-[0_0_18px_rgba(66,133,244,0.32)]"
                        >
                          View More Event Highlights
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="mt-6 md:mt-7 h-10 md:h-11 w-full rounded-md border border-white/15 bg-white/5 text-white/50 text-sm md:text-base font-medium"
                        >
                          No Event Highlights Available
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Stack>
      </Container>
    </div>
  );
}

