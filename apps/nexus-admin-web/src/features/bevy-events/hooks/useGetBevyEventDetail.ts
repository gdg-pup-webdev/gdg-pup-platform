import { useMutation } from "@tanstack/react-query";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";

/**
 * Hook to fetch detail of a single Bevy event from the database.
 * We use useMutation instead of useQuery because we want to trigger it manually 
 * via the "Import from Bevy" button in the form.
 */
export const useGetBevyEventDetail = () => {
  return useMutation({
    mutationFn: async (eventId: string) => {
      const res = await callEndpoint(
        configs.nexusApiBaseUrl,
        contract.api.v1.gdg_scraped_events.gdg_id.GET,
        {
          params: { gdg_id: eventId },
        }
      );

      if (res.status === 200) return res.body;

      throw new Error(extractErrorMessage(res.body));
    },
  });
};
