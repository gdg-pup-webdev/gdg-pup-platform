import { PointEntry } from "./domain/TransactionRecord";
import { ConsumePointsFromUser } from "./useCases/ConsumePointsFromUser";
import { GetOneTransaction } from "./useCases/GetOneTransaction";
import { GetUserWallet } from "./useCases/GetUserWallet";
import { GivePointsToUser } from "./useCases/GivePointsToUser";
import { ListUserTransactions } from "./useCases/ListUserTransactions";

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

  async givePoints(userId: string, entries: PointEntry[]) {
    const { wallet, transaction } = await this.givePointsUseCase.execute(
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
}
