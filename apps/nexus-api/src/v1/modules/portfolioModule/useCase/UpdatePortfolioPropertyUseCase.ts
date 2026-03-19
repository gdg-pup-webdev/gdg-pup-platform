import { NotFoundError } from "@/v1/errors/HttpError";
import { IPortfolioRepository } from "../domain/IPortfolioRepository";
import { Portfolio, PortfolioUpdateProps } from "../domain/Portfolio";
import { IPortfolioStorage, PortfolioFile } from "../domain/IPortfolioStorage";

export class UpdatePortfolioPropertyUseCase {
  constructor(
    private readonly portfolioRepository: IPortfolioRepository,
    private readonly storage: IPortfolioStorage,
  ) {}

  async execute(
    portfolioId: string,
    updates: PortfolioUpdateProps & {
      profileImage?: PortfolioFile;
    },
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found.");
    }

    if (updates.profileImage && updates.profileImage.buffer) {
      // If there's an existing profile image, we should probably delete it
      // But for now, let's just upload the new one
      const uploaded = await this.storage.uploadFile(updates.profileImage);
      (updates as any).profileImage = uploaded.publicUrl;
    }

    portfolio.update(updates as any);

    return this.portfolioRepository.persistUpdates(portfolio);
  }
}
