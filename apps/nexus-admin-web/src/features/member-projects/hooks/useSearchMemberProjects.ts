import { useQuery } from "@tanstack/react-query";
import { searchMemberProjects } from "../api/searchMemberProjects";

export function useSearchMemberProjects(query: string, pageNumber = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["member-projects", "search", query, pageNumber, pageSize],
    queryFn: () => searchMemberProjects(query, pageNumber, pageSize),
    enabled: !!query,
  });
}
