import { NotFoundError } from "@/v1/errors/HttpError";
import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio, PortfolioUpdateProps } from "../domain/Portfolio";
import { IFileRepository } from "../../filesModule/domain/IFileRepository";

export class UpdatePortfolioPropertyUseCase {
  constructor(
    private readonly portfolioRepository: IPortfolioRepository,
    private readonly fileRepository: IFileRepository,
  ) {}

  async execute(
    portfolioId: string,
    updates: PortfolioUpdateProps & {
      profileImage?: { buffer: ArrayBuffer; name: string; type: string };
    },
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);

    if (updates.profileImage && updates.profileImage.buffer) {
      const fileRecord = await this.fileRepository.savePrototype({
        fileName: updates.profileImage.name,
        fileType: updates.profileImage.type,
        buffer: updates.profileImage.buffer,
        folderId: null, // Root or specific folder
      });
      (updates as any).profileImage = fileRecord.previewUrl;
    }

    portfolio.update(updates as any);

    return this.portfolioRepository.persistUpdates(portfolio);
  }
}
