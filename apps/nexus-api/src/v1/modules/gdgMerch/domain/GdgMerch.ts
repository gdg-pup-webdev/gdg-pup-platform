export type GdgMerchProps = {
  id: string;
  name: string;
  image: string;
  points: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};

export type GdgMerchInsertProps = Omit<GdgMerchProps, "id" | "createdAt" | "updatedAt">;

export type GdgMerchUpdateProps = Partial<Omit<GdgMerchProps, "id" | "stock" | "createdAt" | "updatedAt">>;

export class GdgMerch {
  private _props: GdgMerchProps;

  private constructor(props: GdgMerchProps) {
    this._props = props;
  }

  static create(props: GdgMerchInsertProps): GdgMerch {
    return new GdgMerch({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static hydrate(props: GdgMerchProps): GdgMerch {
    return new GdgMerch(props);
  }

  get props(): GdgMerchProps {
    return this._props;
  }

  updateInfo(props: GdgMerchUpdateProps): void {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }

  restock(amount: number): void {
    if (amount <= 0) {
      throw new Error("Restock amount must be greater than zero.");
    }
    this._props.stock += amount;
    this._props.updatedAt = new Date();
  }

  consumeStock(amount: number): void {
    if (amount <= 0) {
      throw new Error("Consume amount must be greater than zero.");
    }
    if (this._props.stock < amount) {
      throw new Error("Not enough stock.");
    }
    this._props.stock -= amount;
    this._props.updatedAt = new Date();
  }
}
