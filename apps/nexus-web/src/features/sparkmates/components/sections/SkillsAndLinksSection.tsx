import type { ReactNode } from "react";
import { Badge, Button, Text, Modal, Input } from "@packages/spark-ui";
import { UserProfile, useUpdateSparkmateProfile } from "@/features/sparkmates";
import { cn } from "@/lib/utils";
import { editIcon } from "../SparkmatesOwnerView/icons/editIcon";
import { addIcon } from "../SparkmatesOwnerView/icons/addIcon";
import { useState, useEffect } from "react";

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

const StyledInputContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="relative group w-full rounded-[8px] p-[1px] focus-within:p-[2px] bg-[#737373] hover:bg-gradient-to-r focus-within:bg-gradient-to-r hover:from-[#FB2C36] hover:via-[#F0B100] hover:to-[#2B7FFF] focus-within:from-[#FB2C36] focus-within:via-[#F0B100] focus-within:to-[#2B7FFF] focus-within:shadow-[0_0_10px_rgba(251,44,54,0.35),0_0_20px_rgba(240,177,0,0.3),0_0_32px_rgba(43,127,255,0.4)] transition-all duration-300 ease-in-out">
    {children}
  </div>
);

const inputBaseStyles =
  "!h-auto py-2 px-3 sm:py-2.5 sm:px-4 !border-none !rounded-[7px] !ring-0 !ring-offset-0 focus-within:!ring-0 focus-within:!ring-offset-0 focus-within:!shadow-none w-full transition-colors bg-[#0a162a] group-hover:bg-[#010b1d] group-focus-within:bg-[#010b1d]";

export function SkillsAndLinksSection({
  profile,
  readOnly
}: {
  profile: UserProfile,
  readOnly?: boolean
}) {
  const { mutate: updateProfile, isPending } = useUpdateSparkmateProfile(profile.gdgId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>(profile.technicalSkills ?? []);
  const [interests, setInterests] = useState<string[]>(profile.learningInterests ?? []);
  const [tools, setTools] = useState<string[]>(profile.toolsAndTechnologies ?? []);
  
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newTool, setNewTool] = useState("");

  // Sync local state when profile data refreshes after invalidation
  useEffect(() => { setSkills(profile.technicalSkills ?? []); }, [profile.technicalSkills]);
  useEffect(() => { setInterests(profile.learningInterests ?? []); }, [profile.learningInterests]);
  useEffect(() => { setTools(profile.toolsAndTechnologies ?? []); }, [profile.toolsAndTechnologies]);

  const handleAddTag = (list: string[], setList: (l: string[]) => void, tag: string, setTag: (t: string) => void) => {
    if (tag && !list.includes(tag)) {
      setList([...list, tag]);
      setTag("");
    }
  };

  const handleRemoveTag = (list: string[], setList: (l: string[]) => void, index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateProfile({
      technicalSkills: skills,
      learningInterests: interests,
      toolsAndTechnologies: tools,
    }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
      }
    });
  };

  return (
    <section className="space-y-4 pt-6">
      <div className="flex items-center justify-between gap-3">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Skills and Interests
        </Text>
        {!readOnly && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white"
            title="Edit Skills and Interests"
            aria-label="Edit Skills and Interests"
            onClick={() => setIsEditModalOpen(true)}
          >
            {editIcon}
          </Button>
        )}
      </div>

      <Text variant="body-sm" className="text-[#C1C7CD]">
        Add your skills or what you are currently learning.
      </Text>

      <div className="space-y-3">
        <CategoryCard
          title="Technical Skills"
          chips={profile.technicalSkills ?? []}
          iconType="technical"
        />
        <CategoryCard
          title="Learning Interests"
          chips={profile.learningInterests ?? []}
          iconType="learning"
        />
        <CategoryCard
          title="Tools & Technologies"
          chips={profile.toolsAndTechnologies ?? []}
          iconType="tools"
        />
      </div>

      {profile.technicalSkills?.length === 0 &&
      profile.learningInterests?.length === 0 &&
      profile.toolsAndTechnologies?.length === 0 ? (
        <Button
          variant="outline"
          className="w-full border-white/25 bg-white/5 text-white"
          iconLeft={addIcon}
          onClick={() => setIsEditModalOpen(true)}
        >
          Add Skills and Interests
        </Button>
      ) : null}

      {!readOnly && (
        <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} scrollBehavior="inside" size="sm" className="bg-transparent border-none p-0 !shadow-none isolate max-w-[95vw] sm:max-w-md">
        <div className="relative overflow-hidden w-full rounded-3xl bg-[#010B1D]/80 backdrop-blur-2xl px-6 py-8 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6),inset_0px_4px_16px_rgba(255,255,255,0.05)]">
        <div className="space-y-6">
          <div>
            <Text variant="heading-6" weight="bold" gradient="white-yellow">Manage Skills and Interests</Text>
            <Text variant="body-sm" className="text-zinc-400 mt-1">
              Showcase your technical expertise and what you're passionate about.
            </Text>
          </div>
          
          <div className="space-y-2 flex flex-col">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Technical Skills</Text>
            <div className="flex gap-2">
              <StyledInputContainer>
                <Input 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(skills, setSkills, newSkill, setNewSkill))}
                  placeholder="e.g. React"
                  containerClassName={inputBaseStyles}
                  className="text-white! py-2 sm:py-2.5"
                />
              </StyledInputContainer>
              <Button variant="colored" subVariant="dark-blue" className="h-auto py-2 sm:py-2.5 px-4" onClick={() => handleAddTag(skills, setSkills, newSkill, setNewSkill)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((tag, i) => (
                <Badge key={i} variant="blue" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(skills, setSkills, i)} className="text-white/80 hover:text-white cursor-pointer pl-1 leading-none">×</button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Interests</Text>
            <div className="flex gap-2">
              <StyledInputContainer>
                <Input 
                  value={newInterest} 
                  onChange={(e) => setNewInterest(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(interests, setInterests, newInterest, setNewInterest))}
                  placeholder="e.g. Public Speaking"
                  containerClassName={inputBaseStyles}
                  className="text-white! py-2 sm:py-2.5"
                />
              </StyledInputContainer>
              <Button variant="colored" subVariant="dark-blue" className="h-auto py-2 sm:py-2.5 px-4" onClick={() => handleAddTag(interests, setInterests, newInterest, setNewInterest)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag, i) => (
                <Badge key={i} variant="blue" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(interests, setInterests, i)} className="text-white/80 hover:text-white cursor-pointer pl-1 leading-none">×</button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2 flex flex-col">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Tech Stack / Tools</Text>
            <div className="flex gap-2">
              <StyledInputContainer>
                <Input 
                  value={newTool} 
                  onChange={(e) => setNewTool(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag(tools, setTools, newTool, setNewTool))}
                  placeholder="e.g. VS Code"
                  containerClassName={inputBaseStyles}
                  className="text-white! py-2 sm:py-2.5"
                />
              </StyledInputContainer>
              <Button variant="colored" subVariant="dark-blue" className="h-auto py-2 sm:py-2.5 px-4" onClick={() => handleAddTag(tools, setTools, newTool, setNewTool)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tag, i) => (
                <Badge key={i} variant="blue" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tools, setTools, i)} className="text-white/80 hover:text-white cursor-pointer pl-1 leading-none">×</button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800/80">
            <Button variant="ghost" className="h-auto py-2 sm:py-2.5 px-6" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="colored" subVariant="blue" className="h-auto py-2 sm:py-2.5 px-6" onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
        </div>
      </Modal>
      )}
    </section>
  );
}
