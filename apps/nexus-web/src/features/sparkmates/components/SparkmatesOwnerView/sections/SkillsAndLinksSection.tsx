import type { ReactNode } from "react";
import { Badge, Button, Text } from "@packages/spark-ui";
import { UserProfile } from "@/features/sparkmates";
import { editIcon } from "../icons/editIcon";
import { addIcon } from "../icons/addIcon";

const SPARK_BADGE = {
  variantBlue: "blue",
} as const;

function SkillSectionIcon({
  type,
}: {
  type: "technical" | "learning" | "tools" | "links";
}) {
  if (type === "technical") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="m8 7-5 5 5 5M16 7l5 5-5 5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "learning") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M4 5.5h8v14H4zM12 4l8-1v16l-8 1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "tools") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M7 21h10M9 17h6M10 3h4l1 4H9l1-4zM8 11h8l-1 6H9l-1-6z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-white"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M10 14 21 3M14 3h7v7M3 10v11h11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CategoryCard({
  title,
  chips,
  iconType,
}: {
  title: string;
  chips: string[];
  iconType: "technical" | "learning" | "tools";
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-6 py-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
      <div className="mb-3 flex items-center gap-3">
        <SkillSectionIcon type={iconType} />
        <Text variant="body-lg" className="text-white" weight="medium">
          {title}
        </Text>
      </div>
      {chips.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <Badge
              key={`${title}-${chip}`}
              variant={SPARK_BADGE.variantBlue as never}
              className="text-[#F2F4F8]"
            >
              {chip}
            </Badge>
          ))}
        </div>
      ) : (
        <Text variant="body-sm" className="text-[#C1C7CD]">
          No items yet.
        </Text>
      )}
    </div>
  );
}

function OtherLinksCard({
  links,
  onOpenExternal,
}: {
  links: string[];
  onOpenExternal: (url: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-6 py-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]">
      <div className="mb-3 flex items-center gap-3">
        <SkillSectionIcon type="links" />
        <Text variant="body-lg" className="text-white" weight="medium">
          Other Links
        </Text>
      </div>
      {links.length > 0 ? (
        <div className="space-y-2">
          {links.map((link, index) => (
            <Button
              key={`${link}-${index}`}
              variant="ghost"
              className="h-auto w-full justify-start rounded-xl border border-white/20 bg-[#091734] px-3 py-2 text-left text-white"
              onClick={() => onOpenExternal(link)}
            >
              <span className="block truncate">{link}</span>
            </Button>
          ))}
        </div>
      ) : (
        <Text variant="body-sm" className="text-[#C1C7CD]">
          No links yet.
        </Text>
      )}
    </div>
  );
}

export function SkillsAndLinksSection({
  profile
}: {
  profile: UserProfile
}) {
  
  const skills: string[] = profile.technicalSkills ?? [];
  const interests: string[] = profile.learningInterests ?? [];
  const tools: string[] = profile.toolsAndTechnologies ?? [];
  const otherLinks: string[] = profile.otherLinks ?? [];  

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between gap-3">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Skills and Interests
        </Text>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-white"
          title="Edit Skills and Interests"
          aria-label="Edit Skills and Interests"
        >
          {editIcon}
        </Button>
      </div>

      <Text variant="body-sm" className="text-[#C1C7CD]">
        Add your skills or what you are currently learning.
      </Text>

      <div className="space-y-3">
        <CategoryCard
          title="Technical Skills"
          chips={skills}
          iconType="technical"
        />
        <CategoryCard
          title="Learning Interests"
          chips={interests}
          iconType="learning"
        />
        <CategoryCard
          title="Tools & Technologies"
          chips={tools}
          iconType="tools"
        />
        <OtherLinksCard links={otherLinks} onOpenExternal={(url) => {window.open( url, '_blank');}} />
      </div>

      {skills.length === 0 &&
      interests.length === 0 &&
      tools.length === 0 &&
      otherLinks.length === 0 ? (
        <Button
          variant="outline"
          className="w-full border-white/25 bg-white/5 text-white"
          iconLeft={addIcon}
        >
          Add Skills and Interests
        </Button>
      ) : null}
    </section>
  );
}
