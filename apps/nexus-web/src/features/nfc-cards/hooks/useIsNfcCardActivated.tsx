import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useNfcCard } from "./useNfcCard";
import { useEffect } from "react";

export const useIsNfcCardActivated = () => {
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
      return router.push(`/sparkmates/${cardData.ownerGdgId}?source=nfc-card`);
    }
  }, [cardData, error]);
};
