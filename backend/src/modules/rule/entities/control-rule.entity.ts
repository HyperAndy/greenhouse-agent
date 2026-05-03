import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Greenhouse } from '../../farm/entities/greenhouse.entity';

export enum RuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
}

export enum ConditionOperator {
  GT = 'gt',
  LT = 'lt',
  GTE = 'gte',
  LTE = 'lte',
  EQ = 'eq',
  BETWEEN = 'between',
}

export enum ActionType {
  SEND_ALERT = 'send_alert',
  CONTROL_DEVICE = 'control_device',
  SEND_NOTIFICATION = 'send_notification',
}

@Entity('control_rules')
export class ControlRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '规则名称' })
  name: string;

  @Column({ nullable: true, length: 500, comment: '规则描述' })
  description: string;

  @Column({ comment: '所属大棚ID' })
  greenhouseId: string;

  @ManyToOne(() => Greenhouse)
  @JoinColumn({ name: 'greenhouseId' })
  greenhouse: Greenhouse;

  @Column({
    type: 'enum',
    enum: RuleStatus,
    default: RuleStatus.ACTIVE,
    comment: '规则状态',
  })
  status: RuleStatus;

  @Column({ type: 'jsonb', comment: '条件配置' })
  conditions: RuleCondition[];

  @Column({ type: 'jsonb', comment: '动作配置' })
  actions: RuleAction[];

  @Column({ default: 0, comment: '优先级' })
  priority: number;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @Column({ nullable: true, comment: '最后触发时间' })
  lastTriggeredAt: Date;

  @Column({ default: 0, comment: '触发次数' })
  triggerCount: number;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}

export interface RuleCondition {
  sensorType: string;
  operator: ConditionOperator;
  value: number;
  value2?: number;
  deviceId?: string;
}

export interface RuleAction {
  type: ActionType;
  config: Record<string, any>;
}
