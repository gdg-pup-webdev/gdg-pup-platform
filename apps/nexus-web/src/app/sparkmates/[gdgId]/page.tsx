"use client";

import { useParams, useSearchParams } from "next/navigation";
import { type SparkmatesSource } from "@/features/sparkmates";
import { ProfilePublicView } from "@/features/sparkmates/components/SparkmatesPublicView/ProfilePublicView";
import { ProfileLoadingState } from "@/features/sparkmates/components/ProfileLoadingState";
import { useNfcCard } from "@/features/nfc-cards/hooks/useNfcCard";

function normalizeSource(raw: string | null): SparkmatesSource {
  if (raw === "nfc_card" || raw === "qr_code" || raw === "direct_link") {
    return raw;
  }

  return "direct_link";
}

export default function SparkmatesPage() {
  const params = useParams<{ gdgId: string }>();
  const gdgId = params?.gdgId ?? "";
  const searchParams = useSearchParams();
  const source = normalizeSource(searchParams.get("source"));

  if (source === "nfc_card") {
    // we separate the nfc card component so we don't have to fetch nfc card if source is not nfc card
    return <ProfilePublicViewWithNfcCardCheck gdgId={gdgId} />;
  }

  return (
    <ProfilePublicView
      gdgId={gdgId}
      source={source}
      nfcCard={null}
      isNfcActivationRequired={false}
    />
  );
}

function ProfilePublicViewWithNfcCardCheck({ gdgId }: { gdgId: string }) {
  const { data, isLoading, error } = useNfcCard(gdgId);

  const cardActivated = data?.status === "activated";

  if (isLoading) return <ProfileLoadingState />;

  // console.log("rendering with nfc card source", { cardActivated, nfcdata });
  return (
    <ProfilePublicView
      gdgId={gdgId}
      source={"nfc_card"}
      nfcCard={data ?? null}
      isNfcActivationRequired={!cardActivated}
    />
  );
}
