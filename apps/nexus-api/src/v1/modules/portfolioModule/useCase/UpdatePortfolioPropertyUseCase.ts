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

    let profileImageUrl: string | null = null;

    if (
      updates.profileImage &&
      typeof updates.profileImage !== "string" &&
      (updates.profileImage as PortfolioFile).buffer
    ) {
      // If there's an existing profile image, we should probably delete it
      if (portfolio.props.profileImage) {
        await this.storage.deleteFile(portfolio.props.profileImage);
      }

      // upload the new one
      const uploaded = await this.storage.uploadFile(
        updates.profileImage as PortfolioFile,
      );
      profileImageUrl = uploaded.publicUrl;
    }

    portfolio.update({
      ...updates,
      profileImage: profileImageUrl,
    });

    return this.portfolioRepository.persistUpdates(portfolio);
  }
}
