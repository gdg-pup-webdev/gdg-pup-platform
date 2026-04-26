"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/shared";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useGetProfileOfUserByGdgId } from "../hooks/useGetProfileOfUserByGdgId";
import { Text, Button } from "@packages/spark-ui";
import { GradientProfilePicture } from "./SparkmatesOwnerView/components/GradientProfilePicture";
import { ASSETS } from "@/lib/constants/assets";
import { UploadProfileImageDialog } from "./UploadProfileImageDialog";
import { DeleteProfileDialog } from "./DeleteProfileDialog";
import { NfcToggleConfirmDialog } from "./NfcToggleConfirmDialog";
import { SettingsChangePasswordDialog } from "./SettingsChangePasswordDialog";

export function AccountSettingsSection() {
  const { decodedToken } = useAuthContext();
  const gdgId = decodedToken?.memberInfo?.gdgId;

  const {
    data: profileResponse,
    isLoading,
    isError,
  } = useGetProfileOfUserByGdgId(gdgId);
  const profile = profileResponse?.data;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  if (isLoading) {
    return <LoadingScreen message="Loading settings..." />;
  }

  if (isError || !profile || !gdgId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 pb-24 pt-40">
        <Text variant="body" className="text-zinc-400">
          Failed to load settings.
        </Text>
      </div>
    );
  }

  const fullName =
    [profile.firstName, profile.middleName, profile.lastName, profile.suffix]
      .filter(Boolean)
      .join(" ") || "Your Name";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 sm:pt-10">
      {/* ── 1. Profile Header Card ─────────────────────────────────────────────
           rainbow-border + bg-white/5 backdrop-blur-md on ALL breakpoints.
           The mobile hero image lives in SettingsSection.tsx behind this card. */}
      <div className="relative overflow-hidden rounded-[28px] rainbow-border backdrop-blur-md bg-white/5 px-6 sm:px-8 py-8 shadow-[inset_0px_4px_16px_0px_rgba(255,255,255,0.05)]">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="shrink-0">
            <GradientProfilePicture
              src={profile.avatarUrl || ASSETS.PROFILE.DEFAULT_AVATAR}
              alt={profile.displayName || "User Avatar"}
              fallback={profile.displayName?.charAt(0) || "U"}
            />
          </div>

          <div className="flex-1 text-center sm:text-left flex flex-col justify-center min-h-[100px] h-full">
            <Text variant="heading-5" weight="bold" gradient="white-yellow">
              {fullName}
            </Text>
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
              <Text variant="body-sm" className="text-zinc-400">
                GDG ID:
              </Text>
              <Text variant="body-sm" weight="bold" gradient="yellow">
                {profile.gdgId}
              </Text>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0 mt-4 sm:mt-0 justify-center min-h-[100px]">
            <Button
              variant="colored"
              subVariant="blue"
              className="w-full"
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload Profile
            </Button>
            <Button
              variant="default"
              className="w-full bg-transparent border border-white/20 text-white hover:bg-white/5"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Profile
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2. Security & Privacy Card ─────────────────────────────────────────
           Same rainbow-border + bg-white/5 backdrop-blur-md pattern. */}
      <div className="relative overflow-hidden rounded-[28px] rainbow-border backdrop-blur-md bg-white/5 px-6 sm:px-8 py-8 shadow-[inset_0px_4px_16px_0px_rgba(255,255,255,0.05)]">
        <div className="relative z-10 space-y-6">
          <div className="pb-2 border-b border-white/10">
            <Text variant="heading-6" weight="bold" gradient="white-blue">
              Security &amp; Privacy
            </Text>
          </div>

          {/* NFC Row */}
          {/* commented out according to issue #979 */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Text variant="body" className="text-[#C1C7CD]">
              Near Field Communication (NFC)
            </Text>
            <Button
              variant="colored"
              subVariant="blue"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setIsNfcModalOpen(true)}
            >
              {profile.isPublic ? "Turn Off" : "Turn On"}
            </Button>
          </div> */}

          {/* Password Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Text variant="body" className="text-[#C1C7CD]">
              Password
            </Text>
            <Button
              variant="colored"
              subVariant="blue"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              Change
            </Button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <UploadProfileImageDialog
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        gdgId={gdgId}
        currentAvatarUrl={profile.avatarUrl}
      />
      <DeleteProfileDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
      <NfcToggleConfirmDialog
        open={isNfcModalOpen}
        onOpenChange={setIsNfcModalOpen}
        gdgId={gdgId}
        currentIsPublic={!!profile.isPublic}
      />
      <SettingsChangePasswordDialog
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </div>
  );
}
