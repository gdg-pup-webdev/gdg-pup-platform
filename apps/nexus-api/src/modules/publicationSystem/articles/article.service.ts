import { models } from "@packages/nexus-api-contracts";
import {
  ArticleRepository,
  articleRepositoryInstance,
} from "./article.repository.js";
import { tryCatch_deprecated } from "@/utils/tryCatch.util.js";
import { RepositoryError_DEPRECATED } from "@/classes/ServerError.js";

type insertDTO = models.publicationSystem.article.insert;
type updateDTO = models.publicationSystem.article.update;
type commentInserDTO = models.publicationSystem.articleComment.insertDTO;
type commentUpdateDTO = models.publicationSystem.articleComment.updateDTO;

export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository = articleRepositoryInstance,
  ) {}

  create = async (dto: insertDTO, userId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () =>
        await this.articleRepository.create({
          ...dto,
          author_id: userId,
        }),
      "creating article",
    );

    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  list = async () => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.articleRepository.list(),
      "listing articles",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);

    return data;
  };

  getOne = async (articleId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.articleRepository.getOne(articleId),
      "getting article",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  update = async (articleId: string, dto: updateDTO) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.articleRepository.update(articleId, dto),
      "updateing article",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  delete = async (articleId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.articleRepository.delete(articleId),
      "deleting article",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  listComments = async (articleId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.articleRepository.listComments(articleId),
      "listing comments",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  createComment = async (dto: commentInserDTO) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.articleRepository.createComment(dto),
      "creating comment",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };

  deleteComment = async (commentId: string) => {
    const { data, error } = await tryCatch_deprecated(
      async () => await this.articleRepository.deleteComment(commentId),
      "deleting comment",
    );
    if (error) throw new RepositoryError_DEPRECATED(error.message);
    return data;
  };
}

export const articleServiceInstance = new ArticleService();
