import { callEndpoint } from '@packages/typed-rest/clientReact';
import { contract } from '@packages/nexus-api-contracts';
import { configs } from '@/configs/servers.config';

export async function getCurrentUserGdgId(userId: string): Promise<string | null> {
  const result = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.users.userId.GET,
    { params: { userId } }
  );

  if (result.status === 200) {
    return result.body.data.gdg_id;
  }

  throw new Error(result.body.message);
}
