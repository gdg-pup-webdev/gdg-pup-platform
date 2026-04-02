"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { modalPanelVariants, modalOverlayVariants } from "./Modal.styles";
import type { ModalProps } from "./Modal.types";
import { cn } from "#utils/cn.js";

const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const Modal = React.forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      // Core
      open: openProp,
      onOpenChange,
      onClose,
      children,
      // Close behavior
      onBeforeClose,
      closeOnOverlayClick = true,
      closeOnEsc = true,
      // Overlay
      withOverlay = true,
      overlayOpacity,
      overlayBlur,
      overlayClassName,
      overlayProps,
      // Scrolling
      lockScroll = true,
      scrollBehavior = "inside",
      preserveScrollBarGap = false,
      // A11y
      role = "dialog",
      trapFocus = true,
      initialFocusRef,
      finalFocusRef,
      // Variants
      size,
      placement,
      // HTML dialog props
      className,
      ...rest
    },
    ref
  ) => {
    const isControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = isControlled ? openProp : internalOpen;

    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const lastFocusedRef = useRef<HTMLElement | null>(null);

    // Merge the forwarded ref with our internal one
    const setRef = useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    // Central close handler — runs onBeforeClose interception first
    const triggerClose = useCallback(async () => {
      if (onBeforeClose) {
        const allowed = await Promise.resolve(onBeforeClose());
        if (!allowed) return;
      }
      if (!isControlled) setInternalOpen(false);
      onOpenChange?.(false);
      onClose?.();
    }, [onBeforeClose, isControlled, onOpenChange, onClose]);

    // Capture focused element before modal opens so we can restore it on close
    useEffect(() => {
      if (isOpen) {
        lastFocusedRef.current = document.activeElement as HTMLElement;
      }
    }, [isOpen]);

    // Initial and final focus management
    useEffect(() => {
      if (!isOpen) {
        const target = finalFocusRef?.current ?? lastFocusedRef.current;
        target?.focus();
        return;
      }
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        dialogRef.current?.focus();
      }
    }, [isOpen, initialFocusRef, finalFocusRef]);

    // Escape key
    useEffect(() => {
      if (!isOpen || !closeOnEsc) return;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          triggerClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, closeOnEsc, triggerClose]);

    // Scroll lock
    useEffect(() => {
      if (!isOpen || !lockScroll) return;
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (preserveScrollBarGap && scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        if (preserveScrollBarGap) document.body.style.paddingRight = "";
      };
    }, [isOpen, lockScroll, preserveScrollBarGap]);

    // Focus trap
    useEffect(() => {
      if (!isOpen || !trapFocus) return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== "Tab") return;
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
        ).filter((el) => !el.closest("[inert]"));
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (e.shiftKey) {
          if (active === first || active === dialog) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      };

      dialog.addEventListener("keydown", handleKeyDown);
      return () => dialog.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, trapFocus]);

    if (!isOpen) return null;

    const overlayStyle: React.CSSProperties = {
      backgroundColor: withOverlay
        ? `rgba(0, 0, 0, ${overlayOpacity ?? 0.63})`
        : "transparent",
      ...(overlayBlur ? { backdropFilter: `blur(${overlayBlur})` } : {}),
    };

    return createPortal(
      <dialog
        ref={setRef}
        open
        role={role}
        aria-modal
        tabIndex={-1}
        className="fixed inset-0 z-50 m-0 h-full w-full border-none bg-transparent p-0 [max-height:none] [max-width:none]"
        {...rest}
      >
        {/* Overlay */}
        <div
          {...overlayProps}
          style={overlayStyle}
          className={cn(
            modalOverlayVariants({ placement }),
            scrollBehavior === "outside" && "overflow-y-auto",
            overlayClassName
          )}
          onClick={closeOnOverlayClick ? () => triggerClose() : undefined}
        >
          {/* Panel */}
          <div
            className={cn(
              modalPanelVariants({ size, placement }),
              scrollBehavior === "inside" && "max-h-[80vh] overflow-y-auto",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </dialog>,
      document.body
    );
  }
);

Modal.displayName = "Modal";