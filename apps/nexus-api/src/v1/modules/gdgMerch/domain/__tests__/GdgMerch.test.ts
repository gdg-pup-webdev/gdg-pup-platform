import { describe, expect, it, vi } from "vitest";
import { GdgMerch } from "../GdgMerch";

describe("GdgMerch Domain Entity", () => {
  const defaultProps = {
    name: "GDG T-Shirt",
    image: "https://example.com/shirt.png",
    points: 100,
    stock: 50,
  };

  describe("create", () => {
    it("should successfully create a valid GdgMerch entity", () => {
      const merch = GdgMerch.create(defaultProps);

      expect(merch.props.id).toBeDefined();
      expect(merch.props.createdAt).toBeInstanceOf(Date);
      expect(merch.props.updatedAt).toBeInstanceOf(Date);
      expect(merch.props.name).toBe(defaultProps.name);
      expect(merch.props.image).toBe(defaultProps.image);
      expect(merch.props.points).toBe(defaultProps.points);
      expect(merch.props.stock).toBe(defaultProps.stock);
    });
  });

  describe("hydrate", () => {
    it("should successfully hydrate an existing GdgMerch entity", () => {
      const hydrationProps = {
        ...defaultProps,
        id: "existing-id-123",
        createdAt: new Date("2023-01-01"),
        updatedAt: new Date("2023-01-02"),
      };

      const merch = GdgMerch.hydrate(hydrationProps);

      expect(merch.props.id).toBe("existing-id-123");
      expect(merch.props.createdAt).toEqual(new Date("2023-01-01"));
      expect(merch.props.updatedAt).toEqual(new Date("2023-01-02"));
    });
  });

  describe("updateInfo", () => {
    it("should partially update specific info fields and set a new updatedAt date", () => {
      const merch = GdgMerch.create(defaultProps);
      const initialUpdatedAt = merch.props.updatedAt;

      vi.useFakeTimers();
      vi.setSystemTime(new Date(initialUpdatedAt.getTime() + 1000));

      merch.updateInfo({
        name: "GDG Hoodie",
        points: 200,
      });

      expect(merch.props.name).toBe("GDG Hoodie");
      expect(merch.props.points).toBe(200);
      expect(merch.props.image).toBe(defaultProps.image); // Should remain unchanged
      expect(merch.props.stock).toBe(defaultProps.stock); // Cannot be directly updated via updateInfo
      expect(merch.props.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());

      vi.useRealTimers();
    });

    it("should handle empty updates correctly", () => {
      const merch = GdgMerch.create(defaultProps);
      const initialUpdatedAt = merch.props.updatedAt;

      merch.updateInfo({});

      expect(merch.props.name).toBe(defaultProps.name);
      expect(merch.props.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
  });

  describe("restock", () => {
    it("should increase the stock by the given amount", () => {
      const merch = GdgMerch.create(defaultProps); // Stock is 50
      merch.restock(25);
      expect(merch.props.stock).toBe(75);
    });

    it("should throw an error if restock amount is zero", () => {
      const merch = GdgMerch.create(defaultProps);
      expect(() => merch.restock(0)).toThrow("Restock amount must be greater than zero.");
    });

    it("should throw an error if restock amount is negative", () => {
      const merch = GdgMerch.create(defaultProps);
      expect(() => merch.restock(-10)).toThrow("Restock amount must be greater than zero.");
    });
  });

  describe("consumeStock", () => {
    it("should decrease the stock by the given amount", () => {
      const merch = GdgMerch.create(defaultProps); // Stock is 50
      merch.consumeStock(10);
      expect(merch.props.stock).toBe(40);
    });

    it("should throw an error if consume amount is zero", () => {
      const merch = GdgMerch.create(defaultProps);
      expect(() => merch.consumeStock(0)).toThrow("Consume amount must be greater than zero.");
    });

    it("should throw an error if consume amount is negative", () => {
      const merch = GdgMerch.create(defaultProps);
      expect(() => merch.consumeStock(-5)).toThrow("Consume amount must be greater than zero.");
    });

    it("should throw an error if consume amount exceeds available stock", () => {
      const merch = GdgMerch.create(defaultProps); // Stock is 50
      expect(() => merch.consumeStock(51)).toThrow("Not enough stock.");
    });

    it("should successfully consume stock when amount equals available stock", () => {
      const merch = GdgMerch.create(defaultProps); // Stock is 50
      merch.consumeStock(50);
      expect(merch.props.stock).toBe(0);
    });
  });
});
