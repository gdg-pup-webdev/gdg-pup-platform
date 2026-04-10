"use client";

import Link from "next/link";
import { Loader2, CircleCheckBig, TriangleAlert } from "lucide-react";

type AuthTransitionStatus = "loading" | "success" | "error";

type AuthTransitionAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

interface AuthTransitionCardProps {
  status: AuthTransitionStatus;
  title: string;
  description: string;
  detail?: string;
  countdownSeconds?: number;
  primaryAction?: AuthTransitionAction;
  secondaryAction?: AuthTransitionAction;
}

function ActionButton({ action, primary = true }: { action: AuthTransitionAction; primary?: boolean }) {
  const className = primary
    ? "w-full rounded-lg border border-black bg-gradient-to-t from-[#2b7fff] to-[#162456] px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0px_4px_18px_0px_rgba(0,0,0,0.2)] transition hover:brightness-110"
    : "w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-white/20";

  if (action.href) {
    return (
      <Link href={action.href} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={action.onClick} className={className}>
      {action.label}
    </button>
  );
}

export function AuthTransitionCard({
  status,
  title,
  description,
  detail,
  countdownSeconds,
  primaryAction,
  secondaryAction,
}: AuthTransitionCardProps) {
  return (
    <div className="bg-[rgba(255,255,255,0.08)] backdrop-blur-[64px] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-full max-w-[500px] rounded-[16px] border border-white/20 px-5 py-7 sm:p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div aria-hidden="true" className="mt-1">
          {status === "loading" && (
            <Loader2 className="h-10 w-10 animate-spin text-[#9ec5ff]" />
          )}
          {status === "success" && (
            <CircleCheckBig className="h-10 w-10 text-emerald-400" />
          )}
          {status === "error" && (
            <TriangleAlert className="h-10 w-10 text-amber-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl">{title}</h1>

        <p className="max-w-[42ch] text-sm leading-relaxed text-white/80 sm:text-base">{description}</p>

        {detail && (
          <p className="max-w-[42ch] rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70" aria-live="polite">
            {detail}
          </p>
        )}

        {typeof countdownSeconds === "number" && countdownSeconds > 0 && (
          <p className="text-xs text-white/60" aria-live="polite">
            Redirecting in {countdownSeconds}s
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="mt-2 flex w-full flex-col gap-2">
            {primaryAction && <ActionButton action={primaryAction} primary />}
            {secondaryAction && <ActionButton action={secondaryAction} primary={false} />}
          </div>
        )}
      </div>
    </div>
  );
}
