import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MqttService } from '../../../common/mqtt/mqtt.service';
import { RedisService } from '../../../common/redis/redis.service';
import { SensorData } from '../entities/sensor-data.entity';

interface SensorPayload {
  temp: number;
  humi: number;
  light: number;
  co2: number;
  soil_moisture: number[];
  ph: number;
  ec: number;
  relay_state: boolean[];
}

@Injectable()
export class SensorDataHandler {
  private readonly logger = new Logger(SensorDataHandler.name);

  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
    private readonly mqttService: MqttService,
    private readonly redisService: RedisService,
  ) {
    this.setupMqttSubscription();
  }

  private setupMqttSubscription() {
    this.mqttService.subscribe('greenhouse/+/sensor/data', (topic, message) => {
      this.handleSensorData(topic, message);
    });
    this.logger.log('传感器数据MQTT订阅已设置');
  }

  private async handleSensorData(topic: string, message: Buffer) {
    try {
      const payload: SensorPayload = JSON.parse(message.toString());
      const topicParts = topic.split('/');
      const greenhouseId = topicParts[1];

      const sensorData = this.sensorDataRepository.create({
        greenhouseId,
        temp: payload.temp,
        humi: payload.humi,
        light: payload.light,
        co2: payload.co2,
        soil_moisture: payload.soil_moisture,
        ph: payload.ph,
        ec: payload.ec,
        relay_state: payload.relay_state,
      });

      await this.sensorDataRepository.save(sensorData);

      const cacheKey = `sensor:latest:${greenhouseId}`;
      await this.redisService.set(cacheKey, JSON.stringify(sensorData), 60);

      this.logger.debug(`传感器数据已保存: ${greenhouseId} - 温度:${payload.temp}°C 湿度:${payload.humi}%`);
    } catch (error) {
      this.logger.error(`处理传感器数据失败: ${error.message}`, error.stack);
    }
  }

  async getLatestData(greenhouseId: string) {
    return this.sensorDataRepository.find({
      where: { greenhouseId },
      order: { time: 'DESC' },
      take: 10,
    });
  }

  async getHistoryData(
    greenhouseId: string,
    startTime: Date,
    endTime: Date,
  ) {
    return this.sensorDataRepository
      .createQueryBuilder('data')
      .where('data.greenhouseId = :greenhouseId', { greenhouseId })
      .andWhere('data.time BETWEEN :startTime AND :endTime', { startTime, endTime })
      .orderBy('data.time', 'ASC')
      .getMany();
  }

  async getStatistics(
    greenhouseId: string,
    startTime: Date,
    endTime: Date,
  ) {
    const result = await this.sensorDataRepository
      .createQueryBuilder('data')
      .select([
        'AVG(data.temp) as avg_temp',
        'MIN(data.temp) as min_temp',
        'MAX(data.temp) as max_temp',
        'AVG(data.humi) as avg_humi',
        'AVG(data.light) as avg_light',
        'AVG(data.co2) as avg_co2',
        'COUNT(*) as count',
      ])
      .where('data.greenhouseId = :greenhouseId', { greenhouseId })
      .andWhere('data.time BETWEEN :startTime AND :endTime', { startTime, endTime })
      .getRawOne();

    return {
      avg_temp: parseFloat(result.avg_temp) || 0,
      min_temp: parseFloat(result.min_temp) || 0,
      max_temp: parseFloat(result.max_temp) || 0,
      avg_humi: parseFloat(result.avg_humi) || 0,
      avg_light: parseFloat(result.avg_light) || 0,
      avg_co2: parseFloat(result.avg_co2) || 0,
      count: parseInt(result.count) || 0,
    };
  }
}
