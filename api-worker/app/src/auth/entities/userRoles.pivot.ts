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
import { User } from './user.entity';

@Entity('user_roles')
@Index(['userId', 'roleId'], { unique: true })
export class UserRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roleId: number;

  @ManyToOne(() => User, user => user.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'roleId' })
  role: Role;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}