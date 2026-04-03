import { cz } from "@packages/typed-rest/shared";

/**
 * A single point-type entry within a transaction
 */
export const PointEntry = cz.object({
  pointType: cz.string(),
  amount: cz.number(),
});

/**
 * A transaction record returned from the API
 */
export const WalletTransactionObject = cz.object({
  transactionId: cz.string(),
  date: cz.string(),
  entries: cz.array(PointEntry),
});

/**
 * User wallet response
 */
export const WalletObject = cz.object({
  userId: cz.string(),
  totalPoints: cz.number(),
  /** Dynamic dictionary of pointType -> balance */
  points: cz.record(cz.string(), cz.number()),
  updatedAt: cz.string(),
});

/**
 * Wallet + transaction pair returned after a point operation
 */
export const PointsOperationResult = cz.object({
  transaction: WalletTransactionObject,
  wallet: WalletObject,
});

/**
 * Request body for givePoints / consumePoints
 */
export const PointsOperationDTO = cz.object({
  entries: cz.array(
    cz.object({
      pointType: cz.string(),
      amount: cz.number().positive(),
    }),
  ),
});
