import { describe, expect, it, beforeEach } from "vitest"; 
import { BevyEvent } from "../domain/BevyEvent";
import { MockBevyEventRepository } from "../infrastructure/MockBevyEventRepository";
import { ListBevyEvents } from "../useCases/ListBevyEvents";

let repository: MockBevyEventRepository;
let listBevyEventsUseCase: ListBevyEvents;

const initializeInstances = () => {
  repository = new MockBevyEventRepository();
  listBevyEventsUseCase = new ListBevyEvents(repository);
};

describe("ListBevyEvents Use Case", () => {
  beforeEach(initializeInstances);

  // Helper function to quickly seed multiple valid events into the mock repository
  const seedEvents = (count: number) => {
    for (let i = 1; i <= count; i++) {
      const newEvent = BevyEvent.hydrate({
        id: `event_${i}`,
        title: `Test Event ${i}`,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 3600000).toISOString(),
        description: `This is a test event number ${i}`,
        status: "Published",
      });
      repository.bevyEvents.push(newEvent);
    }
  };

  it("should successfully return a paginated list of events and the total count", async () => {
    // 1. Arrange
    seedEvents(5); // Total of 5 events in the database
    const pageNumber = 1;
    const pageSize = 2;

    // 2. Act
    const result = await listBevyEventsUseCase.execute(pageNumber, pageSize);

    // 3. Assert
    expect(result).toBeDefined();
    expect(result.list).toHaveLength(2); // Should only return 2 items due to pageSize
    expect(result.count).toBe(5); // Total count should remain 5
    expect(result.list[0].props.id).toBe("event_1");
    expect(result.list[1].props.id).toBe("event_2");
  });

  it("should return the correct items when requesting a subsequent page", async () => {
    // 1. Arrange
    seedEvents(5);
    const pageNumber = 2;
    const pageSize = 2;

    // 2. Act
    const result = await listBevyEventsUseCase.execute(pageNumber, pageSize);

    // 3. Assert
    expect(result.list).toHaveLength(2);
    expect(result.list[0].props.id).toBe("event_3"); // Page 2 should start at item 3
    expect(result.list[1].props.id).toBe("event_4");
    expect(result.count).toBe(5);
  });

  it("should return a partial page if the remaining items are less than the page size", async () => {
    // 1. Arrange
    seedEvents(5);
    const pageNumber = 3;
    const pageSize = 2; // Page 1: [1, 2], Page 2: [3, 4], Page 3: [5]

    // 2. Act
    const result = await listBevyEventsUseCase.execute(pageNumber, pageSize);

    // 3. Assert
    expect(result.list).toHaveLength(1);
    expect(result.list[0].props.id).toBe("event_5");
    expect(result.count).toBe(5);
  });

  it("should throw an error if the requested pageNumber is less than 1", async () => {
    // 1. Arrange
    const invalidPageNumber = 0;
    const pageSize = 10;

    // 2. Act & 3. Assert
    await expect(
      listBevyEventsUseCase.execute(invalidPageNumber, pageSize)
    ).rejects.toThrowError("Page number must be greater than 0");
  });

  it("should throw an error if the requested pageSize is less than 1", async () => {
    // 1. Arrange
    const pageNumber = 1;
    const invalidPageSize = 0;

    // 2. Act & 3. Assert
    await expect(
      listBevyEventsUseCase.execute(pageNumber, invalidPageSize)
    ).rejects.toThrowError("Page size must be greater than 0");
  });

  it("should return an empty list and count of 0 if there are no events in the database", async () => {
    // 1. Arrange
    // Purposefully NOT seeding any events
    const pageNumber = 1;
    const pageSize = 10;

    // 2. Act
    const result = await listBevyEventsUseCase.execute(pageNumber, pageSize);

    // 3. Assert
    expect(result.list).toEqual([]);
    expect(result.list).toHaveLength(0);
    expect(result.count).toBe(0);
  });

  it("should return an empty list if the requested page is out of bounds", async () => {
    // 1. Arrange
    seedEvents(2);
    const outOfBoundsPageNumber = 5;
    const pageSize = 10;

    // 2. Act
    const result = await listBevyEventsUseCase.execute(outOfBoundsPageNumber, pageSize);

    // 3. Assert
    expect(result.list).toEqual([]);
    expect(result.list).toHaveLength(0);
    expect(result.count).toBe(2); // It should still return the correct total count
  });
});