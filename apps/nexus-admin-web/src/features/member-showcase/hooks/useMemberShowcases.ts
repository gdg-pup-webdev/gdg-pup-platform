import { useQuery } from "@tanstack/react-query";
import { getMemberShowcases } from "../api/getMemberShowcases";

export function useMemberShowcases(pageNumber = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["member-showcases", pageNumber, pageSize],
    queryFn: () => getMemberShowcases(pageNumber, pageSize),
  });
}
