"use client";

import React, { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CardActionMenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  tone?: "default" | "danger";
  dividerBefore?: boolean;
  iconClassName?: string;
}

interface CardActionMenuProps {
  items: CardActionMenuItem[];
  align?: "left" | "right";
  triggerClassName?: string;
  panelClassName?: string;
  onOpenChange?: (open: boolean) => void;
}

export function CardActionMenu({
  items,
  align = "right",
  triggerClassName,
  panelClassName,
  onOpenChange,
}: CardActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className={cn(
          "rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600",
          triggerClassName,
        )}
        aria-label="Open card actions"
      >
        <MoreVertical size={20} />
      </button>

      {open ? (
        <div
          className={cn(
            "absolute z-20 mt-1 w-40 origin-top-right rounded border border-gray-100 bg-white py-1 shadow-xl animate-in fade-in slide-in-from-top-1",
            align === "right" ? "right-0" : "left-0",
            panelClassName,
          )}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.key}>
                {item.dividerBefore ? <div className="my-1 border-t border-gray-100" /> : null}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    item.onClick();
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                    item.tone === "danger"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <Icon
                    size={14}
                    className={cn(item.tone === "danger" ? "text-red-400" : "text-gray-400", item.iconClassName)}
                  />
                  {item.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
