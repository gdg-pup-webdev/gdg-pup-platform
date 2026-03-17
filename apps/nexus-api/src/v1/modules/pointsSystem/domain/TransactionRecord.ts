/**
 * TransactionRecord Domain Entity
 *
 * A TransactionRecord captures the details of a single point-change event.
 * Each transaction stores an array of point entries so that a single
 * operation can credit/debit multiple point types atomically.
 */

/** One line-item inside a transaction (pointType + amount) */
export type PointEntry = {
  pointType: string;
  amount: number;
};

export type TransactionRecordProps = {
  id: string;
  userId: string;
  createdAt: string;
  /** All point-type changes that belong to this transaction */
  entries: PointEntry[];
};

/**
 * The prototype is passed to the repository's saveNew method.
 * It omits auto-generated fields (id, createdAt).
 */
export type TransactionRecordPrototypeProps = Omit<
  TransactionRecordProps,
  "id" | "createdAt"
>;

export class TransactionRecord {
  private _props: TransactionRecordProps;

  private constructor(props: TransactionRecordProps) {
    this._props = props;
  }

  get props(): TransactionRecordProps {
    return this._props;
  }

  static hydrate(props: TransactionRecordProps): TransactionRecord {
    return new TransactionRecord(props);
  }
}

export class TransactionRecordPrototype {
  props: TransactionRecordPrototypeProps;

  constructor(props: TransactionRecordPrototypeProps) {
    this.props = props;
  }
}
