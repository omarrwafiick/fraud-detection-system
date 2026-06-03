import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index, 
  ManyToOne, 
  JoinColumn,
} from 'typeorm';
import { Role } from './roles.entity';
import { Permission } from './permissions.entity';

@Entity('role_permissions')
@Index(['permissionId', 'roleId'], { unique: true })
export class RolePermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  permissionId: number;

  @Column()
  roleId: number;

  @ManyToOne(
    () => Permission,
    permission => permission.rolePermissions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @ManyToOne(
    () => Role,
    role => role.rolePermissions,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}