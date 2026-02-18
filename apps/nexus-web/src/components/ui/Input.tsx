import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300"
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
      {helperText && !error && (
        <span className="text-sm text-gray-500">{helperText}</span>
      )}
    </div>
  );
};
