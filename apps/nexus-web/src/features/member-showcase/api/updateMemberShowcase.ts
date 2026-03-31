import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { UpdateMemberShowcaseDTO } from "../types";

export async function updateMemberShowcase(id: string, data: UpdateMemberShowcaseDTO, thumbnailFile?: File) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_showcase.id.PATCH,
    {
      params: { id },
      body: { data },
      files: { thumbnailFile },
    }
  );

  if (result.status === 200 && result.body) {
    return result.body;
  }
  throw new Error("Failed to update member showcase");
}
