export type TransactionRecordProps = {
  id: string;
  createdAt: string;

  amount: number;
  sourceReference: string;
  sourceType: string;
  userId: string;
};

export type TransactionRecordPrototypeProps = Omit<
  TransactionRecordProps,
  "id" | "createdAt"
>;

export abstract class TransactionRecord {
  props: TransactionRecordProps;
  constructor(props: TransactionRecordProps) {
    this.props = props;
  }
}

export abstract class TransactionRecordPrototype {
  props: TransactionRecordPrototypeProps;
  constructor(props: TransactionRecordPrototypeProps) {
    this.props = props;
  }
}
