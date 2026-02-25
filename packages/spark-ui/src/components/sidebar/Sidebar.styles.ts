import { cva, type VariantProps } from "class-variance-authority";

// Sidebar Container
export const sidebarVariants = cva(
  "sidebar-base flex flex-col",
  {
    variants: {
      width: {
        sm: "w-48",
        md: "w-64",
        lg: "w-80",
      },
    },
    defaultVariants: {
      width: "md",
    },
  }
);

// Sidebar Item
export const sidebarItemVariants = cva(
  "sidebar-item text-left cursor-pointer transition-colors duration-200 text-white",
  {
    variants: {
      active: {
        true: "text-[#F9AB00] font-semibold",
        false: "text-white hover:text-white/80",
      },
      nested: {
        true: "text-base pl-6 border-l-2 border-[#F9AB00] ml-0",
        false: "text-base",
      },
    },
    defaultVariants: {
      active: false,
      nested: false,
    },
  }
);

// Sidebar Group (for collapsible sections)
export const sidebarGroupVariants = cva(
  "sidebar-group flex flex-col",
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

export type SidebarVariants = VariantProps<typeof sidebarVariants>;
export type SidebarItemVariants = VariantProps<typeof sidebarItemVariants>;
export type SidebarGroupVariants = VariantProps<typeof sidebarGroupVariants>;
