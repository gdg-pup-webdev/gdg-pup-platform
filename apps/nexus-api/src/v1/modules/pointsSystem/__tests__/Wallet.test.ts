import { describe, it, expect, beforeEach } from "vitest"; 
import { Wallet } from "../domain/Wallet";

describe("Wallet Domain Entity", () => {
  const makeWallet = (overrides = {}) =>
    Wallet.hydrate({
      userId: "user-1",
      points: { sparkPoints: 100, webdevPoints: 50 },
      totalPoints: 150,
      updatedAt: new Date().toISOString(),
      ...overrides,
    });

  describe("hydrate", () => {
    it("should hydrate a wallet with given props", () => {
      const wallet = makeWallet();
      expect(wallet.props.userId).toBe("user-1");
      expect(wallet.props.totalPoints).toBe(150);
      expect(wallet.props.points.sparkPoints).toBe(100);
      expect(wallet.props.points.webdevPoints).toBe(50);
    });

    it("should allow empty points dictionary", () => {
      const wallet = Wallet.hydrate({
        userId: "u",
        points: {},
        totalPoints: 0,
        updatedAt: new Date().toISOString(),
      });
      expect(wallet.props.totalPoints).toBe(0);
    });
  });

  describe("applyPointsDelta – credits (positive delta)", () => {
    it("should add points to an existing point type", () => {
      const wallet = makeWallet();
      wallet.applyPointsDelta("sparkPoints", 50);
      expect(wallet.props.points.sparkPoints).toBe(150);
    });

    it("should initialise a new point type to 0, then apply the delta", () => {
      const wallet = makeWallet();
      wallet.applyPointsDelta("uiuxPoints", 75);
      expect(wallet.props.points.uiuxPoints).toBe(75);
    });

    it("should update totalPoints after crediting", () => {
      const wallet = makeWallet();
      wallet.applyPointsDelta("sparkPoints", 50);
      expect(wallet.props.totalPoints).toBe(200);
    });

    it("should update updatedAt timestamp after a delta", () => {
      const wallet = makeWallet({ updatedAt: "2020-01-01T00:00:00.000Z" });
      wallet.applyPointsDelta("sparkPoints", 1);
      expect(wallet.props.updatedAt).not.toBe("2020-01-01T00:00:00.000Z");
    });
  });

  describe("applyPointsDelta – debits (negative delta)", () => {
    it("should subtract points from an existing point type", () => {
      const wallet = makeWallet();
      wallet.applyPointsDelta("sparkPoints", -30);
      expect(wallet.props.points.sparkPoints).toBe(70);
    });

    it("should allow consuming all available points (balance becomes 0)", () => {
      const wallet = makeWallet();
      wallet.applyPointsDelta("sparkPoints", -100);
      expect(wallet.props.points.sparkPoints).toBe(0);
    });

    it("should throw when the resulting balance would be negative", () => {
      const wallet = makeWallet();
      expect(() => wallet.applyPointsDelta("sparkPoints", -101)).toThrow(
        /Insufficient sparkPoints/,
      );
    });

    it("should throw when debiting an uninitialised point type", () => {
      const wallet = makeWallet();
      expect(() => wallet.applyPointsDelta("uiuxPoints", -1)).toThrow(
        /Insufficient uiuxPoints/,
      );
    });

    it("should update totalPoints after debiting", () => {
      const wallet = makeWallet();
      wallet.applyPointsDelta("sparkPoints", -50);
      expect(wallet.props.totalPoints).toBe(100);
    });
  });

  describe("multiple sequential deltas", () => {
    it("should accumulate correctly across multiple calls", () => {
      const wallet = makeWallet({ points: { sparkPoints: 0 }, totalPoints: 0 });
      wallet.applyPointsDelta("sparkPoints", 200);
      wallet.applyPointsDelta("sparkPoints", -50);
      wallet.applyPointsDelta("webdevPoints", 100);
      expect(wallet.props.points.sparkPoints).toBe(150);
      expect(wallet.props.points.webdevPoints).toBe(100);
      expect(wallet.props.totalPoints).toBe(250);
    });
  });
});
