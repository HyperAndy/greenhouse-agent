import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Farm } from './farm.entity';
import { Device } from '../../device/entities/device.entity';

@Entity('greenhouses')
export class Greenhouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '大棚名称' })
  name: string;

  @Column({ nullable: true, length: 500, comment: '大棚描述' })
  description: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2, comment: '面积(平方米)' })
  area: number;

  @Column({ nullable: true, length: 50, comment: '种植作物' })
  crop: string;

  @Column({ nullable: true, length: 50, comment: '作物类型' })
  cropType: string;

  @Column({ nullable: true, length: 50, comment: '生长阶段' })
  growthStage: string;

  @Column({ comment: '所属农场ID' })
  farmId: string;

  @ManyToOne(() => Farm, (farm) => farm.greenhouses)
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @OneToMany(() => Device, (device) => device.greenhouse)
  devices: Device[];

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active',
    comment: '状态',
  })
  status: string;

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
