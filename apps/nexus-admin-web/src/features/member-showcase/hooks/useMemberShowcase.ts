import { useQuery } from "@tanstack/react-query";
import { getMemberShowcaseById } from "../api/getMemberShowcaseById";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useMemberShowcase(id: string) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-showcase", id],
    queryFn: () => getMemberShowcaseById(callEndpoint, id),
    enabled: !!id,
  });
}
