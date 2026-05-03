import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('control_logs')
export class ControlLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '设备ID' })
  deviceId: string;

  @Column({ length: 50, comment: '通道' })
  channel: string;

  @Column({ comment: '目标状态' })
  state: boolean;

  @Column({ length: 50, comment: '指令来源' })
  source: string;

  @Column({ nullable: true, comment: '操作用户ID' })
  userId: string;

  @Column({ length: 20, default: 'sent', comment: '发送状态' })
  status: string;

  @Column({ type: 'varchar', nullable: true, length: 500, comment: '错误信息' })
  error: string | null;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;
}
