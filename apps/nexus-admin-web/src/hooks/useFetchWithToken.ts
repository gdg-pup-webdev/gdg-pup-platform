import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { callEndpoint } from "@packages/typed-rest/clientReact";

export type CallEndpointType = typeof callEndpoint;

/**
 * DO NOT USE THIS HOOK WITHIN THE AUTHENTICATION FEATURE TO AVOID CIRCULAR DEPENDENCIES. This hook is intended for use in other features that require authenticated API calls. For authentication-related API calls, consider using the callEndpoint function directly and passing the token from the authentication context.
 */
export const useCallEndpointWithToken  = () : CallEndpointType => {
  const { token } = useAuthContext();

  const callEndpointWithToken: CallEndpointType = async (baseUrl, endpoint, args) => {
    const result = await callEndpoint(baseUrl, endpoint, {
      ...args,
      token: token || undefined,
    });

    return result;
  };

  return callEndpointWithToken;
};
