import { PointEntry } from "./domain/TransactionRecord.js";
import { ConsumePointsFromUser } from "./useCases/ConsumePointsFromUser.js";
import { GetOneTransaction } from "./useCases/GetOneTransaction.js";
import { GetUserWallet } from "./useCases/GetUserWallet.js";
import { GivePointsToUser } from "./useCases/GivePointsToUser.js";
import { ListUserTransactions } from "./useCases/ListUserTransactions.js";
import { TakePointsFromUser } from "./useCases/TakePointsFromUser.js";

/**
 * PointSystemController
 *
 * Application-layer controller. Adapts rich domain objects into
 * simple plain-object DTOs suitable for the presentation (HTTP) layer.
 */
export class PointSystemController {
  constructor(
    private readonly getOneTransactionUseCase: GetOneTransaction,
    private readonly getUserWalletUseCase: GetUserWallet,
    private readonly givePointsUseCase: GivePointsToUser,
    private readonly listUserTransactionsUseCase: ListUserTransactions,
    private readonly consumePointsUseCase: ConsumePointsFromUser,
    private readonly takePointsFromUserUseCase: TakePointsFromUser,
  ) {}

  // ── Wallet ────────────────────────────────────────────────────────────────

  async getWallet(userId: string) {
    const wallet = await this.getUserWalletUseCase.execute(userId);
    if (!wallet) return null;

    return {
      userId: wallet.props.userId,
      totalPoints: wallet.props.totalPoints,
      points: wallet.props.points,
      updatedAt: wallet.props.updatedAt,
    };
  }

  // ── Transactions ──────────────────────────────────────────────────────────

  async getTransaction(transactionId: string) {
    const tx = await this.getOneTransactionUseCase.execute(transactionId);
    if (!tx) return null;

    return {
      transactionId: tx.props.id,
      userId: tx.props.userId,
      date: tx.props.createdAt,
      entries: tx.props.entries,
    };
  }

  async getHistory(userId: string, pageNumber: number, pageSize: number) {
    const result = await this.listUserTransactionsUseCase.execute(
      userId,
      pageNumber,
      pageSize,
    );

    return {
      list: result.list.map((tx) => ({
        transactionId: tx.props.id,
        date: tx.props.createdAt,
        entries: tx.props.entries,
      })),
      count: result.count,
    };
  }

  // ── Point Operations ──────────────────────────────────────────────────────

  async givePoints(
    userId: string,
    entries: PointEntry[],
    sourceReference?: string,
    sourceType?: string,
  ) {
    const { wallet, transaction } = await this.givePointsUseCase.execute(
      userId,
      entries,
      sourceReference,
      sourceType,
    );

    return {
      transaction: {
        transactionId: transaction.props.id,
        date: transaction.props.createdAt,
        entries: transaction.props.entries,
      },
      wallet: {
        userId: wallet.props.userId,
        totalPoints: wallet.props.totalPoints,
        points: wallet.props.points,
        updatedAt: wallet.props.updatedAt,
      },
    };
  }

  async consumePoints(userId: string, entries: PointEntry[]) {
    const { wallet, transaction } = await this.consumePointsUseCase.execute(
      userId,
      entries,
    );

    return {
      transaction: {
        transactionId: transaction.props.id,
        date: transaction.props.createdAt,
        entries: transaction.props.entries,
      },
      wallet: {
        userId: wallet.props.userId,
        totalPoints: wallet.props.totalPoints,
        points: wallet.props.points,
        updatedAt: wallet.props.updatedAt,
      },
    };
  }

  async givePointsToUser(
    userId: string,
    pointType: string,
    amount: number,
    sourceReference?: string,
    sourceType?: string,
  ) {
    return this.givePoints(userId, [{ pointType, amount }], sourceReference, sourceType);
  }

  async takePointsFromUser(
    userId: string,
    pointType: string,
    amount: number,
    reason: string,
    sourceType: string,
  ) {
    const result = await this.takePointsFromUserUseCase.execute(
      userId,
      pointType,
      amount,
      reason,
      sourceType,
    );

    return {
      transaction: {
        transactionId: result.transactionRecord.props.id,
        date: result.transactionRecord.props.createdAt,
        entries: result.transactionRecord.props.entries,
      },
      wallet: {
        userId: result.updatedWallet.props.userId,
        totalPoints: result.updatedWallet.props.totalPoints,
        points: result.updatedWallet.props.points,
        updatedAt: result.updatedWallet.props.updatedAt,
      },
    };
  }
}
