import { contract } from "@packages/nexus-api-contracts"; 

// types inferred from contract models
export type GdgMember = contract.api.v1.gdgmembers.GET.response[200]["data"][number];

export type GdgMemberUpdate = contract.api.v1.gdgmembers.gdgId.PATCH.request.body["data"];
