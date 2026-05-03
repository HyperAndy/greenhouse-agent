import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from './entities/sensor-data.entity';
import { SensorDataHandler } from './handlers/sensor-data.handler';

@Injectable()
export class SensorService {
  constructor(
    @InjectRepository(SensorData)
    private readonly sensorDataRepository: Repository<SensorData>,
    private readonly sensorDataHandler: SensorDataHandler,
  ) {}

  async getLatestData(greenhouseId: string) {
    return this.sensorDataHandler.getLatestData(greenhouseId);
  }

  async getHistoryData(
    greenhouseId: string,
    startTime: Date,
    endTime: Date,
  ) {
    return this.sensorDataHandler.getHistoryData(greenhouseId, startTime, endTime);
  }

  async getStatistics(
    greenhouseId: string,
    startTime: Date,
    endTime: Date,
  ) {
    return this.sensorDataHandler.getStatistics(greenhouseId, startTime, endTime);
  }
}
