"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, Text } from "@packages/spark-ui";
import { useEvents } from "../hooks/useEvents";
import type { Event } from "../types";
import { cn } from "@/lib/utils";
import { normalizeEventDescription } from "../utils/description";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"] as const;

type CalendarCell = {
  date: Date;
  isCurrentMonth: boolean;
  key: string;
};

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getEventRouteId(event: Event): string {
  const rawId =
    event.id ||
    event.bevy_url ||
    `${event.start_date}-${event.title}`;

  return String(rawId).trim();
}

function getEventRouteHref(event: Event): string {
  const routeId = encodeURIComponent(getEventRouteId(event));
  const title = encodeURIComponent(event.title);
  return `/events/${routeId}?title=${title}`;
}

function splitEventTitle(title: string) {
  const idx = title.indexOf(":");
  if (idx === -1) return { primary: title, secondary: "" };

  return {
    primary: title.slice(0, idx).trim() || title,
    secondary: title.slice(idx + 1).trim(),
  };
}

function formatDateBar(startDate?: string, endDate?: string) {
  if (!startDate) return "Date to be announced";

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "Date to be announced";

  const end = endDate ? new Date(endDate) : null;
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

  return `${monthDay}, ${startTime}${endTime ? ` – ${endTime}` : ""} (${gmt})`;
}

function formatCalendarTitle(title: string): string {
  return title.replace(/\s([A-Za-z])$/, "\u00A0$1");
}

function buildMonthCells(year: number, monthIndex: number): CalendarCell[] {
  const monthStart = new Date(year, monthIndex, 1, 0, 0, 0, 0);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return {
      date,
      isCurrentMonth: date.getMonth() === monthIndex,
      key: toLocalDateKey(date),
    };
  });
}

const EVENT_SEQUENCE_GRADIENTS = [
  {
    default: "linear-gradient(90deg, rgba(1, 102, 48, 1) 0%, rgba(0, 201, 80, 1) 50%, rgba(1, 102, 48, 1) 100%)",
    hover: "linear-gradient(0deg, rgba(92, 219, 109, 1) 0%, rgba(49, 117, 58, 1) 100%)",
    border: "rgba(0, 201, 80, 1)",
    mobileLabelColor: "rgba(1, 102, 48, 1)",
  },
  {
    default: "linear-gradient(90deg, rgba(130, 24, 26, 1) 0%, rgba(234, 67, 53, 1) 50%, rgba(130, 24, 26, 1) 100%)",
    hover: "linear-gradient(0deg, rgba(234, 67, 53, 1) 0%, rgba(132, 38, 30, 1) 100%)",
    border: "rgba(251, 44, 54, 1)",
    mobileLabelColor: "rgba(130, 24, 26, 1)",
  },
  {
    default: "linear-gradient(90deg, rgba(142, 114, 0, 1) 0%, rgba(240, 177, 0, 1) 50%, rgba(142, 114, 0, 1) 100%)",
    hover: "linear-gradient(0deg, rgba(255, 212, 39, 1) 0%, rgba(153, 127, 23, 1) 100%)",
    border: "rgba(240, 177, 0, 1)",
    mobileLabelColor: "rgba(142, 114, 0, 1)",
  },
  {
    default: "linear-gradient(90deg, rgba(22, 36, 86, 1) 0%, rgba(43, 127, 255, 1) 50%, rgba(22, 36, 86, 1) 100%)",
    hover: "linear-gradient(0deg, rgba(81, 162, 255, 1) 0%, rgba(21, 93, 252, 1) 100%)",
    border: "rgba(43, 127, 255, 1)",
    mobileLabelColor: "rgba(22, 36, 86, 1)",
  },
];

