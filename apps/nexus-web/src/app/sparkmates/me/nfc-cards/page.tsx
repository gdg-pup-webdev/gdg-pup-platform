"use client";

import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useSetDestinationUrlMutation } from "@/features/nfc-cards/hooks/useSetDestinationUrlMutation";
import { useUserNfcCards } from "@/features/nfc-cards/hooks/useUserNfcCards";
import React from "react";

const NfcCards = () => {
  const { decodedToken } = useAuthContext();
  const {
    data: nfccards,
    isLoading,
    error,
  } = useUserNfcCards(decodedToken?.memberInfo.gdgId);

  return (
    <>
      <div className="flex flex-col gap-4 w-full min-h-screen items-center justify-center text-white">
        <div>NfcCards</div>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {nfccards && nfccards.length === 0 && <div>No NFC cards found.</div>}
        {nfccards && nfccards.length > 0 && (
          <>
            {nfccards.map((card) => (
              <NfcCardComponent key={card.id} card={card} />
            ))}
          </>
        )}
      </div>
    </>
  );
};

const NfcCardComponent = ({
  card,
}: {
  card: {
    id: string;
    ownerGdgId: string;
    status: string;
    notes: string | null;
    destinationUrl: string | null;
    activated_at: string | null;
    suspended_at: string | null;
    revoked_at: string | null;
  };
}) => {
  const inputref = React.useRef<HTMLInputElement>(null);
  const setDestinationurlMutation = useSetDestinationUrlMutation();

  const handleSetDestinationUrl = () => {
    if (inputref.current) {
      setDestinationurlMutation.mutate({
        cardId: card.id,
        destinationUrl: inputref.current.value,
      });
    }
  };

  return (
    <div className="border-3 p-2" key={card.id}>
      <div>ID: {card.id}</div>
      <div>Owner GDG ID: {card.ownerGdgId}</div>
      <div>Status: {card.status}</div>
      <div>Notes: {card.notes}</div>
      <div>Destination URL: {card.destinationUrl}</div>
      <div>Activated At: {card.activated_at}</div>
      <div>Suspended At: {card.suspended_at}</div>
      <div>Revoked At: {card.revoked_at}</div>

      <input
        ref={inputref}
        type="text"
        placeholder="Enter destination URL"
        className="border p-1"
      />
      <button
        onClick={handleSetDestinationUrl}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={setDestinationurlMutation.isPending}
      >
        {setDestinationurlMutation.isPending
          ? "Updating..."
          : "Set Destination URL"}
      </button>
    </div>
  );
};

export default NfcCards;
