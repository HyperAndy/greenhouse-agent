import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('sensor_data')
@Index(['greenhouseId', 'time'])
export class SensorData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ comment: '大棚ID' })
  greenhouseId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '温度' })
  temp: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: '湿度' })
  humi: number;

  @Column({ type: 'int', comment: '光照' })
  light: number;

  @Column({ type: 'int', comment: 'CO2浓度' })
  co2: number;

  @Column({ type: 'decimal', array: true, precision: 5, scale: 2, comment: '土壤湿度' })
  soil_moisture: number[];

  @Column({ type: 'decimal', precision: 4, scale: 2, comment: 'pH值' })
  ph: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, comment: 'EC值' })
  ec: number;

  @Column({ type: 'boolean', array: true, comment: '继电器状态' })
  relay_state: boolean[];

  @CreateDateColumn({ type: 'timestamp', comment: '采集时间' })
  time: Date;
}
