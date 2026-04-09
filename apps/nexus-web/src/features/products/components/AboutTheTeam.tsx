import type { ReactNode } from "react";

interface AboutTheTeamProps {
  description?: ReactNode;
  categories?: ReactNode;
}

export function AboutTheTeam({ description, categories }: AboutTheTeamProps) {
  return (
    <div className="relative w-full -mt-25 lg:mt-0">
      <div
        className="absolute inset-0 z-3 rounded-3xl pointer-events-none"
        style={{
          padding: "1px",
          background:
            "linear-gradient(90deg, #EA4335, #F9AB00, #34A853, #4285F4)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div
        className="relative flex w-full flex-col items-start justify-center gap-5 rounded-3xl p-6 md:p-10 outline outline-1 outline-black/20"
        style={{
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(163, 163, 163, 0.06))",
          backdropFilter: "blur(70px) saturate(120%)",
          WebkitBackdropFilter: "blur(70px) saturate(120%)",
          outlineOffset: "-1px",
        }}
      >
        <div className="w-full text-white">
          {description ?? (
            <div className="h-24 w-full rounded-md border border-dashed border-white/30 bg-white/5" />
          )}
        </div>

        <div className="flex w-full flex-wrap items-center justify-start gap-3 md:gap-5">
          {categories ?? (
            <div className="h-6 w-28 rounded-full border border-dashed border-white/30 bg-white/5" />
          )}
        </div>
      </div>
    </div>
  );
}
