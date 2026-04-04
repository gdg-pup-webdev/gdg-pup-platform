import { Button, ShineBorder, Text } from "@packages/spark-ui";
import { profile } from "console";
import React, { useState } from "react";
import { Divider } from "../components/Divider";
import { ProjectCard } from "../components/ProjectCard";
import { addIcon } from "../icons/addIcon";
import { editIcon } from "../icons/editIcon"; 
import { UserProfile } from "@/features/sparkmates";
import { getLinkHostname } from "../utils/getLinkHostname";
import { ProjectsSection } from "./ProjectsSection";
import { ImpactSection } from "./ImpactSection";
import { BadgesSection } from "./BadgesSection";

export const CustomButtonsSection = ({ profile }: { profile: UserProfile }) => {
  const [starredCustomButtons, setStarredCustomButtons] = useState<Set<number>>(
    () => new Set([0]),
  );

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
              <div className="flex items-start justify-between">
                <div>
                  <Text
                    variant="body-lg"
                    className="text-white"
                    weight="medium"
                  >
                    {item.title}
                  </Text>
                  <Text variant="body" className="text-[#E5E5E5]">
                    {item.url}
                  </Text>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-white"
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
        <Button variant="dashed-outline" className="w-full" iconLeft={addIcon}>
          Add Custom Buttons
        </Button>
      </section>

      
    
  );
};
