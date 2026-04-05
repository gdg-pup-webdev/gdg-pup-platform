"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const AdminInputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-sm border px-3 py-2 text-sm outline-none transition-all placeholder:text-gray-400 focus:ring-2",
            error 
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" 
              : "border-gray-200 focus:border-teal-500 focus:ring-teal-500/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-400 mt-1 italic">{helperText}</p>}
      </div>
    );
  }
);

AdminInputField.displayName = "AdminInputField";
