import { describe, it, expect, beforeEach } from "vitest"; 
import { TransactionRecord } from "../domain/TransactionRecord";
import { MockTransactionRepository } from "../infrastructure/MockTransactionRepository";
import { ListUserTransactions } from "../useCases/ListUserTransactions";

describe("ListUserTransactions Use Case", () => {
  let txRepo: MockTransactionRepository;
  let useCase: ListUserTransactions;

  const seedTx = (userId: string, num: number) => {
    for (let i = 0; i < num; i++) {
      const tx = TransactionRecord.hydrate({
        id: `tx-${userId}-${i}`,
        userId,
        createdAt: new Date(Date.now() + i * 1000).toISOString(),
        entries: [{ pointType: "sparkPoints", amount: 10 * (i + 1) }],
      });
      txRepo.__seed(tx);
    }
  };

  beforeEach(() => {
    txRepo = new MockTransactionRepository();
    useCase = new ListUserTransactions(txRepo);
  });

  it("should return an empty list for a user with no transactions", async () => {
    const { list, count } = await useCase.execute("empty-user", 1, 10);
    expect(list).toHaveLength(0);
    expect(count).toBe(0);
  });

  it("should return all transactions on one page", async () => {
    seedTx("user-1", 5);
    const { list, count } = await useCase.execute("user-1", 1, 10);
    expect(list).toHaveLength(5);
    expect(count).toBe(5);
  });

  it("should paginate correctly", async () => {
    seedTx("user-1", 10);
    const page1 = await useCase.execute("user-1", 1, 4);
    const page2 = await useCase.execute("user-1", 2, 4);
    const page3 = await useCase.execute("user-1", 3, 4);

    expect(page1.list).toHaveLength(4);
    expect(page2.list).toHaveLength(4);
    expect(page3.list).toHaveLength(2); // Remaining
    expect(page1.count).toBe(10);
  });

  it("should only return transactions for the requested user", async () => {
    seedTx("user-1", 5);
    seedTx("user-2", 3);

    const { list, count } = await useCase.execute("user-2", 1, 10);
    expect(count).toBe(3);
    list.forEach((tx: TransactionRecord) => expect(tx.props.userId).toBe("user-2"));
  });

  it("should return empty list when page exceeds available records", async () => {
    seedTx("user-1", 3);
    const { list, count } = await useCase.execute("user-1", 5, 10);
    expect(list).toHaveLength(0);
    expect(count).toBe(3);
  });
});
