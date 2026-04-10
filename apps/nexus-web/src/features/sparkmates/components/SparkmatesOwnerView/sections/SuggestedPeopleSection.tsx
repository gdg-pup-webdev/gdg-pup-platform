import { Input, Button, Text } from "@packages/spark-ui";
import React, { useState } from "react";
import { ConnectedSuggestedCard } from "../components/ConnectedSuggestedCard";
import { FadeInSection } from "../components/FadeInSection";
import { searchIcon } from "../icons/searchIcon";
import { viewIcon } from "../icons/viewIcon";
import { useSuggestedSparkmates } from "@/features/sparkmates/hooks";
import { UserProfile } from "@/features/sparkmates/types";

export const SuggestedPeopleSection = ({
  profile,
}: {
  profile: UserProfile;
}) => {
  const [search, setSearch] = useState("");

  const suggestedUsers = useSuggestedSparkmates({
    search,
    viewerGdgId: profile?.gdgId,
  });

  return (
    <FadeInSection delay={0.1}>
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search"
        leftIcon={searchIcon}
        containerClassName="h-9 border-white/20 bg-black/20"
        className="text-white placeholder:text-[#C1C7CD]"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Text variant="body-lg" className="text-white">
          Suggested To You
        </Text>
        <Button
          variant="default"
          size="sm"
          iconRight={viewIcon}
          className="text-white"
        >
          View All
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        {suggestedUsers.map((member) => (
          <ConnectedSuggestedCard
            key={member.gdgId}
            avatarUrl={member.avatarUrl ?? undefined}
            name={member.name}
            bio={member.bio}
            gdgId={member.gdgId}
          />
        ))}

        {suggestedUsers.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
            <Text variant="body-sm" className="text-[#C1C7CD]">
              No matches found.
            </Text>
          </div>
        ) : null}
      </div>
    </FadeInSection>
  );
};
