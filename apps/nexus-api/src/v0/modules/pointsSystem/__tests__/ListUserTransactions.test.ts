import { describe, expect, it, beforeEach } from "vitest";
import { MockTransactionRepository } from "../infrastructure/MockTransactionRepository";
import { ListUserTransactions } from "../useCases/ListUserTransactions";
import { TransactionRecordPrototype } from "../domain/TransactionRecord";

let transactionRepository: MockTransactionRepository;
let listUserTransactionsUseCase: ListUserTransactions;

const initializeInstances = () => {
  transactionRepository = new MockTransactionRepository();
  listUserTransactionsUseCase = new ListUserTransactions(transactionRepository);
};

describe("ListUserTransactions Use Case", () => {
  beforeEach(initializeInstances);

  it("should return a paginated list of transactions for a specific user", async () => {
    // 1. Arrange: Seed multiple transactions for one user
    const userId = "user_1";
    const otherUser = "user_2";

    // Create 3 transactions for user_1
    for (let i = 1; i <= 3; i++) {
      await transactionRepository.savePrototype(new TransactionRecordPrototype({
        userId,
        pointsChange: 10 * i,
        pointsType: "sparkPoints",
        sourceReference: `ref_${i}`,
        sourceType: "TEST",
      }));
    }

    // Create 1 transaction for user_2 (should be filtered out)
    await transactionRepository.savePrototype(new TransactionRecordPrototype({
      userId: otherUser,
      pointsChange: 50,
      pointsType: "webdevPoints",
      sourceReference: "ref_other",
      sourceType: "TEST",
    }));

    // 2. Act: Request first page with size 2
    const result = await listUserTransactionsUseCase.execute(1, 2, userId);

    // 3. Assert
    expect(result.list).toHaveLength(2); // Page size was 2
    expect(result.count).toBe(3);        // Total count for user_1 is 3
    expect(result.list.every(t => t.props.userId === userId)).toBe(true);
  });

  it("should return the second page of transactions correctly", async () => {
    // 1. Arrange: Seed 3 transactions
    const userId = "user_page_test";
    for (let i = 1; i <= 3; i++) {
      await transactionRepository.savePrototype(new TransactionRecordPrototype({
        userId,
        pointsChange: i,
        pointsType: "sparkPoints",
        sourceReference: `ref_${i}`,
        sourceType: "TEST",
      }));
    }

    // 2. Act: Request page 2 with size 2
    const result = await listUserTransactionsUseCase.execute(2, 2, userId);

    // 3. Assert
    expect(result.list).toHaveLength(1); // Only 1 item left for the second page
    expect(result.count).toBe(3);
  });

  it("should return an empty list if the user has no transactions", async () => {
    // 1. Act
    const result = await listUserTransactionsUseCase.execute(1, 10, "empty_user");

    // 2. Assert
    expect(result.list).toHaveLength(0);
    expect(result.count).toBe(0);
  });
});