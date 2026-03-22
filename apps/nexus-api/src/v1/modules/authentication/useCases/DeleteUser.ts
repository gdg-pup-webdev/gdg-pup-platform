import { ICustomAuthRepository } from "../domain/IAuthenticationInterfaces";

export class DeleteUser {
  constructor(private readonly repo: ICustomAuthRepository) {}
  async execute(email: string): Promise<void> {
    const user = await this.repo.findByEmail(email);
    if (user) {
      await this.repo.deleteByUsername(user.props.username);
    }
  }
}
