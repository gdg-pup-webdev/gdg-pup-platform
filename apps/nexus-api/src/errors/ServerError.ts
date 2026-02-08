export class ServerError extends Error {
  constructor(
    public title: string,
    public detail: string,
    public originalError?: unknown,
  ) {
    super(title, { cause: originalError });
    this.name = "ServerError";
  }

  public getErrorChain(): string {
    const parts: string[] = [this.title];
    let currentCause = this.cause;

    while (currentCause !== undefined && currentCause !== null) {
      if (currentCause instanceof Error) {
        parts.push(currentCause.message);
        currentCause = (currentCause as any).cause;
      } else {
        parts.push(String(currentCause));
        break;
      }
    }

    return parts.join(" -> ");
  }
}
