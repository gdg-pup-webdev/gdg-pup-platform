import { z } from "zod";
import { contract } from "@packages/nexus-api-contracts";

export type Role = z.infer<typeof contract.api.v1.roles.GET.response[200]>;
export type RoleItem = Role["data"][number];

export type RoleInsert = z.infer<typeof contract.api.v1.roles.POST.request.body>;
export type RoleUpdate = z.infer<typeof contract.api.v1.roles.roleName.PATCH.request.body>;

export type RolePermission = z.infer<typeof contract.api.v1.roles.roleName.permissions.POST.response[200]>["data"];
export type RolePermissionInsert = z.infer<typeof contract.api.v1.roles.roleName.permissions.POST.request.body>;
