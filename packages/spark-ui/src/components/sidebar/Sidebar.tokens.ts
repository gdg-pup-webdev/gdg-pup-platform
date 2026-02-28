/**
 * Design tokens for the Sidebar component
 */

export const SIDEBAR_TOKENS = {
  border: {
    gradient: "linear-gradient(180deg, #F9AB00 0%, #EA4335 100%)",
    width: "1px",
  },
  background: {
    default: "linear-gradient(90deg, rgba(0, 0, 0, 0.45) 0%, rgba(65, 65, 65, 0.45) 100%)",
  },
  shadows: {
    outer: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    inner: "0px 4px 36px 0px rgba(255, 255, 255, 0.25) inset",
    glow: "0px 4px 46px 0px rgba(0, 0, 0, 0.25)",
  },
  padding: {
    top: "30px",
    right: "30px",
    bottom: "30px",
    left: "50px",
  },
  gap: "19px",
  colors: {
    itemDefault: "#FFFFFF",
    itemHover: "#FFFFFF",
    itemActive: "#F9AB00",
    nested: "#FFFFFF",
    nestedBorder: "#F9AB00",
  },
} as const;
