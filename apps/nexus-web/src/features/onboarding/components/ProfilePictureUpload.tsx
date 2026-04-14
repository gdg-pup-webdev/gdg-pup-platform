import React, { useState } from 'react';
import { cn } from "@/lib/utils";

type ProfilePictureUploadProps = {
  previewUrl: string | null;
  setProfileFile: (file: File | null) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function ProfilePictureUpload({ previewUrl, setProfileFile }: ProfilePictureUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, WEBP).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5MB.");
      return;
    }
    setProfileFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProfileFile(null);
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.getElementById('profile-upload-input')?.click();
    }
  };

  return (
    <div className="flex w-full max-w-[280px] flex-col h-full rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-inner">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-400">Profile Picture</p>
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
      
      <label 
        className={cn(
          "group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 transition-all focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 focus-within:ring-offset-zinc-950",
          isDragging 
            ? "border-blue-500 bg-blue-500/10 scale-[1.02]" 
            : error
              ? "border-red-500/50 bg-red-500/5 hover:border-red-500/80"
              : "border-zinc-700 border-dashed bg-zinc-950/50 hover:border-blue-500/50 hover:bg-zinc-900/80",
          previewUrl && !isDragging && !error ? "border-solid border-zinc-800" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Upload profile picture"
      >
        {previewUrl ? (
          <div className="relative h-full w-full group">
            <img
              src={previewUrl}
              alt="Profile preview"
              className={cn(
                "h-full w-full object-cover transition-opacity",
                isDragging ? "opacity-50" : "group-hover:opacity-75"
              )}
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
                : error
                  ? "bg-red-500/20 text-red-400"
                  : "bg-zinc-800 text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400"
            )}>
              {error ? <AlertIcon /> : <UploadIcon />}
            </div>
            <span className={cn(
              "text-sm font-medium transition-colors",
              isDragging 
                ? "text-blue-400" 
                : error 
                  ? "text-red-400" 
                  : "text-zinc-500 group-hover:text-zinc-300"
            )}>
              {isDragging ? "Drop your photo here" : "Click or drag photo to upload"}
            </span>
          </div>
        )}
        <input
          id="profile-upload-input"
          type="file"
          accept={ALLOWED_TYPES.join(',')}
          className="sr-only"
          onChange={handleChange}
          tabIndex={-1}
        />
      </label>
      {error && (
        <p className="mt-3 text-xs text-red-400 text-center animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
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

function AlertIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}