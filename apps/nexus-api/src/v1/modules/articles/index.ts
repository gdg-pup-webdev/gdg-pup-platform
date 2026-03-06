 import { ArticleController } from "./ArticleController";
import { SupabaseArticleRepository, SupabaseArticleCommentRepository } from "./infrastructure/SupabaseRepositories";
import { 
  CreateArticle, GetOneArticle, ListArticles, UpdateArticle, DeleteArticle, 
  CreateArticleComment, ListArticleComments, DeleteArticleComment 
} from "./useCases/ArticleUseCases";

// 1. Adapters
const articleRepo = new SupabaseArticleRepository();
const commentRepo = new SupabaseArticleCommentRepository();

// 2. Use Cases
const createUC = new CreateArticle(articleRepo);
const getOneUC = new GetOneArticle(articleRepo);
const listUC = new ListArticles(articleRepo);
const updateUC = new UpdateArticle(articleRepo);
const deleteUC = new DeleteArticle(articleRepo);
const createCommentUC = new CreateArticleComment(commentRepo);
const listCommentsUC = new ListArticleComments(commentRepo);
const deleteCommentUC = new DeleteArticleComment(commentRepo);

// 3. Controller
export const articleController = new ArticleController(
  createUC, getOneUC, listUC, updateUC, deleteUC, 
  createCommentUC, listCommentsUC, deleteCommentUC
);
