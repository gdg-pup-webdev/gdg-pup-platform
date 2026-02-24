import { cva, type VariantProps } from "class-variance-authority";

// Dropdown Content (Menu container)
export const dropdownContentVariants = cva(
  "dropdown-content absolute z-50 overflow-hidden rounded-sm",
  {
    variants: {
      variant: {
        default: "dropdown-bg",
        minimal: "bg-[#1E1E1E]",
      },
      size: {
        sm: "min-w-[10rem]",
        md: "min-w-[12rem]",
        lg: "min-w-[16rem]",
        full: "w-full",
      },
      position: {
        "bottom-start": "left-0 mt-2",
        "bottom-end": "right-0 mt-2",
        "top-start": "left-0 bottom-full mb-2",
        "top-end": "right-0 bottom-full mb-2",
      },
      animation: {
        true: "animate-in fade-in slide-in-from-top-2 duration-200",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "bottom-start",
      animation: true,
    },
  }
);

// Dropdown Item
export const dropdownItemVariants = cva(
  "dropdown-item flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors",
  {
    variants: {
      variant: {
        default: "text-gray-300 hover:text-white",
        danger: "text-red-400 hover:text-red-300",
        success: "text-green-400 hover:text-green-300",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
    },
  }
);

// Dropdown Label
export const dropdownLabelVariants = cva(
  "dropdown-label px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "text-gray-400",
        muted: "text-gray-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Dropdown Separator
export const dropdownSeparatorVariants = cva(
  "dropdown-separator my-1 h-px bg-gray-700",
  {
    variants: {
      variant: {
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type DropdownContentVariants = VariantProps<typeof dropdownContentVariants>;
export type DropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
export type DropdownLabelVariants = VariantProps<typeof dropdownLabelVariants>;
