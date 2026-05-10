import { Input, Button, Text } from "@packages/spark-ui";
import React, { useState } from "react";
import Link from "next/link";
import { ConnectedSuggestedCard } from "../SparkmatesOwnerView/components/ConnectedSuggestedCard";
import { FadeInSection } from "../SparkmatesOwnerView/components/FadeInSection";
import { searchIcon } from "../SparkmatesOwnerView/icons/searchIcon";
import { viewIcon } from "../SparkmatesOwnerView/icons/viewIcon";
import { useSuggestedSparkmates } from "@/features/sparkmates/hooks";
import { UserProfile } from "@/features/sparkmates/types";
import { useSearchMember } from "@/features/sparkmates/hooks/useSearchMember";
import { GdgLoader } from "@/components/ui/loader";

export const SuggestedPeopleSection = ({}: {
  profile: UserProfile;
  readOnly?: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [trueSearch, setTrueSearch] = useState("");
  const [viewingSearchResults, setViewingSearchResults] = useState(false);

  const { data, isLoading } = useSuggestedSparkmates();

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

  const getSuggestedBio = (bio?: string | null) => {
    const trimmedBio = bio?.trim();
    return trimmedBio ? trimmedBio : "No description yet.";
  };

  return (
    <FadeInSection delay={0.1} className="min-w-0">
      <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:flex-nowrap">
        <div className="min-w-0 flex-1 basis-full sm:basis-auto">
          <div className="rainbow-border-animated-hover w-full rounded-lg bg-white/20 p-px">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              leftIcon={searchIcon}
              containerClassName="h-9 border-none bg-black/20 transition-colors group-hover:bg-[#050F22] group-focus-within:bg-[#050F22]"
              className="text-white placeholder:text-[#C1C7CD]"
            />
          </div>
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
        <Link prefetch={false} href="/sparkmates/network">
          <Button
            variant="default"
            size="sm"
            iconRight={viewIcon}
            className="px-3 py-1 text-white"
          >
            View All
          </Button>
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {viewingSearchResults && (
          <>
            {searchData?.data.map((member) => (
              <ConnectedSuggestedCard
                key={member.gdgId}
                avatarUrl={member.avatarUrl ?? undefined}
                name={member.displayName || member.firstName || member.gdgId}
                bio={getSuggestedBio(member.bio)}
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
            {isLoading ? (
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="inline-flex items-center gap-2 text-[#C1C7CD]">
                  <GdgLoader size="xs" />
                  <Text variant="body-sm" className="text-[#C1C7CD]">
                    Loading suggestions...
                  </Text>
                </div>
              </div>
            ) : (
              suggestedUsers.map((member) => (
                <ConnectedSuggestedCard
                  key={member.gdgId}
                  avatarUrl={member.avatarUrl ?? undefined}
                  name={member.displayName || member.firstName || member.gdgId}
                  bio={getSuggestedBio(member.bio)}
                  gdgId={member.gdgId}
                />
              ))
            )}

            {suggestedUsers.length === 0 && !isLoading ? (
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
