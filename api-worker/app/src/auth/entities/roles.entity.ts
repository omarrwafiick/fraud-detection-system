import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index,
  OneToMany,
} from 'typeorm';
import { RolePermissions } from './rolePermissions.pivot';
import { UserRoles } from './userRoles.pivot';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  name: string;

  @OneToMany(() => UserRoles, userRoles => userRoles.role)
  userRoles: UserRoles[];

  @OneToMany(() => RolePermissions, rolePermissions => rolePermissions.role)
  rolePermissions: RolePermissions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}