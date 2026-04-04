import { useQuery } from "@tanstack/react-query";
import { useGetRandomMemberProjectsRequest } from "./getRandomMemberProjects";

export function useRandomMemberProjects(pageNumber = 1, pageSize = 10) {
  const getRandomMemberProjects = useGetRandomMemberProjectsRequest();
  return useQuery({
    queryKey: ["member-projects", "random", pageNumber, pageSize],
    queryFn: () => getRandomMemberProjects(pageNumber, pageSize),
  });
}
