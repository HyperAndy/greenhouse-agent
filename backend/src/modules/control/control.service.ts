import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MqttService } from '../../common/mqtt/mqtt.service';
import { RedisService } from '../../common/redis/redis.service';
import { ControlLog } from './entities/control-log.entity';
import { Device } from '../device/entities/device.entity';

export interface ControlCommand {
  deviceId: string;
  channel: string;
  state: boolean;
  source: string;
  userId?: string;
}

@Injectable()
export class ControlService {
  private readonly logger = new Logger(ControlService.name);

  constructor(
    @InjectRepository(ControlLog)
    private readonly controlLogRepository: Repository<ControlLog>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly mqttService: MqttService,
    private readonly redisService: RedisService,
  ) {}

  async sendCommand(command: ControlCommand): Promise<ControlLog> {
    const device = await this.deviceRepository.findOne({
      where: { id: command.deviceId },
      relations: ['greenhouse'],
    });

    if (!device) {
      throw new Error('设备不存在');
    }

    const farmId = device.greenhouse?.farmId || 'default';
    const greenhouseId = device.greenhouseId;

    const topic = `farm/${farmId}/greenhouse/${greenhouseId}/control/set`;
    const payload = {
      deviceId: command.deviceId,
      channel: command.channel,
      state: command.state,
      source: command.source,
      timestamp: new Date().toISOString(),
    };

    let status = 'sent';
    let errorMsg: string | null = null;

    try {
      this.mqttService.publish(topic, payload);
      this.logger.log(`控制指令已发送: ${command.deviceId} -> ${command.channel} = ${command.state}`);
    } catch (error) {
      status = 'failed';
      errorMsg = error.message;
      this.logger.error(`控制指令发送失败: ${error.message}`);
    }

    const log = this.controlLogRepository.create({
      deviceId: command.deviceId,
      channel: command.channel,
      state: command.state,
      source: command.source,
      userId: command.userId,
      status,
      error: errorMsg,
    });

    return this.controlLogRepository.save(log);
  }

  async getControlLog(logId: string): Promise<ControlLog | null> {
    return this.controlLogRepository.findOne({ where: { id: logId } });
  }

  async getDeviceControlHistory(deviceId: string): Promise<ControlLog[]> {
    return this.controlLogRepository.find({
      where: { deviceId },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async emergencyStop(greenhouseId: string): Promise<void> {
    this.logger.warn(`紧急停止: 大棚 ${greenhouseId}`);
    const topic = `greenhouse/${greenhouseId}/control/emergency`;
    this.mqttService.publish(topic, {
      command: 'emergency_stop',
      timestamp: new Date().toISOString(),
    });
  }
}
