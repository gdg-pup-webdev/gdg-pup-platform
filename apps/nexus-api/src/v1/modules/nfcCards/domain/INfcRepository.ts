import {
  BulkRegisterCard,
  NfcCard,
  NfcCardStatus,
  VisitSource,
} from "./NfcCard";
import { NfcVisit } from "./NfcVisit";

export abstract class INfcRepository {

  abstract findByGdgid(gdgId: string): Promise<NfcCard | null>;

  abstract listCardsByGdgId(gdgId: string): Promise<NfcCard[]>;
  abstract findById(cardId: string): Promise<NfcCard>;

  abstract saveCard(card: NfcCard): Promise<boolean>;

  abstract saveCardsBulk(cards: Array<NfcCard>): Promise<BulkRegisterCard>;

  abstract persistUpdates(card: NfcCard): Promise<boolean>;
}
