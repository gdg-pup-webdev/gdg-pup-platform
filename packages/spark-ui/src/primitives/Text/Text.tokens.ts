/**
 * Text Design Tokens
 * 
 * Centralized design constants for the Text primitive component.
 * Includes gradient definitions for decorative text effects.
 */

/**
 * Gradient definitions for text effects
 * Applied using background-clip: text for gradient text
 */
export const TEXT_GRADIENTS = {
  /**
   * White to Blue gradient (existing)
   * Used for hero headings and prominent titles
   */
  whiteBlue: {
    css: "linear-gradient(180deg, #FFFFFF 27.56%, #4285F4 100%)",
    tailwind: "bg-linear-to-b from-white from-[27.56%] to-[#4285F4] to-100%",
  },
  
  /**
   * Red gradient (Google Red themed)
   * Direction: 360deg (top to bottom)
   * Colors: #EA4335 → #84261E
   */
  red: {
    css: "linear-gradient(360deg, #EA4335 0%, #84261E 100%)",
    tailwind: "bg-linear-[360deg,#EA4335_0%,#84261E_100%]",
  },
  
  /**
   * Green gradient (Google Green themed)
   * Direction: 360deg (top to bottom)
   * Colors: #5CDB6D → #31753A
   */
  green: {
    css: "linear-gradient(360deg, #5CDB6D 0%, #31753A 100%)",
    tailwind: "bg-linear-[360deg,#5CDB6D_0%,#31753A_100%]",
  },
  
  /**
   * Yellow gradient (Google Yellow themed)
   * Direction: 360deg (top to bottom)
   * Colors: #FFD427 → #997F17
   */
  yellow: {
    css: "linear-gradient(360deg, #FFD427 0%, #997F17 100%)",
    tailwind: "bg-linear-[360deg,#FFD427_0%,#997F17_100%]",
  },
  
  /**
   * Blue gradient (Google Blue themed)
   * Direction: 0deg (bottom to top)
   * Colors: #57CAFF → #347999
   */
  blue: {
    css: "linear-gradient(0deg, #57CAFF 0%, #347999 100%)",
    tailwind: "bg-linear-[0deg,#57CAFF_0%,#347999_100%]",
  },

  /**
   * White to Yellow gradient
   * Direction: 189.74deg (~top to bottom)
   * Colors: #FFFFFF 28.59% → #F9AB00 99.17%
   */
  whiteYellow: {
    css: "linear-gradient(189.74deg, #FFFFFF 28.59%, #F9AB00 99.17%)",
    tailwind: "bg-linear-to-b from-white from-[28.59%] to-[#F9AB00] to-[99%]",
  },

  /**
   * White to Green gradient
   * Direction: 180deg (top to bottom)
   * Colors: #FFFFFF 1.41% → #34A853 100%
   */
  whiteGreen: {
    css: "linear-gradient(180deg, #FFFFFF 1.41%, #34A853 100%)",
    tailwind: "bg-linear-to-b from-white from-[1.41%] to-[#34A853] to-100%",
  },
} as const;

/**
 * Typography scale tokens
 * These map to the semantic variant sizes
 */
export const TEXT_SCALE = {
  display: {
    fontSize: "3rem", // 48px
    lineHeight: "1",
    fontWeight: "700",
  },
  h1: {
    fontSize: { base: "3.5rem", md: "4.5rem" }, // 56px/72px
    lineHeight: "1.2",
    fontWeight: "700",
  },
  h2: {
    fontSize: { base: "3rem", md: "3.75rem" }, // 48px/60px
    lineHeight: "1.2",
    fontWeight: "600",
  },
  h3: {
    fontSize: { base: "2.5rem", md: "3rem" }, // 40px/48px
    lineHeight: "1.2",
    fontWeight: "600",
  },
  h4: {
    fontSize: { base: "2rem", md: "2.5rem" }, // 32px/40px
    lineHeight: "1.3",
    fontWeight: "600",
  },
  h5: {
    fontSize: { base: "1.5rem", md: "2rem" }, // 24px/32px
    lineHeight: "1.4",
    fontWeight: "500",
  },
  h6: {
    fontSize: { base: "1.25rem", md: "1.5rem" }, // 20px/24px
    lineHeight: "1.4",
    fontWeight: "500",
  },
  bodyLg: {
    fontSize: { base: "1.25rem", md: "1.5rem" }, // 20px/24px
    lineHeight: "1.5",
    fontWeight: "400",
  },
  body: {
    fontSize: "1rem", // 16px
    lineHeight: "1.5",
    fontWeight: "400",
  },
  bodySm: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1.5",
    fontWeight: "400",
  },
  caption: {
    fontSize: "0.75rem", // 12px
    lineHeight: "1.5",
    fontWeight: "400",
  },
  label: {
    fontSize: "0.875rem", // 14px
    lineHeight: "1",
    fontWeight: "500",
  },
} as const;
