export const SECTION_VIEWPORT = { once: true, amount: 0.2 } as const;

export const SECTION_DELAYS = {
  hero: 0,
  spotlight: 0.06,
  achievements: 0.1,
  submitStory: 0.14,
} as const;

export const ITEM_EASING = [0.22, 1, 0.36, 1] as const;

export function createSectionVariants(delay = 0) {
  return {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" as const },
    },
  };
}

export function createContainerVariants(delayChildren = 0.2, staggerChildren = 0.18) {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}

export const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: ITEM_EASING },
  },
} as const;
