import { useQuery } from "@tanstack/react-query";
import { getMemberProjectsByGdgId } from "../api/getMemberProjectsByGdgId";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useMemberProjectsByGdgId(memberGdgId: string, pageNumber = 1, pageSize = 10) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-projects", "member", memberGdgId, pageNumber, pageSize],
    queryFn: () => getMemberProjectsByGdgId(callEndpoint, memberGdgId, pageNumber, pageSize),
    enabled: !!memberGdgId,
  });
}
