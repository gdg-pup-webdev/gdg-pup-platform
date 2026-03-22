import { ICustomAuthRepository, IEncryptionService } from "../domain/IAuthenticationInterfaces";
import { User } from "../domain/User";

export class CreateUser {
  constructor(
    private readonly repo: ICustomAuthRepository,
    private readonly encryption: IEncryptionService
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const existing = await this.repo.findByEmail(email);
    if (existing) throw new Error("User already exists.");

    const username = email.split("@")[0];
    const hash = await this.encryption.hash(password);
    const user = User.create({
      username,
      emailAddress: email,
      passwordHash: hash
    });

    return await this.repo.saveNew(user);
  }
}
