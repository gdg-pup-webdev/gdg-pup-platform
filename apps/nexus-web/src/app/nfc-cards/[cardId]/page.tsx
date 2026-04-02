"use client";

import { useNfcCard } from "@/features/nfc-cards/hooks/useNfcCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const NfcPage = () => {
  const { cardId } = useParams();
  const router = useRouter();
  const { data: cardData, isLoading, error } = useNfcCard(cardId as string);
 

  useEffect(() => {
    if (isLoading || error || !cardData) return;

    if (cardData.status !== "activated") {
      console.log("Card is not activated. Redirecting to activation page.");
      return router.push(`/nfc-cards/${cardId}/activate`);
    }

    if (cardData.destinationUrl) {
      return router.push(cardData.destinationUrl);
    } else {
      return router.push(`/sparkmates/${cardData.ownerGdgId}`);
    }
  }, [cardData, error]);

  return <></>; 
};

export default NfcPage;
