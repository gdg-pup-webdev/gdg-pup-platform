import { supabase } from "@/v1/lib/supabase";
import { INfcRepo } from "../domain/INfcRepo";
import { nfcCardsModuleController } from "../../nfcCards";

export class NfcRepo implements INfcRepo {
  async getNfcIdByGdgId(gdgId: string): Promise<string | null> {
    try {
      const data = await nfcCardsModuleController.getCardByGdgId(gdgId);
      return data?.id;
    } catch (error) {
      return null;
    }
  }
}
