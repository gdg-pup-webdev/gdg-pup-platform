import { useQuery } from "@tanstack/react-query";
import { getMemberProjects } from "../api/memberProjects";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function usePublicMemberProjects(gdgId?: string) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["publicMemberProjects", gdgId],
    queryFn: () => {
      if (!gdgId) throw new Error("No GDG ID provided");
      return getMemberProjects(callEndpoint,gdgId);
    },
    enabled: Boolean(gdgId),
  });
}
