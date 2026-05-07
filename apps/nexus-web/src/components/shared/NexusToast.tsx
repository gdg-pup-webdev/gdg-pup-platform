"use client";

import { toast, type ToastOptions } from "react-toastify";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "warning" | "info";

interface NexusToastContentProps {
  message: string;
  type: ToastType;
  closeToast?: () => void;
}

// ── Config per type ───────────────────────────────────────────────────────────

const CONFIG: Record<
  ToastType,
  {
    icon: React.ReactNode;
    accent: string;      // left-border + glow colour (CSS colour)
    iconBg: string;      // icon pill background
    label: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={18} strokeWidth={2.2} />,
    accent: "#34a853",
    iconBg: "rgba(52, 168, 83, 0.15)",
    label: "Success",
  },
  error: {
    icon: <XCircle size={18} strokeWidth={2.2} />,
    accent: "#ea4335",
    iconBg: "rgba(234, 67, 53, 0.15)",
    label: "Error",
  },
  warning: {
    icon: <AlertTriangle size={18} strokeWidth={2.2} />,
    accent: "#f9ab00",
    iconBg: "rgba(249, 171, 0, 0.15)",
    label: "Warning",
  },
  info: {
    icon: <Info size={18} strokeWidth={2.2} />,
    accent: "#2b7fff",
    iconBg: "rgba(43, 127, 255, 0.15)",
    label: "Info",
  },
};

// ── Custom toast content ──────────────────────────────────────────────────────

function NexusToastContent({ message, type, closeToast }: NexusToastContentProps) {
  const { icon, accent, iconBg, label } = CONFIG[type];

  return (
    <div className="nexus-toast-inner" data-type={type} style={{ "--nexus-accent": accent } as React.CSSProperties}>
      {/* Left accent bar */}
      <span className="nexus-toast-accent-bar" />

      {/* Icon pill */}
      <span
        className="nexus-toast-icon"
        style={{ background: iconBg, color: accent }}
        aria-hidden
      >
        {icon}
      </span>

      {/* Text */}
      <div className="nexus-toast-text">
        <p className="nexus-toast-label">{label}</p>
        <p className="nexus-toast-message">{message}</p>
      </div>

      {/* Close button */}
      <button
        className="nexus-toast-close"
        onClick={closeToast}
        aria-label="Dismiss notification"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// ── Public API ────────────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: ToastOptions = {
  autoClose: 4000,
  hideProgressBar: false,
  closeButton: false,
  icon: false,
};

export const nexusToast = {
  success: (message: string, options?: ToastOptions) =>
    toast(
      ({ closeToast }) => (
        <NexusToastContent message={message} type="success" closeToast={closeToast} />
      ),
      { ...DEFAULT_OPTIONS, ...options }
    ),

  error: (message: string, options?: ToastOptions) =>
    toast(
      ({ closeToast }) => (
        <NexusToastContent message={message} type="error" closeToast={closeToast} />
      ),
      { ...DEFAULT_OPTIONS, ...options }
    ),

  warning: (message: string, options?: ToastOptions) =>
    toast(
      ({ closeToast }) => (
        <NexusToastContent message={message} type="warning" closeToast={closeToast} />
      ),
      { ...DEFAULT_OPTIONS, ...options }
    ),

  info: (message: string, options?: ToastOptions) =>
    toast(
      ({ closeToast }) => (
        <NexusToastContent message={message} type="info" closeToast={closeToast} />
      ),
      { ...DEFAULT_OPTIONS, ...options }
    ),
};
