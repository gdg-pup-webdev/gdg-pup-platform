import { useQuery } from "@tanstack/react-query";
import { getMemberProjectById } from "../api/getMemberProjectById";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useMemberProject(id: string) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-projects", "detail", id],
    queryFn: () => getMemberProjectById(callEndpoint, id),
    enabled: !!id,
  });
}
