import { Rule } from 'src/rules/entities/rules.entity';
import { Tenant } from 'src/tenant/entities/tenant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';

@Entity('transactions')
@Index(['tenantId', 'transaction_id'], { unique: true }) //Idempotency
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ nullable: true })
  ruleId?: number | null;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ruleId' })
  rule?: Rule;

  @Index()
  @Column()
  transaction_id: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @Column()
  amountUnit: 'CENTS';

  @Column({ length: 3 })
  currency: string;

  @Column({ type: 'varchar', default: 'APPROVED' })
  status: 'APPROVED' | 'REJECTED';

  @Index()
  @Column()
  sender_user_id: string;

  @Column()
  external_sender_account_id: string;

  @Column()
  sender_device_id: string;

  @Column()
  sender_ip_address: string;

  @Column()
  external_receiver_account_id: string;

  @Column({ type: 'timestamp with time zone' })
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}