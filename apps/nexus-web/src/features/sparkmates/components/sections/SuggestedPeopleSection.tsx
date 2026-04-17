import { Input, Button, Text } from "@packages/spark-ui";
import React, { useState } from "react";
import { ConnectedSuggestedCard } from "../SparkmatesOwnerView/components/ConnectedSuggestedCard";
import { FadeInSection } from "../SparkmatesOwnerView/components/FadeInSection";
import { searchIcon } from "../SparkmatesOwnerView/icons/searchIcon";
import { viewIcon } from "../SparkmatesOwnerView/icons/viewIcon";
import { useSuggestedSparkmates } from "@/features/sparkmates/hooks";
import { UserProfile } from "@/features/sparkmates/types";
import { useSearchMember } from "@/features/sparkmates/hooks/useSearchMember";

export const SuggestedPeopleSection = ({
  profile,
  readOnly,
}: {
  profile: UserProfile;
  readOnly?: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [trueSearch, setTrueSearch] = useState("");
  const [viewingSearchResults, setViewingSearchResults] = useState(false);

  const { data, isLoading } = useSuggestedSparkmates({
    search,
    viewerGdgId: profile?.gdgId,
  });

  const suggestedUsers = data?.data || [];

  const { data: searchData } = useSearchMember(trueSearch);

  const handleOnSearch = () => {
    setTrueSearch(search);
    setViewingSearchResults(true);
  };

  const handleClearSearch = () => {
    setSearch("");
    setTrueSearch("");
    setViewingSearchResults(false);
  };

  const handleViewAll = () => {
    setViewingSearchResults(false);
  };

  return (
    <FadeInSection delay={0.1} className="min-w-0">
      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
        <div className="min-w-0 flex-1 basis-full sm:basis-auto">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            leftIcon={searchIcon}
            containerClassName="h-9 border-white/20 bg-black/20"
            className="text-white placeholder:text-[#C1C7CD]"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="px-3 text-[#C1C7CD] hover:bg-white/10 hover:text-white sm:shrink-0"
          onClick={handleClearSearch}
          disabled={!search && !viewingSearchResults && !trueSearch}
        >
          Clear
        </Button>
        <Button
          variant="colored"
          subVariant="blue"
          size="sm"
          className="px-3 sm:shrink-0"
          onClick={handleOnSearch}
          disabled={!search.trim()}
        >
          Search
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <Text variant="body-lg" className="text-white">
          Suggested To You
        </Text>
        <Button
          variant="default"
          size="sm"
          iconRight={viewIcon}
          className="px-3 py-1 text-white"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>

      <div className="mt-5 space-y-4">
        {viewingSearchResults && (
          <>
            {searchData?.data.map((member) => (
              <ConnectedSuggestedCard
                key={member.gdgId}
                avatarUrl={member.avatarUrl ?? undefined}
                name={member.displayName || member.firstName || member.gdgId}
                bio={member.bio || "---"}
                gdgId={member.gdgId}
              />
            ))}

            {searchData?.data.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
                <Text variant="body-sm" className="text-[#C1C7CD]">
                  No matches found.
                </Text>
              </div>
            ) : null}
          </>
        )}

        {!viewingSearchResults && (
          <>
            {suggestedUsers.map((member) => (
              <ConnectedSuggestedCard
                key={member.gdgId}
                avatarUrl={member.avatarUrl ?? undefined}
                name={member.displayName || member.firstName || member.gdgId}
                bio={member.bio || "---"}
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
          </>
        )}
      </div>
    </FadeInSection>
  );
};
