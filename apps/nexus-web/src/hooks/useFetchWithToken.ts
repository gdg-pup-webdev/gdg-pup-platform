import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import {
  callEndpoint,
  ContractEndpointArgs,
  ContractEndpointOutput,
  ContractType,
} from "@packages/typed-rest/clientReact";

/**
 * DO NOT USE THIS HOOK WITHIN THE AUTHENTICATION FEATURE TO AVOID CIRCULAR DEPENDENCIES. This hook is intended for use in other features that require authenticated API calls. For authentication-related API calls, consider using the callEndpoint function directly and passing the token from the authentication context.
 */
export const callEndpointWithToken = async <T extends ContractType>(
  baseUrl: string,
  endpoint: T,
  args: ContractEndpointArgs<T>,
): ContractEndpointOutput<T> => {
  const { token } = useAuthContext();

  const result = await callEndpoint<T>(baseUrl, endpoint, {
    ...args,
    token: token || undefined,
  });

  return result;
};
