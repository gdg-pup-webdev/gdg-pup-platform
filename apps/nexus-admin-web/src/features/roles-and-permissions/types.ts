import { z } from "zod";
import { contract } from "@packages/nexus-api-contracts";

export type Role = z.infer<typeof contract.api.v1.roles.GET.response[200]>;
export type RoleItem = Role["data"][number];

export type RoleInsert = z.infer<typeof contract.api.v1.roles.POST.body.payload>;
export type RoleUpdate = z.infer<typeof contract.api.v1.roles._roleName_.PATCH.body.payload>;

export type RolePermission = z.infer<typeof contract.api.v1.roles._roleName_.permissions.POST.response[200]>["data"];
export type RolePermissionInsert = z.infer<typeof contract.api.v1.roles._roleName_.permissions.POST.body.payload>;
