 

export type NfcVisitProps = {
    cardId: string; 
    date: string;
    userAgent: string | null;
};

export class NfcVisit {
  private _props: NfcVisitProps;

  private constructor(props: NfcVisitProps) {
    this._props = props;
  }

  static create(props: NfcVisitProps): NfcVisit {
    return new NfcVisit(props);
  }

  static hydrate(props: NfcVisitProps): NfcVisit {
    return new NfcVisit(props);
  }


  get props(): NfcVisitProps {
    return this._props;
  }

}
