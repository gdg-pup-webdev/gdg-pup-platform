import { useQuery } from "@tanstack/react-query";
import { useGetMemberShowcasesRequest } from "./getMemberShowcases";

export function useMemberShowcases(pageNumber = 1, pageSize = 10) {
  const getMemberShowcases = useGetMemberShowcasesRequest();




  return useQuery({
    queryKey: ["member-showcases", pageNumber, pageSize],
    queryFn: () => getMemberShowcases(pageNumber, pageSize),
  });
}
