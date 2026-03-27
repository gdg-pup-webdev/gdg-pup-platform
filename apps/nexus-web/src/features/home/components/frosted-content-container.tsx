import type { ReactNode } from "react";

interface FrostedContentContainerProps {
  children: ReactNode;
  className?: string;
  ringClassName?: string;
  contentClassName?: string;
  ringGradient?: string;
  contentBackgroundColor?: string;
  contentBackdropFilter?: string;
}

export function FrostedContentContainer({
  children,
  className = "",
  ringClassName = "",
  contentClassName = "",
  ringGradient = "linear-gradient(90deg, #EA4335, #F9AB00, #34A853, #4285F4)",
  contentBackgroundColor = "rgba(255, 255, 255, 0.08)",
  contentBackdropFilter = "blur(70px) saturate(180%)",
}: FrostedContentContainerProps) {
  return (
    <div className={`relative w-full ${className}`}>
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
        className={`relative rounded-2xl p-8 ${contentClassName}`}
        style={{
          backgroundColor: contentBackgroundColor,
          backdropFilter: contentBackdropFilter,
          WebkitBackdropFilter: contentBackdropFilter,
        }}
      >
        {children}
      </div>
    </div>
  );
}