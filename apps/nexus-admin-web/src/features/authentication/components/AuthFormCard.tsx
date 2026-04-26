import React from "react";

interface AuthFormCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/**
 * Shared card wrapper used by all auth pages (Sign In, Sign Up, Forgot Password).
 */
export const AuthFormCard = ({ title, subtitle, children }: AuthFormCardProps) => {
  return (
    <div className="w-full max-w-[500px] flex flex-col gap-8 bg-white dark:bg-zinc-950 p-6 sm:p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
      {/* Card header */}
      <div className="flex flex-col gap-3 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-base sm:text-lg">
          {subtitle}
        </p>
      </div>

      {/* Form content */}
      <div className="w-full">{children}</div>
    </div>
  );
};
