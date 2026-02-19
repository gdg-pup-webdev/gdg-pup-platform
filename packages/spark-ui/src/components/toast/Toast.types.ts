import type { VariantProps } from "class-variance-authority";
import type { toastStyles } from "./Toast.styles";

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastStyles> {
  /**
   * Unique identifier for the toast
   */
  id?: string;
  /**
   * Title of the toast
   */
  title?: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * Action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Duration in milliseconds before auto-dismiss (0 = no auto-dismiss)
   */
  duration?: number;
  /**
   * Callback when toast is dismissed
   */
  onDismiss?: () => void;
}

export interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "destructive";
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}
