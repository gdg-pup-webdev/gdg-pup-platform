"use client";

import React from "react";
import { 
  File as FileIcon, 
  Download, 
  ExternalLink,
  Folder as FolderIcon,
  Video as VideoIcon,
  FileText,
  Archive,
  Music,
  FileCode,
  FileJson,
  CalendarClock
} from "lucide-react";
import { FileRecord, Folder } from "../types";
import { AdminEntityCard } from "@/components/admin/AdminEntityCard";
import { CardActionMenuItem } from "@/components/admin/CardActionMenu";

interface FileCardProps {
  file: FileRecord | Folder;
  onEdit: (file: FileRecord | Folder) => void;
  onDelete: (file: FileRecord | Folder) => void | Promise<void>;
  onView: (file: FileRecord | Folder) => void;
  onOpen?: (file: FileRecord | Folder) => void;
  isFolder?: boolean;
}

export function FileCard({ file, onEdit, onDelete, onView, onOpen, isFolder }: FileCardProps) {
  const renderFileFallback = () => {
    if (isFolder) {
      return (
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 shadow-inner transition-transform duration-300 group-hover:scale-110">
          <FolderIcon size={48} fill="currentColor" fillOpacity={0.3} strokeWidth={1.5} />
        </div>
      );
    }
    
    const fileRecord = file as FileRecord;
    const type = fileRecord.fileType?.toLowerCase() || "";
    
    if (type.startsWith("image/")) {
      return <FileIcon size={42} strokeWidth={1.6} />;
    }

    let Icon = FileIcon;
    let bgColor = "bg-white";
    let iconColor = "text-teal-600";

    if (type.startsWith("video/")) {
      Icon = VideoIcon;
      bgColor = "bg-purple-50";
      iconColor = "text-purple-600";
    } else if (type === "application/pdf") {
      Icon = FileText;
      bgColor = "bg-red-50";
      iconColor = "text-red-600";
    } else if (type.startsWith("audio/")) {
      Icon = Music;
      bgColor = "bg-amber-50";
      iconColor = "text-amber-600";
    } else if (type.includes("zip") || type.includes("archive") || type.includes("tar") || type.includes("rar")) {
      Icon = Archive;
      bgColor = "bg-blue-50";
      iconColor = "text-blue-600";
    } else if (type.includes("json")) {
      Icon = FileJson;
      bgColor = "bg-yellow-50";
      iconColor = "text-yellow-600";
    } else if (type.includes("javascript") || type.includes("typescript") || type.includes("html") || type.includes("css") || type.includes("markdown")) {
      Icon = FileCode;
      bgColor = "bg-emerald-50";
      iconColor = "text-emerald-600";
    }

    return (
      <div className={`flex h-16 w-16 items-center justify-center rounded-xl ${bgColor} ${iconColor} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
    );
  };

  const name = isFolder ? (file as Folder).name : (file as FileRecord).fileName;

  const handleCardClick = () => {
    if (isFolder && onOpen) {
      onOpen(file);
    } else {
      onView(file);
    }
  };

  const extraItems: CardActionMenuItem[] = [];

  if (isFolder) {
    if (onOpen) {
      extraItems.push({
        key: "open-folder",
        label: "Open Folder",
        icon: FolderIcon,
        onClick: () => onOpen(file),
      });
    }
  } else {
    const fileRecord = file as FileRecord;

    if (fileRecord.previewUrl) {
      extraItems.push({
        key: "preview",
        label: "Preview",
        icon: ExternalLink,
        onClick: () => {
          window.open(fileRecord.previewUrl, "_blank", "noopener,noreferrer");
        },
      });
    }

    extraItems.push({
      key: "download",
      label: "Download",
      icon: Download,
      onClick: () => {
        window.open(fileRecord.downloadUrl, "_blank", "noopener,noreferrer");
      },
    });
  }

  const fileTypeLabel = isFolder ? "Folder" : (file as FileRecord).fileType?.split("/")[1] || "File";
  const fileCreatedLabel = !isFolder
    ? new Date((file as FileRecord).createdAt).toLocaleDateString()
    : null;
  const isImageFile = !isFolder && ((file as FileRecord).fileType?.toLowerCase() || "").startsWith("image/");

  return (
    <AdminEntityCard
      title={name}
      mediaImageUrl={isImageFile ? (file as FileRecord).previewUrl : undefined}
      mediaAlt={name}
      mediaFallback={renderFileFallback()}
      mediaClassName={isFolder ? "bg-gradient-to-br from-white to-teal-50" : undefined}
      mediaLabel={
        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-teal-700 shadow-sm">
          {isFolder ? "Folder" : "File"}
        </span>
      }
      topMetaRight={
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
          {fileTypeLabel}
        </span>
      }
      metaItems={
        fileCreatedLabel
          ? [
              {
                key: "uploadedAt",
                icon: <CalendarClock size={13} />,
                content: `Uploaded ${fileCreatedLabel}`,
                className: "font-semibold uppercase tracking-wider text-[10px]",
              },
            ]
          : undefined
      }
      onClick={handleCardClick}
      actions={{
        onView: () => onView(file),
        onEdit: !isFolder ? () => onEdit(file) : undefined,
        onDelete: () => onDelete(file),
        editLabel: "Edit Info",
        deleteDialogTitle: isFolder ? "Delete Folder" : "Delete File",
        deleteDialogDescription: (
          <>
            {isFolder ? "Folder" : "File"} <strong>{name}</strong> will be permanently deleted.
          </>
        ),
        extraItems,
      }}
    />
  );
}
