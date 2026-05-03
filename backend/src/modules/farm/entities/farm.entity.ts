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
import { User } from '../../auth/entities/user.entity';
import { Greenhouse } from './greenhouse.entity';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, comment: '农场名称' })
  name: string;

  @Column({ nullable: true, length: 255, comment: '农场地址' })
  address: string;

  @Column({ nullable: true, length: 20, comment: '联系电话' })
  contactPhone: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7, comment: '经度' })
  longitude: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 7, comment: '纬度' })
  latitude: number;

  @Column({ nullable: true, length: 500, comment: '农场描述' })
  description: string;

  @Column({ comment: '所有者ID' })
  ownerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Greenhouse, (greenhouse) => greenhouse.farm)
  greenhouses: Greenhouse[];

  @Column({ default: true, comment: '是否启用' })
  isActive: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt: Date;
}
