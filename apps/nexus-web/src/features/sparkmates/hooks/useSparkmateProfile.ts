import { useQuery } from "@tanstack/react-query";
import { getSparkmateByGdgId } from "../api/getSparkmateByGdgId";
import type { SparkmatesSource } from "../types"; 
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useSparkmateProfile({
  gdgId,
  source,
}: {
  gdgId: string;
  source?: SparkmatesSource;
}) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["sparkmates-profile", gdgId, source],
    queryFn: async () => {

      const res = await getSparkmateByGdgId({ callEndpoint, gdgId, source })
      return res;
    },
    enabled: Boolean(gdgId),
  });
}
