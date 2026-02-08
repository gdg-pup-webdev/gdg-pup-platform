export class ServerError extends Error {
  constructor(
    public title: string,
    public detail: string,
    private originalError?: unknown,
  ) {
    super(title, { cause: originalError });
    this.name = "ServerError";
  }

  public getErrorChain(): string {
    const parts: string[] = [this.title];
    let currentCause = this.cause;

    while (currentCause) {
      if (currentCause instanceof Error) {
        parts.push(currentCause.message);
        currentCause = (currentCause as Error).cause;
      } else {
        parts.push(String(currentCause));
        break;
      }
    }

    return parts.join(" -> ");
  }
}
