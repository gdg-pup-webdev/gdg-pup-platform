import { GetOneTransaction } from "./useCases/GetOneTransaction";
import { GetUserWallet } from "./useCases/GetUserWallet";
import { GivePointsToUser } from "./useCases/GivePointsToUser";
import { ListUserTransactions } from "./useCases/ListUserTransactions";
import { TakePointsFromUser } from "./useCases/TakePointsFromUser";

export class PointSystemController {
  constructor(
    private getOneTransactionUseCase: GetOneTransaction,
    private getUserWalletUseCase: GetUserWallet,
    private givePointsToUserUseCase: GivePointsToUser,
    private listUserTransactionsUseCase: ListUserTransactions,
    private takePointsFromUserUseCase: TakePointsFromUser,
  ) {}

  async getOneTransaction(transactionId: string) {
    const result = await this.getOneTransactionUseCase.execute(transactionId);

    if (!result) return null;

    return {
      id: result.props.id,
      createdAt: result.props.createdAt,
      amount: result.props.pointsChange,
      pointsType: result.props.pointsType,
      sourceReference: result.props.sourceReference,
      sourceType: result.props.sourceType,
      userId: result.props.userId,
    };
  }

  async getUserWallet(userId: string) {
    const result = await this.getUserWalletUseCase.execute(userId);

    if (!result) return null;

    return {
      updatedAt: result.props.updatedAt,
      points: result.props.points,
      totalPoints: result.props.totalPoints,
    };
  }

  async givePointsToUser(
    userId: string,
    pointsType: string,
    points: number,
    sourceReference: string,
    sourceType: string,
  ) {
    const result = await this.givePointsToUserUseCase.execute(
      userId,
      pointsType,
      points,
      sourceReference,
      sourceType,
    );

    if (!result) return null;

    return {
      updatedAt: result.updatedWallet.props.updatedAt,
      points: result.updatedWallet.props.points,
      totalPoints: result.updatedWallet.props.totalPoints,
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

    return {
      list: result.list.map((transaction) => ({
        id: transaction.props.id,
        createdAt: transaction.props.createdAt,
        amount: transaction.props.pointsChange,
        pointsType: transaction.props.pointsType,
        sourceReference: transaction.props.sourceReference,
        sourceType: transaction.props.sourceType,
        userId: transaction.props.userId,
      })),
      count: result.count,
    };
  }

  async takePointsFromUser(
    userId: string,
    pointsType: string,
    points: number,
    sourceReference: string,
    sourceType: string,
  ) {
    const result = await this.takePointsFromUserUseCase.execute(
      userId,
      pointsType,
      points,
      sourceReference,
      sourceType,
    );

    return {
      updatedAt: result.updatedWallet.props.updatedAt,
      points: result.updatedWallet.props.points,
      totalPoints: result.updatedWallet.props.totalPoints,
    };
  }
}
