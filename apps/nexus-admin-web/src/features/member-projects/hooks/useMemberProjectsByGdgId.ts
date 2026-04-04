import { useQuery } from "@tanstack/react-query";
import { useGetMemberProjectsByGdgIdRequest } from "./getMemberProjectsByGdgId";

export function useMemberProjectsByGdgId(memberGdgId: string, pageNumber = 1, pageSize = 10) {
  const getMemberProjectsByGdgId = useGetMemberProjectsByGdgIdRequest();




  return useQuery({
    queryKey: ["member-projects", "member", memberGdgId, pageNumber, pageSize],
    queryFn: () => getMemberProjectsByGdgId(memberGdgId, pageNumber, pageSize),
    enabled: !!memberGdgId,
  });
}
