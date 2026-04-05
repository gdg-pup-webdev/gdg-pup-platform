import React, { useState } from "react";
import { Plus, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminListFieldProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  required?: boolean;
}

export function AdminListField({
  label,
  items,
  onChange,
  placeholder = "Add an item and press Enter...",
  helperText,
  error,
  containerClassName,
  required,
}: AdminListFieldProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      handleAdd(inputValue.trim());
    }
  };

  const handleAdd = (value: string) => {
    if (value && !items.includes(value)) {
      onChange([...items, value]);
      setInputValue("");
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(items.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <label className="text-xs font-bold tracking-widest uppercase text-gray-500">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {helperText && (
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Info size={12} />
          {helperText}
        </span>
      )}

      <div
        className={cn(
          "flex flex-col gap-2 rounded-sm border border-gray-200 bg-white p-2 focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all",
          error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
        )}
      >
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="flex items-center gap-1 rounded bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-teal-200 hover:text-teal-900 transition-colors"
                aria-label={`Remove ${item}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            className="flex-1 min-w-[120px] bg-transparent text-sm outline-none text-gray-900 placeholder:text-gray-400 py-1 px-2"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => handleAdd(inputValue.trim())} // Add on blur if typed but not entered
          />
        </div>
      </div>

      {error && (
        <span className="text-xs font-bold text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
