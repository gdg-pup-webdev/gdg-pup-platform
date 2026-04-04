import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import {
  callEndpoint,
  ContractEndpointArgs,
  ContractEndpointOutput,
  ContractType,
} from "@packages/typed-rest/clientReact";

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
