import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { DatabaseModule } from './common/database/database.module';
import { MqttModule } from './common/mqtt/mqtt.module';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { FarmModule } from './modules/farm/farm.module';
import { DeviceModule } from './modules/device/device.module';
import { SensorModule } from './modules/sensor/sensor.module';
import { RuleModule } from './modules/rule/rule.module';
import { AlertModule } from './modules/alert/alert.module';
import { ControlModule } from './modules/control/control.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    MqttModule,
    RedisModule,
    AuthModule,
    FarmModule,
    DeviceModule,
    SensorModule,
    RuleModule,
    AlertModule,
    ControlModule,
  ],
})
export class AppModule {}
