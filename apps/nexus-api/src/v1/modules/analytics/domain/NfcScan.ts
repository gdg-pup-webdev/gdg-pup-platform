export type NfcScanProps = {
  id: string;
  date: string;
  nfcCardId: string;
  scanContext: string | null;
  scannerId: string | null;
};

export type NfcScanInsertProps = Omit<NfcScanProps, "id" | "date">;

export class NfcScan {
  private _props: NfcScanProps;

  get props() {
    return this._props;
  }

  private constructor(props: NfcScanProps) {
    this._props = props;
  }

  static create(props: NfcScanInsertProps) {
    return new NfcScan({
      ...props,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    });
  }

  static hydrate(props: NfcScanProps) {
    return new NfcScan(props);
  }
}


