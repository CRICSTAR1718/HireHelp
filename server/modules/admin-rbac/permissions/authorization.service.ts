import * as permissionsRepository from "./permissions.repository";

export const hasPermission = async (
  roleId: string,
  permission: string
): Promise<boolean> => {
  return permissionsRepository.hasPermission(roleId, permission);
};

export const hasAnyPermission = async (
  roleId: string,
  permissions: string[]
): Promise<boolean> => {
  if (permissions.length === 0) {
    return false;
  }

  for (const permission of permissions) {
    if (await permissionsRepository.hasPermission(roleId, permission)) {
      return true;
    }
  }

  return false;
};

export const hasAllPermissions = async (
  roleId: string,
  permissions: string[]
): Promise<boolean> => {
  if (permissions.length === 0) {
    return false;
  }

  for (const permission of permissions) {
    if (!(await permissionsRepository.hasPermission(roleId, permission))) {
      return false;
    }
  }

  return true;
};
