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

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  name: string;

  @OneToMany(
    () => RolePermissions,
    rolePermissions => rolePermissions.permission,
  )
  rolePermissions: RolePermissions[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}