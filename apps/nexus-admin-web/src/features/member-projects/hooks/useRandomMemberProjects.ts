import { useQuery } from "@tanstack/react-query";
import { getRandomMemberProjects } from "../api/getRandomMemberProjects";

export function useRandomMemberProjects(pageNumber = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["member-projects", "random", pageNumber, pageSize],
    queryFn: () => getRandomMemberProjects(pageNumber, pageSize),
  });
}
