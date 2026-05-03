import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorController } from './sensor.controller';
import { SensorService } from './sensor.service';
import { SensorDataHandler } from './handlers/sensor-data.handler';
import { SensorData } from './entities/sensor-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData])],
  controllers: [SensorController],
  providers: [SensorService, SensorDataHandler],
  exports: [SensorService],
})
export class SensorModule {
  constructor(private readonly sensorDataHandler: SensorDataHandler) {}

  onModuleInit() {
    // MQTT subscription is handled in SensorDataHandler constructor
  }
}
