/**
 * GdgIdCard design tokens
 *
 * All magic numbers in one place — matches the Figma spec.
 */

/** Card body gradient (top white section uses #f8f9fa; bottom dark section uses this). */
export const GDG_ID_CARD_TOP_BG = "#1E2939";
export const GDG_ID_CARD_BOTTOM_BG = "#1E2939";

/** Full card outer gradient border — matches Figma border-image-source. */
export const GDG_ID_CARD_BORDER_GRADIENT =
  "linear-gradient(92.56deg, #4285F4 -7.33%, #34A853 33.65%, #F9AB00 72.08%, #EA4335 109.62%)";

/** Border width from Figma: 4.38px solid. */
export const GDG_ID_CARD_BORDER_WIDTH = 4.38;

/** Corner radius from Figma: 19.12px (clamped for responsiveness). */
export const GDG_ID_CARD_RADIUS = "clamp(12px, 2.5vw, 19.12px)";

/** ShineBorder animated ring — Google 4-colour stops. */
export const GDG_ID_CARD_SHINE_COLORS = [
  "#4285F4",
  "#34A853",
  "#F9AB00",
  "#EA4335",
] as const;

/** Idle shine sweep duration (seconds). */
export const GDG_ID_CARD_SHINE_DURATION = 14;

/** Hover shine sweep duration (seconds) — faster for emphasis. */
export const GDG_ID_CARD_SHINE_DURATION_HOVER = 3;

/** Maximum tilt angle (degrees). */
export const GDG_ID_CARD_TILT_MAX = 8;

/** Horizontal padding for the Background grid graphic (px or string). */
export const GDG_ID_CARD_BG_PADDING_X = "4px";

/** Vertical padding for the Background grid graphic (px or string). */
export const GDG_ID_CARD_BG_PADDING_Y = "1px";

/** Vertical offset to push the Background grid graphic down (px or string). */
export const GDG_ID_CARD_BG_OFFSET_Y = "12px";

/** Height of the upper grid graphic section as a percentage (1-100). */
export const GDG_ID_CARD_UPPER_FLEX = 82;

/** Vertical offset to move the Sparky mascot up or down (px or rem, negative = up). */
export const GDG_ID_CARD_SPARKY_OFFSET_Y = "-50px";

/** Vertical offset to move the Name frame up or down (px or rem, negative = up). */
export const GDG_ID_CARD_NAME_OFFSET_Y = "-36px";

/** Vertical offset to move the lower info block up or down (px or rem, negative = up). */
export const GDG_ID_CARD_INFO_OFFSET_Y = "-16px";

/** Width of the name frame relative to the card (percentage or pixels). */
export const GDG_ID_CARD_NAME_FRAME_WIDTH = "55%";

/** Scale factor for the bottom info text (Name, Email, Course). */
export const GDG_ID_CARD_INFO_SCALE = 1.15;

/** CSS perspective depth (px). */
export const GDG_ID_CARD_PERSPECTIVE = 1000;

/** Card drop-shadow. */
export const GDG_ID_CARD_SHADOW =
  "0px 8px 40px 0px rgba(66, 133, 244, 0.35), 0px 4px 4px 0px #00000040";

/** Bottom section "GetId" variant border — top+sides only (bottom is open). */
export const GDG_GET_ID_CARD_BORDER_GRADIENT =
  "linear-gradient(90deg, #EA4335 0%, #F9AB00 33%, #34A853 66%, #4285F4 100%)";
