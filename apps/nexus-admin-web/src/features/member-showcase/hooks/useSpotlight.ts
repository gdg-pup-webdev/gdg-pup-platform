import { useQuery } from "@tanstack/react-query";
import { getSpotlight } from "../api/getSpotlight";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useSpotlight() {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-showcase", "spotlight"],
    queryFn: () => getSpotlight(callEndpoint),
  });
}
