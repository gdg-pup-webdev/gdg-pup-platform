import { GradientProfilePicture } from "../components/GradientProfilePicture";
import { SocialLogo } from "../components/SocialLogo";
import { editIcon } from "../icons/editIcon";
import { ASSETS } from "@/lib/constants/assets";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { Badge, Button, Input, Text, Modal, Textarea } from "@packages/spark-ui";
import { useRouter } from "next/navigation";
import { UserProfile, useUpdateSparkmateProfile } from "@/features/sparkmates";
import { useState, useEffect, useMemo } from "react";
import {
  parseCustomButtonLinks,
  serializeCustomButtonLinks,
} from "../../../utils/customButtonFavorites";

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] focus-within:p-[2px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_0_10px_rgba(251,44,54,0.35),0_0_20px_rgba(240,177,0,0.3),0_0_32px_rgba(43,127,255,0.4)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles =
  "!h-auto py-2 px-3 sm:py-2.5 sm:px-4 !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";

export const NameAndProfileSection = ({
  profile,
  onOpenReorderDesktop,
  onOpenReorderMobile,
}: {
  profile: UserProfile;
  onOpenReorderDesktop?: () => void;
  onOpenReorderMobile?: () => void;
}) => {
  const router = useRouter();
  const { mutate: updateProfile, isPending } = useUpdateSparkmateProfile(profile.gdgId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLinksModalOpen, setIsLinksModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    displayName: profile.displayName || "",
    program: profile.program || "",
    department: profile.department || "",
    bio: profile.bio || "",
    githubUrl: profile.githubUrl || "",
    linkedinUrl: profile.linkedinUrl || "",
    portfolioWebsiteUrl: profile.portfolioWebsiteUrl || "",
  });

  const parsedProfileLinks = useMemo(
    () => parseCustomButtonLinks(profile.otherLinks),
    [profile.otherLinks],
  );
  const [links, setLinks] = useState<string[]>(parsedProfileLinks.links);
  const [newLink, setNewLink] = useState("");

  // Sync when profile is refreshed after query invalidation
  useEffect(() => {
    setLinks(parsedProfileLinks.links);
  }, [parsedProfileLinks]);

  const handleAddLink = () => {
    if (newLink && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const socialLinks = [
    { key: "linkedin", url: profile?.linkedinUrl || null, label: "LinkedIn" },
    { key: "github",   url: profile?.githubUrl || null,   label: "GitHub"   },
    { key: "website",  url: profile?.portfolioWebsiteUrl || null, label: "Website" },
  ] as const;

  const handleAddSocialLink = () => setIsLinksModalOpen(true);
  const handleEditProfileDetails = () => setIsEditModalOpen(true);
  const handleOpenReorderDesktop = () => onOpenReorderDesktop?.();
  const handleOpenReorderMobile = () => onOpenReorderMobile?.();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData, { onSuccess: () => setIsEditModalOpen(false) });
  };

  const handleSaveLinks = () => {
    updateProfile(
      {
        otherLinks: serializeCustomButtonLinks(links, parsedProfileLinks.starredUrls),
      },
      { onSuccess: () => setIsLinksModalOpen(false) },
    );
  };

  const fullName =
    [profile?.firstName, profile?.middleName, profile?.lastName, profile?.suffix]
      .filter(Boolean)
      .join(" ") || "Your Name";

  /* ─────────────────────────────────────────────────────────────────
   * Social buttons — shared between both layouts
   * ───────────────────────────────────────────────────────────────── */
  const SocialButtons = ({ className }: { className?: string }) => (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {socialLinks.map((social) => (
        <Button
          key={social.key}
          variant="ghost"
          size="sm"
          title={social.label}
          disabled={!social.url}
          className="h-9 w-9 rounded-full border border-white/25 bg-[#091734] p-0 text-[11px] text-white disabled:opacity-40"
          onClick={() => { if (!social.url) return; router.push(social.url); }}
        >
          <SocialLogo type={social.key} />
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        title="Add Socials"
        className="h-9 w-9 rounded-full border border-white/25 bg-[#091734] p-0 text-white"
        onClick={handleAddSocialLink}
      >
        +
      </Button>
    </div>
  );

  const reorderIcon = (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="mt-4 p-0 relative">

      {/* ══════════════════════════════════════════════════════════════
       *  MOBILE LAYOUT  (hidden on sm and above)
       * ════════════════════════════════════════════════════════════ */}
      <div className="sm:hidden relative">

        {/* Horizon — absolute, full-viewport-width, sits BEHIND the avatar (z-0) */}
        {/* -left-3 and -right-3 breaks out of the parent's px-3 (12px) padding */}
        <div
          className="absolute z-0 top-0 h-[220px] -left-3 -right-3 pointer-events-none overflow-hidden"
        >
          <Image
            src={ASSETS.SPARKMATES.HORIZON}
            alt=""
            aria-hidden
            fill
            className="object-cover"
            style={{ objectPosition: "50% 65%" }}
            priority
          />
          {/* Top gradient — blends page bg into the image */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#010B1D] to-transparent" />
          {/* Bottom gradient — softens bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#010B1D] to-transparent" />
        </div>

        {/* Edit/reorder buttons — absolute, top right */}
        <div className="absolute top-3 right-0 z-20 flex items-center gap-2">
          <button
            onClick={handleOpenReorderMobile}
            aria-label="Reorder Sections"
            title="Reorder Sections"
            className="h-8 w-8 flex items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            {reorderIcon}
          </button>
          <button
            onClick={handleEditProfileDetails}
            aria-label="Edit Profile"
            title="Edit Profile"
            className="h-8 w-8 flex items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
          >
            {editIcon}
          </button>
        </div>

        {/* Avatar — normal flow, z-10 above horizon */}
        {/* pt-10 (40px) + h-32/2 (64px) = avatar center at ~104px from top */}
        {/* Horizon glow at objectPosition 65% of 220px ≈ 143px — arc visible behind avatar */}
        <div className="relative z-10 flex justify-center pt-10">
          <GradientProfilePicture
            size="sm"
            src={profile?.avatarUrl || ASSETS.PROFILE.DEFAULT_AVATAR}
            alt={profile?.displayName || "User Avatar"}
            fallback={profile?.displayName?.charAt(0) || "U"}
          />
        </div>

        {/* Text — follows avatar in normal flow, tight gap */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-3 pb-2">
          {/* Name */}
          <Text variant="heading-6" weight="bold" className="text-white leading-tight">
            {fullName}
          </Text>

          {/* Display name alias */}
          {profile?.displayName && (
            <Text variant="body-sm" className="text-zinc-400 mt-0.5">
              ({profile.displayName})
            </Text>
          )}

          {/* Program */}
          <Text variant="body-sm" className="text-[#C1C7CD] mt-1">
            {profile?.program || "Program & Year not set"}
          </Text>

          {/* Badges */}
          <div className="mt-2.5 flex flex-wrap justify-center gap-2">
            {profile.department && <Badge variant={"yellow"}>{profile.department}</Badge>}
            <Badge variant={"id"}>{profile.gdgId}</Badge>
          </div>

          {/* Bio */}
          <Text variant="body-sm" className="mt-3 text-[#E5E5E5] max-w-xs leading-relaxed">
            {profile?.bio || "Share your story to let sparkmates know what you are building."}
          </Text>

          {/* Social links */}
          <SocialButtons className="mt-4 justify-center" />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
       *  DESKTOP LAYOUT  (hidden below sm)
       * ════════════════════════════════════════════════════════════ */}
      <div className="hidden sm:flex sm:flex-row sm:items-start sm:gap-4 sm:justify-between mt-6">
        {/* Left: avatar + details row */}
        <div className="flex items-start gap-4 min-w-0">
          {/* Avatar */}
          <div className="shrink-0">
            <GradientProfilePicture
              src={profile?.avatarUrl || ASSETS.PROFILE.DEFAULT_AVATAR}
              alt={profile?.displayName || "User Avatar"}
              fallback={profile?.displayName?.charAt(0) || "U"}
            />
          </div>

          {/* Text details */}
          <div className="min-w-0 pt-2">
            <Text
              variant="heading-6"
              weight="bold"
              className="text-white flex flex-wrap items-baseline gap-2 leading-tight"
            >
              <span>{fullName}</span>
              {profile?.displayName && (
                <span className="text-zinc-400 font-medium text-base">
                  ({profile.displayName})
                </span>
              )}
            </Text>

            <Text variant="body-sm" className="text-[#C1C7CD] mt-1">
              {profile?.program || "Program & Year not set"}
            </Text>

            <div className="mt-2 flex flex-wrap gap-2">
              {profile.department && <Badge variant={"yellow"}>{profile.department}</Badge>}
              <Badge variant={"id"}>{profile.gdgId}</Badge>
            </div>

            <Text variant="body-sm" className="mt-2 max-w-sm text-[#E5E5E5] leading-relaxed">
              {profile?.bio || "Share your story to let sparkmates know what you are building."}
            </Text>

            <SocialButtons className="mt-3" />
          </div>
        </div>

        {/* Right: edit button */}
        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white"
            title="Reorder Sections"
            aria-label="Reorder Sections"
            onClick={handleOpenReorderDesktop}
          >
            {reorderIcon}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white"
            title="Edit"
            aria-label="Edit"
            onClick={handleEditProfileDetails}
          >
            {editIcon}
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
       *  MODALS  (shared — logic untouched)
       * ════════════════════════════════════════════════════════════ */}

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        scrollBehavior="inside"
        size="sm"
        className="bg-transparent border-none p-0 !shadow-none isolate max-w-[95vw] sm:max-w-md"
      >
        <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/80 backdrop-blur-2xl px-6 py-8 sm:px-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Text variant="heading-6" weight="bold" gradient="white-yellow">Edit Profile</Text>
              <Text variant="body-sm" className="text-zinc-400 mt-1">
                Update your personal details and links to let people know who you are.
              </Text>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">Display Name</Text>
              <StyledInputContainer>
                <Input name="displayName" value={formData.displayName} onChange={handleInputChange} placeholder="Display Name" containerClassName={inputBaseStyles} className="text-white! py-2 sm:py-2.5" />
              </StyledInputContainer>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">Program</Text>
              <StyledInputContainer>
                <Input name="program" value={formData.program} onChange={handleInputChange} placeholder="e.g. BSIT 3-1" containerClassName={inputBaseStyles} className="text-white! py-2 sm:py-2.5" />
              </StyledInputContainer>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">Department</Text>
              <StyledInputContainer>
                <Input name="department" value={formData.department} onChange={handleInputChange} placeholder="Department" containerClassName={inputBaseStyles} className="text-white! py-2 sm:py-2.5" />
              </StyledInputContainer>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">Bio</Text>
              <StyledInputContainer>
                <Textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder="Tell us about yourself" className={cn(inputBaseStyles, "min-h-[100px] !h-auto py-2 sm:py-2.5 text-white!")} />
              </StyledInputContainer>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">GitHub URL</Text>
              <StyledInputContainer>
                <Input name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} placeholder="https://github.com/..." containerClassName={inputBaseStyles} className="text-white! py-2 sm:py-2.5" />
              </StyledInputContainer>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">LinkedIn URL</Text>
              <StyledInputContainer>
                <Input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} placeholder="https://linkedin.com/in/..." containerClassName={inputBaseStyles} className="text-white! py-2 sm:py-2.5" />
              </StyledInputContainer>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">Portfolio Website URL</Text>
              <StyledInputContainer>
                <Input name="portfolioWebsiteUrl" value={formData.portfolioWebsiteUrl} onChange={handleInputChange} placeholder="https://..." containerClassName={inputBaseStyles} className="text-white! py-2 sm:py-2.5" />
              </StyledInputContainer>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
              <Button variant="ghost" type="button" className="h-auto py-2 sm:py-2 px-5" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button variant="colored" subVariant="blue" type="submit" className="h-auto py-2 sm:py-2 px-5" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Manage Links Modal */}
      <Modal
        open={isLinksModalOpen}
        onOpenChange={setIsLinksModalOpen}
        scrollBehavior="inside"
        size="sm"
        className="bg-transparent border-none p-0 !shadow-none isolate max-w-[95vw] sm:max-w-sm"
      >
        <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/80 backdrop-blur-2xl px-6 py-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
          <div className="space-y-4">
            <div>
              <Text variant="heading-6" weight="bold" gradient="white-yellow">Manage Links</Text>
              <Text variant="body-sm" className="text-zinc-400 mt-1">
                Add prominent links to other platforms that will appear on your profile.
              </Text>
            </div>

            <div className="space-y-1.5 flex flex-col">
              <Text variant="body-sm" className="text-zinc-300 font-medium">Link URL</Text>
              <div className="flex gap-2">
                <StyledInputContainer>
                  <Input
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLink())}
                    placeholder="https://your-link.com"
                    containerClassName={inputBaseStyles}
                    className="text-white! py-2 sm:py-2.5"
                  />
                </StyledInputContainer>
                <Button variant="colored" subVariant="dark-blue" className="h-auto py-2 sm:py-2.5 px-4" onClick={handleAddLink}>Add</Button>
              </div>
            </div>

            {links.length > 0 && (
              <div className="space-y-2">
                <Text variant="body-sm" className="text-zinc-300 font-medium">Added Links</Text>
                {links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 p-3 rounded-xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors">
                    <Text variant="body-sm" className="truncate flex-1 text-zinc-200">{link}</Text>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(index)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">Remove</Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800/80">
              <Button variant="ghost" className="h-auto py-2 sm:py-2 px-5" onClick={() => setIsLinksModalOpen(false)}>Cancel</Button>
              <Button variant="colored" subVariant="blue" className="h-auto py-2 sm:py-2 px-5" onClick={handleSaveLinks} disabled={isPending}>
                {isPending ? "Saving..." : "Save Links"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
