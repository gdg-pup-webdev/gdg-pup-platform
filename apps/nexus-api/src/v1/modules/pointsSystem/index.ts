import { PointSystemController } from "./PointSystemController.js";
import { SupabaseTransactionRepository } from "./infrastructure/SupabaseTransactionRepository.js";
import { SupabaseWalletRepository } from "./infrastructure/SupabaseWalletRepository.js";
import { ConsumePointsFromUser } from "./useCases/ConsumePointsFromUser.js";
import { GetOneTransaction } from "./useCases/GetOneTransaction.js";
import { GetUserWallet } from "./useCases/GetUserWallet.js";
import { GivePointsToUser } from "./useCases/GivePointsToUser.js";
import { ListUserTransactions } from "./useCases/ListUserTransactions.js";
import { TakePointsFromUser } from "./useCases/TakePointsFromUser.js";

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
const takePointsFromUserUseCase = new TakePointsFromUser(walletRepository, transactionRepository);

export const pointSystemController = new PointSystemController(
  getOneTransactionUseCase,
  getUserWalletUseCase,
  givePointsUseCase,
  listUserTransactionsUseCase,
  consumePointsUseCase,
  takePointsFromUserUseCase,
);

export * from "./PointSystemController.js";
