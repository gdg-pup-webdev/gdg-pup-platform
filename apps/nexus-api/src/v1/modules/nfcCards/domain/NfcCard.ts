export type VisitSource = "nfc_card" | "qr_code" | "direct_link";

export type NfcCardStatus = "issued" | "activated" | "suspended" | "revoked";

export type NfcCardProps = {
  id: string;
  ownerGdgId: string;
  status: NfcCardStatus;
  notes: string | null;
  destinationUrl: string | null;
  activated_at: string | null;
  suspended_at: string | null;
  revoked_at: string | null;
};

export type BulkRegisterCard = {
  registered: {
    gdgId: string;
  }[];
  failed: {
    gdgId: string;
    error: string;
  }[];
};

export class NfcCard {
  private _props: NfcCardProps;

  private constructor(props: NfcCardProps) {
    this._props = props;
  }

  static create(props: Omit<NfcCardProps, "id" | "destinationUrl" | "activated_at" | "suspended_at" | "revoked_at" | "status"> ): NfcCard { 
    return new NfcCard({
      ...props, 
      id: crypto.randomUUID(), 
      status: "issued",
      destinationUrl: null,
      activated_at: null,
      suspended_at: null,
      revoked_at: null,
    });
  }

  static hydrate(props: NfcCardProps): NfcCard {
    return new NfcCard(props);
  }

  get props(): NfcCardProps {
    return this._props;
  }

  setDestinationUrl(url: string) {
    this._props.destinationUrl = url;
  }

  clearDestinationUrl() {
    this._props.destinationUrl = null;
  }

  activate() {
    if (this._props.status !== "issued") {
      throw new Error(`Cannot activate card with status ${this._props.status}`);
    }
    this._props.status = "activated";
    this._props.activated_at = new Date().toISOString();
  }

  suspend() {
    if (this._props.status !== "activated") {
      throw new Error(`Cannot suspend card with status ${this._props.status}`);
    }
    this._props.status = "suspended";
  }

  revoke() {
    if (this._props.status === "revoked") {
      throw new Error(`Card is already revoked`);
    }
    this._props.status = "revoked";
  }
}
