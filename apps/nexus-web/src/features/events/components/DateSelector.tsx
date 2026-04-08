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

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    onDateChange(newDate);
  };

  return (
    <div className={className}>
      <div className="w-full *:w-1/4">
        <Dropdown>
          <DropdownTrigger asChild>
            <Button
              variant="ghost"
              className="bg-[#1a1a1a] border border-white/10 hover:bg-[#262626] w-full h-12 flex justify-between items-center px-4 rounded-xl group transition-all duration-200"
            >
              <span className="text-white/90 text-lg font-bold tracking-tight">
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <div className="flex items-center gap-3 ml-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors group/btn flex items-center justify-center"
                  aria-label="Previous month"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-white/50 group-hover/btn:text-white transition-colors"
                  >
                    <path d="m12 8-6 8h12z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors group/btn flex items-center justify-center"
                  aria-label="Next month"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-white/50 group-hover/btn:text-white transition-colors"
                  >
                    <path d="m12 16 6-8H6z" />
                  </svg>
                </button>
              </div>
            </Button>
          </DropdownTrigger>
          <DropdownContent className="bg-[#1a1a1a] border border-white/10 min-w-[320px] p-4 rounded-2xl shadow-2xl shadow-black/50">
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-white font-bold opacity-90 text-[13px]">
                  Select Date
                </span>
              </div>

              <div className="flex gap-4">
                {/* Months Column */}
                <div className="flex-1">
                  <DropdownLabel className="mb-2 text-[10px] uppercase tracking-widest text-white/40">
                    Month
                  </DropdownLabel>
                  <div className="grid grid-cols-3 gap-1.5">
                    {MONTHS.map((month, index) => (
                      <button
                        key={month}
                        onClick={() => {
                          const newDate = new Date(date);
                          newDate.setMonth(index);
                          onDateChange(newDate);
                        }}
                        className={`text-[11px] px-2 py-1.5 rounded-md transition-all text-center border ${
                          currentMonth === index
                            ? "bg-white/90 text-black font-bold border-white/90"
                            : "text-white/60 border-transparent hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {month.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Separator */}
                <div className="w-px bg-white/5 self-stretch" />

                {/* Years Column */}
                <div className="w-20">
                  <DropdownLabel className="mb-2 text-[10px] uppercase tracking-widest text-white/40">
                    Year
                  </DropdownLabel>
                  <div className="flex flex-col gap-1.5">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          const newDate = new Date(date);
                          newDate.setFullYear(year);
                          onDateChange(newDate);
                        }}
                        className={`text-[11px] px-2 py-1.5 rounded-md transition-all text-center border ${
                          currentYear === year
                            ? "bg-white/90 text-black font-bold border-white/90"
                            : "text-white/60 border-transparent hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DropdownContent>
        </Dropdown>
      </div>
    </div>
  );
}
