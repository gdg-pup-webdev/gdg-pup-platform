export type ArticleCommentProps = {
  id: string;
  articleId: string;
  userId: string;
  body: string;
  createdAt: Date;
};

export type ArticleCommentInsertProps = Omit<ArticleCommentProps, "id" | "createdAt">;

export class ArticleComment {
  _props: ArticleCommentProps;

  constructor(props: ArticleCommentProps) {
    this._props = props;
  }

  static create = (props: ArticleCommentInsertProps) => {
    return new ArticleComment({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  };

  static hydrate = (props: ArticleCommentProps) => {
    return new ArticleComment(props);
  };

  get props() {
    return this._props;
  }
}