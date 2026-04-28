"use client";

import { useRef, useState, useCallback } from "react";
import { Modal, Button, Text, Stack } from "@packages/spark-ui";
import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import { useUploadProfileImage } from "../hooks/useUploadProfileImage";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/features/onboarding/utils/cropImage";

interface UploadProfileImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gdgId: string;
  currentAvatarUrl?: string | null;
}

export const UploadProfileImageDialog = ({
  open,
  onOpenChange,
  gdgId,
  currentAvatarUrl,
}: UploadProfileImageDialogProps) => {
  const { mutateAsync: uploadImage, isPending } = useUploadProfileImage(gdgId);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cropper states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setIsCropping(true);
      // Reset the file input so the same file can be selected again
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      if (!imageSrc || !croppedAreaPixels) return;
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedFile) {
        setSelectedFile(croppedFile);
        setPreview(URL.createObjectURL(croppedFile));
      }
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels]);

  const handleConfirm = async () => {
    if (!selectedFile) return;
    await uploadImage(selectedFile);
    handleClose();
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
    setIsCropping(false);
    setImageSrc(null);
    if (inputRef.current) inputRef.current.value = "";
    onOpenChange(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(val) => { if (!val) handleClose(); }}
      scrollBehavior="inside"
      size="sm"
      className="bg-transparent border-none p-0 !shadow-none isolate max-w-[95vw] sm:max-w-sm"
    >
      <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/90 backdrop-blur-2xl px-6 py-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)] flex flex-col max-h-[90vh]">
        {!isCropping ? (
          <div className="space-y-5">
            {/* Header */}
            <div>
              <Text variant="heading-6" weight="bold" gradient="white-yellow">
                Upload Profile Picture
              </Text>
              <Text variant="body-sm" className="text-zinc-400 mt-1">
                Choose a new profile image. This will replace your current one.
              </Text>
            </div>

            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src={preview ?? currentAvatarUrl ?? ASSETS.PROFILE.DEFAULT_AVATAR}
                  alt="Profile preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* File input */}
            <div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="profile-upload-input"
              />
              <label
                htmlFor="profile-upload-input"
                className="flex items-center justify-center w-full cursor-pointer rounded-xl border border-white/15 bg-white/5 py-3 text-sm text-zinc-300 hover:bg-white/10 hover:border-white/25 transition-colors"
              >
                {selectedFile ? selectedFile.name : "Click to select an image"}
              </label>
            </div>

            {/* Alert note */}
            {selectedFile && (
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
                <Text variant="body-sm" className="text-amber-300">
                  Are you sure you want to update your profile picture?
                </Text>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <Button
                variant="ghost"
                type="button"
                className="h-auto py-2 px-5"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="colored"
                subVariant="blue"
                type="button"
                className="h-auto py-2 px-5"
                onClick={handleConfirm}
                disabled={!selectedFile || isPending}
              >
                {isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        ) : (
          <Stack gap="none" className="flex flex-col flex-1 overflow-y-auto">
            <div className="pb-4 sm:pb-6 border-b border-white/10 shrink-0">
              <Text variant="heading-6" className="font-bold text-white text-center">
                Crop Profile Picture
              </Text>
              <Text variant="body-sm" className="text-white/70 text-center mt-1">
                Drag to move, use slider to zoom.
              </Text>
            </div>
            
            <div className="relative w-full h-[250px] sm:h-[300px] bg-zinc-950 shrink-0 mt-4 rounded-xl overflow-hidden">
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

            <div className="pt-4 sm:pt-6 flex flex-col gap-4 shrink-0">
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
                  variant="colored"
                  subVariant="blue"
                  onClick={showCroppedImage}
                >
                  Apply Crop
                </Button>
              </Stack>
            </div>
          </Stack>
        )}
      </div>
    </Modal>
  );
};

function readFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), false);
    reader.readAsDataURL(file);
  });
}
