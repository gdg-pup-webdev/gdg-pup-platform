import { ZodError } from "zod";

// --- Custom Errors ---
export class ContractError extends Error {
  public blame: "client" | "server";
  constructor(
    public error: ZodError,
    blame: "client" | "server",
  ) {
    super("Request validation failed");
    this.name = "Contract validation error";
    this.blame = blame;
  }
}
