import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { CreateMemberShowcaseDTO } from "../types";

export async function createMemberShowcase(data: CreateMemberShowcaseDTO, thumbnailFile: File) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_showcase.POST,
    {
      body: { data },
      files: { thumbnailFile },
    }
  );

  if (result.status === 201 && result.body) {
    return result.body;
  }
  throw new Error("Failed to create member showcase");
}
