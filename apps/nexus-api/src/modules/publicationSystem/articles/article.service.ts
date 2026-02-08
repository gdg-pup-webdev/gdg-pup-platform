import { models } from "@packages/nexus-api-contracts";
import {
  ArticleRepository,
  articleRepositoryInstance,
} from "./article.repository.js";

type insertDTO = models.publicationSystem.article.insert;
type updateDTO = models.publicationSystem.article.update;
type commentInserDTO = models.publicationSystem.articleComment.insertDTO;
type commentUpdateDTO = models.publicationSystem.articleComment.updateDTO;

export class ArticleService {
  constructor(
    private readonly articleRepository: ArticleRepository = articleRepositoryInstance,
  ) {}

  create = async (dto: insertDTO, userId: string) => {
    return await this.articleRepository.create({
      ...dto,
      author_id: userId,
    });
  };

  list = async () => {
    return await this.articleRepository.list();
  };

  getOne = async (articleId: string) => {
    return await this.articleRepository.getOne(articleId);
  };

  update = async (articleId: string, dto: updateDTO) => {
    return await this.articleRepository.update(articleId, dto);
  };

  delete = async (articleId: string) => {
    return await this.articleRepository.delete(articleId);
  };

  listComments = async (articleId: string) => {
    return await this.articleRepository.listComments(articleId);
  };

  createComment = async (dto: commentInserDTO) => {
    return await this.articleRepository.createComment(dto);
  };

  deleteComment = async (commentId: string) => {
    return await this.articleRepository.deleteComment(commentId);
  };
}

export const articleServiceInstance = new ArticleService();
