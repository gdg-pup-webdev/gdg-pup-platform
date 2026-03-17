import { PointSystemController } from "./PointSystemController";
import { SupabaseTransactionRepository } from "./infrastructure/SupabaseTransactionRepository";
import { SupabaseWalletRepository } from "./infrastructure/SupabaseWalletRepository";
import { ConsumePointsFromUser } from "./useCases/ConsumePointsFromUser";
import { GetOneTransaction } from "./useCases/GetOneTransaction";
import { GetUserWallet } from "./useCases/GetUserWallet";
import { GivePointsToUser } from "./useCases/GivePointsToUser";
import { ListUserTransactions } from "./useCases/ListUserTransactions";

/**
 * Dependency Injection: wire Supabase infrastructure to use cases,
 * then expose the singleton controller.
 */
const walletRepository = new SupabaseWalletRepository();
const transactionRepository = new SupabaseTransactionRepository();

const getOneTransactionUseCase = new GetOneTransaction(transactionRepository);
const getUserWalletUseCase = new GetUserWallet(walletRepository);
const givePointsUseCase = new GivePointsToUser(walletRepository, transactionRepository);
const listUserTransactionsUseCase = new ListUserTransactions(transactionRepository);
const consumePointsUseCase = new ConsumePointsFromUser(walletRepository, transactionRepository);

export const pointSystemController = new PointSystemController(
  getOneTransactionUseCase,
  getUserWalletUseCase,
  givePointsUseCase,
  listUserTransactionsUseCase,
  consumePointsUseCase,
);

export * from "./PointSystemController";
