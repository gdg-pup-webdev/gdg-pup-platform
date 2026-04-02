export class Logout {
  async execute(): Promise<{ success: boolean }> {
    // In a stateless JWT system, logout is handled by the client 
    // removing the token. Server-side logout could involve blacklisting.
    return { success: true };
  }
}
