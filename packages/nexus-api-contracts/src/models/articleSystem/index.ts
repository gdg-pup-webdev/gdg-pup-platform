import { ArticleModels } from "./article.model.js";
import { ArticleCommentModels } from "./comment.model.js";

export namespace ArticleSystemModels {
  export import article = ArticleModels;
  export import comment = ArticleCommentModels;
}

