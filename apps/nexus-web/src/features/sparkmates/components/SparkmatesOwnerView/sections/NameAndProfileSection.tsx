 
import { GradientProfilePicture } from "../components/GradientProfilePicture";
import { SocialLogo } from "../components/SocialLogo"; 
import { editIcon } from "../icons/editIcon"; 
import { ASSETS } from "@/lib/constants/assets";

import { Badge, Button, Input, ShineBorder, Text } from "@packages/spark-ui";
import { useRouter } from "next/navigation";
import { SparkmatesProfile, UserProfile } from "@/features/sparkmates";

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
    console.log("Add Social Link clicked");
  };

  const handleEditProfileDetails = () => {
    console.log("Edit Profile Details clicked");
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
            <Text variant="heading-6" className="text-white" weight="bold">
              {profile?.displayName || "User Name"}
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
    </div>
  );
};
