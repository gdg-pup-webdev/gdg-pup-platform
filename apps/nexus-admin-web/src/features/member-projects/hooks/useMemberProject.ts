import { useQuery } from "@tanstack/react-query";
import { useGetMemberProjectByIdRequest } from "./getMemberProjectById";

export function useMemberProject(id: string) {
  const getMemberProjectById = useGetMemberProjectByIdRequest();




  return useQuery({
    queryKey: ["member-projects", "detail", id],
    queryFn: () => getMemberProjectById(id),
    enabled: !!id,
  });
}
