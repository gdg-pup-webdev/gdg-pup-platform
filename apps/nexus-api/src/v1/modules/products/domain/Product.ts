export interface ProductProps {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInsertProps {
  name: string;
  description: string;
  category: string;
  image: string;
  link?: string;
}

export interface ProductUpdateProps {
  name?: string;
  description?: string;
  category?: string;
  image?: string;
  link?: string;
}

export class Product {
  private constructor(private _props: ProductProps) {}

  get props(): ProductProps {
    return this._props;
  }

  static create(insertProps: ProductInsertProps): Product {
    const now = new Date();
    return new Product({
      id: crypto.randomUUID(),
      name: insertProps.name,
      description: insertProps.description,
      category: insertProps.category,
      image: insertProps.image,
      link: insertProps.link,
      createdAt: now,
      updatedAt: now,
    });
  }

  static hydrate(props: ProductProps): Product {
    return new Product(props);
  }

  update(updateProps: ProductUpdateProps): void {
    if (updateProps.name !== undefined) {
      this._props.name = updateProps.name;
    }
    if (updateProps.description !== undefined) {
      this._props.description = updateProps.description;
    }
    if (updateProps.category !== undefined) {
      this._props.category = updateProps.category;
    }
    if (updateProps.image !== undefined) {
      this._props.image = updateProps.image;
    }
    if (updateProps.link !== undefined) {
      this._props.link = updateProps.link;
    }
    this._props.updatedAt = new Date();
  }
}
