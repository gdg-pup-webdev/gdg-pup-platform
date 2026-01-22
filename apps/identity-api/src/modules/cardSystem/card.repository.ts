import { supabase } from "@/lib/supabase.js";
import { Models } from "@packages/identity-api-contracts/models";

export class CardRepository {
  constructor() {}

  create = async (dto: Models.cardSystem.CardModels.insertDTO) => {
    const { data, error } = await supabase
      .from("nfc_card")
      .insert(dto)
      .select("*")
      .single();
    if (error) {
      return { error };
    }
    return { data };
  };

  getCardByUid = async (uid: string) => {
    const { data, error } = await supabase
      .from("nfc_card")
      .select("*")
      .eq("id", uid)
      .maybeSingle();

    if (error) {
      return { error };
    }
    return { data };
  };

  activateCard = async (cardUid: string, userId: string) => {
    const { data, error } = await supabase
      .from("nfc_card")
      .update({
        status: "ACTIVE",
        user_id: userId,
        activated_at: new Date().toISOString(),
      })
      .eq("id", cardUid)
      .select()
      .single();

    if (error) {
      return { error };
    }
    return { data };
  };

  logTransaction = async (
    cardId: string,
    eventType: "ACTIVATION" | "TAP_PROFILE" | "TAP_CHECKIN",
    meta: any = {}
  ) => {
    const transaction: Models.cardSystem.CardTransactionModels.insertDTO = {
      card_id: cardId,
      event_type: eventType,
      metadata: meta,
    };

    const { data, error } = await supabase
      .from("nfc_card_transaction")
      .insert(transaction);

    if (error) {
      return { error };
    }
    return { data };
  };
}

export const cardRepositoryInstance = new CardRepository();
