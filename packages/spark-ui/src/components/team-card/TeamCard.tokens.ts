/**
 * TeamCard design tokens
 *
 * Centralises all magic numbers so tweaks live in one place.
 */

/** Background gradient — deep purple-to-blue sweep matching the team page art. */
export const TEAM_CARD_BG =
  "linear-gradient(180deg, #241631 0%, #211F35 25%, #54729F 50%, rgba(33, 31, 53, 0.96) 75%, rgba(36, 22, 49, 0.92) 100%)";

/** Google 4-colour gradient used for both the static ::before border and the ShineBorder sweep. */
export const TEAM_CARD_BORDER_GRADIENT =
  "linear-gradient(92.56deg, #4285F4 -7.33%, #34A853 33.65%, #F9AB00 72.08%, #EA4335 109.62%)";

/** Colour stops used individually for ShineBorder's radial sweep. */
export const TEAM_CARD_SHINE_COLORS = ["#4285F4", "#34A853", "#F9AB00", "#EA4335"] as const;

/** Drop-shadow applied to the card. */
export const TEAM_CARD_SHADOW = "0px 4px 4px 0px #00000040";

/** Border width (px). Must match the `--team-card-border-width` CSS variable. */
export const TEAM_CARD_BORDER_WIDTH = 4.5;

/** Card corner radius (px). */
export const TEAM_CARD_RADIUS = 28;

/** Animation duration for ShineBorder sweep (seconds). */
export const TEAM_CARD_SHINE_DURATION = 14;

/**
 * Animation duration for ShineBorder sweep while the card is hovered (seconds).
 * Set lower than TEAM_CARD_SHINE_DURATION for a fast, emphatic spin on hover.
 * 2  → fast and punchy ← default
 * 4  → moderate
 */
export const TEAM_CARD_SHINE_DURATION_HOVER = 3;

/** Maximum 3D tilt rotation capped at this value (degrees). */
export const TEAM_CARD_TILT_MAX = 6;

/** CSS perspective depth for the 3D tilt (px). */
export const TEAM_CARD_PERSPECTIVE = 1000;

/**
 * Extra top margin applied to the photo block (px).
 * Nudges the image, mascot, name and role downward together.
 * 0  → photo flush with card top padding
 * 8  → slight downward nudge ← default
 * 16 → more space above the photo
 */
export const TEAM_CARD_IMAGE_MARGIN_TOP = 16;

/**
 * Card bottom padding (px). Controls how far the social icons sit from the
 * bottom of the card — smaller = socials higher up.
 * 12 → tighter (socials closer to bottom edge) ← default
 * 20 → original pb-5
 * 8  → very tight
 */
export const TEAM_CARD_PADDING_BOTTOM = 30;

/**
 * Width of the member photo relative to the card's content box.
 * "100%" fills the full padded content area (matches the reference design).
 * Reduce (e.g. "80%") to add side breathing room around the photo.
 */
export const TEAM_CARD_IMAGE_WIDTH = "100%";

/**
 * Aspect ratio of the member photo (width ÷ height).
 * "5/6" fills roughly 60% of the card height — matches the reference design.
 * Common alternatives:
 *   "1/1"   → square
 *   "3/4"   → classic portrait (taller)
 *   "197/227" → original Figma photo crop
 */
export const TEAM_CARD_IMAGE_ASPECT = "5/6";

/**
 * Mascot image size in pixels (width AND height — it's always a square).
 *
 * This is the single value to change to make the mascot bigger or smaller:
 *   80  → small
 *   96  → medium (current)
 *   112 → large
 *   128 → extra large
 *
 * Tip: increase TEAM_CARD_MASCOT_OFFSET_Y by the same amount you grow this
 * so the mascot keeps the same overlap depth below the photo.
 */
export const TEAM_CARD_MASCOT_SIZE = 112;

/**
 * How far the mascot hangs below the bottom edge of the photo (px).
 * The name/role text section is automatically padded to clear this overhang.
 * 0  → flush with the photo bottom edge
 * 30 → overlaps 30 px below the photo ← default
 * 40 → overlaps 40 px below the photo
 */
export const TEAM_CARD_MASCOT_OFFSET_Y = 40;

/**
 * Maximum width of the card (responsive rem unit).
 * Figma source: 237 px ÷ 16 px/rem = 14.8rem.
 * The card fills its grid cell up to this cap, then stops growing.
 * Increase for a wider card, decrease for a narrower one.
 */
export const TEAM_CARD_MAX_WIDTH = "14.8rem";

/**
 * Minimum height of the card (responsive rem unit).
 * Figma source: 429 px ÷ 16 px/rem = 26.8rem.
 * Keeps all cards in a row the same height even when content differs.
 * Increase for a taller card, decrease for a shorter one.
 */
export const TEAM_CARD_MIN_HEIGHT = "26.8rem";
