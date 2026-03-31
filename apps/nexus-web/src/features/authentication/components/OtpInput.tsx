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

  // Always-current value ref — avoids stale closures in async focus events.
  // Updated on every render so handlers always read the latest value.
  const valueRef = useRef(value);
  valueRef.current = value;

  // Distinguishes programmatic focus (our code calling .focus()) from
  // user-initiated focus (mouse click / tab). If programmatic, skip redirection.
  const isProgrammaticFocus = useRef(false);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const focusBox = (index: number) => {
    isProgrammaticFocus.current = true;
    inputRefs.current[index]?.focus();
  };

  /** First empty slot index using the always-fresh valueRef — never stale. */
  const getCorrectIndex = () => {
    const current = Array.from({ length }, (_, i) => valueRef.current[i] ?? "");
    const firstEmpty = current.findIndex((d) => d === "");
    return firstEmpty === -1 ? length - 1 : firstEmpty;
  };

  const handleFocus = (index: number) => {
    if (isProgrammaticFocus.current) {
      // Our code moved focus — trust it, don't redirect
      isProgrammaticFocus.current = false;
      setActiveIndex(index);
      inputRefs.current[index]?.select();
      return;
    }
    // User-initiated focus (click / tab) — enforce sequential order
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
    <div className="flex items-center justify-center gap-[6px] sm:gap-[12px]">
      {digits.map((digit, index) => {
        const isFilled = digit !== "";
        const isActive = activeIndex === index;
        return (
          <div
            key={index}
            className={`
              relative rounded-[8px] sm:rounded-[10px] transition-all duration-200
              ${isFilled
                ? "p-[1px] bg-[conic-gradient(from_315deg_at_50%_50%,#2B7FFF_0deg,#F0B100_90deg,#FB2C36_180deg,#F0B100_270deg,#2B7FFF_360deg)]"
                : isActive
                  ? "p-[1px] bg-[conic-gradient(from_315deg_at_50%_50%,#2B7FFF_0deg,#F0B100_90deg,#FB2C36_180deg,#F0B100_270deg,#2B7FFF_360deg)]"
                  : "p-[1px] bg-white/40"
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
              className={`
                w-[42px] h-[52px] sm:w-[64px] sm:h-[76px]
                text-center text-[18px] sm:text-[24px] font-bold text-white
                rounded-[7px] sm:rounded-[8px]
                bg-[#060f21] outline-none border-none caret-transparent
                ${isFilled
                  ? "bg-[#030a17] shadow-[inset_0_0_18px_rgba(255,255,255,0.08)]"
                  : isActive
                    ? "shadow-[inset_0_0_16px_rgba(255,255,255,0.07)]"
                    : ""
                }
              `}
            />
          </div>
        );
      })}
    </div>
  );
};
