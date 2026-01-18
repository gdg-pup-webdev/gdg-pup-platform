import { Models } from "@packages/nexus-api-contracts/models";
import {
  ArticleRepository,
  articleRepositoryInstance,
} from "./article.repository.js";

export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository = articleRepositoryInstance
  ) {}

  create = async (
    dto: Omit<Models.articleSystem.article.insertDTO, "author_id">,
    userId: string
  ) => {
    const { data, error } = await this.articleRepository.create({
      ...dto,
      author_id: userId,
    });
    if (error) {
      return { error };
    }
    return { data };
  };

  list = async () => {
    const { data, error } = await this.articleRepository.list();
    if (error) {
      return { error };
    }
    return { data: { listData: data, count: data?.length || 0 } };
  };

  getOne = async (articleId: string) => {
    const { data, error } = await this.articleRepository.getOne(articleId);
    if (error) {
      return { error };
    }
    return { data };
  };

  update = async (
    articleId: string,
    dto: Models.articleSystem.article.updateDTO
  ) => {
    const { data, error } = await this.articleRepository.update(
      articleId,
      dto
    );
    if (error) {
      return { error };
    }
    return { data };
  };

  delete = async (articleId: string) => {
    const { data, error } = await this.articleRepository.delete(articleId);
    if (error) {
      return { error };
    }
    return { data };
  };

  listComments = async (articleId: string) => {
    const { data, error } = await this.articleRepository.listComments(articleId);
    if (error) {
      return { error };
    }
    return { data: { listData: data, count: data?.length || 0 } };
  };

  createComment = async (dto: Models.articleSystem.comment.insertDTO) => {
    const { data, error } = await this.articleRepository.createComment(dto);
    if (error) {
      return { error };
    }
    return { data };
  };

  deleteComment = async (commentId: string) => {
    const { data, error } = await this.articleRepository.deleteComment(commentId);
    if (error) {
      return { error };
    }
    return { data };
  };
}

export const articleServiceInstance = new ArticleService();
