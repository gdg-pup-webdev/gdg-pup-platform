"use client";

import React from "react";
import { 
  File as FileIcon, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Download, 
  Folder,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Archive,
  Music,
  FileCode,
  FileJson
} from "lucide-react";
import { FileRecord } from "../types";

interface FileCardProps {
  file: FileRecord;
  onEdit: (file: FileRecord) => void;
  onDelete: (file: FileRecord) => void;
  onView: (file: FileRecord) => void;
  isFolder?: boolean;
}

export function FileCard({ file, onEdit, onDelete, onView, isFolder }: FileCardProps) {
  const renderThumbnail = () => {
    if (isFolder) {
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-teal-50 text-teal-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
          <Folder size={40} fill="currentColor" fillOpacity={0.2} />
        </div>
      );
    }
    
    const type = file.fileType?.toLowerCase() || "";
    
    if (type.startsWith("image/")) {
      return (
        <div className="relative h-full w-full overflow-hidden">
          <img 
            src={file.previewUrl} 
            alt={file.fileName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
        </div>
      );
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
      <div className={`flex h-16 w-16 items-center justify-center rounded-sm ${bgColor} ${iconColor} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
        <Icon size={32} />
      </div>
    );
  };

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white transition-all hover:border-teal-100 hover:shadow-md ${isFolder ? "cursor-pointer" : ""}`}
      onClick={isFolder ? () => onView(file) : undefined}
    >
      {/* Icon Area */}
      <div className="flex h-32 items-center justify-center bg-gray-50 transition-colors group-hover:bg-teal-50/20">
        {renderThumbnail()}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <Folder size={12} className="text-teal-500" />
          <span className="truncate">{file.filePath}</span>
        </div>
        
        <h3 className="mb-2 line-clamp-1 text-sm font-bold text-gray-900 group-hover:text-teal-700">
          {file.fileName}
        </h3>
        
        <p className="mb-4 line-clamp-2 min-h-[32px] text-xs leading-relaxed text-gray-500">
          {file.fileDescription || (isFolder ? "Click to open folder" : "No description provided.")}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-50 pt-3">
          {!isFolder ? (
            <>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(file); }}
                  className="rounded-sm p-2 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
                  title="Edit details"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(file); }}
                  className="rounded-sm p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onView(file); }}
                  className="flex items-center gap-1.5 rounded-sm bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-600 transition-colors hover:bg-gray-100"
                >
                  <ExternalLink size={12} />
                  Details
                </button>
                <a
                  href={file.downloadUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 rounded-sm bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-teal-700"
                >
                  <Download size={12} />
                  Get
                </a>
              </div>
            </>
          ) : (
            <div className="flex w-full justify-center">
               <button
                  onClick={(e) => { e.stopPropagation(); onView(file); }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-sm bg-teal-600 px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-teal-700"
                >
                  <Folder size={12} />
                  Open Folder
                </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
