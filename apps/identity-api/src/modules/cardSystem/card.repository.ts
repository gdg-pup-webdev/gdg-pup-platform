import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js"; 
import { RepositoryResult } from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";


type cardRow = Tables<"nfc_card">;
type cardInsertDTO = TablesInsert<"nfc_card">;
type cardUpdateDTO = TablesUpdate<"nfc_card">;

type transactionInsertDTO = TablesInsert<"nfc_card_transaction">;

export class CardRepository {
  tableName = "nfc_card";

  constructor() {}

  create = async (dto: cardInsertDTO) : RepositoryResult<cardRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);

    return data;
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
    const transaction: transactionInsertDTO = {
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
