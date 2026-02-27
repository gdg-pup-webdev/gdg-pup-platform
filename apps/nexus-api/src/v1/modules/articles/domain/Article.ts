export type ArticleProps = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: Date;
};

export type ArticleInsertProps = Omit<ArticleProps, "id" | "createdAt">;
export type ArticleUpdateProps = Partial<Omit<ArticleProps, "id" | "authorId" | "createdAt">>;

export class Article {
  _props: ArticleProps;

  constructor(props: ArticleProps) {
    this._props = props;
  }

  static create = (props: ArticleInsertProps) => {
    return new Article({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  };

  static hydrate = (props: ArticleProps) => {
    return new Article(props);
  };

  get props() {
    return this._props;
  }

  update = (props: ArticleUpdateProps) => {
    this._props = { ...this._props, ...props };
  };
}