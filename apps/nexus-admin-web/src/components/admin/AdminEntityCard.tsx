"use client";

import React, { useMemo, useState } from "react";
import { Edit2, Eye, Image as ImageIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CardShell } from "@/components/ui/CardShell";
import { CardActionMenu, CardActionMenuItem } from "@/components/admin/CardActionMenu";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export interface AdminEntityCardMetaItem {
  key?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

interface AdminEntityCardActions {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void | Promise<void>;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  confirmDelete?: boolean;
  deleteDialogTitle?: string;
  deleteDialogDescription?: React.ReactNode;
  deleteConfirmLabel?: string;
  isDeleting?: boolean;
  extraItems?: CardActionMenuItem[];
}

interface AdminEntityCardProps {
  title: string;
  description?: React.ReactNode;
  mediaImageUrl?: string | null;
  mediaAlt?: string;
  mediaFallback?: React.ReactNode;
  mediaLabel?: React.ReactNode;
  mediaStatus?: React.ReactNode;
  topMetaLeft?: React.ReactNode;
  topMetaRight?: React.ReactNode;
  metaItems?: AdminEntityCardMetaItem[];
  tags?: React.ReactNode;
  footer?: React.ReactNode;
  actions?: AdminEntityCardActions;
  onClick?: () => void;
  className?: string;
  mediaClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
}

export function AdminEntityCard({
  title,
  description,
  mediaImageUrl,
  mediaAlt,
  mediaFallback,
  mediaLabel,
  mediaStatus,
  topMetaLeft,
  topMetaRight,
  metaItems,
  tags,
  footer,
  actions,
  onClick,
  className,
  mediaClassName,
  contentClassName,
  titleClassName,
}: AdminEntityCardProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeletingInternal, setIsDeletingInternal] = useState(false);

  const shouldConfirmDelete = actions?.confirmDelete ?? true;
  const isDeleting = Boolean(actions?.isDeleting || isDeletingInternal);
  const openCard = onClick ?? actions?.onView;

  const runDelete = async () => {
    if (!actions?.onDelete) return;

    try {
      setIsDeletingInternal(true);
      await actions.onDelete();
      setIsDeleteConfirmOpen(false);
    } finally {
      setIsDeletingInternal(false);
    }
  };

  const menuItems = useMemo<CardActionMenuItem[]>(() => {
    const items: CardActionMenuItem[] = [];

    if (actions?.onView) {
      items.push({
        key: "view",
        label: actions.viewLabel || "View Details",
        icon: Eye,
        onClick: actions.onView,
      });
    }

    if (actions?.onEdit) {
      items.push({
        key: "edit",
        label: actions.editLabel || "Edit",
        icon: Edit2,
        onClick: actions.onEdit,
      });
    }

    if (actions?.extraItems?.length) {
      items.push(...actions.extraItems);
    }

    if (actions?.onDelete) {
      items.push({
        key: "delete",
        label: actions.deleteLabel || "Delete",
        icon: Trash2,
        tone: "danger",
        dividerBefore: items.length > 0,
        onClick: () => {
          if (shouldConfirmDelete) {
            setIsDeleteConfirmOpen(true);
            return;
          }

          void runDelete();
        },
      });
    }

    return items;
  }, [actions, shouldConfirmDelete]);

  return (
    <>
      <CardShell
        interactive={Boolean(openCard)}
        onClick={openCard}
        accentBarClassName="bg-gradient-to-r from-teal-500 via-cyan-500 to-emerald-500"
        accentBarPosition="bottom"
        className={cn(
          "rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-xl",
          className,
        )}
      >
        <div
          className={cn(
            "relative h-40 w-full border-b border-gray-100 bg-linear-to-br from-teal-50 via-white to-cyan-50",
            mediaClassName,
          )}
        >
          <div className="absolute inset-0 overflow-hidden">
            {mediaImageUrl ? (
              <img
                src={mediaImageUrl}
                alt={mediaAlt || title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-teal-300">
                {mediaFallback || <ImageIcon size={52} />}
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/0 to-transparent" />
          </div>

          {(mediaLabel || mediaStatus) && (
            <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2">
              <div>{mediaLabel}</div>
              <div>{mediaStatus}</div>
            </div>
          )}

          {menuItems.length > 0 ? (
            <div className="absolute right-3 bottom-3 z-30" onClick={(event) => event.stopPropagation()}>
              <CardActionMenu
                items={menuItems}
                triggerClassName="bg-white/95 text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white hover:text-teal-600"
                panelClassName="w-44 rounded-lg border-gray-200"
              />
            </div>
          ) : null}
        </div>

        <div className={cn("flex flex-1 flex-col gap-3 p-5", contentClassName)}>
          {(topMetaLeft || topMetaRight) && (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">{topMetaLeft}</div>
              <div className="shrink-0">{topMetaRight}</div>
            </div>
          )}

          <div>
            <h3
              className={cn(
                "line-clamp-2 text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-teal-600",
                titleClassName,
              )}
            >
              {title}
            </h3>
            {description ? (
              <div className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-500">{description}</div>
            ) : null}
          </div>

          {metaItems?.length ? (
            <div className="space-y-2 border-t border-gray-100 pt-3">
              {metaItems.map((item, index) => (
                <div
                  key={item.key || `${title}-meta-${index}`}
                  className={cn("flex items-center gap-2 text-xs text-gray-500", item.className)}
                >
                  {item.icon ? <span className="shrink-0 text-teal-500">{item.icon}</span> : null}
                  <span className="min-w-0 truncate">{item.content}</span>
                </div>
              ))}
            </div>
          ) : null}

          {tags ? <div className="flex flex-wrap gap-1.5">{tags}</div> : null}

          {footer ? <div className="mt-auto border-t border-gray-100 pt-3">{footer}</div> : null}
        </div>
      </CardShell>

      {actions?.onDelete && shouldConfirmDelete ? (
        <ConfirmDialog
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            if (!isDeleting) {
              setIsDeleteConfirmOpen(false);
            }
          }}
          onConfirm={() => {
            void runDelete();
          }}
          isConfirming={isDeleting}
          title={actions.deleteDialogTitle || "Delete item"}
          description={
            actions.deleteDialogDescription || (
              <>
                You are about to permanently delete <strong>{title}</strong>. This action cannot be undone.
              </>
            )
          }
          confirmLabel={actions.deleteConfirmLabel || actions.deleteLabel || "Delete"}
          cancelLabel="Cancel"
        />
      ) : null}
    </>
  );
}