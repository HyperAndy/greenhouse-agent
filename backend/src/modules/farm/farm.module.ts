import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { Farm } from './entities/farm.entity';
import { Greenhouse } from './entities/greenhouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Farm, Greenhouse])],
  controllers: [FarmController],
  providers: [FarmService],
  exports: [FarmService],
})
export class FarmModule {}
