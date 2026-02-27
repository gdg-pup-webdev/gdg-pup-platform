import { MockTransactionRepository } from "./infrastructure/MockTransactionRepository";
import { MockWalletRepository } from "./infrastructure/MockWalletRepository";
import { PointSystemController } from "./PointSystemController";
import { GetOneTransaction } from "./useCases/GetOneTransaction";
import { GetUserWallet } from "./useCases/GetUserWallet";
import { GivePointsToUser } from "./useCases/GivePointsToUser";
import { ListUserTransactions } from "./useCases/ListUserTransactions";
import { TakePointsFromUser } from "./useCases/TakePointsFromUser";

/**
 * infrastructure dependencies
 */
const transactionRepository = new MockTransactionRepository();
const walletRepository = new MockWalletRepository();

/**
 * use cases
 */
const getOneTransactionUseCase = new GetOneTransaction(transactionRepository);
const getUserWalletUseCase = new GetUserWallet(walletRepository);
const givePointsToUserUseCase = new GivePointsToUser(
  walletRepository,
  transactionRepository,
);
const listUserTransactionsUseCase = new ListUserTransactions(
  transactionRepository,
);
const takePointsFromUserUseCase = new TakePointsFromUser(
  walletRepository,
  transactionRepository,
);

/**
 * exporting default controller
 */
export const pointSystemController = new PointSystemController(
  getOneTransactionUseCase,
  getUserWalletUseCase,
  givePointsToUserUseCase,
  listUserTransactionsUseCase,
  takePointsFromUserUseCase,
);
export * from "./PointSystemController";
