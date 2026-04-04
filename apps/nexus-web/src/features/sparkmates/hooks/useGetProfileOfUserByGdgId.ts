import { useQuery } from "@tanstack/react-query";
import { getSparkmateByGdgId } from "../api";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { configs } from "@/lib/constants/configs";
import { contract } from "@packages/nexus-api-contracts";

export const useGetProfileOfUserByGdgId = (gdgId: string | undefined) => {

    return useQuery({
        queryKey: ['sparkmates', 'profile'],
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