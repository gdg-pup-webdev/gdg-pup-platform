import { useQuery } from "@tanstack/react-query";
import { useCallEndpointWithToken } from "@/hooks/useFetchWithToken";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { useAuthContext } from "@/features/authentication/store/useAuthStore";
import { getNfcCard } from "../api/getNfcCard";

export const useNfcCard = (gdgId: string) => {
  const { token } = useAuthContext();
  const callEndpoint = useCallEndpointWithToken();

  return useQuery({
    queryKey: ["nfc-card", gdgId],
    queryFn: async () => {
      const result = await getNfcCard(gdgId);
      return result;
    }, 
  });
};
