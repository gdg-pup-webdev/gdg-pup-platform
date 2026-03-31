import { handlePostgresError } from "@/v1/lib/supabase.utils";
import { supabase } from "@/v1/lib/supabase";
import { INfcRepository } from "../domain/INfcRepository";
import { BulkRegisterCard, NfcCard } from "../domain/NfcCard";

export class NfcRepository implements INfcRepository {
  private readonly nfcTable = "nfc_cards";

  constructor() {}

  async listCardsByGdgId(gdgId: string): Promise<NfcCard[]> {
    const { data, error } = await supabase
      .from(this.nfcTable)
      .select("*")
      .eq("gdg_id", gdgId) 

    if (error) handlePostgresError(error);

    const cards = data.map((card) => NfcCard.hydrate({
      id: card.id,
      ownerGdgId: card.gdg_id,
      status: card.status,
      notes: card.notes,
      destinationUrl: card.destination_url,
      activated_at: card.activated_at,
      suspended_at: card.suspended_at,
      revoked_at: card.revoked_at,
    }))

    return cards;
  }

  async findById(cardId: string): Promise<NfcCard> {
    const { data, error } = await supabase
      .from(this.nfcTable)
      .select("*")
      .eq("id", cardId)
      .single();

    if (error) handlePostgresError(error);

    return NfcCard.hydrate({
      id: data.id,
      ownerGdgId: data.gdg_id,
      status: data.status,
      notes: data.notes,
      destinationUrl: data.destination_url,
      activated_at: data.activated_at,
      suspended_at: data.suspended_at,
      revoked_at: data.revoked_at,
    });
  }

  async saveCard(card: NfcCard): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.nfcTable)
      .insert({
        id: card.props.id,
        gdg_id: card.props.ownerGdgId,
        status: card.props.status,
        notes: card.props.notes,
      })
      .select()
      .single();

    if (error) handlePostgresError(error);

    return true;
  }

  async saveCardsBulk(cards: Array<NfcCard>): Promise<BulkRegisterCard> {
    const registered: BulkRegisterCard["registered"] = [];
    const failed: BulkRegisterCard["failed"] = [];

    for (const card of cards) {
      try {
        await this.saveCard(card);
        registered.push({
          gdgId: card.props.ownerGdgId,
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected bulk registration error";

        failed.push({
          gdgId: card.props.ownerGdgId,
          error: message,
        });
      }
    }

    return { registered, failed };
  }

  async persistUpdates(card: NfcCard): Promise<boolean> {
    const { data, error } = await supabase
      .from(this.nfcTable)
      .update({
        status: card.props.status,
        notes: card.props.notes,
        destination_url: card.props.destinationUrl,
        activated_at: card.props.activated_at,
        suspended_at: card.props.suspended_at,
        revoked_at: card.props.revoked_at,
      })
      .eq("id", card.props.id)
      .select()
      .single();

    if (error) handlePostgresError(error);

    return true;
  }
}
