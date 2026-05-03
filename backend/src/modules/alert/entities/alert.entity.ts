import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  PENDING = 'pending',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '告警标题' })
  title: string;

  @Column({ length: 500, comment: '告警内容' })
  message: string;

  @Column({ comment: '大棚ID' })
  greenhouseId: string;

  @Column({ nullable: true, comment: '设备ID' })
  deviceId: string;

  @Column({ nullable: true, comment: '规则ID' })
  ruleId: string;

  @Column({
    type: 'enum',
    enum: AlertSeverity,
    default: AlertSeverity.WARNING,
    comment: '严重程度',
  })
  severity: AlertSeverity;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.PENDING,
    comment: '状态',
  })
  status: AlertStatus;

  @Column({ nullable: true, type: 'jsonb', comment: '额外数据' })
  metadata: Record<string, any>;

  @Column({ nullable: true, comment: '确认人ID' })
  acknowledgedBy: string;

  @Column({ nullable: true, comment: '确认时间' })
  acknowledgedAt: Date;

  @Column({ nullable: true, comment: '解决时间' })
  resolvedAt: Date;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
