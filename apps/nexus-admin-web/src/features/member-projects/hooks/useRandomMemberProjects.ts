import { useQuery } from "@tanstack/react-query";
import { getRandomMemberProjects } from "../api/getRandomMemberProjects";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useRandomMemberProjects(pageNumber = 1, pageSize = 10) {
  const callEndpoint = useCallEndpointWithToken();
  return useQuery({
    queryKey: ["member-projects", "random", pageNumber, pageSize],
    queryFn: () => getRandomMemberProjects(callEndpoint, pageNumber, pageSize),
  });
}
