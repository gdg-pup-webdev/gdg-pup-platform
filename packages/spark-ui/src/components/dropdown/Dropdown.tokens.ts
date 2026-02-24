export const DROPDOWN_TOKENS = {
  // Container
  content: {
    background: "#1E1E1E",
    borderRadius: "3px",
    padding: "10px",
    border: "1px solid #374151",
    minWidth: "12rem",
    maxWidth: "20rem",
    maxHeight: "24rem",
  },
  
  // Spacing
  gap: {
    items: "2px",
    sections: "8px",
  },
  
  // Item
  item: {
    padding: "8px 12px",
    borderRadius: "2px",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  
  // Colors
  colors: {
    text: {
      default: "#D1D5DB", // gray-300
      hover: "#FFFFFF",
      muted: "#9CA3AF", // gray-400
    },
    background: {
      hover: "#374151", // gray-700
      active: "#4B5563", // gray-600
    },
  },
  
  // Shadows
  shadows: {
    dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  
  // Animation
  animation: {
    duration: "200ms",
    easing: "ease-out",
  },
  
  // Z-Index
  zIndex: {
    content: 50,
  },
} as const;
