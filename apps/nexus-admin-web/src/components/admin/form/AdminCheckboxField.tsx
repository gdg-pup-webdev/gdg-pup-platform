"use client";

import React from "react";

interface AdminCheckboxFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  helperText?: string;
}

export function AdminCheckboxField({
  label,
  helperText,
  checked,
  onChange,
  id,
  ...props
}: AdminCheckboxFieldProps) {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={checkboxId}
        className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700"
      >
        <input
          id={checkboxId}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <span>{label}</span>
      </label>
      {helperText ? <p className="text-xs italic text-gray-400">{helperText}</p> : null}
    </div>
  );
}
