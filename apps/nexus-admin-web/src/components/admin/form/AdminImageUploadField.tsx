"use client";
import React, { useRef } from "react";
import { UploadCloud, X, FileImage } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  label: string;
  previewUrl: string | null;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  error?: string;
  helperText?: string;
  className?: string;
}

export function AdminImageUploadField({
  label,
  previewUrl,
  onImageChange,
  error,
  helperText,
  className,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ObjectUrl = URL.createObjectURL(file);
      onImageChange(file, ObjectUrl);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageChange(null, null);
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-widest block">
        {label}
      </label>
      
      <div className={cn(
        "group relative overflow-hidden rounded-md border-2 border-dashed transition-all",
        error ? "border-red-300 bg-red-50/50" : previewUrl ? "border-gray-200" : "border-gray-200 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/50",
        previewUrl ? "h-64" : "h-32"
      )}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />
        
        {previewUrl ? (
          <div className="relative h-full w-full">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover object-center"
            />
            {/* Overlay to click-to-change and remove */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity z-20 pointer-events-none">
              <UploadCloud size={32} className="text-white mb-2" />
              <p className="text-sm font-bold text-white">Click to change image</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClear();
              }}
              className="absolute top-2 right-2 z-30 rounded-full bg-red-500 p-1.5 text-white shadow-md hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-teal-600 transition-colors">
            <div className="rounded-full bg-white p-3 shadow-xs mb-3 group-hover:bg-teal-50">
              <FileImage size={24} />
            </div>
            <p className="text-sm font-bold">Click or drag image to upload</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-400 mt-1 italic">{helperText}</p>}
    </div>
  );
}
