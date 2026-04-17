import { contract } from "@packages/nexus-api-contracts"; 
import { configs } from "@/configs/servers.config";
import type { SparkmatesProfile, SparkmatesSource } from "../types"; 
import { CallEndpointType } from "@/hooks/useFetchWithToken";

export async function getSparkmateByGdgId({
  callEndpoint,
  gdgId,
  source,
}: {
  gdgId: string;
  source?: SparkmatesSource;
  callEndpoint : CallEndpointType
}) : Promise<SparkmatesProfile> { 
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.gdgmembers.gdgId.GET,
    {
      params: { gdgId }, 
    },
  );

  if (result.status === 200 && result.body) {
    return (result.body ).data;
  }

  const message =
    result.body && typeof result.body === "object" && "message" in result.body
      ? String((result.body as { message?: unknown }).message ?? "Failed to fetch Sparkmates profile")
      : "Failed to fetch Sparkmates profile";

  throw new Error(message);
}
