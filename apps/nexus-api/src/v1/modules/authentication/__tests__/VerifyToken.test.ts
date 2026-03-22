import { describe, it, expect, beforeEach } from "vitest";
import { VerifyToken } from "../../useCases/VerifyToken";
import { MockJwtService } from "./__mocks__/MockJwtService";

describe("VerifyToken", () => {
  let jwtService: MockJwtService;
  let useCase: VerifyToken;

  beforeEach(() => {
    jwtService = new MockJwtService();
    useCase = new VerifyToken(jwtService);
  });

  it("should return the payload for a valid token", async () => {
    const payload = { userId: "123" };
    const token = await jwtService.sign(payload);
    const result = await useCase.execute(token);
    expect(result).toEqual(payload);
  });
});
