import { cz } from "@packages/typed-rest/shared";

export const rolePermission = cz.object({
  role_id: cz.string(),

  resource_name: cz.string(),
  action: cz.string(),
});

export const rolePermissionInsertDTO = rolePermission.omit({
  role_id: true,
});

export const roleRow = cz.object({
  id: cz.string(),

  name: cz.string().min(1),
  description: cz.string().min(1),

  permissions: cz.array(
    cz.object({
      resource: cz.string(),
      action: cz.string(),
    }),
  ),
});

export const roleInsertDTO = roleRow.omit({
  id: true,
  permissions: true,
});

export const roleUpdateDTO = roleInsertDTO.partial();
