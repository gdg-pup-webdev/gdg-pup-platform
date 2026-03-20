"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { SparkmatesPortfolio, type SparkmatesSource } from "@/features/sparkmates";

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

  return <SparkmatesPortfolio gdgId={gdgId} source={source} />;
}
