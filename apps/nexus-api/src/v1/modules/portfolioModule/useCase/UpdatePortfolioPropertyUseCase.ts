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
    updates: Omit<PortfolioUpdateProps, "profileImage"> & {
      profileImage?: PortfolioFile | string | null;
    },
  ): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);

    if (!portfolio) {
      throw new NotFoundError("Portfolio not found.");
    }

    if (updates.profileImage && typeof updates.profileImage !== "string" && (updates.profileImage as PortfolioFile).buffer) {
      // If there's an existing profile image, we should probably delete it
      // But for now, let's just upload the new one
      const uploaded = await this.storage.uploadFile(updates.profileImage as PortfolioFile);
      (updates as any).profileImage = uploaded.publicUrl;
    }

    portfolio.update(updates as any);

    return this.portfolioRepository.persistUpdates(portfolio);
  }
}
