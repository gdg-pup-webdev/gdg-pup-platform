"use client";

import React, { useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import Image from "next/image";

interface AdminAvatarUploadFieldProps {
  label: string;
  previewUrl: string | null;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  helperText?: string;
}

export function AdminAvatarUploadField({
  label,
  previewUrl,
  onImageChange,
  helperText,
}: AdminAvatarUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    onImageChange(file, objectUrl);
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange(null, null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>

      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300">
          {previewUrl ? (
            <Image src={previewUrl} alt="Profile preview" fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Camera size={28} />
            </div>
          )}

          {previewUrl ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
              title="Remove image"
            >
              <X size={12} />
            </button>
          ) : null}
        </div>

        <div className="flex-1 space-y-2">
          {helperText ? <p className="text-xs text-gray-500">{helperText}</p> : null}
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50">
            <Upload size={16} />
            Choose Photo
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
