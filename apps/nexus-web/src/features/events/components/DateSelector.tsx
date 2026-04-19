"use client";

import { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownLabel,
  Button,
  Text,
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
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="flex items-center justify-between gap-3">
        <Dropdown onOpenChange={setIsOpen}>
          <DropdownTrigger asChild>
            <Button
              variant="ghost"
              className="bg-[#1a1a1a] border border-white/10 hover:bg-[#262626] h-10 md:h-12 flex items-center gap-2 px-4 md:px-5 rounded-xl group transition-all duration-200 shadow-sm"
            >
              <Text
                as="span"
                variant="body"
                gradient="white-green"
                weight="bold"
                className="text-sm md:text-base tracking-tight"
              >
                {MONTHS[currentMonth]} {currentYear}
              </Text>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-all duration-200 ${isOpen ? "text-white rotate-180" : "text-white/50 group-hover:text-white"}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
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

        {/* Navigation Arrows */}
        <div className="flex items-center bg-[#1a1a1a] border border-white/10 rounded-xl h-10 md:h-12 overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="px-3 md:px-4 h-full hover:bg-white/10 transition-colors flex items-center justify-center border-r border-white/10 group"
            aria-label="Previous month"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white/50 group-hover:text-white transition-colors"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="px-3 md:px-4 h-full hover:bg-white/10 transition-colors flex items-center justify-center group"
            aria-label="Next month"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-white/50 group-hover:text-white transition-colors"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
