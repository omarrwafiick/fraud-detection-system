import { Tenant } from 'src/tenant/entities/tenant.entity';
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn, 
  Index, 
  ManyToOne, 
  JoinColumn, 
  OneToMany
} from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { UserRoles } from './userRoles.pivot';

@Entity('users')
@Index(['tenantId', 'email'], { unique: true })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 50 })
  firstname: string;

  @Column({ type: 'varchar', length: 50 })
  lastname: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;
  
  @Column({ type: 'varchar', length: 255, default: '' })
  refreshTokenHash?: string;

  @OneToMany(() => UserRoles, userRoles => userRoles.user)
  userRoles: UserRoles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}