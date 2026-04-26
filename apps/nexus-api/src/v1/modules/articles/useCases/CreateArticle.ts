import { Article, ArticleInsertProps } from "../domain/Article";
import { IArticleRepo } from "../domain/IArticleRepo";
import { IEventService } from "../domain/IEventService";
import { FileToUpload, IStorageService } from "../domain/IStorageService";
import { IUserService } from "../domain/IUserService";

export type CreateArticleInput = ArticleInsertProps & {
  thumbnailImage?: FileToUpload;
};

export class CreateArticle {
  constructor(
    private readonly repo: IArticleRepo,
    private readonly userService: IUserService,
    private readonly eventService: IEventService,
    private readonly storage: IStorageService,
  ) {}

  async execute(input: CreateArticleInput): Promise<Article> {
    const { thumbnailImage, ...props } = input;

    if (
      !props.title ||
      !props.description ||
      !props.content
    ) {
      throw new Error("Title, description, and content are required.");
    }

    if (props.authorId) {
      const userExists = await this.userService.exists(props.authorId);
      if (!userExists) {
        console.log("User does not exist", props.authorId);
        throw new Error("Author does not exist");
      }
    }

    if (props.eventId) {
      const eventExists = await this.eventService.exists(props.eventId);
      if (!eventExists) {
        throw new Error("Event does not exist");
      }
    }

    let imageUrl = props.imageUrl;

    if (thumbnailImage) {
      const uploaded = await this.storage.uploadFile(thumbnailImage);
      imageUrl = uploaded.publicUrl;
    }

    const highlight = Article.create({
      ...props,
      imageUrl,
    });

    return await this.repo.saveNew(highlight);
  }
}
