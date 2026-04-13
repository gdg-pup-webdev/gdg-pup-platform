import { callEndpoint } from "@packages/typed-rest/clientReact";
import { contract } from "@packages/nexus-api-contracts";
import { configs } from "@/lib/constants/configs";
import { UpdateMemberProjectDTO } from "../types";

export async function updateMemberProject(
  id: string,
  data: UpdateMemberProjectDTO,
  files?: {
    mainImage?: File;
    secondaryImage?: File;
    tertiaryImage?: File;
  }
) {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.member_projects.id.PATCH,
    {
      params: { id },
      body: { data },
      files: files as any,
    }
  );

  if (result.status === 200 && result.body) {
    return result.body;
  }
  throw new Error(`Failed to update member project with ID ${id}`);
}
