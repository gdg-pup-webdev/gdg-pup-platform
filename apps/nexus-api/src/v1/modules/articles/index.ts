import { CreateArticle } from "./useCases/CreateArticle";
import { UpdateHighlight } from "./useCases/UpdateArticle";
import { DeleteArticle } from "./useCases/DeleteArticle";
import { GetOneArticle } from "./useCases/GetOneArticle";
import { ListArticles } from "./useCases/ListArticle";
import { UserAdapter } from "./infrastructure/UserAdapter";
import { EventAdapter } from "./infrastructure/EventAdapter";
import { ArticlesController } from "./ArticleController";

// External dependencies (Will be injected or used from other modules)
import { eventSystemController } from "../eventSystem";
import { filesModuleController } from "../filesModule";
import { StorageAdapter } from "./infrastructure/StorageAdapter";
import { ArticleRepository } from "./infrastructure/ArticleRepo";
import { gdgMembersController } from "../members";

const articleRepo = new ArticleRepository();
const userServiceAdapter = new UserAdapter(gdgMembersController);
const eventServiceAdapter = new EventAdapter(eventSystemController);
const storageAdapter = new StorageAdapter(filesModuleController);

// Initialize Use Cases
const createUC = new CreateArticle(
  articleRepo,
  userServiceAdapter,
  eventServiceAdapter,
  storageAdapter,
);
const updateUC = new UpdateHighlight(articleRepo, storageAdapter);
const deleteUC = new DeleteArticle(articleRepo);
const getOneUC = new GetOneArticle(articleRepo);
const listUC = new ListArticles(articleRepo);

// Initialize Controller
export const articlesController = new ArticlesController(
  createUC,
  updateUC,
  deleteUC,
  getOneUC,
  listUC,
);
