import React, { useState } from 'react';
import { cn } from "@/lib/utils";

type ProfilePictureUploadProps = {
  previewUrl: string | null;
  setProfileFile: (file: File | null) => void;
};

export function ProfilePictureUpload({ previewUrl, setProfileFile }: ProfilePictureUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setProfileFile(file);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-inner flex flex-col h-full w-full max-w-[280px]">
      <p className="mb-4 text-sm font-medium text-zinc-400">Profile Picture</p>
      <label 
        className={cn(
          "group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all",
          isDragging 
            ? "border-blue-500 bg-blue-500/10 scale-[1.02]" 
            : "border-zinc-700 bg-zinc-950/50 hover:border-blue-500/50 hover:bg-zinc-900/80",
          previewUrl ? "border-solid" : "border-dashed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative h-full w-full group">
            <img
              src={previewUrl}
              alt="Profile preview"
              className="h-full w-full object-cover transition-opacity group-hover:opacity-75"
            />
            {isDragging && (
              <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center backdrop-blur-[2px]">
                <div className="rounded-full bg-blue-600 p-3 text-white shadow-lg animate-bounce">
                  <UploadIcon />
                </div>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
              <span className="text-white text-xs font-bold bg-black/60 px-3 py-1.5 rounded-full border border-white/20">Change Photo</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className={cn(
              "rounded-full p-3 transition-all duration-300",
              isDragging 
                ? "bg-blue-500 text-white scale-110 rotate-3" 
                : "bg-zinc-800 text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400"
            )}>
              <UploadIcon />
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors",
              isDragging ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-300"
            )}>
              {isDragging ? "Drop your photo here" : "Click or drag photo to upload"}
            </span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => setProfileFile(event.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
