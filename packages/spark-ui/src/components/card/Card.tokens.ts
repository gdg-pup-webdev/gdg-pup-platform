/**
 * Card Design Tokens
 *
 * Centralized design constants for the Card component
 */

/**
 * Card spacing and layout constants
 */
export const CARD_TOKENS = {
  borderRadius: "28px",
  borderWidth: "1px",
  padding: "20px",
  gap: "10px",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  borderColor: "#FFFFFF",
} as const;

/**
 * Sub-component token overrides
 */
export const CARD_SUBCOMPONENT_TOKENS = {
  header: {
    gap: "12px",
    padding: "0", // Headers inherit card padding
  },

  content: {
    gap: "16px",
    padding: "0", // Content inherits card padding
  },

  footer: {
    gap: "12px",
    padding: "0", // Footers inherit card padding
  },
} as const;
