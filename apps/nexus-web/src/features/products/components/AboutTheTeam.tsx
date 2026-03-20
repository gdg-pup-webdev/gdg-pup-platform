import type { ReactNode } from "react";

interface AboutTheTeamProps {
  description?: ReactNode;
  categories?: ReactNode;
}

export function AboutTheTeam({ description, categories }: AboutTheTeamProps) {
  return (
    <div className="relative w-full">
      <div
        className="absolute inset-0 z-3 rounded-2xl pointer-events-none"
        style={{
          padding: "2px",
          background: "linear-gradient(90deg, #EA4335, #F9AB00, #34A853, #4285F4)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div
        className="relative rounded-2xl p-8 flex flex-col items-start gap-5"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(70px) saturate(180%)",
          WebkitBackdropFilter: "blur(70px) saturate(180%)",
        }}
      >
        <div className="w-full text-left text-base font-normal leading-7 text-white/95">
          {description ?? (
            <div className="h-24 w-full rounded-md border border-dashed border-white/30 bg-white/5" />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-start gap-2">
          {categories ?? (
            <div className="h-6 w-28 rounded-full border border-dashed border-white/30 bg-white/5" />
          )}
        </div>
      </div>
    </div>
  );
}