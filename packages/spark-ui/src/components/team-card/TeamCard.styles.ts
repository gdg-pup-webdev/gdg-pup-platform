import { cva, type VariantProps } from "class-variance-authority";

/**
 * TeamCard CVA variants.
 *
 * Base visual treatment lives in `.team-card-base` (defined in styles.css);
 * Tailwind utilities here handle layout only so the compiled CSS stays atomic.
 */
export const teamCardVariants = cva([
  // Links to the .team-card-base CSS class in styles.css
  "team-card-base",
  // Layout
  "flex",
  "flex-col",
  "items-center",
  "text-center",
  // Spacing — pt-2 nudges the photo down from the top border so corners don't clip
  "gap-3",
  "px-4",
  "pt-2",
  // pb is set via TEAM_CARD_PADDING_BOTTOM inline style in TeamCard.tsx
  // Text
  "text-white",
  // Cursor feedback
  "cursor-default",
  // Select-none to avoid text highlighting during tilt drag
  "select-none",
]);

export type TeamCardVariants = VariantProps<typeof teamCardVariants>;

/**
 * Team member photo wrapper.
 * Full-width rectangular image with 16 px border-radius, no circular crop.
 */
export const teamCardImageVariants = cva([
  "relative",
  "overflow-visible", // allows mascot to hang below the image boundary
  "rounded-2xl", // 16px
  "shrink-0",
]);

/** Member name heading — blue accent matching the design reference. */
export const teamCardNameVariants = cva([
  "text-lg",
  "font-bold",
  "leading-snug",
  "text-[#4285F4]",
]);

/** Role / position subtitle. */
export const teamCardRoleVariants = cva([
  "text-sm",
  "font-medium",
  "text-white/70",
  "leading-snug",
]);

/** Social links row. */
export const teamCardSocialsVariants = cva([
  "flex",
  "items-center",
  "justify-center",
  "gap-4",
  "mt-auto",
  // pt removed — vertical position controlled by TEAM_CARD_PADDING_BOTTOM on the card
]);
