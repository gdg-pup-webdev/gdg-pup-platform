import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminMarkdownFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export function AdminMarkdownField({
  label,
  helperText,
  error,
  containerClassName,
  className,
  required,
  ...props
}: AdminMarkdownFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      <label className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-gray-500">
        <span>
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </span>
        <span className="text-[10px] text-gray-400">Supports Markdown</span>
      </label>

      {helperText && (
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Info size={12} />
          {helperText}
        </span>
      )}

      <div className="relative flex rounded-sm border border-gray-200 overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all bg-white min-h-[300px]">
        {/* Left pane: Markdown Input (We can consider adding a toolbar later, but this acts as base plain-textarea for markdown) */}
        <textarea
          required={required}
          className={cn(
            "w-full p-4 text-sm font-mono leading-relaxed outline-none resize-y",
            error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-500",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <span className="text-xs font-bold text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}
