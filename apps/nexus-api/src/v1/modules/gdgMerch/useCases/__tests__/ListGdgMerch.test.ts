import { describe, it, expect, beforeEach } from "vitest";
import { ListGdgMerch } from "../ListGdgMerch";
import { MockGdgMerchRepository } from "../../infrastructure/MockGdgMerchRepository";
import { GdgMerch } from "../../domain/GdgMerch";

describe("ListGdgMerch Use Case", () => {
  let repo: MockGdgMerchRepository;
  let listGdgMerch: ListGdgMerch;

  beforeEach(() => {
    repo = new MockGdgMerchRepository();
    listGdgMerch = new ListGdgMerch(repo);
  });

  it("should successfully list multiple GdgMerch entities with pagination", async () => {
    // Creating 15 mock items
    for (let i = 1; i <= 15; i++) {
      const merch = GdgMerch.create({
        name: `Merch ${i}`,
        image: `image${i}.jpg`,
        points: i * 10,
        stock: 5,
      });
      await repo.saveNew(merch);
    }

    // Page 1, Size 10
    const page1 = await listGdgMerch.execute(1, 10);
    expect(page1.count).toBe(15);
    expect(page1.list.length).toBe(10);
    expect(page1.list[0].props.name).toBe("Merch 1");
    expect(page1.list[9].props.name).toBe("Merch 10");

    // Page 2, Size 10
    const page2 = await listGdgMerch.execute(2, 10);
    expect(page2.count).toBe(15);
    expect(page2.list.length).toBe(5);
    expect(page2.list[0].props.name).toBe("Merch 11");
    expect(page2.list[4].props.name).toBe("Merch 15");
  });

  it("should return an empty list if there are no items", async () => {
    const emptyPage = await listGdgMerch.execute(1, 10);
    expect(emptyPage.count).toBe(0);
    expect(emptyPage.list.length).toBe(0);
  });
});
