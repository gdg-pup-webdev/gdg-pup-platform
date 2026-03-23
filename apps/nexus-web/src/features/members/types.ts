import { contract } from "@packages/nexus-api-contracts";
import { z } from "zod";

// types inferred from contract models
export type GdgMember = z.infer<
  (typeof contract.api.v1.gdgmembers.GET.response)[200]
>["data"][number];

export type GdgMemberUpdate = z.infer<
  typeof contract.api.v1.gdgmembers.gdgId.PATCH.request.body
>["data"];
