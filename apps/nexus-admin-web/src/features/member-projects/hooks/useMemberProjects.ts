import { useQuery } from "@tanstack/react-query";
import { getMemberProjects } from "../api/getMemberProjects";

export function useMemberProjects(pageNumber = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["member-projects", "list", pageNumber, pageSize],
    queryFn: () => getMemberProjects(pageNumber, pageSize),
  });
}
