export type ArticleProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  published_at: Date | null;
  is_published: boolean; 
  authorId: string | null;
  title: string;
  description: string | null;
  content: string;
  imageUrl?: string;
  eventId: string | null;
};

export type ArticleInsertProps = Omit<
  ArticleProps,
  "id" | "createdAt" | "updatedAt"
>;

export type ArticleUpdateProps = Partial<ArticleInsertProps>;

export class Article {
  private constructor(private _props: ArticleProps) {}

  static hydrate(props: ArticleProps) {
    return new Article(props);
  }

  static create(props: ArticleInsertProps) {
    return new Article({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  get props() {
    return this._props;
  }

  update(props: ArticleUpdateProps) {
    this._props = {
      ...this._props,
      ...props,
      updatedAt: new Date(),
    };
  }
}
