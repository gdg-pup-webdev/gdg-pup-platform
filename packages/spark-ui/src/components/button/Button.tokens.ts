/**
 * Design tokens for Button component
 * Centralized constants for gradient borders, shadows, and sizing
 */

// Reusable Google gradient border - used across ALL button variants
export const GOOGLE_GRADIENT_BORDER =
  "linear-gradient(90deg, #EA4335 0%, #F9AB00 50%, #97AA2A 75%, #4285F4 100%)";

// Shared shadow system (used in default variant)
export const DEFAULT_SHADOWS = {
  outer: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
  inner: "0px 4px 32px 0px rgba(255, 255, 255, 0.25) inset",
  glow: "0px 4px 46.1px 0px rgba(0, 0, 0, 0.25)",
};

// Combined shadow string for easy use
export const DEFAULT_BOX_SHADOW = [
  DEFAULT_SHADOWS.outer,
  DEFAULT_SHADOWS.inner,
  DEFAULT_SHADOWS.glow,
].join(", ");

// Size specifications for button dimensions
export const SIZE_TOKENS = {
  sm: {
    height: "32px",
    paddingX: "12px",
    fontSize: "12px",
    iconSize: "14px",
    gap: "6px",
  },
  md: {
    height: "40px",
    paddingX: "16px",
    fontSize: "14px",
    iconSize: "16px",
    gap: "8px",
  },
  lg: {
    height: "48px",
    paddingX: "20px",
    fontSize: "16px",
    iconSize: "20px",
    gap: "10px",
  },
} as const;

// Border radius specifications
export const BORDER_RADIUS = {
  default: "16px",
  outline: "8px",
  stroke: "8px",
  link: "0px",
} as const;

// Background colors
export const BACKGROUNDS = {
  defaultLight:
    "linear-gradient(90deg, rgba(0, 0, 0, 0.45) 0%, rgba(65, 65, 65, 0.45) 100%)",
  defaultDark: "#000000CC",
  transparent: "transparent",
} as const;

// Dashed border pattern for outline variant
export const DASHED_PATTERN = {
  dashLength: "4px",
  gapLength: "4px",
} as const;
