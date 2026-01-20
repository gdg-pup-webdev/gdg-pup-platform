import { models } from "@packages/nexus-api-contracts";
import {
  ArticleRepository,
  articleRepositoryInstance,
} from "./article.repository.js";
import { tryCatch } from "@/utils/tryCatch.util.js";
import { RepositoryError } from "@/classes/ServerError.js";

type insertDTO = models.articleSystem.article.insertDTO;
type updateDTO = models.articleSystem.article.updateDTO;
type commentInserDTO = models.articleSystem.comment.insertDTO;
type commentUpdateDTO = models.articleSystem.comment.updateDTO;

export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository = articleRepositoryInstance,
  ) {}

  create = async (dto: insertDTO, userId: string) => {
    const { data, error } = await tryCatch(
      async () =>
        await this.articleRepository.create({
          ...dto,
          author_id: userId,
        }),
      "creating article",
    );

    if (error) throw new RepositoryError(error.message);

    return data;
  };

  list = async () => {
    const { data, error } = await tryCatch(
      async () => await this.articleRepository.list(),
      "listing articles",
    );
    if (error) throw new RepositoryError(error.message);

    return data;
  };

  getOne = async (articleId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.articleRepository.getOne(articleId),
      "getting article",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  update = async (articleId: string, dto: updateDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.articleRepository.update(articleId, dto),
      "updateing article",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  delete = async (articleId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.articleRepository.delete(articleId),
      "deleting article",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  listComments = async (articleId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.articleRepository.listComments(articleId),
      "listing comments",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  createComment = async (dto: commentInserDTO) => {
    const { data, error } = await tryCatch(
      async () => await this.articleRepository.createComment(dto),
      "creating comment",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };

  deleteComment = async (commentId: string) => {
    const { data, error } = await tryCatch(
      async () => await this.articleRepository.deleteComment(commentId),
      "deleting comment",
    );
    if (error) throw new RepositoryError(error.message);
    return data;
  };
}

export const articleServiceInstance = new ArticleService();
