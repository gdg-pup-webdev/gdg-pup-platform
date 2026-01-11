import { Models } from "@packages/nexus-api-contracts";
import {
  TransactionRepository,
  transactionRepositoryInstance,
} from "./transaction.repository.js";
import { WalletService, walletServiceInstance } from "./wallet.service.js";
import { ServerError } from "../../classes/ServerError.js";
import { PostgrestError } from "@supabase/supabase-js";

export class TransactionService {
  constructor(
    private walletService: WalletService = walletServiceInstance,
    private transactionRepository: TransactionRepository = transactionRepositoryInstance
  ) {}

  listTransactionsOfUser = async (userId: string) => {
    const { data: userWallet, error: walletError } =
      await this.walletService.getWalletByUserId(userId);
    if (walletError) {
      return { error: walletError };
    }

    if (!userWallet) {
      throw ServerError.notFound("Wallet not found.");
    }

    const { data: walletTransactions, error: transactionsError } =
      await this.transactionRepository.listTransactionsByWalletId(
        userWallet.id
      );

    if (transactionsError) {
      return { error: transactionsError };
    }

    return { data: walletTransactions };
  };

  create = async (dto: Models.economySystem.transaction.insertDTO) => {
    const { data, error } =
      await this.transactionRepository.createTransaction(dto);

    if (error instanceof PostgrestError) {
      // sure ka na supabase error. pede mo pa inarrow down dito check mo kung table doesnot exist or foreign key violation or constraint violation or whatever
      throw ServerError.internalError("something about supabase error");
    }

    if (error) {
      // unknown error. return lang yung error then let the caller handle it
      // di ka sure anong error. basta may error. handler na ang maghahandle.
      return { error };
    }

    if (!data) {
      // data doesnt exist meaning sure ka na not found error to. 
      throw ServerError.internalError("Failed to create transaction record.");
    }


    return { data };
  };
}

export const transactionServiceInstance = new TransactionService();
