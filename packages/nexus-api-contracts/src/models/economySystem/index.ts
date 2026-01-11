import { TransactionModels } from "./transaction.js";
import { WalletModels } from "./wallet.js";

export namespace EconomySystemModels {
  export import transaction = TransactionModels;
  export import wallet = WalletModels;
}
