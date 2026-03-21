import { EventHighlightUpdateProps, EventHighlight } from "../domain/EventHighlight";
import { IEventHighlightRepository } from "../domain/IEventHighlightRepository";
import { IEventHighlightStorage, EventHighlightFile } from "../domain/IEventHighlightStorage";

export type UpdateHighlightInputProps = EventHighlightUpdateProps & {
  thumbnailImage?: EventHighlightFile;
};

export class UpdateHighlight {
  constructor(
    private readonly repo: IEventHighlightRepository,
    private readonly storage: IEventHighlightStorage,
  ) {}

  async execute(id: string, input: UpdateHighlightInputProps): Promise<EventHighlight> {
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
