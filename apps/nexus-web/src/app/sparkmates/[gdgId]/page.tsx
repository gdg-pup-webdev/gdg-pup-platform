"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { 
  type SparkmatesSource,
} from "@/features/sparkmates";
import { ProfilePublicView } from "@/features/sparkmates/components/SparkmatesPublicView/ProfilePublicView";
import { useNfcCard } from "@/features/nfc-cards/hooks/useNfcCard"; 
import { ProfileLoadingState } from "@/features/sparkmates/components/ProfileLoadingState";

function normalizeSource(raw: string | null): SparkmatesSource {
  if (raw === "nfc_card" || raw === "qr_code" || raw === "direct_link") {
    return raw;
  }

  return "direct_link";
}

export default function SparkmatesPage({
  params,
}: {
  params: Promise<{ gdgId: string }>;
}) {
  const { gdgId } = React.use(params);
  const searchParams = useSearchParams();
  const source = normalizeSource(searchParams.get("source"));

  const { data, isLoading, isError, error } = useNfcCard(gdgId);

  const notactivated =
    source === "nfc_card" && data && data.status !== "activated";

  if (isLoading) return <ProfileLoadingState />;

  return (
    <ProfilePublicView
      gdgId={gdgId}
      source={source}
      nfcCard={data ?? null}
      isNfcActivationRequired={!!notactivated}
    />
  );
}
