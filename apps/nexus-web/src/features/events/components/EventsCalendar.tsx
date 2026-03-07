"use client";

import { useMemo } from "react";
import { Card, Text } from "@packages/spark-ui";
import { useEvents } from "../hooks/useEvents";
import type { Event } from "../types";
import { cn } from "@/lib/utils";

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
  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const monthIndex = now.getMonth();

  const monthStart = useMemo(
    () => new Date(year, monthIndex, 1, 0, 0, 0, 0),
    [year, monthIndex],
  );
  const monthEnd = useMemo(
    () => new Date(year, monthIndex + 1, 0, 23, 59, 59, 999),
    [year, monthIndex],
  );

  const { data, isLoading, error } = useEvents({
    pageNumber: 1,
    pageSize: 50,
    start_date_gte: monthStart.toISOString(),
    start_date_lte: monthEnd.toISOString(),
  });

  const monthLabel = useMemo(
    () =>
      now.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }),
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

  const eventColorById = useMemo(() => {
    const list = [...(data?.data ?? [])].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
    );

    const map = new Map<
      string,
      { default: string; hover: string; border: string; mobileLabelColor: string }
    >();
    list.forEach((event, index) => {
      map.set(event.id, EVENT_SEQUENCE_GRADIENTS[index % EVENT_SEQUENCE_GRADIENTS.length]);
    });

    return map;
  }, [data]);

  return (
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

      <Card
        className="p-0 gap-0 overflow-hidden border border-white/35 bg-[rgba(26,26,26,0.88)] rounded-xl md:rounded-[18px]"
      >
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
          const accentStyle = firstEvent ? eventColorById.get(firstEvent.id) : undefined;

          return (
            <div
              key={cell.key}
              className={cn(
                "relative min-h-16 md:min-h-32 p-1 md:p-2 border-r border-b border-white/20",
                hasEvent && "group cursor-pointer",
                cell.isCurrentMonth
                  ? "bg-[rgba(23,23,23,1)]"
                  : "bg-[rgba(38,38,38,1)]",
              )}
            >
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
                    hasEvent
                      ? "text-black font-semibold"
                      : cell.isCurrentMonth
                        ? "text-white"
                        : "text-white/55",
                  )}
                >
                  {String(cell.date.getDate()).padStart(2, "0")}
                </span>

                {firstEvent && (
                  <div className="mt-auto">
                    <p className="hidden md:block text-[9px] md:text-sm font-semibold text-black leading-tight line-clamp-1 md:line-clamp-2 group-hover:hidden">
                      {firstEvent.title}
                    </p>
                    <p
                      className="text-[9px] font-semibold leading-tight truncate px-1 py-0.5 rounded-sm bg-white/55 group-hover:hidden md:hidden"
                      style={{ color: accentStyle?.mobileLabelColor }}
                    >
                      Event
                    </p>
                    <p className="hidden md:flex text-[8px] md:text-[10px] font-semibold text-black/75 truncate items-center gap-1 group-hover:hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-2 w-2 md:h-2.5 md:w-2.5 shrink-0"
                        aria-hidden="true"
                      >
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
  );
}


