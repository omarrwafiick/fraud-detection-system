import { Tenant } from 'src/tenant/entities/tenant.entity';
import { Transactions } from 'src/transactions/entities/transactions.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, Index } from 'typeorm';

export enum CaseStatus {
    'OPEN'='OPEN',
    'INVESTIGATING'='INVESTIGATING', 
    'RESOLVED'='RESOLVED',
    'DISMISSED'='DISMISSED',
}

export enum TriggerType{
    'CYCLIC_TRANSFER_DETECTION'='CYCLIC_TRANSFER_DETECTION',
    'CUSTOM_RULE_VIOLATION'='CUSTOM_RULE_VIOLATION',
}

@Entity('cases')
export class Case {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  tenantId: number;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Index()
  @Column()
  transactionId: number;

  @ManyToOne(() => Transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transactionId' })
  transaction: Transactions;

  @Column({ type: 'enum', enum: CaseStatus, default: CaseStatus.OPEN })
  status: CaseStatus;
  
  @Column({ type: 'enum', enum: TriggerType, default: TriggerType.CYCLIC_TRANSFER_DETECTION })
  triggerType: TriggerType; 

  @Column({ type: 'varchar' })
  suspectEntityId: string;

  @Column({ type: 'jsonb' })
  metadata: any;

  @Column({ type: 'text', nullable: true })
  resolutionNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}