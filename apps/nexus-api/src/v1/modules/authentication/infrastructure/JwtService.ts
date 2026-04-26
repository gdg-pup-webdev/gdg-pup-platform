import { IJWTService } from "../domain/IAuthenticationInterfaces.js";
import * as jwt from "jsonwebtoken";
import { TokenPayload, TokenPayloadProps } from "../domain/TokenPayload.js";

export class JwtService implements IJWTService {
  constructor(
    private readonly secret: string,
  ) {}

  async sign(payload: TokenPayload): Promise<string> {
    console.log("creating jwt token with payload", payload.props);
    return jwt.sign(payload.props, this.secret);
  }

  async verify(token: string): Promise<TokenPayload> {
    const data = jwt.verify(token, this.secret) as TokenPayloadProps;
    return TokenPayload.create(data);
  }
}
