import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import {
  callEndpoint,
  ContractEndpointArgs,
  ContractEndpointOutput,
  ContractType,
} from "@packages/typed-rest/clientReact";

/**
 * A custom hook that wraps the callEndpoint function from typed-rest/clientReact, automatically including the authentication token in the headers if available. This allows for consistent API calls across the application without having to manually include the token each time.
 */
export const useFetchApi = () => {
  const { token } = useAuthContext();

  const call = async <T extends ContractType>(
    baseUrl: string,
    endpoint: T,
    args: ContractEndpointArgs<T>,
  ): ContractEndpointOutput<T> => {
    return await callEndpoint(baseUrl, endpoint, { ...args, 
        headers: {
            ...(args.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
     });
  };

    return call;
};
