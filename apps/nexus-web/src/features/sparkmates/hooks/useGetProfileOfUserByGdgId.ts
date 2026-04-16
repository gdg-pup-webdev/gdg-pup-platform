import { useQuery } from "@tanstack/react-query";
import { getSparkmateByGdgId } from "../api"; 
import { configs } from "@/lib/constants/configs";
import { contract } from "@packages/nexus-api-contracts";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export const useGetProfileOfUserByGdgId = (gdgId: string | undefined) => {
  const callEndpoint = useCallEndpointWithToken();

    return useQuery({
        queryKey: ['sparkmates', 'profile', gdgId],
        queryFn: async () => {
            console.log("Fetching profile for GDG ID:", gdgId);
            if (!gdgId) {
                return;
            }

            console.log("Calling API to fetch profile...", gdgId);


            const result = await callEndpoint(
                configs.nexusApiBaseUrl, 
                contract.api.v1.gdgmembers.gdgId.GET, 
                {
                    params: {
                        gdgId: gdgId
                    }
                }
            )

            if (result.status !== 200) {
                throw new Error('Failed to fetch profile of user by GDG ID');
            }
            

            return result.body;
        }, 
    })



};