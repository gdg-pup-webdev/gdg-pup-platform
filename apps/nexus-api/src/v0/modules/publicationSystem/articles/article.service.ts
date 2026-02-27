import { models } from "@packages/nexus-api-contracts";
import {
  ArticleRepository,
  articleRepositoryInstance,
} from "./article.repository.js";
import {
  TablesInsert,
  TablesUpdate,
} from "@/v0/types/supabase.types.js";

type insertDTO = TablesInsert<"article">;
type updateDTO = TablesUpdate<"article">;
type commentInserDTO = TablesInsert<"article_comment">;
type commentUpdateDTO = TablesUpdate<"article_comment">;

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
