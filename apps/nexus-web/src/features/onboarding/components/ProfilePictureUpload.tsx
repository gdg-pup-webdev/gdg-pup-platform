"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Modal, Button, Text, Stack } from "@packages/spark-ui";
import getCroppedImg from "../utils/cropImage";

type ProfilePictureUploadProps = {
  previewUrl: string | null;
  setProfileFile: (file: File | null) => void;
};

export function ProfilePictureUpload({
  previewUrl,
  setProfileFile,
}: ProfilePictureUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropping(true);
      // Reset the file input so the same file can be selected again
      e.target.value = "";
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        setProfileFile(croppedFile);
      }
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, setProfileFile]);

  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-inner flex flex-col h-full w-full max-w-[240px]">
      <p className="mb-4 text-sm font-medium text-zinc-400 text-center">Profile Picture</p>
      <label className="group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-700 bg-zinc-950/50 transition-all hover:border-blue-500/50 hover:bg-zinc-900/80">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-4 text-center">
            <div className="rounded-full bg-zinc-800 p-3 text-zinc-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
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
            </div>
            <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-300">
              Upload photo
            </span>
          </div>
        )}
        {previewUrl && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium text-white">Change Photo</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
          ref={fileInputRef}
        />
      </label>

      {/* Cropper Modal */}
      <Modal
        open={isCropping}
        onOpenChange={(open) => {
          if (!open) {
            setIsCropping(false);
            setImageSrc(null);
          }
        }}
        size="md"
        className="!bg-[#0a162a] border border-white/10 !p-0 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <Stack gap="none" className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-white/10 shrink-0">
            <Text variant="heading-4" className="font-bold text-white text-center">
              Crop Profile Picture
            </Text>
            <Text variant="body-sm" className="text-white/70 text-center mt-1">
              Drag to move, use slider to zoom.
            </Text>
          </div>
          
          <div className="relative w-full h-[250px] sm:h-[350px] bg-zinc-950 shrink-0">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="p-4 sm:p-6 flex flex-col gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs text-white/50">Zoom</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-blue-500 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <Stack gap="sm" className="flex-row justify-end mt-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCropping(false);
                  setImageSrc(null);
                }}
                className="text-white/70 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={showCroppedImage}
                className="!bg-gradient-to-t !from-[#2b7fff] !to-[#162456] !border-none !shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25),inset_0px_2px_0px_0px_rgba(255,255,255,0.4)]"
              >
                Apply Crop
              </Button>
            </Stack>
          </div>
        </Stack>
      </Modal>
    </div>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}
