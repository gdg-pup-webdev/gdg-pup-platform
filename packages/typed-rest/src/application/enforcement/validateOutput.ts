import { Contract } from "./domains/serverTypes";

type Response = {
  status: number;
  body: unknown;
};

export async function validateOutput<T extends Contract>(
  result: Response,
  contract: T,
): Promise<{
  status: number;
  body: unknown;
}> {
  const statusCode = result.status;

  const responseValidator = contract.response[statusCode];

  if (responseValidator) {
    const parsedResponse = await responseValidator.safeParseAsync(result.body);

    if (parsedResponse.error) {
      console.warn(
        `[Contract Warning] Invalid response for status ${statusCode}: ${parsedResponse.error.message}`,
      );
    }
  } else {
    console.warn(
      `[Contract Warning] No response schema defined for status ${statusCode}`,
    );
  }

  return result;
}
