import { Tenant } from 'src/tenant/entities/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';

export enum RuleSeverity {
  'MEDIUM',
  'HIGH',
  'CRITICAL'
}

@Entity('rules')
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ type: 'varchar', length: 255 })
  name: 'HIGH_VALUE_VELOCITY_CHECK' | 'DETECT_TRANSACTION_CYCLES' | 'DEGREES_OF_SEPARATION_LIMIT';

  @Column({ type: 'enum',  enum: RuleSeverity, default: RuleSeverity.HIGH })
  severity: RuleSeverity;

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}