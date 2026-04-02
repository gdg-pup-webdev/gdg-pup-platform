import type { ReactNode } from "react";
import Image from "next/image";

interface StudyJamContainerProps {
  children?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  category?: ReactNode;
  date?: ReactNode;
  className?: string;
  ringClassName?: string;
  contentClassName?: string;
  ringGradient?: string;
  contentBackgroundColor?: string;
  contentBackdropFilter?: string;
}

export function StudyJamContainer({
  children,
  imageSrc,
  imageAlt = "Study Jam image",
  title,
  subtitle,
  description,
  category,
  date,
  className = "",
  ringClassName = "",
  contentClassName = "",
  ringGradient = "linear-gradient(90deg, #EA4335, #F9AB00, #34A853, #4285F4)",
  contentBackgroundColor = "rgba(255, 255, 255, 0.08)",
  contentBackdropFilter = "blur(70px) saturate(180%)",
}: StudyJamContainerProps) {
  return (
    <div className={`relative w-full max-w-85 ${className}`}>
      <div
        className={`absolute inset-0 z-3 rounded-2xl pointer-events-none ${ringClassName}`}
        style={{
          padding: "2px",
          background: ringGradient,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div
        className={`relative rounded-2xl p-4 flex flex-col items-center gap-3.25 ${contentClassName}`}
        style={{
          backgroundColor: contentBackgroundColor,
          backdropFilter: contentBackdropFilter,
          WebkitBackdropFilter: contentBackdropFilter,
        }}
      >
        {/* Image placeholder container */}
        <div
          className="w-full rounded-xl p-px"
          style={{ background: "linear-gradient(90deg, #FEF2F2, #666666)" }}
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1200}
              height={1200}
              className="w-full aspect-square rounded-[11px] object-cover bg-white/5"
            />
          ) : (
            <div className="w-full aspect-square rounded-[11px] border border-dashed border-white/40 bg-white/5" />
          )}
        </div>

        {/* Title and subtitle container */}
        <div className="flex w-full flex-col items-center gap-3.25 text-center">
          <div className="text-white text-2xl font-bold text-center">
            {title ?? (
              <div className="h-8 w-2/3 rounded-md border border-dashed border-white/40 bg-white/5" />
            )}
          </div>
          <div className="text-xs italic text-white/90 text-center">
            {subtitle ?? (
              <div className="h-5 w-1/2 rounded-md border border-dashed border-white/30 bg-white/5" />
            )}
          </div>
        </div>

        {/* Description, category, and date container */}
        <div className="flex w-full flex-col items-center gap-3.25 text-center">
          <div className="max-w-[95%] text-xs font-normal leading-relaxed text-white/80 text-center">
            {description ?? (
              <div className="h-5 w-full rounded-md border border-dashed border-white/30 bg-white/5" />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {typeof category === "string" || typeof category === "number" ? (
              <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium leading-none text-white">
                {category}
              </span>
            ) : (
              category ?? (
                <div className="h-6 w-28 rounded-full border border-dashed border-white/30 bg-white/5" />
              )
            )}
          </div>
          <div className="text-xs text-white/80">
            {date ?? (
              <div className="h-4 w-20 rounded-md border border-dashed border-white/30 bg-white/5" />
            )}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}