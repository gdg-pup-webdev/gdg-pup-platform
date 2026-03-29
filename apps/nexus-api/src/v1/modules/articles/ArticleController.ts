 
import { CreateArticle, CreateArticleInput } from "./useCases/CreateArticle";
import { UpdateHighlight, UpdateArticleInputProps } from "./useCases/UpdateArticle";
import { DeleteArticle } from "./useCases/DeleteArticle";
import { GetOneArticle } from "./useCases/GetOneArticle";
import { ListArticles } from "./useCases/ListArticle";

export class ArticlesController {
  constructor(
    private readonly createHighlightUseCase: CreateArticle,
    private readonly updateHighlightUseCase: UpdateHighlight,
    private readonly deleteHighlightUseCase: DeleteArticle,
    private readonly getOneHighlightUseCase: GetOneArticle,
    private readonly listHighlightsUseCase: ListArticles,
  ) {}

  async create(input: CreateArticleInput) {
    const result = await this.createHighlightUseCase.execute(input);
    return {
      ...result.props,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
    };
  }

  async update(id: string, input: UpdateArticleInputProps) {
    const result = await this.updateHighlightUseCase.execute(id, input);
    return {
      ...result.props,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
    };
  }

  async delete(id: string) {
    await this.deleteHighlightUseCase.execute(id);
    return true;
  }

  async getOne(id: string) {
    const result = await this.getOneHighlightUseCase.execute(id);
    return {
      ...result.props,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
    };
  }

  async list(pageNumber: number, pageSize: number, eventId?: string) {
    const { list, count } = await this.listHighlightsUseCase.execute(
      pageNumber,
      pageSize,
      eventId,
    );
    return {
      list: list.map((item) => ({
        ...item.props,
        createdAt: item.props.createdAt.toISOString(),
        updatedAt: item.props.updatedAt.toISOString(),
      })),
      count,
    };
  }
}
