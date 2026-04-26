import { IJWTService } from "../domain/IAuthenticationInterfaces.js";

export class VerifyToken {
  constructor(private readonly jwtService: IJWTService) {}

  async execute(token: string)  {
    const payload = await this.jwtService.verify(token);
    
    // Validate validUntil field against current time
    const validUntilTime = new Date(payload.props.validUntil);
    if (new Date() > validUntilTime) {
      throw new Error("Session expired. Please login again.");
    }
    
    return payload;
  }
}

