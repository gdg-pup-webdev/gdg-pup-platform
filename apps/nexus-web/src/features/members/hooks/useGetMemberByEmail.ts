import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken  } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

export const useGetMemberByEmail = (email: string | undefined) => {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["gdgmembers", "email", email],
    enabled: !!email,
    queryFn: async () => {
      if (!email) throw new Error("Email is required");
      
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdgmembers.GET,
        {
          query: { email, pageNumber: 1, pageSize: 1 },
        }
      );

      if (res.status === 200) {
        // Since list returns paginated, and our email filter returns 1 record in data
        return res.body.data[0] || null;
      }

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
