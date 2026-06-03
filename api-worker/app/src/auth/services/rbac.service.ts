import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/roles.entity';
import { EntityManager, Repository } from 'typeorm';
import { UserRoles } from '../entities/userRoles.pivot';
import { ROLES } from 'src/common/constants/rbac.constants';
import { UserRoleWithPermissions } from '../types/rbac.types';

@Injectable()
export class RBACService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRoles)
    private readonly userRolesRepository: Repository<UserRoles>,
  ){}

  async getUserRolesWithPermissions(userId: number): Promise<Role[]> {
    const userRoles = await this.userRolesRepository.find({
        where: {
        userId,
        },
        relations: {
        role: {
            rolePermissions: {
            permission: true,
            },
        },
        },
    });

    return userRoles.map(userRole => userRole.role);
  }

  formatRolesWithPermissions(userRoles: Role[]): UserRoleWithPermissions[]{
    return userRoles.map(role => ({
      name: role.name,
      permissions: role.rolePermissions.map(({ permission }) => ({
        name: permission.name,
      })),
    }));
  }

  async addUserToDefaultRole(userId: number, manager?: EntityManager): Promise<boolean> {
    const roleRepo = manager ? manager.getRepository(Role) : this.roleRepository;
    const userRoleRepo = manager ? manager.getRepository(UserRoles) : this.userRolesRepository;

    const role = await roleRepo.findOne({
      where: {
        name: ROLES.USER,
      },
    });

    if (!role) {
      throw new NotFoundException(`Default role '${ROLES.USER}' not found`,);
    }

    await userRoleRepo.save({
      userId: userId,
      roleId: role.id,
    });

    return true;
  }
}