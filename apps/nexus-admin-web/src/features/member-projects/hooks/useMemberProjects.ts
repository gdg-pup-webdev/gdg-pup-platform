import { useQuery } from "@tanstack/react-query";
import { useGetMemberProjectsRequest } from "./getMemberProjects";

export function useMemberProjects(pageNumber = 1, pageSize = 10) {
  const getMemberProjects = useGetMemberProjectsRequest();




  return useQuery({
    queryKey: ["member-projects", "list", pageNumber, pageSize],
    queryFn: () => getMemberProjects(pageNumber, pageSize),
  });
}
