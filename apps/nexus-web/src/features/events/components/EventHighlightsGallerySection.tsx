"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Container, Skeleton, Stack, Text } from "@packages/spark-ui"; 
import { useEvent } from "../hooks/useEvents";

type EventHighlightsGallerySectionProps = {
  yearParam: string;
  eventId: string;
  title?: string;
};




const PLACEHOLDER_TILE_URL = "/pages/events/event-cover.webp";
const PLACEHOLDER_IMAGES = Array.from(
  { length: 12 },
  () => PLACEHOLDER_TILE_URL,
);



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



function GallerySkeletonGrid() {
  return (
    <div className="animate-pulse w-full">
      {/* Mobile Stack: Match INITIAL_VISIBLE_COUNT */}
      <div className="flex flex-col gap-5 md:hidden">
        {Array.from({ length: 4 }).map((_, i) => (


          <div
            key={`mobile-skeleton-${i}`}
            className="aspect-video w-full rounded-[10px] bg-white/10 border border-white/5"
          />
        ))}
      </div>

      {/* Desktop Grid: Match INITIAL_VISIBLE_COUNT */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (

          <div
            key={`desktop-skeleton-${i}`}
            className="aspect-video w-full rounded-[6px] bg-white/10 border border-white/5"
          />
        ))}
      </div>
    </div>
  );
}

export function EventHighlightsGallerySection({
  yearParam,
  eventId,
  title,
}: EventHighlightsGallerySectionProps) { 
  const INITIAL_COUNT = 4;
  const STEP = 10;
  
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  console.log(`[EventHighlightsGallerySection] Rendered with visibleCount: ${visibleCount}`);




  const {data : eventDetail, error : errorMessage, isLoading} = useEvent(eventId);
 

  const eventTitle = eventDetail?.title?.trim() || title?.trim() || "Event";
  const pageTitle = `${eventTitle} Gallery`;
  const tag =
    eventDetail?.tags?.find((theme) => Boolean(theme?.trim())) ||
    eventDetail?.category ||
    "General";
  const dateLabel = formatDateLabel(eventDetail?.start_date || "", eventDetail?.end_date || "");
  const venue = eventDetail?.venue?.trim() || "Location TBA";

  const galleryImages = PLACEHOLDER_IMAGES;


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
            {isLoading ? (
              <Skeleton className="h-9 w-3/4 sm:w-1/2 md:h-14 md:w-3/5 rounded-lg bg-white/10" />
            ) : (
              <Text
                variant="heading-1"
                align="center"
                weight="bold"
                className="text-[1.6rem] sm:text-[2rem] leading-tight md:text-[3.25rem] text-white"
              >
                {pageTitle}
              </Text>
            )}

            {isLoading ? (
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:gap-5 w-full">
                <Skeleton className="h-5 w-20 md:w-24 rounded-full bg-white/10" />
                <Skeleton className="h-5 w-32 md:w-40 rounded-lg bg-white/10" />
                <Skeleton className="h-5 w-24 md:w-28 rounded-lg bg-white/10" />
              </div>
            ) : (
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
            )}

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
            {errorMessage ? (
              <Text
                variant="body"
                align="center"
                className="text-white/60 text-xs md:text-sm"
              >
                Event details unavailable. Showing placeholder gallery.
              </Text>
            ) : null}

            {isLoading ? (
              <div className="px-0 md:px-16">
                <GallerySkeletonGrid />
              </div>
            ) : (
              <>
                <div className="md:hidden mt-2">
                  <div className="flex flex-col gap-5">
                    {galleryImages.slice(0, visibleCount).map((src, index) => (
                      <div
                        key={`${src}-${index}`}
                        className="relative w-full overflow-hidden rounded-[10px] border border-white/15 bg-black/30 aspect-video"
                      >
                        <Image
                          src={src}
                          alt={`${eventTitle} highlight ${index + 1}`}
                          fill
                          sizes="92vw"
                          className="object-cover"
                          priority={index < 2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
                  {galleryImages.slice(0, visibleCount).map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="relative overflow-hidden rounded-[6px] border border-white/10 bg-black/30 aspect-video"
                    >
                      <Image
                        src={src}
                        alt={`${eventTitle} highlight ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                        className="object-cover"
                        priority={index < 4}
                      />
                    </div>
                  ))}
                </div>

                {visibleCount < galleryImages.length && (
                  <div className="mt-8 md:mt-12 flex justify-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + STEP)}

                      className="w-full md:w-fit md:min-w-[240px] px-8 py-3.5 border border-white rounded-[12px] text-white text-sm md:text-base font-medium bg-transparent hover:bg-white/10 active:bg-white/20 transition-all cursor-pointer flex items-center justify-center font-outfit"
                    >
                      Load more
                    </button>
                  </div>
                )}
              </>
            )}


          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
