import { contract } from "@packages/nexus-api-contracts";
import { callEndpoint } from "@packages/typed-rest/clientReact";
import { configs } from "@/configs/servers.config";

export async function activateSparkmatesCard({
  gdgId,
  token,
}: {
  gdgId: string;
  token: string;
}) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.nfc_system.nfc.gdgId.activate.POST,
    {
      params: { gdgId },
      token,
    },
  );

  if (result.status === 200) {
    return result.body;
  }

  const message =
    result.body && typeof result.body === "object" && "message" in result.body
      ? String((result.body as { message?: unknown }).message ?? "Failed to activate Sparkmates card")
      : "Failed to activate Sparkmates card";

  throw new Error(message);
}
