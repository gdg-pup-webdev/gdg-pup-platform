import { Button, Text } from "@packages/spark-ui";
import React from "react";
import { viewIcon } from "../icons/viewIcon";
import { UserProfile } from "@/features/sparkmates";
import { ComingSoonPlaceholder } from "../../ComingSoonPlaceholder";

export const ImpactSection = ({ profile }: { profile: UserProfile }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <Text variant="heading-6" gradient="white-blue" weight="bold">
          GDG Impact
        </Text>
        {/* <Button
          variant="default"
          size="sm"
          className="text-white"
          iconRight={viewIcon}
        >
          View
        </Button> */}
      </div>
      {/* <Text variant="body-sm" className="text-[#C1C7CD]">
        Track your milestones and growth within GDG.
      </Text>
      <div className="grid grid-cols-3 gap-4">
        {["Study Jam", "Workshop", "Hackathon"].map((label) => (
          <div
            key={label}
            className="rounded-2xl border border-white/20 bg-[rgba(255,255,255,0.04)] px-5 py-6 shadow-[inset_0px_4px_16px_rgba(255,255,255,0.25)]"
          >
            <Text
              variant="heading-5"
              align="center"
              gradient="white-yellow"
              weight="bold"
            >
              00
            </Text>
            <Text variant="body-sm" align="center" className="text-white">
              {label}
            </Text>
          </div>
        ))}
      </div> */}
      <ComingSoonPlaceholder />
    </section>
  );
};
