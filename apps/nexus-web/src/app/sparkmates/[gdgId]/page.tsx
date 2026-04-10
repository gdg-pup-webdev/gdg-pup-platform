"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SparkmatesPortfolio,
  type SparkmatesSource,
} from "@/features/sparkmates";
import { ProfilePublicView } from "@/features/sparkmates/components/SparkmatesPublicView/ProfilePublicView";
import { useNfcCard } from "@/features/nfc-cards/hooks/useNfcCard";
import { LoadingState } from "@/features/user-profile";
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
  const router = useRouter();

  const { data, isLoading, isError, error } = useNfcCard(gdgId);

  const notactivated =
    source === "nfc_card" && data && data.status !== "activated";

  useEffect(() => {
    if (notactivated) {
      router.push(
        `/nfc-cards/${data.id}/activate?redirect=/sparkmates/${gdgId}`,
      );
    }
  }, [data, source]);

  if (isLoading) return <ProfileLoadingState />;

  if (notactivated) return <ProfileLoadingState />;

  return <ProfilePublicView gdgId={gdgId} source={source} />;
}
