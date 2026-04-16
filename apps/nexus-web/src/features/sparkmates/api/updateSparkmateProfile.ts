import { contract } from "@packages/nexus-api-contracts";
import { callEndpointWithToken as callEndpoint } from "@/hooks/useFetchWithToken";
import { configs } from "@/configs/servers.config";
import type { UserProfile } from "../types"; 

export async function updateSparkmateProfile({
  gdgId,
  data,
}: {
  gdgId: string;
  data: Partial<UserProfile>;
}) : Promise<UserProfile> { 
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.gdgmembers.gdgId.PATCH,
    {
      params: { gdgId },
      body: { data: data as any }
    },
  );

  if (result.status === 200 && result.body) {
    return (result.body).data;
  }

  const message =
    result.body && typeof result.body === "object" && "message" in result.body
      ? String((result.body as { message?: unknown }).message ?? "Failed to update profile")
      : "Failed to update profile";

  throw new Error(message);
}
