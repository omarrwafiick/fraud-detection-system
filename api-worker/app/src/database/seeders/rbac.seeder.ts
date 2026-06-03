import { DataSource } from 'typeorm';
import {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
} from 'src/common/constants/rbac.constants';
import { Role } from 'src/auth/entities/roles.entity';
import { Permission } from 'src/auth/entities/permissions.entity';
import { RolePermissions } from 'src/auth/entities/rolePermissions.pivot';

export async function seedRolesAndPermissions(
  dataSource: DataSource,
): Promise<void> {
  await dataSource.transaction(async manager => {
    const roleRepository = manager.getRepository(Role);
    const permissionRepository = manager.getRepository(Permission);
    const rolePermissionRepository = manager.getRepository(RolePermissions);

    for (const permissionName of Object.values(PERMISSIONS)) {
      await permissionRepository.upsert(
        {
          name: permissionName,
        },
        ['name'],
      );
    }

    for (const roleName of Object.values(ROLES)) {
      await roleRepository.upsert(
        {
          name: roleName,
        },
        ['name'],
      );
    }

    const savedRoles = await roleRepository.find();
    const savedPermissions = await permissionRepository.find();

    const roleMap = new Map(
      savedRoles.map(role => [role.name, role]),
    );

    const permissionMap = new Map(
      savedPermissions.map(permission => [
        permission.name,
        permission,
      ]),
    );

    for (const [roleName, permissions] of Object.entries(
      ROLE_PERMISSIONS,
    )) {
      const role = roleMap.get(roleName);

      if (!role) {
        throw new Error(`Role '${roleName}' not found`);
      }

      for (const permissionName of permissions) {
        const permission = permissionMap.get(permissionName);

        if (!permission) {
          throw new Error(
            `Permission '${permissionName}' not found`,
          );
        }

        await rolePermissionRepository.upsert(
          {
            roleId: role.id,
            permissionId: permission.id,
          },
          ['roleId', 'permissionId'],
        );
      }
    }
  });
}