"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  File as FileIcon, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Download, 
  Folder as FolderIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText,
  Archive,
  Music,
  FileCode,
  FileJson,
  MoreVertical,
  Eye
} from "lucide-react";
import { FileRecord, Folder } from "../types";

interface FileCardProps {
  file: FileRecord | Folder;
  onEdit: (file: any) => void;
  onDelete: (file: any) => void;
  onView: (file: any) => void;
  onOpen?: (file: any) => void;
  isFolder?: boolean;
}

export function FileCard({ file, onEdit, onDelete, onView, onOpen, isFolder }: FileCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderThumbnail = () => {
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
      return (
        <div className="relative h-full w-full overflow-hidden">
          <img 
            src={fileRecord.previewUrl} 
            alt={fileRecord.fileName}
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

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div 
      className={`group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:border-teal-200 hover:shadow-lg cursor-pointer ${isFolder ? "bg-gradient-to-br from-white to-teal-50/30" : ""}`}
      onClick={handleCardClick}
    >
      {/* 3-Dot Menu */}
      <div className="absolute top-2 right-2 z-10" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="rounded-full p-2 text-gray-400 opacity-0 transition-all hover:bg-white hover:text-teal-600 hover:shadow-sm group-hover:opacity-100"
        >
          <MoreVertical size={18} />
        </button>
        
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-1 w-40 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl">
            <button
              onClick={(e) => { e.stopPropagation(); onView(file); setIsMenuOpen(false); }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye size={14} className="text-teal-500" />
              View Details
            </button>
            {!isFolder && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(file); setIsMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 size={14} className="text-teal-500" />
                  Edit Info
                </button>
                <a
                  href={(file as FileRecord).downloadUrl}
                  onClick={(e) => e.stopPropagation()}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download size={14} className="text-teal-500" />
                  Download
                </a>
              </>
            )}
            <div className="h-px bg-gray-50" />
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(file); setIsMenuOpen(false); }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Icon Area */}
      <div className="flex h-36 items-center justify-center bg-gray-50/50 transition-colors group-hover:bg-teal-50/30">
        {renderThumbnail()}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between">
            <div className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${isFolder ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-500"}`}>
                {isFolder ? "Folder" : (file as FileRecord).fileType?.split("/")[1] || "File"}
            </div>
        </div>
        
        <h3 className="line-clamp-1 text-sm font-bold text-gray-900 transition-colors group-hover:text-teal-700">
          {name}
        </h3>
        
        {!isFolder && (
             <p className="mt-1 text-[10px] font-medium text-gray-400">
                Uploaded {new Date((file as FileRecord).createdAt).toLocaleDateString()}
            </p>
        )}
      </div>
    </div>
  );
}
