import { Skeleton } from "@packages/spark-ui";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BrandedSkeletonVariant = "block" | "text" | "chip" | "button";

interface BrandedSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BrandedSkeletonVariant;
  withGradientRing?: boolean;
}

const variantClassMap: Record<BrandedSkeletonVariant, string> = {
  block: "rounded-xl",
  text: "h-4 rounded-md",
  chip: "h-6 rounded-full",
  button: "h-10 rounded-md",
};

/**
 * Nexus branded skeleton placeholder.
 * Uses glassy dark surfaces and optional 4-color GDG ring accents.
 */
export function BrandedSkeleton({
  className,
  variant = "block",
  withGradientRing = false,
  ...props
}: BrandedSkeletonProps) {
  if (!withGradientRing) {
    return (
      <Skeleton
        className={cn(
          "border border-white/10 bg-white/10",
          variantClassMap[variant],
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl p-px",
        variant === "chip" && "rounded-full",
        className,
      )}
      style={{
        background:
          "linear-gradient(90deg, rgba(234,67,53,0.85) 0%, rgba(249,171,0,0.85) 33%, rgba(52,168,83,0.85) 66%, rgba(66,133,244,0.85) 100%)",
      }}
      {...props}
    >
      <Skeleton
        className={cn(
          "h-full w-full border border-white/5 bg-[#0F0E0E]/80",
          variantClassMap[variant],
        )}
      />
    </div>
  );
}