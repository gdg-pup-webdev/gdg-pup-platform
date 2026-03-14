"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container, Stack, Text } from "@packages/spark-ui";
import { getEventDetail } from "../api/getEventDetail";
import type { Event } from "../types";
import { normalizeEventDescription, splitBoldSegments } from "../utils/description";

type EventDetailSectionProps = {
  eventId: string;
  title?: string;
};

function renderDescriptionWithBold(text: string) {
  return splitBoldSegments(text).map((segment, index) =>
    segment.bold ? (
      <strong
        key={`${segment.text}-${index}`}
        className="font-semibold text-white"
      >
        {segment.text}
      </strong>
    ) : (
      <span key={`${segment.text}-${index}`}>{segment.text}</span>
    ),
  );
}

export function EventDetailSection({
  eventId,
  title,
}: EventDetailSectionProps) {
  const [eventDetail, setEventDetail] = useState<Event | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function resolveDetail() {
      try {
        const found = await getEventDetail({
          routeId: eventId,
          title: title?.trim() || undefined,
        });
        if (!cancelled) setEventDetail(found);
      } catch {
        if (!cancelled) setEventDetail(null);
      }
    }

    resolveDetail();

    return () => {
      cancelled = true;
    };
  }, [eventId, title]);

  const eventTitle = eventDetail?.title?.trim() || title?.trim() || "Event Details";

  const [primaryTitle, secondaryTitle] = useMemo(() => {
    const idx = eventTitle.indexOf(":");
    if (idx === -1) return [eventTitle, ""] as const;

    const head = eventTitle.slice(0, idx).trim();
    const tail = eventTitle.slice(idx + 1).trim();
    return [head || eventTitle, tail] as const;
  }, [eventTitle]);

  const infoSubtitle = secondaryTitle || eventDetail?.short_description?.trim() || "";
  const primaryTitleDisplay = primaryTitle.replace(/\s(\d+[A-Za-z0-9-]*)$/, "\u00A0$1");
  const secondaryTitleDisplay = secondaryTitle.replace(/\s([A-Za-z])$/, "\u00A0$1");
  const aboutText = normalizeEventDescription(
    eventDetail?.description?.trim() ||
      eventDetail?.short_description?.trim() ||
      "Description will be available soon.",
  );
  const isLongAbout = aboutText.length > 360;
  const aboutPreview =
    isLongAbout && !expanded ? `${aboutText.slice(0, 360).trimEnd()}...` : aboutText;
  const fullAboutParagraphs = aboutText.split(/\n{2,}|\r\n\r\n/).filter(Boolean);
  const aboutParagraphs = aboutPreview.split(/\n{2,}|\r\n\r\n/).filter(Boolean);
  const keyThemes =
    eventDetail?.tags?.filter((tag) => Boolean(tag?.trim())) ||
    (eventDetail?.category ? [eventDetail.category] : []);

  const registerHref =
    eventDetail?.registration_url?.trim() || eventDetail?.bevy_url?.trim() || "";

  const dateBarLabel = useMemo(() => {
    if (!eventDetail?.start_date) return "Date to be announced";

    const start = new Date(eventDetail.start_date);
    if (Number.isNaN(start.getTime())) return "Date to be announced";

    const end = eventDetail.end_date ? new Date(eventDetail.end_date) : null;
    const monthDay = start.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
    });
    const startTime = start.toLocaleString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const endTime =
      end && !Number.isNaN(end.getTime())
        ? end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" })
        : "";

    const offsetMinutes = -new Date().getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const abs = Math.abs(offsetMinutes);
    const hours = Math.floor(abs / 60);
    const minutes = abs % 60;
    const gmt =
      minutes === 0
        ? `GMT${sign}${hours}`
        : `GMT${sign}${hours}:${String(minutes).padStart(2, "0")}`;

    return `${monthDay}, ${startTime}${endTime ? ` \u2013 ${endTime}` : ""} (${gmt})`;
  }, [eventDetail]);

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
        <Stack gap="md" className="md:gap-5">
          <Link
            href="/events"
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

          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-black min-h-[260px] md:min-h-[520px]">
            <img
              src="/pages/events/event-cover.png"
              alt={eventTitle}
              className="absolute inset-0 h-full w-full object-cover object-center"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
            <div className="absolute z-10 left-4 top-11 md:left-10 md:top-14 max-w-[66%] md:max-w-[48%]">
              <Text
                variant="heading-2"
                weight="bold"
                className="text-white text-[1.65rem] md:text-[4.75rem]"
                style={{
                  lineHeight: 0.84,
                  textShadow:
                    "-1.2px 0 rgba(66,133,244,0.9), 1.2px 0 rgba(234,67,53,0.9), 0 -1.2px rgba(249,171,0,0.9), 0 1.2px rgba(52,168,83,0.9), -2px 0 8px rgba(66,133,244,0.35), 2px 0 8px rgba(234,67,53,0.35), 0 -2px 8px rgba(249,171,0,0.35), 0 2px 8px rgba(52,168,83,0.35)",
                }}
              >
                {primaryTitleDisplay}
              </Text>
              <div
                className="mt-1 md:mt-2 h-[2px] w-40 md:w-56 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(66,133,244,1) 0%, rgba(234,67,53,1) 33%, rgba(249,171,0,1) 66%, rgba(52,168,83,1) 100%)",
                }}
              />
              {secondaryTitle ? (
                <Text
                  variant="heading-5"
                  className="mt-1 md:mt-2 italic text-white/95 text-[0.875rem] md:text-[2.15rem] leading-tight"
                >
                  {secondaryTitleDisplay}
                </Text>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl p-4 md:p-8">
            <Stack gap="md" className="md:gap-6">
              <div>
                <Text
                  variant="heading-2"
                  weight="bold"
                  className="text-white text-[2rem] md:text-[3.25rem] leading-tight"
                >
                  {primaryTitle}
                </Text>
                {infoSubtitle ? (
                  <Text
                    variant="heading-5"
                    className="text-white/90 mt-1 md:mt-2 text-[1.25rem] md:text-[2.15rem] leading-tight"
                  >
                    {infoSubtitle}
                  </Text>
                ) : null}
              </div>

              <div
                className="w-full rounded-lg border border-white/10 px-3 py-2 md:px-4 md:py-2.5 flex items-center gap-2"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(65, 65, 65, 1) 50%, rgba(0, 0, 0, 1) 100%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                >
                  <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8Z" />
                </svg>
                <Text variant="caption" className="text-white/85">
                  {dateBarLabel}
                </Text>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-5 md:gap-8">
                <div>
                  <Text
                    variant="body"
                    className="text-white mb-2 text-[1.0625rem] font-normal md:text-base md:font-semibold"
                  >
                    Key Themes
                  </Text>
                  <div className="flex flex-wrap md:flex-col gap-2">
                    {keyThemes.length > 0 ? (
                      keyThemes.slice(0, 6).map((theme) => (
                        <span key={theme}>
                          <span
                            className="inline-flex md:hidden w-fit rounded-full p-[1px]"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(234,67,53,1) 0%, rgba(249,171,0,1) 33%, rgba(52,168,83,1) 66%, rgba(66,133,244,1) 100%)",
                            }}
                          >
                            <span
                              className="inline-flex rounded-full text-white text-[11px] px-2.5 py-0.5"
                              style={{
                                backgroundColor: "rgba(0, 0, 0, 0.82)",
                                backgroundImage: "none",
                              }}
                            >
                              {theme}
                            </span>
                          </span>
                          <span className="hidden md:inline-flex w-fit rounded-md bg-white text-black px-3 py-1 text-sm">
                            {theme}
                          </span>
                        </span>
                      ))
                    ) : (
                      <>
                        <span
                          className="inline-flex md:hidden w-fit rounded-full p-[1px]"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(234,67,53,1) 0%, rgba(249,171,0,1) 33%, rgba(52,168,83,1) 66%, rgba(66,133,244,1) 100%)",
                          }}
                        >
                          <span
                            className="inline-flex rounded-full text-white text-[11px] px-2.5 py-0.5"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.82)",
                              backgroundImage: "none",
                            }}
                          >
                            TBD
                          </span>
                        </span>
                        <span className="hidden md:inline-flex w-fit rounded-md bg-white/20 text-white/80 px-3 py-1 text-sm">
                          TBD
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <Text
                    variant="heading-4"
                    className="text-white mb-3 text-[1.0625rem] font-normal md:text-[2rem] md:font-bold"
                  >
                    What is the event about?
                  </Text>
                  <div className="space-y-3 md:hidden">
                    {fullAboutParagraphs.map((paragraph, index) => (
                      <Text
                        key={`${paragraph.slice(0, 20)}-mobile-${index}`}
                        variant="body-sm"
                        className="text-white/85 leading-relaxed"
                      >
                        {renderDescriptionWithBold(paragraph)}
                      </Text>
                    ))}
                  </div>
                  <div className="hidden md:block space-y-3">
                    {aboutParagraphs.map((paragraph, index) => (
                      <Text
                        key={`${paragraph.slice(0, 20)}-${index}`}
                        variant="body-sm"
                        className="text-white/85 leading-relaxed"
                      >
                        {renderDescriptionWithBold(paragraph)}
                      </Text>
                    ))}
                  </div>
                  {isLongAbout ? (
                    <div className="mt-4 hidden md:flex w-full justify-center">
                      <button
                        type="button"
                        onClick={() => setExpanded((value) => !value)}
                        className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-1 cursor-pointer"
                      >
                        {expanded ? "See Less" : "See More"}
                        <span aria-hidden="true">{expanded ? "\u02c4" : "\u02c5"}</span>
                      </button>
                    </div>
                  ) : null}

                  <div className="mt-6 md:mt-7">
                    {registerHref ? (
                      <a
                        href={registerHref}
                        target="_blank"
                        rel="noreferrer"
                        className="h-10 md:h-11 w-full rounded-md border border-[#4285F4] bg-[linear-gradient(90deg,rgba(20,57,132,0.95)_0%,rgba(43,127,255,0.95)_50%,rgba(20,57,132,0.95)_100%)] text-white text-sm md:text-base font-medium inline-flex items-center justify-center"
                      >
                        Register
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="h-10 md:h-11 w-full rounded-md border border-white/15 bg-white/5 text-white/50 text-sm md:text-base font-medium"
                      >
                        Register
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Stack>
          </div>
        </Stack>
      </Container>
    </div>
  );
}
