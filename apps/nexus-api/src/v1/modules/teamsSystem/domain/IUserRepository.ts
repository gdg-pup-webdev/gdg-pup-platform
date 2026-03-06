// By defining this here, the Team module dictates what it needs from the User module, 
// strictly adhering to the Dependency Inversion Principle.
export interface IUserRepository {
  findById(userId: string): Promise<any | null>; // Returns the User entity or null
}