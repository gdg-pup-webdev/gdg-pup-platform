import {
  EventHighlightInsertProps,
  EventHighlightUpdateProps,
} from "./domain/EventHighlight";
import { CreateHighlight } from "./useCases/CreateHighlight";
import { UpdateHighlight } from "./useCases/UpdateHighlight";
import { DeleteHighlight } from "./useCases/DeleteHighlight";
import { GetOneHighlight } from "./useCases/GetOneHighlight";
import { ListHighlights } from "./useCases/ListHighlights";

export class EventHighlightsController {
  constructor(
    private readonly createHighlightUseCase: CreateHighlight,
    private readonly updateHighlightUseCase: UpdateHighlight,
    private readonly deleteHighlightUseCase: DeleteHighlight,
    private readonly getOneHighlightUseCase: GetOneHighlight,
    private readonly listHighlightsUseCase: ListHighlights,
  ) {}

  async createHighlight(props: EventHighlightInsertProps) {
    const result = await this.createHighlightUseCase.execute(props);
    return {
      ...result.props,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
    };
  }

  async updateHighlight(id: string, props: EventHighlightUpdateProps) {
    const result = await this.updateHighlightUseCase.execute(id, props);
    return {
      ...result.props,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
    };
  }

  async deleteHighlight(id: string) {
    await this.deleteHighlightUseCase.execute(id);
    return true;
  }

  async getOneHighlight(id: string) {
    const result = await this.getOneHighlightUseCase.execute(id);
    return {
      ...result.props,
      createdAt: result.props.createdAt.toISOString(),
      updatedAt: result.props.updatedAt.toISOString(),
    };
  }

  async listHighlights(pageNumber: number, pageSize: number, eventId?: string) {
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