export function EventsCalendar() {
  const [selectedMobileEvent, setSelectedMobileEvent] = useState<Event | null>(null);
  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const monthIndex = now.getMonth();

  const monthStart = useMemo(() => new Date(year, monthIndex, 1, 0, 0, 0, 0), [year, monthIndex]);
  const monthEnd = useMemo(() => new Date(year, monthIndex + 1, 0, 23, 59, 59, 999), [year, monthIndex]);

  const { data, isLoading, error } = useEvents({
    pageNumber: 1,
    pageSize: 50,
    start_date_gte: monthStart.toISOString(),
    start_date_lte: monthEnd.toISOString(),
  });

  const monthLabel = useMemo(
    () => now.toLocaleString("en-US", { month: "long", year: "numeric" }),
    [now],
  );

  const cells = useMemo(() => buildMonthCells(year, monthIndex), [year, monthIndex]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, Event[]>();
    const list = data?.data ?? [];

    for (const event of list) {
      if (!event.start_date) continue;
      const eventDate = new Date(event.start_date);
      if (Number.isNaN(eventDate.getTime())) continue;

      const key = toLocalDateKey(eventDate);
      const existing = map.get(key) ?? [];
      existing.push(event);
      map.set(key, existing);
    }

    return map;
  }, [data]);

  const eventColorByDate = useMemo(() => {
    const dateKeys = Array.from(eventsByDate.keys())
      .filter((key) => {
        const [y, m] = key.split("-");
        return Number(y) === year && Number(m) === monthIndex + 1;
      })
      .sort((a, b) => (a < b ? -1 : 1));

    const map = new Map<
      string,
      { default: string; hover: string; border: string; mobileLabelColor: string }
    >();
    dateKeys.forEach((key, index) => {
      map.set(key, EVENT_SEQUENCE_GRADIENTS[index % EVENT_SEQUENCE_GRADIENTS.length]);
    });

    return map;
  }, [eventsByDate, year, monthIndex]);

  useEffect(() => {
    if (!selectedMobileEvent) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedMobileEvent(null);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedMobileEvent]);

  return (
    <>
      <div className="w-[calc(100%+1rem)] -mx-2 md:w-full md:mx-0 mt-5 md:mt-8">
        <Text variant="heading-5" weight="semibold" gradient="white-green" className="mb-1 md:mb-3 text-[1.35rem] sm:text-[1.55rem] md:text-[2rem]">
          {monthLabel}
        </Text>

        {isLoading && (
          <Text variant="body-sm" className="text-white/70 mb-2">
            Loading events...
          </Text>
        )}

        {error && !isLoading && (
          <div className="mb-2">
            <Text variant="body-sm" className="text-red-300">
              Failed to load events for this month.
            </Text>
            <Text variant="caption" className="text-red-200/85">
              {error instanceof Error ? error.message : "Unknown request error."}
            </Text>
          </div>
        )}

        <Card className="p-0 gap-0 overflow-hidden border border-white/35 bg-[rgba(26,26,26,0.88)] rounded-xl md:rounded-[18px]">
          <div className="grid grid-cols-7">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="h-7 md:h-8 px-1 md:px-2 flex items-center border-r border-white/20 last:border-r-0"
                style={{ backgroundColor: "rgba(64, 64, 64, 1)" }}
              >
                <span className="text-[8px] md:text-[11px] text-white/80">{day}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-t border-white/25">
            {cells.map((cell) => {
              const dayEvents = eventsByDate.get(cell.key) ?? [];
              const firstEvent = dayEvents[0];
              const hasEvent = Boolean(firstEvent);
              const extraCount = dayEvents.length > 1 ? dayEvents.length - 1 : 0;
              const accentStyle = firstEvent ? eventColorByDate.get(cell.key) : undefined;

              return (
                <div
                  key={cell.key}
                  className={cn(
                    "relative h-16 md:h-32 p-1 md:p-2 border-r border-b border-white/20 overflow-hidden",
                    hasEvent && "group cursor-pointer",
                    cell.isCurrentMonth ? "bg-[rgba(23,23,23,1)]" : "bg-[rgba(38,38,38,1)]",
                  )}
                >
                  {firstEvent && (
                    <Link
                      href={getEventRouteHref(firstEvent)}
                      className="absolute inset-0 z-20 hidden md:block"
                      aria-label={`View details for ${firstEvent.title}`}
                    />
                  )}
                  {firstEvent && (
                    <button
                      type="button"
                      className="absolute inset-0 z-20 md:hidden"
                      aria-label={`Preview details for ${firstEvent.title}`}
                      onClick={() => setSelectedMobileEvent(firstEvent)}
                    />
                  )}

                  {firstEvent && (
                    <div
                      className="absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-0"
                      style={{ backgroundImage: accentStyle?.default }}
                    />
                  )}
                  {firstEvent && (
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100"
                      style={{ backgroundImage: accentStyle?.hover }}
                    />
                  )}
                  {firstEvent && (
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 pointer-events-none border-2"
                      style={{ borderColor: accentStyle?.border }}
                    />
                  )}

                  <div className="relative z-10 h-full flex flex-col">
                    <span
                      className={cn(
                        "text-[10px] md:text-sm",
                        hasEvent ? "text-black font-semibold" : cell.isCurrentMonth ? "text-white" : "text-white/55",
                      )}
                    >
                      {String(cell.date.getDate()).padStart(2, "0")}
                    </span>

                    {firstEvent && (
                      <div className="mt-auto min-h-0">
                        <div className="hidden md:block group-hover:hidden">
                          <p
                            className="text-[9px] md:text-sm font-semibold text-black leading-tight overflow-hidden"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {formatCalendarTitle(firstEvent.title)}
                          </p>
                        </div>
                        <p
                          className="text-[9px] font-semibold leading-tight truncate px-1 py-0.5 rounded-sm bg-white/55 group-hover:hidden md:hidden"
                          style={{ color: accentStyle?.mobileLabelColor }}
                        >
                          Event
                        </p>
                        <p className="hidden md:flex text-[8px] md:text-[10px] font-semibold text-black/75 truncate items-center gap-1 group-hover:hidden">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-2 w-2 md:h-2.5 md:w-2.5 shrink-0" aria-hidden="true">
                            <path d="M12 2a7 7 0 0 0-7 7c0 4.7 5.1 11.5 6.4 13.1a.8.8 0 0 0 1.2 0C13.9 20.5 19 13.7 19 9a7 7 0 0 0-7-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                          </svg>
                          <span>{firstEvent.venue || "Location"}</span>
                        </p>
                        {extraCount > 0 && (
                          <p className="hidden md:block text-[8px] md:text-[10px] text-black/70 mt-0.5 group-hover:hidden">
                            +{extraCount} more
                          </p>
                        )}
                        <p className="hidden md:group-hover:block text-[9px] md:text-sm leading-tight font-semibold text-black">
                          View More →
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {selectedMobileEvent && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/70 px-4 py-6 flex items-center justify-center"
          onClick={() => setSelectedMobileEvent(null)}
        >
          <div
            className="w-full max-w-[350px] rounded-xl p-[1px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(234,67,53,1) 0%, rgba(249,171,0,1) 33%, rgba(52,168,83,1) 66%, rgba(66,133,244,1) 100%)",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rounded-[11px] p-3 relative" style={{ backgroundColor: "rgba(1, 11, 29, 1)" }}>
              <button
                type="button"
                onClick={() => setSelectedMobileEvent(null)}
                className="absolute right-3 top-2 text-white/80 hover:text-white text-[30px] leading-none cursor-pointer z-30"
                aria-label="Close event preview"
              >
                ×
              </button>

              {(() => {
                const { primary, secondary } = splitEventTitle(selectedMobileEvent.title);
                const themes =
                  selectedMobileEvent.tags?.filter((tag) => Boolean(tag?.trim())) ||
                  (selectedMobileEvent.category ? [selectedMobileEvent.category] : []);
                const about =
                  normalizeEventDescription(
                    selectedMobileEvent.description?.trim() ||
                      selectedMobileEvent.short_description?.trim() ||
                      "Description will be available soon.",
                  );

                return (
                  <div>
                    <div className="relative mb-3 h-36 mt-6">
                      <img
                        src="/pages/events/cirby-event-icon.png"
                        alt="Cirby"
                        className="absolute -top-8 -left-3 z-20 h-14 w-14 object-contain"
                      />
                      <div className="relative overflow-hidden rounded-md border border-white/15 h-full">
                        <img
                          src="/pages/events/event-cover.png"
                          alt={selectedMobileEvent.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
                        <div className="absolute left-2.5 top-4 z-10 max-w-[64%]">
                          <Text
                            variant="heading-5"
                            weight="bold"
                            className="text-white leading-[0.92] text-[1.32rem]"
                            style={{
                              textShadow:
                                "-1px 0 rgba(66,133,244,0.9), 1px 0 rgba(234,67,53,0.9), 0 -1px rgba(249,171,0,0.9), 0 1px rgba(52,168,83,0.9)",
                            }}
                          >
                            {primary}
                          </Text>
                          <div
                            className="mt-1 h-[2px] w-24 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(66,133,244,1) 0%, rgba(234,67,53,1) 33%, rgba(249,171,0,1) 66%, rgba(52,168,83,1) 100%)",
                            }}
                          />
                          {secondary ? (
                            <p className="mt-1 italic text-white/95 text-[10px] leading-[0.9]">
                              {secondary}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div
                      className="rounded-md border border-white/10 px-2 py-1.5 w-full flex items-center gap-1.5 mb-3"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(65, 65, 65, 1) 50%, rgba(0, 0, 0, 1) 100%)",
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-white" aria-hidden="true">
                        <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8Z" />
                      </svg>
                      <span className="text-white/85 text-[11px] leading-none">
                        {formatDateBar(selectedMobileEvent.start_date, selectedMobileEvent.end_date)}
                      </span>
                    </div>

                    <Text variant="body-sm" weight="semibold" className="text-white mb-1.5">
                      Key Themes
                    </Text>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(themes.length > 0 ? themes.slice(0, 4) : ["TBD"]).map((theme) => (
                        <span
                          key={theme}
                          className="inline-flex rounded-full p-[1px]"
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
                      ))}
                    </div>

                    <Text variant="body-sm" weight="semibold" className="text-white mb-1">
                      What is this event about?
                    </Text>
                    <Text variant="caption" className="text-white/80 line-clamp-4 mb-4">
                      {about}
                    </Text>

                    <Link
                      href={getEventRouteHref(selectedMobileEvent)}
                      onClick={() => setSelectedMobileEvent(null)}
                      className="h-9 w-full rounded-md border border-[#4285F4] bg-[linear-gradient(90deg,rgba(20,57,132,0.95)_0%,rgba(43,127,255,0.95)_50%,rgba(20,57,132,0.95)_100%)] text-white text-sm font-medium inline-flex items-center justify-center gap-1"
                    >
                      Learn more about this event
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
