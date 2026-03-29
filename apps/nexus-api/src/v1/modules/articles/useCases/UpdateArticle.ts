import { Article, ArticleUpdateProps } from "../domain/Article";
import { IArticleRepo } from "../domain/IArticleRepo";
import { FileToUpload, IStorageService } from "../domain/IStorageService";

 
export type UpdateArticleInputProps = ArticleUpdateProps & {
  thumbnailImage?: FileToUpload;
};

export class UpdateHighlight {
  constructor(
    private readonly repo: IArticleRepo,
    private readonly storage: IStorageService,
  ) {}

  async execute(id: string, input: UpdateArticleInputProps): Promise<Article> {
    const highlight = await this.repo.findById(id);
    if (!highlight) {
      throw new Error("Highlight not found");
    }

    const { thumbnailImage, ...props } = input;

    let imageUrl = props.imageUrl;

    if (thumbnailImage) {
      if (highlight.props.imageUrl) {
        await this.storage.deleteFile(highlight.props.imageUrl);
      }
      const uploaded = await this.storage.uploadFile(thumbnailImage);
      imageUrl = uploaded.publicUrl;
    }

    highlight.update({
      ...props,
      imageUrl: imageUrl ?? highlight.props.imageUrl,
    });
    return await this.repo.persistUpdates(highlight);
  }
}
