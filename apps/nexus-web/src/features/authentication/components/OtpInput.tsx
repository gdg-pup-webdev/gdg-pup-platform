"use client";

import React, { useRef, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OtpInput = ({ value, onChange, length = 6 }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focusBox = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, char: string) => {
    // Only accept single digits
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
        // Clear current box
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      } else if (index > 0) {
        // Move to previous and clear it
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
    // Focus the box after the last pasted digit
    const nextFocus = Math.min(pasted.length, length - 1);
    focusBox(nextFocus);
  };

  return (
    <div className="flex items-center justify-center gap-[12px]">
      {digits.map((digit, index) => {
        const isFilled = digit !== "";
        return (
          <div
            key={index}
            className={`
              relative rounded-[10px] transition-all duration-200
              ${isFilled
                ? "p-[2px] bg-gradient-to-r from-[#FB2C36] via-[#F0B100] to-[#2B7FFF]"
                : "p-[1px] bg-[#404040] focus-within:p-[2px] focus-within:bg-gradient-to-r focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF]"
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
              onFocus={(e) => e.target.select()}
              className={`
                w-[52px] h-[60px] text-center text-[24px] font-bold text-white rounded-[8px]
                bg-[#0d1b35] outline-none border-none caret-transparent
                ${isFilled ? "bg-[#0a1628]" : ""}
              `}
            />
          </div>
        );
      })}
    </div>
  );
};
