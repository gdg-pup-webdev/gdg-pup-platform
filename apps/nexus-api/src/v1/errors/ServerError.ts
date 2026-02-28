export class ServerError extends Error {
  constructor(
    public title: string,
    public detail: string,
    private originalError?: unknown,
  ) {
    super(title, { cause: originalError });
    this.name = "ServerError";
  }

  public getAllErrorStack(): string[] {
    const parts: string[] = [ ];
    let currentCause = this as unknown;

    while (currentCause) {
      if (currentCause instanceof Error) {
        parts.push(currentCause.stack || `${currentCause.name}: ${currentCause.message}`);
        currentCause = (currentCause as Error).cause;
      } else {
        parts.push(String(currentCause));
        break;
      }
    }

    return parts.reverse();
    // return parts.join(" -> ");
  }
}
