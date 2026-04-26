"use client";

import React, { useRef, useState, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OtpInput = ({ value, onChange, length = 6 }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const valueRef = useRef(value);
  valueRef.current = value;

  const isProgrammaticFocus = useRef(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const focusBox = (index: number) => {
    isProgrammaticFocus.current = true;
    inputRefs.current[index]?.focus();
  };

  const getCorrectIndex = () => {
    const current = Array.from({ length }, (_, i) => valueRef.current[i] ?? "");
    const firstEmpty = current.findIndex((d) => d === "");
    return firstEmpty === -1 ? length - 1 : firstEmpty;
  };

  const handleFocus = (index: number) => {
    if (isProgrammaticFocus.current) {
      isProgrammaticFocus.current = false;
      setActiveIndex(index);
      inputRefs.current[index]?.select();
      return;
    }
    const correct = getCorrectIndex();
    if (index !== correct) {
      focusBox(correct);
      return;
    }
    setActiveIndex(index);
    inputRefs.current[index]?.select();
  };

  const handleBlur = () => {
    setActiveIndex(null);
  };

  const handleChange = (index: number, char: string) => {
    const digit = char.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    onChange(newDigits.join(""));

    if (digit && index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else if (index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
        focusBox(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusBox(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const newDigits = [...digits];
    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    onChange(newDigits.join(""));
    const nextFocus = Math.min(pasted.length, length - 1);
    focusBox(nextFocus);
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {digits.map((digit, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={index}
            className={`
              relative rounded-lg sm:rounded-xl transition-all duration-200 border-2
              ${isActive
                ? "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                : digit !== ""
                  ? "border-zinc-300 dark:border-zinc-700"
                  : "border-zinc-200 dark:border-zinc-800"
              }
            `}
          >
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 rounded-md sm:rounded-lg bg-white dark:bg-zinc-900 outline-none caret-transparent"
            />
          </div>
        );
      })}
    </div>
  );
};
