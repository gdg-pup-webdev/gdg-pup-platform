import { describe, it, expect, beforeEach } from "vitest";
import { GetOneTransaction } from "../../useCases/GetOneTransaction";
import { MockTransactionRepository } from "../../infrastructure/MockTransactionRepository";
import { TransactionRecord } from "../../domain/TransactionRecord";

describe("GetOneTransaction Use Case", () => {
  let txRepo: MockTransactionRepository;
  let useCase: GetOneTransaction;

  beforeEach(() => {
    txRepo = new MockTransactionRepository();
    useCase = new GetOneTransaction(txRepo);
  });

  it("should return the transaction when found", async () => {
    const tx = TransactionRecord.hydrate({
      id: "tx-123",
      userId: "user-1",
      createdAt: new Date().toISOString(),
      entries: [{ pointType: "sparkPoints", amount: 50 }],
    });
    txRepo.__seed(tx);

    const result = await useCase.execute("tx-123");
    expect(result).not.toBeNull();
    expect(result!.props.id).toBe("tx-123");
  });

  it("should return null when the transaction is not found", async () => {
    const result = await useCase.execute("nonexistent");
    expect(result).toBeNull();
  });
});
