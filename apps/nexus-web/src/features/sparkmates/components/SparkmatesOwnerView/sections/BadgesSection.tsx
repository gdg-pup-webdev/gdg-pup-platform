import { Button, Text } from "@packages/spark-ui";
import React from "react";
import { viewIcon } from "../icons/viewIcon"; 
import { UserProfile } from "@/features/sparkmates";
import { ASSETS } from "@/lib/constants/assets";

export const BadgesSection = ({ profile }: { profile: UserProfile }) => {
  const badgeCards = [1, 2, 3];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          Badges
        </Text>
        <Button
          variant="default"
          size="sm"
          className="text-white"
          iconRight={viewIcon}
        >
          View All
        </Button>
      </div>
      <Text variant="body-sm" className="text-[#C1C7CD]">
        Unlock exclusive collectibles by attending events.
      </Text>
      <div className="grid grid-cols-3 gap-4">
        {badgeCards.map((badge) => (
          <div
            key={badge}
            className="rounded-2xl border border-white/20 bg-[rgba(255,255,255,0.04)] p-4 text-center shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]"
          >
            <img
              src={ASSETS.PROFILE.DEFAULT_BADGE}
              alt="Badge"
              className="mx-auto h-20 w-20 object-cover"
            />
            <Text variant="body-sm" className="mt-2 text-white" align="center">
              Badge Name
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
};
