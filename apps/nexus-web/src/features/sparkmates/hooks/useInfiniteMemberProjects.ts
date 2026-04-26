import { useInfiniteQuery } from "@tanstack/react-query";
import { getMemberProjectsPaginated } from "../api/memberProjects";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";

const DEFAULT_PROJECTS_PAGE_SIZE = 10;

export function useInfiniteMemberProjects(
  gdgId?: string,
  pageSize: number = DEFAULT_PROJECTS_PAGE_SIZE,
) {
  const { token } = useAuthContext();
    const callEndpoint = useCallEndpointWithToken();

  return useInfiniteQuery({
    queryKey: ["memberProjectsInfinite", gdgId, pageSize],
    enabled: Boolean(gdgId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      if (!gdgId) {
        throw new Error("No GDG ID provided");
      }

      const pageNumber = typeof pageParam === "number" ? pageParam : 1;

      return getMemberProjectsPaginated(callEndpoint, gdgId, {
        token: token ?? undefined,
        pageNumber,
        pageSize,
      });
    },
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.meta;
      if (currentPage >= totalPages) {
        return undefined;
      }

      return currentPage + 1;
    },
  });
}
