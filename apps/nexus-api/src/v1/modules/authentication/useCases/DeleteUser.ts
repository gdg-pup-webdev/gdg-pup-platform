import { IUserCredentialRepository } from "../domain/IAuthenticationInterfaces";

export class DeleteUser {
  constructor(private readonly credentialRepo: IUserCredentialRepository) {}

  async execute(email: string): Promise<boolean> {
    return await this.credentialRepo.deleteByEmail(email);
  }
}
