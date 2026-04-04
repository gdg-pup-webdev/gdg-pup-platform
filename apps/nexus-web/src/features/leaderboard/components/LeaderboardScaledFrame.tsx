"use client";

import type { ReactNode } from "react";

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
  void baseWidth;
  void baseHeight;
  void children;
  void className;

  return null;
}
