export type TransactionRecordProps = {
  id: string;
  createdAt: string;

  pointsChange: number;
  pointsType: string;
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

export  class TransactionRecordPrototype {
  props: TransactionRecordPrototypeProps;
  constructor(props: TransactionRecordPrototypeProps) {
    this.props = props;
  }
}
