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

export enum DeviceType {
  SENSOR = 'sensor',
  ACTUATOR = 'actuator',
  CONTROLLER = 'controller',
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
}

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '设备名称' })
  name: string;

  @Column({ length: 50, unique: true, comment: '设备编码' })
  code: string;

  @Column({
    type: 'enum',
    enum: DeviceType,
    comment: '设备类型',
  })
  type: DeviceType;

  @Column({ nullable: true, length: 100, comment: '设备型号' })
  model: string;

  @Column({ nullable: true, length: 50, comment: '设备厂商' })
  manufacturer: string;

  @Column({
    type: 'enum',
    enum: DeviceStatus,
    default: DeviceStatus.OFFLINE,
    comment: '设备状态',
  })
  status: DeviceStatus;

  @Column({ comment: '所属大棚ID' })
  greenhouseId: string;

  @ManyToOne(() => Greenhouse, (greenhouse) => greenhouse.devices)
  @JoinColumn({ name: 'greenhouseId' })
  greenhouse: Greenhouse;

  @Column({ nullable: true, type: 'jsonb', comment: '设备配置' })
  config: Record<string, any>;

  @Column({ nullable: true, comment: '最后上线时间' })
  lastOnlineAt: Date;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
