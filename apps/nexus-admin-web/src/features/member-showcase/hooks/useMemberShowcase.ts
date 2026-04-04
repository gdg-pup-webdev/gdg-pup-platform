import { useQuery } from "@tanstack/react-query";
import { useGetMemberShowcaseByIdRequest } from "./getMemberShowcaseById";

export function useMemberShowcase(id: string) {
  const getMemberShowcaseById = useGetMemberShowcaseByIdRequest();




  return useQuery({
    queryKey: ["member-showcase", id],
    queryFn: () => getMemberShowcaseById(id),
    enabled: !!id,
  });
}
