"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LeaderboardScaledFrameProps {
  baseWidth: number;
  baseHeight: number;
  children: ReactNode;
  className?: string;
}

export function LeaderboardScaledFrame({
  baseWidth,
  baseHeight,
  children,
  className = "",
}: LeaderboardScaledFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = frameRef.current;

    if (!node) {
      return;
    }

    const updateScale = (width: number) => {
      setScale(Math.min(1, width / baseWidth));
    };

    updateScale(node.clientWidth);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (entry) {
        updateScale(entry.contentRect.width);
      }
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [baseWidth]);

  return (
    <div ref={frameRef} className={className}>
      <div
        className="relative w-full overflow-visible"
        style={{ height: `${baseHeight * scale}px` }}
      >
        <div
          className="absolute left-1/2 top-0 overflow-visible"
          style={{
            width: `${baseWidth}px`,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
