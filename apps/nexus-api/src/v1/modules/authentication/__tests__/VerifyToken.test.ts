import { describe, it, expect, beforeEach } from "vitest"; 
import { MockJwtService } from "../infrastructure/mocks/MockJwtService.js";
import { VerifyToken } from "../useCases/VerifyToken.js";

describe("VerifyToken", () => {
  let jwtService: MockJwtService;
  let useCase: VerifyToken;

  beforeEach(() => {
    jwtService = new MockJwtService();
    useCase = new VerifyToken(jwtService);
  });

  it("should return the payload for a valid token", async () => {
    const payload = { userId: "123" };
    const token = await jwtService.sign(payload as any);
    const result = await useCase.execute(token);
    expect(result).toEqual(payload);
  });
});
