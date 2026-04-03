import { cva, type VariantProps } from "class-variance-authority";

export const modalPanelVariants = cva(
  [
    "relative",
    "bg-black/60",
    "w-full",
    "box-border",
    "rounded-t-2xl",
    "md:rounded-2xl",
    "overflow-hidden",
    "p-4 md:p-6"
  ],
  {
    variants: {
      size: {
        sm:   "w-full md:max-w-(--container-sm)",
        md:   "w-full md:max-w-(--container-md)",
        lg:   "w-full md:max-w-(--container-lg)",
        xl:   "w-full md:max-w-(--container-xl)",
        full: "w-full",
      },
      placement: {
        adaptive: "mt-auto lg:mb-auto",
        bottom: "mt-auto",
        center: ""
      },
    },
    defaultVariants: {
      size: "md",
      placement: "adaptive",
    },
  }
);

export const modalOverlayVariants = cva(
  [
    "fixed",
    "inset-0",
    "z-50",
    "flex",
    "p-8",
    "items-center",
    "justify-center",
    "max-h-screen"
  ],
  {
    variants: {
      placement: {
        adaptive: "items-end md:items-center",
        bottom: "items-end",
        center: "items-center"
      },
    },
    defaultVariants: {
      placement: "center",
    },
  }
);

export type ModalPanelVariants = VariantProps<typeof modalPanelVariants>;
export type ModalOverlayVariants = VariantProps<typeof modalOverlayVariants>;