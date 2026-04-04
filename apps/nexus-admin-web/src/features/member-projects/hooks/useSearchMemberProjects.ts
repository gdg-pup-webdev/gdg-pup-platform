import { useQuery } from "@tanstack/react-query";
import { useSearchMemberProjectsRequest } from "./searchMemberProjects";

export function useSearchMemberProjects(query: string, pageNumber = 1, pageSize = 10) {
  const searchMemberProjects = useSearchMemberProjectsRequest();




  return useQuery({
    queryKey: ["member-projects", "search", query, pageNumber, pageSize],
    queryFn: () => searchMemberProjects(query, pageNumber, pageSize),
    enabled: !!query,
  });
}
