import { Button, ShineBorder, Text, Modal, Input } from "@packages/spark-ui";
import { profile } from "console";
import React, { useState } from "react";
import { Divider } from "../components/Divider";
import { ProjectCard } from "../components/ProjectCard";
import { addIcon } from "../icons/addIcon";
import { editIcon } from "../icons/editIcon"; 
import { UserProfile, useUpdateSparkmateProfile } from "@/features/sparkmates";
import { getLinkHostname } from "../utils/getLinkHostname";
import { ProjectsSection } from "./ProjectsSection";
import { ImpactSection } from "./ImpactSection";
import { BadgesSection } from "./BadgesSection";

export const CustomButtonsSection = ({ profile }: { profile: UserProfile }) => {
  const [starredCustomButtons, setStarredCustomButtons] = useState<Set<number>>(
    () => new Set([0]),
  );
  const { mutate: updateProfile, isPending } = useUpdateSparkmateProfile(profile.gdgId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [links, setLinks] = useState<string[]>(profile.otherLinks || []);
  const [newLink, setNewLink] = useState("");

  const toggleStar = (index: number) => {
    setStarredCustomButtons((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleAddLink = () => {
    if (newLink && !links.includes(newLink)) {
      setLinks([...links, newLink]);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateProfile({ otherLinks: links }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
      },
    });
  };

  const customLinks = (profile.otherLinks ?? []).map((url) => ({
    title: getLinkHostname(url),
    url,
  }));

  return (
    <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Text variant="heading-6" gradient="white-blue" weight="bold">
            Custom Button
          </Text>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white"
            title="Edit Custom Button"
            aria-label="Edit Custom Button"
            onClick={() => setIsEditModalOpen(true)}
          >
            {editIcon}
          </Button>
        </div>
        <Text variant="body-sm" className="text-[#C1C7CD]">
          Add a custom button that appears on your profile.
        </Text>
        <div className="space-y-2.5">
          {customLinks.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="relative overflow-hidden rounded-2xl border border-white/20 bg-[rgba(255,255,255,0.05)] p-5 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)] transition-[border-color,box-shadow] duration-300"
            >
              <ShineBorder
                borderWidth={1.25}
                duration={9}
                shineColor={["#FB2C36", "#F0B100", "#00C950", "#2B7FFF"]}
                className={
                  starredCustomButtons.has(index)
                    ? "opacity-100 transition-opacity duration-300"
                    : "opacity-0 transition-opacity duration-300"
                }
              />
              <div className="flex items-start justify-between min-w-0">
                <div className="min-w-0 flex-1">
                  <Text
                    variant="body-lg"
                    className="text-white truncate block"
                    weight="medium"
                  >
                    {item.title}
                  </Text>
                  <Text variant="body" className="text-[#E5E5E5] break-all block pr-4">
                    {item.url}
                  </Text>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white shrink-0"
                  onClick={() => toggleStar(index)}
                >
                  {starredCustomButtons.has(index) ? "★" : "☆"}
                </Button>
              </div>
            </div>
          ))}
          {customLinks.length === 0 ? (
            <div className="rounded-2xl border border-white/15 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-center">
              <Text variant="body-sm" className="text-[#C1C7CD]">
                No custom links yet.
              </Text>
            </div>
          ) : null}
        </div>
        <Button 
          variant="dashed-outline" 
          className="w-full" 
          iconLeft={addIcon}
          onClick={() => setIsEditModalOpen(true)}
        >
          Add Custom Buttons
        </Button>

        <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} scrollBehavior="inside" size="sm" className="bg-[#091734] text-white border border-white/10">
          <div className="">
            <div>
              <Text variant="heading-6" weight="bold" className="text-white">Manage Custom Buttons</Text>
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
              <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button variant="default" onClick={handleSave} disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Modal>
      </section>

      
    
  );
};
