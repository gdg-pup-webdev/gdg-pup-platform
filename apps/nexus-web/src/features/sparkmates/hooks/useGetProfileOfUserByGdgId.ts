import { useQuery } from "@tanstack/react-query";
import { configs } from "@/lib/constants/configs";
import { contract } from "@packages/nexus-api-contracts";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export const useGetProfileOfUserByGdgId = (gdgId: string | undefined) => {
  const callEndpoint = useCallEndpointWithToken();

    return useQuery({
        queryKey: ["sparkmates", "profile", gdgId],
        enabled: Boolean(gdgId),
        queryFn: async () => {
            if (!gdgId) {
                throw new Error("GDG ID is required");
            }

            const result = await callEndpoint(
                configs.nexusApiBaseUrl,
                contract.api.v1.gdgmembers.gdgId.GET,
                {
                    params: {
                        gdgId,
                    },
                },
            );

            if (result.status !== 200) {
                throw new Error("Failed to fetch profile of user by GDG ID");
            }

            return result.body;
        },
    });
};