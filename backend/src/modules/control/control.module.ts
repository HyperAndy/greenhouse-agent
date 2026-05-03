import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ControlController } from './control.controller';
import { ControlService } from './control.service';
import { ControlLog } from './entities/control-log.entity';
import { Device } from '../device/entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ControlLog, Device])],
  controllers: [ControlController],
  providers: [ControlService],
  exports: [ControlService],
})
export class ControlModule {}
