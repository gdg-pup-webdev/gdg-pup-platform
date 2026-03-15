import type React from "react";
import type { ModalPanelVariants, ModalOverlayVariants } from "./Modal.styles";

export type { ModalPanelVariants, ModalOverlayVariants };

export interface ModalProps
  extends Omit<React.ComponentPropsWithRef<"dialog">, "open">,
    ModalPanelVariants {
  /** Controls visibility in controlled mode. Omit to use uncontrolled mode. */
  open?: boolean;

  /** Fires whenever the open state changes, in both controlled and uncontrolled mode. */
  onOpenChange?: (open: boolean) => void;

  /** Direct close handler. Called after `onBeforeClose` resolves to `true`. */
  onClose?: () => void;

  children?: React.ReactNode;

  /**
   * Intercepts any close attempt.
   * Return (or resolve) `false` to cancel closing, `true` to allow it.
   */
  onBeforeClose?: () => boolean | Promise<boolean>;

  /** Close when the overlay is clicked. @default true */
  closeOnOverlayClick?: boolean;

  /** Close when Escape is pressed. @default true */
  closeOnEsc?: boolean;

  /** Show the overlay backdrop. @default true */
  withOverlay?: boolean;

  /** Opacity of the overlay backdrop (0–1). */
  overlayOpacity?: number;

  /** CSS blur amount applied to the overlay backdrop e.g. `"4px"`. */
  overlayBlur?: string;

  /** Extra class names forwarded to the overlay element. */
  overlayClassName?: string;

  /** Arbitrary props forwarded to the overlay `<div>`. */
  overlayProps?: Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "onClick">;

  /** Prevent body scroll while the modal is open. @default true */
  lockScroll?: boolean;

  /**
   * Where scrolling occurs when content overflows.
   * - `inside`  — the modal panel scrolls, body stays fixed.
   * - `outside` — the body scrolls, the panel grows to fit content.
   * @default "inside"
   */
  scrollBehavior?: "inside" | "outside";

  /**
   * Add padding equal to the scrollbar width to prevent layout shift
   * when the scroll lock removes the scrollbar.
   * @default false
   */
  preserveScrollBarGap?: boolean;

  /**
   * ARIA role for the dialog.
   * Use `"alertdialog"` for critical, blocking messages.
   * @default "dialog"
   */
  role?: "dialog" | "alertdialog";

  /** Trap focus within the modal while it is open. @default true */
  trapFocus?: boolean;

  /** Ref to the element that should receive focus when the modal opens. */
  initialFocusRef?: React.RefObject<HTMLElement | null>;

  /** Ref to the element that should regain focus when the modal closes. */
  finalFocusRef?: React.RefObject<HTMLElement | null>;
}