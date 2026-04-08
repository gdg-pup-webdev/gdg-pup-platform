import type { ReactNode } from "react";
import Image from "next/image";
import {
  normalizeEventDescription,
  splitBoldSegments,
} from "@/features/events/utils/description";

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

function renderDescriptionContent(description: ReactNode) {
  if (typeof description !== "string" && typeof description !== "number") {
    return description;
  }

  const normalizedDescription = normalizeEventDescription(String(description));

  return splitBoldSegments(normalizedDescription).map((segment, index) =>
    segment.bold ? (
      <strong
        key={`${segment.text}-${index}`}
        className="font-semibold text-white/90"
      >
        {segment.text}
      </strong>
    ) : (
      <span key={`${segment.text}-${index}`}>{segment.text}</span>
    ),
  );
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
    <div
      className={`relative h-full w-full max-w-[340px] md:min-w-[340px] ${className}`}
    >
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
        className={`relative h-full rounded-2xl p-4 flex flex-col items-center gap-3.25 ${contentClassName}`}
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
          <div className="min-h-[3.5rem] text-white text-2xl leading-tight font-bold text-center line-clamp-2">
            {title ?? (
              <div className="h-8 w-2/3 rounded-md border border-dashed border-white/40 bg-white/5" />
            )}
          </div>
          <div className="min-h-[1rem] text-xs italic text-white/90 text-center line-clamp-1">
            {subtitle ?? (
              <div className="h-5 w-1/2 rounded-md border border-dashed border-white/30 bg-white/5" />
            )}
          </div>
        </div>

        {/* Description, category, and date container */}
        <div className="flex w-full flex-1 flex-col items-center gap-3.25 text-center">
          <div className="min-h-[3.75rem] max-w-[95%] text-xs font-normal leading-relaxed text-white/80 text-center whitespace-pre-line line-clamp-4">
            {description ? (
              renderDescriptionContent(description)
            ) : (
              <div className="h-5 w-full rounded-md border border-dashed border-white/30 bg-white/5" />
            )}
          </div>
          <div className="mt-auto flex flex-col items-center gap-3.25">
            <div className="flex min-h-6 w-full flex-wrap items-center justify-center gap-2">
              {typeof category === "string" || typeof category === "number" ? (
                <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium leading-none text-white">
                  {category}
                </span>
              ) : (
                (category ?? (
                  <div className="h-6 w-28 rounded-full border border-dashed border-white/30 bg-white/5" />
                ))
              )}
            </div>
            <div className="text-xs text-white/80">
              {date ?? (
                <div className="h-4 w-20 rounded-md border border-dashed border-white/30 bg-white/5" />
              )}
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
