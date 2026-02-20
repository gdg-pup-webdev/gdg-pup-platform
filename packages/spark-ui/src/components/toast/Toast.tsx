import React, { createContext, useContext, useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import {
  toastStyles,
  toastTitleStyles,
  toastDescriptionStyles,
  toastActionStyles,
  toastCloseStyles,
  toastViewportStyles,
} from "./Toast.styles";
import type { ToastProps, ToastContextValue, ToastData } from "./Toast.types";

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to access toast functionality
 *
 * @example
 * ```tsx
 * const { addToast } = useToast();
 *
 * addToast({
 *   title: "Success",
 *   description: "Your changes have been saved",
 *   variant: "success",
 * });
 * ```
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Provider component for toast notifications
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = (toast: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastData = { id, duration: 5000, ...toast };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
};

/**
 * Container for displaying toasts
 */
const ToastViewport: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className={cn(toastViewportStyles({ position: "bottom-right" }))}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

/**
 * Individual toast notification component
 *
 * @example
 * ```tsx
 * <Toast
 *   title="Success"
 *   description="Your changes have been saved"
 *   variant="success"
 * />
 * ```
 */
export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      title,
      description,
      variant = "default",
      action,
      duration = 5000,
      onDismiss,
      className,
      ...props
    },
    ref
  ) => {
    const { removeToast } = useToast();
    const [isOpen, setIsOpen] = useState(true);

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration]);

    const handleDismiss = () => {
      setIsOpen(false);
      setTimeout(() => {
        if (id) removeToast(id);
        onDismiss?.();
      }, 200); // Wait for animation
    };

    return (
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        className={cn(toastStyles({ variant }), className)}
        {...props}
      >
        <div className="grid gap-1">
          {title && <div className={toastTitleStyles()}>{title}</div>}
          {description && (
            <div className={toastDescriptionStyles()}>{description}</div>
          )}
        </div>
        {action && (
          <button
            className={toastActionStyles()}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              handleDismiss();
            }}
          >
            {action.label}
          </button>
        )}
        <button
          className={toastCloseStyles()}
          onClick={handleDismiss}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    );
  }
);

Toast.displayName = "Toast";
