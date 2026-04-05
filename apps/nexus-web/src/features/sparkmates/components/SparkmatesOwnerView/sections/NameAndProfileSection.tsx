 
import { GradientProfilePicture } from "../components/GradientProfilePicture";
import { SocialLogo } from "../components/SocialLogo"; 
import { editIcon } from "../icons/editIcon"; 
import { ASSETS } from "@/lib/constants/assets";

import { Badge, Button, Input, ShineBorder, Text, Modal, Textarea } from "@packages/spark-ui";
import { useRouter } from "next/navigation";
import { SparkmatesProfile, UserProfile, useUpdateSparkmateProfile } from "@/features/sparkmates";
import { useState, useEffect } from "react";

const SPARK_BADGE = {
  variantYellow: "yellow",
  variantRed: "red",
  variantId: "id",
} as const;

export const NameAndProfileSection = ({
  profile,
}: {
  profile: UserProfile;
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

  const [links, setLinks] = useState<string[]>(profile.otherLinks || []);
  const [newLink, setNewLink] = useState("");

  // Sync when profile is refreshed after query invalidation
  useEffect(() => { setLinks(profile.otherLinks ?? []); }, [profile.otherLinks]);

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
    {
      key: "linkedin",
      url: profile?.linkedinUrl || null,
      label: "LinkedIn",
    },
    {
      key: "github",
      url: profile?.githubUrl || null,
      label: "GitHub",
    },
    {
      key: "website",
      url: profile?.portfolioWebsiteUrl || null,
      label: "Website",
    },
  ] as const;

  const handleAddSocialLink = () => {
    setIsLinksModalOpen(true);
  };

  const handleEditProfileDetails = () => {
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData, {
        onSuccess: () => {
          setIsEditModalOpen(false);
        },
      }
    );
  };

  const handleSaveLinks = () => {
    updateProfile({ otherLinks: links }, {
      onSuccess: () => {
        setIsLinksModalOpen(false);
      },
    });
  };

  return (
    <div className="mt-6 p-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <GradientProfilePicture
            src={profile?.avatarUrl || ASSETS.PROFILE.DEFAULT_AVATAR}
            alt={profile?.displayName || "User Avatar"}
            fallback={profile?.displayName?.charAt(0) || "U"}
          />

          <div className="min-w-0">
            <Text variant="heading-6" weight="bold" className="text-white flex flex-wrap items-baseline gap-2">
              <span>
                {[
                  profile?.firstName,
                  profile?.middleName,
                  profile?.lastName,
                  profile?.suffix,
                ].filter(Boolean).join(" ") || "User Name"}
              </span>
              {profile?.displayName && (
                <span className="text-zinc-400 font-medium text-lg">
                  ({profile.displayName})
                </span>
              )}
            </Text>
            <Text variant="body-sm" className="text-[#C1C7CD]">
              {profile?.program || "Program and Year not set"}
            </Text>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.department && (
                <Badge variant={"yellow"}>{profile.department}</Badge>
              )}
              <Badge variant={"id"}>{profile.gdgId}</Badge>
            </div>
            <Text variant="body-sm" className="mt-2 max-w-130 text-[#E5E5E5]">
              {profile?.bio ||
                "Share your story to let sparkmates know what you are building."}
            </Text>
            <div className="mt-3 flex gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.key}
                  variant="ghost"
                  size="sm"
                  title={social.label}
                  disabled={!social.url}
                  className="h-8 w-8 rounded-full border border-white/25 bg-[#091734] p-0 text-[11px] text-white disabled:opacity-40"
                  onClick={() => {
                    if (!social.url) return;
                    router.push(social.url);
                  }}
                >
                  <SocialLogo type={social.key} />
                </Button>
              ))}

              <Button
                variant="ghost"
                size="sm"
                title="Add Socials"
                className="h-8 w-8 rounded-full border border-white/25 bg-[#091734] p-0 text-white"
                onClick={handleAddSocialLink}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white"
            title="Menu"
            aria-label="Menu"
          >
            {burgerIcon}
          </Button> */}
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

      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} scrollBehavior="inside" size="sm" className="bg-[#091734] text-white border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Text variant="heading-6" weight="bold" className="text-white">Edit Profile</Text>
            <Text variant="body-sm" className="text-zinc-400 mt-1">
              Update your personal details and links to let people know who you are.
            </Text>
          </div>
          
          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Display Name</Text>
            <Input 
              name="displayName" 
              value={formData.displayName} 
              onChange={handleInputChange} 
              placeholder="Display Name"
              containerClassName="bg-white/5 border-white/10"
              className="bg-transparent text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Program</Text>
            <Input 
              name="program" 
              value={formData.program} 
              onChange={handleInputChange} 
              placeholder="e.g. BSIT 3-1"
              containerClassName="bg-white/5 border-white/10"
              className="bg-transparent text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Department</Text>
            <Input 
              name="department" 
              value={formData.department} 
              onChange={handleInputChange} 
              placeholder="Department"
              containerClassName="bg-white/5 border-white/10"
              className="bg-transparent text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Bio</Text>
            <Textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleInputChange} 
              placeholder="Tell us about yourself"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[100px]"
            />
          </div>

          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">GitHub URL</Text>
            <Input 
              name="githubUrl" 
              value={formData.githubUrl} 
              onChange={handleInputChange} 
              placeholder="https://github.com/..."
              containerClassName="bg-white/5 border-white/10"
              className="bg-transparent text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">LinkedIn URL</Text>
            <Input 
              name="linkedinUrl" 
              value={formData.linkedinUrl} 
              onChange={handleInputChange} 
              placeholder="https://linkedin.com/in/..."
              containerClassName="bg-white/5 border-white/10"
              className="bg-transparent text-white placeholder:text-white/40"
            />
          </div>

          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Portfolio Website URL</Text>
            <Input 
              name="portfolioWebsiteUrl" 
              value={formData.portfolioWebsiteUrl} 
              onChange={handleInputChange} 
              placeholder="https://..."
              containerClassName="bg-white/5 border-white/10"
              className="bg-transparent text-white placeholder:text-white/40"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="default" type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Separate Links Modal */}
      <Modal open={isLinksModalOpen} onOpenChange={setIsLinksModalOpen} scrollBehavior="inside" size="sm" className="bg-[#091734] text-white border border-white/10">
        <div className="space-y-4">
          <div>
            <Text variant="heading-6" weight="bold" className="text-white">Manage Links</Text>
            <Text variant="body-sm" className="text-zinc-400 mt-1">
              Add prominent links to other platforms that will appear on your profile.
            </Text>
          </div>

          <div className="space-y-1.5">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Link URL</Text>
            <div className="flex gap-2">
              <Input 
                value={newLink} 
                onChange={(e) => setNewLink(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLink())}
                placeholder="https://your-link.com"
                containerClassName="bg-white/5 border-white/10"
                className="bg-transparent text-white placeholder:text-white/40"
              />
              <Button variant="default" onClick={handleAddLink}>Add</Button>
            </div>
          </div>

          {links.length > 0 && (
            <div className="space-y-2">
              <Text variant="body-sm" className="text-zinc-300 font-medium">Added Links</Text>
              {links.map((link, index) => (
                <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <Text variant="body-sm" className="truncate flex-1 text-white">{link}</Text>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveLink(index)} className="text-red-400">Remove</Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setIsLinksModalOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleSaveLinks} disabled={isPending}>
              {isPending ? "Saving..." : "Save Links"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
