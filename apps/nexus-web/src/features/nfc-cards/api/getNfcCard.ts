import { configs } from "@/lib/constants/configs";
import { extractErrorMessage } from "@/lib/utils";
import { contract } from "@packages/nexus-api-contracts";
import {
  callEndpoint, 
} from "@packages/typed-rest/clientReact";

export const getNfcCard = async (gdgId: string ) => {
  const res = await callEndpoint(
    configs.nexusApiBaseUrl,
    contract.api.v1.gdgmembers.gdgId.nfc_card.GET,
    {
      params: {
        gdgId: gdgId,
      }, 
    },
  );
 

  if (res.status === 200) return res.body.data;

  if (res.status === 404) return null;

  throw new Error(extractErrorMessage(res.body));
};
