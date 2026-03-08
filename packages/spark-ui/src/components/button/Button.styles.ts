import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "text-sm font-medium",
    "rounded-lg",
    "transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    "cursor-pointer",
    "text-white",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-[linear-gradient(180deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_100%)]", 
          "hover:bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_50%,rgba(0,0,0,0.8)_100%)]",
          "active:bg-[linear-gradient(180deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_100%)]",
          ],
        tag: [
          "bg-[linear-gradient(180deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_100%)]", 
          "active:bg-[linear-gradient(180deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_100%)]",
          "button-gradient-border"
        ], 
        colored: [
          "active:shadow-[0px_1px_0px_0px_#FFFFFF66_inset,0px_4px_4px_0px_#00000040_inset,0px_-4px_4px_0px_#0000004D_inset,0px_-1px_4px_0px_#FFFFFF66_inset]",
          "shadow-[0px_6px_4px_0px_#00000040,0px_4px_46.1px_0px_#00000040,0px_4px_0px_0px_#FFFFFF4D_inset,0px_-4px_0px_0px_#0000004D_inset]",
        ],
        link: [
          "google-gradient-pseudo-background",
          "relative",
          "rounded-none",
          "before:h-px before:w-full",
          "before:content-['']",
          "before:absolute before:left-0 before:bottom-0",
          "not-active:hover:before:h-0.5 not-active:hover:before:bottom-[-1px]",
        ],
        "dashed-outline": "button-dashed-outline",
        "stroke-outline": "ring-1 hover:ring-2 active:ring-2 md:active:ring-1",
        ghost: "origin-center not-active:hover:transform-[scale(1.04)]",
        attribute: [
          "rounded-full",
          "ring",
          "not-active:hover:ring-2",
          "active:bg-[linear-gradient(180deg,#0F2449_0%,#2A4F91_100%)]",
          "active:ring-none",
          "active:shadow-[0px_1px_0px_#FFFFFF66_inset,0px_4px_4px_0px_#0000004D_inset,0px_-4px_4px_0px_#0000004D_inset,0px_-1px_4px_0px_#FFFFFF66_inset]"
        ],
        disabled: "bg-[#0A162A]",
      },
      subVariant: {
        // default sub-variants
        plain: "",
        colored: "",
        // colored sub-variants
        blue: "",
        yellow: "",
        green: "",
        red: "",
        "dark-blue": "",
      },
      size: {
        sm: "text-sm gap-2 px-3 py-1",
        md: "text-md gap-4 px-4 py-2",
        lg: "text-lg gap-4 px-4 py-3",
      }
    },
    compoundVariants: [
      // --- Semi-filled sub-variants ---
      {
        variant: "default",
        subVariant: "plain",
        class: [
          "ring",
          "hover:ring-2"
        ],
      },
      {
        variant: "default",
        subVariant: "colored",
        class: [
          "button-gradient-border", 
          "hover:before:p-0.5"
        ],
      },

      // --- Colored size variants ---
      {
        variant: "colored",
        size: "lg",
        class: [
          "shadow-[0px_4px_4px_0px_#000000,0px_4px_46.1px_0px_#00000040,0px_2px_0px_0px_#FFFFFF66_inset]",
        ]
      },

      // --- Colored sub-variants ---
      {
        variant: "colored",
        subVariant: "blue",
        class: [
          "bg-[linear-gradient(90deg,#162456_0%,#2B7FFF_50%,#162456_100%)]",
          "active:bg-[linear-gradient(0deg,#2B7FFF_0%,#162456_100%)]",
        ],
      },
      {
        variant: "colored",
        subVariant: "blue",
        size: "lg",
        class: [
          "bg-[linear-gradient(0deg,#2B7FFF_0%,#162456_100%)]",
          "hover:bg-[linear-gradient(90deg,#162456_0%,#2B7FFF_50%,#162456_100%)]",
          "not-active:hover:shadow-[0px_6px_4px_0px_#00000040,0px_4px_0px_0px_#FFFFFF4D_inset,0px_-4px_0px_0px_#0000004D_inset,0px_0px_8px_0px_#155DFC]"
        ]
      },
      {
        variant: "colored",
        subVariant: "yellow",
        class: [
          "bg-[linear-gradient(90deg,#8E7200_0%,#F0B100_50%,#8E7200_100%)]",
          "active:bg-[linear-gradient(360deg,#F0B100_0%,#8E7200_100%)]"
        ],
      },
      {
        variant: "colored",
        subVariant: "yellow",
        size: "lg",
        class: [
          "bg-[linear-gradient(360deg,#F0B100_0%,#8E7200_100%)]",
          "hover:bg-[linear-gradient(90deg,#8E7200_0%,#F0B100_50%,#8E7200_100%)]",
          "not-active:hover:shadow-[0px_6px_4px_0px_#00000040,0px_4px_0px_0px_#FFFFFF4D_inset,0px_-4px_0px_0px_#0000004D_inset,0px_0px_8px_0px_#997F17]"
        ],
      },
      {
        variant: "colored",
        subVariant: "green",
        class: [
          "bg-[linear-gradient(90deg,#016630_0%,#00C950_50%,#016630_100%)]",
          "active:bg-[linear-gradient(360deg,#00C950_0%,#016630_100%)]"
        ],
      },
      {
        variant: "colored",
        subVariant: "green",
        size: "lg",
        class: [
          "bg-[linear-gradient(360deg,#00C950_0%,#016630_100%)]",
          "hover:bg-[linear-gradient(90deg,#016630_0%,#00C950_50%,#016630_100%)]",
          "not-active:hover:shadow-[0px_6px_4px_0px_#00000040,0px_4px_0px_0px_#FFFFFF4D_inset,0px_-4px_0px_0px_#0000004D_inset,0px_0px_8px_0px_#31753A]"
        ],
      },
      {
        variant: "colored",
        subVariant: "red",
        class: [
          "bg-[linear-gradient(90deg,#82181A_0%,#EA4335_50%,#82181A_100%)]",
          "active:bg-[linear-gradient(360deg,#EA4335_0%,#82181A_100%)]"
        ],
      },
      {
        variant: "colored",
        subVariant: "red",
        size: "lg",
        class: [
          "bg-[linear-gradient(360deg,#EA4335_0%,#82181A_100%)]",
          "hover:bg-[linear-gradient(90deg,#82181A_0%,#EA4335_50%,#82181A_100%)]",
          "not-active:hover:shadow-[0px_6px_4px_0px_#00000040,0px_4px_0px_0px_#FFFFFF4D_inset,0px_-4px_0px_0px_#0000004D_inset,0px_0px_8px_0px_#84261E]"
        ],
      },
      {
        variant: "colored",
        subVariant: "dark-blue",
        class: [
          "bg-[linear-gradient(90deg,#0F2449_0%,#2A4F91_50%,#0F2449_100%)]",
          "active:bg-[linear-gradient(#0F2449_0%,#2A4F91_100%)]"
        ],
      },
      {
        variant: "colored",
        subVariant: "dark-blue",
        size: "lg",
        class: [
          "bg-[linear-gradient(#0F2449_0%,#2A4F91_100%)]",
          "hover:bg-[linear-gradient(90deg,#0F2449_0%,#2A4F91_50%,#0F2449_100%)]",
        ],
      },
      // --- Tag sizes ---
      {
        variant: "tag",
        size: "sm",
        class: [
          "text-xs",
          "gap-2 px-3 py-0.5",
          "bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_50%,rgba(0,0,0,0.8)_100%)]"
        ]
      },
      {
        variant: "tag",
        size: "md",
        class: [
          "text-sm",
          "gap-2 px-3 py-1",
          "hover:bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_50%,rgba(0,0,0,0.8)_100%)]"
        ]
      },
      {
        variant: "tag",
        size: "lg",
        class: [
          "text-md",
          "gap-4 px-4 py-2",
          "hover:bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(65,65,65,0.8)_50%,rgba(0,0,0,0.8)_100%)]"
        ]
      },
    ],
    defaultVariants: {
      variant: "default",
      subVariant: "colored",
      size: "md",
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;