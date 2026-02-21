import { describe, expect, it, beforeEach } from "vitest";
import { ITransactionRepository } from "../domain/ITransactionRepository";
import { MockTransactionRepository } from "../infrastructure/MockTransactionRepository";
import { GetOneTransaction } from "../useCases/GetOneTransaction";
import { TransactionRecordPrototype } from "../domain/TransactionRecord";

let transactionRepository: ITransactionRepository;
let getOneTransactionUseCase: GetOneTransaction;

const initializeInstances = () => {
  transactionRepository = new MockTransactionRepository();
  getOneTransactionUseCase = new GetOneTransaction(transactionRepository);
};

describe("GetOneTransaction Use Case", () => {
  beforeEach(initializeInstances);

  it("should return the transaction record when a valid ID is provided", async () => {
    // 1. Arrange: Create a transaction to find
    // Using the savePrototype method from our mock to seed data
    const prototype = new TransactionRecordPrototype({
      userId: "user_123",
      pointsChange: 100,
      pointsType: "sparkPoints",
      sourceReference: "event_001",
      sourceType: "STUDY_JAM_ATTENDANCE",
    });
    
    const createdRecord = await transactionRepository.savePrototype(prototype);

    // 2. Act
    const result = await getOneTransactionUseCase.execute(createdRecord.props.id);

    // 3. Assert
    expect(result).not.toBeNull();
    expect(result?.props.id).toBe(createdRecord.props.id);
    expect(result?.props.userId).toBe("user_123");
    expect(result?.props.pointsChange).toBe(100);
  });

  it("should return null if the transaction does not exist", async () => {
    // 1. Act
    const result = await getOneTransactionUseCase.execute("non_existent_id");

    // 2. Assert
    expect(result).toBeNull();
  });

  it("should ensure the returned data matches the persisted prototype data", async () => {
    // Arrange
    const prototypeProps = {
      userId: "user_456",
      pointsChange: -50,
      pointsType: "webdevPoints",
      sourceReference: "store_001",
      sourceType: "MERCH_REDEEM",
    };
    
    const prototype = new TransactionRecordPrototype(prototypeProps);
    const seeded = await transactionRepository.savePrototype(prototype);

    // Act
    const result = await getOneTransactionUseCase.execute(seeded.props.id);

    // Assert
    expect(result?.props).toMatchObject(prototypeProps);
    expect(result?.props.createdAt).toBeDefined(); // Ensure the repo added metadata
  });
});