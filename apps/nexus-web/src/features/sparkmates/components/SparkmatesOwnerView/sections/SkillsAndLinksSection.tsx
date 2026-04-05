import type { ReactNode } from "react";
import { Badge, Button, Text, Modal, Input } from "@packages/spark-ui";
import { UserProfile, useUpdateSparkmateProfile } from "@/features/sparkmates";
import { editIcon } from "../icons/editIcon";
import { addIcon } from "../icons/addIcon";
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
        <OtherLinksCard links={profile.otherLinks ?? []} onOpenExternal={(url) => {window.open( url, '_blank');}} />
      </div>

      {profile.technicalSkills?.length === 0 &&
      profile.learningInterests?.length === 0 &&
      profile.toolsAndTechnologies?.length === 0 &&
      profile.otherLinks?.length === 0 ? (
        <Button
          variant="outline"
          className="w-full border-white/25 bg-white/5 text-white"
          iconLeft={addIcon}
          onClick={() => setIsEditModalOpen(true)}
        >
          Add Skills and Interests
        </Button>
      ) : null}

      <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} scrollBehavior="inside" size="sm" className="bg-[#091734] text-white border border-white/10">
        <div className="space-y-6">
          <div>
            <Text variant="heading-6" weight="bold" className="text-white">Manage Skills and Interests</Text>
            <Text variant="body-sm" className="text-zinc-400 mt-1">
              Add technical skills, learning interests, and tools you're proficient in to showcase your expertise.
            </Text>
          </div>
          
          <div className="space-y-2">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Technical Skills</Text>
            <div className="flex gap-2">
              <Input 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)} 
                placeholder="React, Node.js, etc."
                containerClassName="bg-white/5 border-white/10"
                className="bg-transparent text-white placeholder:text-white/40"
              />
              <Button variant="default" onClick={() => handleAddTag(skills, setSkills, newSkill, setNewSkill)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((tag, i) => (
                <Badge key={i} className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(skills, setSkills, i)} className="hover:text-red-400 cursor-pointer pl-1">×</button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Learning Interests</Text>
            <div className="flex gap-2">
              <Input 
                value={newInterest} 
                onChange={(e) => setNewInterest(e.target.value)} 
                placeholder="AI, Blockchain, etc."
                containerClassName="bg-white/5 border-white/10"
                className="bg-transparent text-white placeholder:text-white/40"
              />
              <Button variant="default" onClick={() => handleAddTag(interests, setInterests, newInterest, setNewInterest)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {interests.map((tag, i) => (
                <Badge key={i} className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(interests, setInterests, i)} className="hover:text-red-400 cursor-pointer pl-1">×</button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Text variant="body-sm" className="text-zinc-300 font-medium">Tools & Technologies</Text>
            <div className="flex gap-2">
              <Input 
                value={newTool} 
                onChange={(e) => setNewTool(e.target.value)} 
                placeholder="VS Code, Docker, etc."
                containerClassName="bg-white/5 border-white/10"
                className="bg-transparent text-white placeholder:text-white/40"
              />
              <Button variant="default" onClick={() => handleAddTag(tools, setTools, newTool, setNewTool)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tools.map((tag, i) => (
                <Badge key={i} className="flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tools, setTools, i)} className="hover:text-red-400 cursor-pointer pl-1">×</button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
