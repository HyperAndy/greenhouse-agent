import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../../modules/auth/entities/user.entity';
import { Farm } from '../../modules/farm/entities/farm.entity';
import { Greenhouse } from '../../modules/farm/entities/greenhouse.entity';
import { Device } from '../../modules/device/entities/device.entity';
import { SensorData } from '../../modules/sensor/entities/sensor-data.entity';
import { ControlRule } from '../../modules/rule/entities/control-rule.entity';
import { Alert } from '../../modules/alert/entities/alert.entity';
import { ControlLog } from '../../modules/control/entities/control-log.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [User, Farm, Greenhouse, Device, SensorData, ControlRule, Alert, ControlLog],
        synchronize: true,
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
