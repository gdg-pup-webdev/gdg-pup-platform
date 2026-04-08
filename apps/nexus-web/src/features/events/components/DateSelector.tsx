"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownLabel,
  Button,
} from "@packages/spark-ui";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export function DateSelector({
  date,
  onDateChange,
  className,
}: DateSelectorProps) {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i,
  );

  return (
    <div className={className}>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="bg-transparent border-white/20 hover:bg-white/10 min-w-[160px] flex justify-between"
          >
            <span className="bg-linear-to-b text-4xl from-white to-green-500 bg-clip-text text-transparent">
              {MONTHS[currentMonth]} {currentYear}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 opacity-80"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="100%" stopColor="#22c55e" />{" "}
                  {/* Tailwind green-500 */}
                </linearGradient>
              </defs>

              <path d="m6 9 6 6 6-6" />
            </svg>
          </Button>
        </DropdownTrigger>
        <DropdownContent className="bg-[#1a1a1a] border-white/20 min-w-[280px] p-3">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Months Column */}
            <div className="flex-1">
              <DropdownLabel className="mb-2">Month</DropdownLabel>
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setMonth(index);
                      onDateChange(newDate);
                    }}
                    className={`text-[11px] px-2 py-1.5 rounded-md transition-colors text-left ${
                      currentMonth === index
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator for desktop */}
            <div className="hidden md:block w-px bg-white/10 self-stretch" />

            {/* Years Column */}
            <div className="min-w-[80px]">
              <DropdownLabel className="mb-2">Year</DropdownLabel>
              <div className="flex flex-col gap-1">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => {
                      const newDate = new Date(date);
                      newDate.setFullYear(year);
                      onDateChange(newDate);
                    }}
                    className={`text-[11px] px-3 py-1.5 rounded-md transition-colors text-left ${
                      currentYear === year
                        ? "bg-white/20 text-blue font-bold"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
