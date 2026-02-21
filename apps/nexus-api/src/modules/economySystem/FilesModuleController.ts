import { GetOneTransaction } from "./useCases/GetOneTransaction";
import { GetUserWallet } from "./useCases/GetUserWallet";
import { GivePointsToUser } from "./useCases/givePointsToUser";
import { ListUserTransactions } from "./useCases/ListUserTransactions";
import { TakePointsFromUser } from "./useCases/takePointsFromUser";

export class FilesModuleController {
  constructor(
    private getOneTransactionUseCase: GetOneTransaction,
    private getUserWalletUseCase: GetUserWallet,
    private givePointsToUserUseCase: GivePointsToUser,
    private listUserTransactionsUseCase: ListUserTransactions,
    private takePointsFromUserUseCase: TakePointsFromUser,
  ) {}

  async getOneTransaction(id: string) {
    const result = await this.getOneTransactionUseCase.execute(id);

    if (!result) return null;

    return {
      id: result.props.id, 
      createdAt: result.props.createdAt, 
      amount: result.props.amount,
      sourceReference: result.props.sourceReference,
      sourceType: result.props.sourceType,
      walletId: result.props.walletId,
    };
  }

  async getUserWallet(userId: string) {
    const result = await this.getUserWalletUseCase.execute(userId);

    if (!result) return null;

    return {  
      updatedAt: result.props.updatedAt, 
      points: result.props.points,
      totalPoints: result.props.totalPoints,
      userId: result.props.userId,
    };
  }

  async givePointsToUser(userId: string, pointsType: string, points: number) {
    const result = await this.givePointsToUserUseCase.execute(
      userId,
      pointsType,
      points,
    );

    if (!result) return null;

    return {  
      updatedAt: result.props.updatedAt, 
      points: result.props.points,
      totalPoints: result.props.totalPoints,
      userId: result.props.userId,
    };
  }

  async listUserTransactions(
    pageNumber: number,
    pageSize: number,
    userId: string,
  ) {
    const result = await this.listUserTransactionsUseCase.execute(
      pageNumber,
      pageSize,
      userId,
    );

    return result;
  }

  async takePointsFromUser(userId: string, pointsType: string, points: number) {
    const result = await this.takePointsFromUserUseCase.execute(
      userId,
      pointsType,
      points,
    );

    return result;
  }
}
