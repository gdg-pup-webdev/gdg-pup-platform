import { IJWTService } from "../../domain/IAuthenticationInterfaces";

export class MockJwtService implements IJWTService {
  async sign(payload: Record<string, any>): Promise<string> {
    return Promise.resolve(JSON.stringify(payload));
  }

  async verify(token: string): Promise<Record<string, any>> {
    return Promise.resolve(JSON.parse(token));
  }
}
