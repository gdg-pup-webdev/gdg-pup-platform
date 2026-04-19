import { useQuery } from "@tanstack/react-query";
import { getMemberProjectsPaginated } from "../api/memberProjects";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

export function useMemberProjectsPaginated(
  gdgId: string | undefined,
  pageNumber: number,
  pageSize: number,
) {
  const { token } = useAuthContext();
  const callEndpoint = useCallEndpointWithToken();

  return useQuery({
    queryKey: ["memberProjectsPage", gdgId, pageNumber, pageSize],
    enabled: Boolean(gdgId),
    queryFn: () => {
      if (!gdgId) {
        throw new Error("No GDG ID provided");
      }

      return getMemberProjectsPaginated(callEndpoint, gdgId, {
        token: token ?? undefined,
        pageNumber,
        pageSize,
      });
    },
  });
}
