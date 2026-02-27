import {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/v0/presentation/types/supabase.types";

export type TransactionRowType = Tables<"wallet_transaction">;

export type TransactionInsert = TablesInsert<"wallet_transaction">;

export type TransactionUpdate = TablesUpdate<"wallet_transaction">;
