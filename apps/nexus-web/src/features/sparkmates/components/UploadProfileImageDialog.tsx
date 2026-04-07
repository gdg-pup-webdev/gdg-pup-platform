"use client";

import { useRef, useState } from "react";
import { Modal, Button, Text } from "@packages/spark-ui";
import Image from "next/image";
import { ASSETS } from "@/lib/constants/assets";
import { useUploadProfileImage } from "../hooks/useUploadProfileImage";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    if (!selectedFile) return;
    await uploadImage(selectedFile);
    handleClose();
  };

  const handleClose = () => {
    setPreview(null);
    setSelectedFile(null);
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
      <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/90 backdrop-blur-2xl px-6 py-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
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
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
            <Text variant="body-sm" className="text-amber-300">
              Are you sure you want to update your profile picture?
            </Text>
          </div>

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
      </div>
    </Modal>
  );
};
