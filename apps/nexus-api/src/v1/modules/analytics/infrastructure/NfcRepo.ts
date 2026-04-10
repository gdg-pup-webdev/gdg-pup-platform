import { supabase } from "@/v1/lib/supabase";
import { INfcRepo } from "../domain/INfcRepo";

export class NfcRepo implements INfcRepo {
  async getNfcIdByGdgId(gdgId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("nfc_cards")
      .select("id")
      .eq("gdg_id", gdgId)
      .maybeSingle();
    if (error) {
      throw new Error(error.message);
    }
    return data?.id ?? null;
  }
}
