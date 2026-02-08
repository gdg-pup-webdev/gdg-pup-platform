import { DatabaseError } from "@/classes/ServerError.js";
import { supabase } from "@/lib/supabase.js";
import {
  RepositoryResult,
  RepositoryResultList,
} from "@/types/repository.types.js";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types.js";

type cardRow = Tables<"nfc_card">;
type cardInsertDTO = TablesInsert<"nfc_card">;
type cardUpdateDTO = TablesUpdate<"nfc_card">;

type transactionRow = Tables<"nfc_card_transaction">;
type transactionInsertDTO = TablesInsert<"nfc_card_transaction">;

export class CardRepository {
  tableName = "nfc_card";
  transactionTableName = "nfc_card_transaction";

  constructor() {}

  create = async (dto: cardInsertDTO): RepositoryResult<cardRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(dto)
      .select("*")
      .single();
    if (error) throw new DatabaseError(error.message);

    return data;
  };

  getCardByUid = async (uid: string): RepositoryResult<cardRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*")
      .eq("id", uid)
      .maybeSingle();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  activateCard = async (
    cardUid: string,
    userId: string,
  ): RepositoryResult<cardRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({
        status: "ACTIVE",
        user_id: userId,
        activated_at: new Date().toISOString(),
      })
      .eq("id", cardUid)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);

    return data;
  };

  logTransaction = async (
    cardId: string,
    eventType: "ACTIVATION" | "TAP_PROFILE" | "TAP_CHECKIN",
    meta: any = {},
  ): RepositoryResult<transactionRow> => {
    const transaction: transactionInsertDTO = {
      card_id: cardId,
      event_type: eventType,
      metadata: meta,
    };

    const { data, error } = await supabase
      .from(this.transactionTableName)
      .insert(transaction)
      .select("*")
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  };

  listCards = async (
    pageNumber: number,
    pageSize: number,
  ): RepositoryResultList<cardRow> => {
    const { data, error } = await supabase
      .from(this.tableName)
      .select("*", { count: "exact" })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);

    if (error) throw new DatabaseError(error.message);

    const { count, error: countError } = await supabase
      .from(this.tableName)
      .select("id", { count: "exact", head: true })
      .range((pageNumber - 1) * pageSize, pageNumber * pageSize - 1);

    if (countError) throw new DatabaseError(countError.message);

    return {
      list: data || [],
      count: count || 0,
    };
  };
}

export const cardRepositoryInstance = new CardRepository();
