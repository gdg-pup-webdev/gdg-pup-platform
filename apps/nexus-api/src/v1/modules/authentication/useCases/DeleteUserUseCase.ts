import { ICustomAuthRepository } from "../domain/Interfaces";

export class DeleteUserUseCase {
  constructor(private readonly repository: ICustomAuthRepository) {}

  async execute(username: string): Promise<boolean> {
    const user = await this.repository.findByUsername(username);
    if (!user) throw new Error("User not found.");

    return await this.repository.deleteByUsername(username);
  }
}
