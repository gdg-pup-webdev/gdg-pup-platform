"use client";

import React from "react";
import { File as FileIcon, Edit2, Trash2, ExternalLink, Download, Folder } from "lucide-react";
import { FileRecord } from "../types";

interface FileCardProps {
  file: FileRecord;
  onEdit: (file: FileRecord) => void;
  onDelete: (file: FileRecord) => void;
  onView: (file: FileRecord) => void;
}

export function FileCard({ file, onEdit, onDelete, onView }: FileCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-sm border border-gray-100 bg-white transition-all hover:border-teal-100 hover:shadow-md">
      {/* Icon Area */}
      <div className="flex h-32 items-center justify-center bg-gray-50 transition-colors group-hover:bg-teal-50/30">
        <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white text-teal-600 shadow-sm transition-transform group-hover:scale-110">
          <FileIcon size={32} />
        </div>
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
          {file.fileDescription || "No description provided."}
        </p>

        {/* Action Buttons */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-50 pt-3">
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(file)}
              className="rounded-sm p-2 text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
              title="Edit details"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(file)}
              className="rounded-sm p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              title="Delete file"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onView(file)}
              className="flex items-center gap-1.5 rounded-sm bg-gray-50 px-3 py-1.5 text-[11px] font-bold text-gray-600 transition-colors hover:bg-gray-100"
            >
              <ExternalLink size={12} />
              Details
            </button>
            <a
              href={file.downloadUrl}
              className="flex items-center gap-1.5 rounded-sm bg-teal-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-teal-700"
            >
              <Download size={12} />
              Get
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
